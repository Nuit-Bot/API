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
    ModuleConfigField,
} from "./api";

function attachModule<T extends ModuleConfigField>(field: T, moduleName: string): T & { module: string } {
    return {
        ...field,
        module: moduleName,
    };
}

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
                guildScoped: options?.guildScoped ?? false,
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

        registerConfig(config: ModuleConfigField[]) {
            for (const field of config) {
                registry.config.push(attachModule(field, moduleName));
            }
        },
    };

    return selfApi;
}
