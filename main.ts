import { Client, DiscordAPIError, Events, IntentsBitField, REST, Routes } from "discord.js";
import { loadModule } from "./utility/loader";
import { getSupabaseClient } from "../utility/supabase";
import config, { type ModuleConfig, type RegistryConfig } from "../utility/config";
import { createAPI } from "./createAPI";
import { type NuitCommand, type NuitEvent } from "./api";
import { createRegistry } from "../core/registry";
import { getEnabledModules } from "../utility/getEnabledModules";

/**
 * Resolve module into importable path
 */
function resolveModule(mod: ModuleConfig): string {
    switch (mod.type) {
        case "local":
            return mod.path!;
        case "npm":
            return mod.version
                ? `${mod.name}@${mod.version}`
                : mod.name!;
        case "github":
            return `https://raw.githubusercontent.com/${mod.repo}/${mod.commit}/index.js`;
    }
}

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

/**
 * 1. Create registry FIRST
 */
const registry = createRegistry();

/**
 * 2. Create API bound to registry
 */
const api = createAPI(registry);

/**
 * 3. Base context (SAFE)
 */
const baseCtx = {
    supabase: getSupabaseClient(),
    client,
    config,
    api
};

/**
 * Global runtime registry
 */
const globalRegistry: {
    commands: NuitCommand[];
    events: NuitEvent[];
} = {
    commands: [],
    events: []
};

/**
 * =========================
 * LOAD MODULES (SAFE GUARD)
 * =========================
 */
const modulesToLoad: ModuleConfig[] = config.modules ?? [];

for (const mod of modulesToLoad) {
    const resolved = resolveModule(mod);

    try {
        const moduleRegistry = await loadModule(resolved, baseCtx);

        if (!moduleRegistry) continue;

        globalRegistry.commands.push(...moduleRegistry.commands);
        globalRegistry.events.push(...moduleRegistry.events);
    } catch (err) {
        console.error(`Failed to load module: ${resolved}`, err);
    }
}

/**
 * =========================
 * BIND EVENTS
 * =========================
 */
for (const event of globalRegistry.events) {
    const wrapped = async (...args: any[]) => {
        const guildId = args[0]?.guildId;

        // Only filter if this event belongs to a guild
        if (guildId) {
            const enabled = await getEnabledModules(
                guildId,
                baseCtx.supabase
            );

            if (!enabled.includes(event.module)) {
                return; // 🚫 stop event execution
            }
        }

        // ✅ allowed → run handler
        return event.handler(...args, baseCtx);
    };

    if (event.once) {
        client.once(event.name, wrapped);
    } else {
        client.on(event.name, wrapped);
    }
}

/**
 * =========================
 * COMMAND HANDLER
 * =========================
 */
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = globalRegistry.commands.find(
        c => c.data.name === interaction.commandName
    );

    if (!cmd) return;

    await cmd.execute(interaction, baseCtx);
});

if (process.argv.includes("--register")) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN as string)

    try {
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), {
            body: globalRegistry.commands.map((c) => {
                return c.data.toJSON();
            })
        })
    } catch (err: DiscordAPIError | any) {
        throw new Error("Unexpected error when sending commands to Discord: " + err.message);
    }
}

/**
 * =========================
 * LOGIN
 * =========================
 */
await client.login(process.env.DISCORD_TOKEN);
