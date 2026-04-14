import {
    type ModuleRegistry,
    type NuitAPI,
    type NuitCommandInput,
    type NuitCommand
} from "./api";

export function createAPI(
    registry: ModuleRegistry,
    moduleName: string
): NuitAPI {
    return {
        registerCommand(cmd: NuitCommandInput) {
            const internal: NuitCommand = {
                ...cmd,
                module: moduleName
            };

            registry.commands.push(internal);
        },

        onEvent(name, handler) {
            registry.events.push({
                module: moduleName,
                name,
                once: false,
                handler
            });
        },

        onceEvent(name, handler) {
            registry.events.push({
                module: moduleName,
                name,
                once: true,
                handler
            });
        }
    };
}