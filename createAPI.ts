import type { ClientEvents } from "discord.js";
import type {
    ModuleRegistry,
    NuitAPI,
    NuitCommandInput,
    NuitCommand,
    NuitEventHandler,
    NuitEventOptions,
    NuitModuleKind,
    BaseCtx,
} from "./api";

export function createAPI(
    registry: ModuleRegistry,
    moduleName: string,
    kind: NuitModuleKind | null = null,
): NuitAPI {
    const selfApi: NuitAPI = {
        registerCommand(cmd: NuitCommandInput) {
            const internal: NuitCommand = {
                ...cmd,
                module: moduleName,
                kind,
                execute: (interaction, ctx: BaseCtx) =>
                    cmd.execute(interaction, ctx),
            };

            registry.commands.push(internal);
        },

        onEvent<K extends keyof ClientEvents>(
            name: K,
            handler: NuitEventHandler<K>,
            options?: NuitEventOptions,
        ) {
            registry.events.push({
                module: moduleName,
                name,
                once: false,
                guildScoped: options?.guildScoped ?? true,
                handler,
            } as ModuleRegistry["events"][number]);
        },

        onceEvent<K extends keyof ClientEvents>(
            name: K,
            handler: NuitEventHandler<K>,
            options?: NuitEventOptions,
        ) {
            registry.events.push({
                module: moduleName,
                name,
                once: true,
                guildScoped: options?.guildScoped ?? false,
                handler,
            } as ModuleRegistry["events"][number]);
        },
    };

    return selfApi;
}
