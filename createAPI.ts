import {
    type ModuleRegistry,
    type NuitAPI,
    type NuitCommandInput,
    type NuitCommand,
    type NuitEventOptions,
    type BaseCtx,
} from "./api";

export function createAPI(
    registry: ModuleRegistry,
    moduleName: string,
): NuitAPI {
    const selfApi: NuitAPI = {
        registerCommand(cmd: NuitCommandInput) {
            const internal: NuitCommand = {
                ...cmd,
                module: moduleName,
                execute: (interaction, ctx: BaseCtx) =>
                    cmd.execute(interaction, { ...ctx, api: selfApi }),
            };

            registry.commands.push(internal);
        },

        onEvent(name, handler, options?: NuitEventOptions) {
            registry.events.push({
                module: moduleName,
                name,
                once: false,
                guildScoped: options?.guildScoped ?? true,
                handler,
            });
        },

        onceEvent(name, handler, options?: NuitEventOptions) {
            registry.events.push({
                module: moduleName,
                name,
                once: true,
                guildScoped: options?.guildScoped ?? true,
                handler,
            });
        },
    };

    return selfApi;
}
