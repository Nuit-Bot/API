import { type ModuleRegistry, type NuitAPI, type NuitCommand } from "./api";

export function createAPI(registry: ModuleRegistry): NuitAPI {
    return {
        registerCommand(cmd: NuitCommand) {
            registry.commands.push(cmd);
        },

        onEvent(name, handler) {
            registry.events.push({ name, once: false, handler });
        },

        onceEvent(name, handler) {
            registry.events.push({ name, once: true, handler });
        }
    };
}