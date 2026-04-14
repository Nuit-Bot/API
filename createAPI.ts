import { type ModuleRegistry, type NuitAPI, type NuitCommand } from "./api";

export function createAPI(
    registry: ModuleRegistry,
    moduleName: string
): NuitAPI {
    return {
        registerCommand(cmd: NuitCommand) {
            registry.commands.push({
                ...cmd,
                module: moduleName // ✅ enforce module ownership
            });
        },

        onEvent(name, handler) {
            registry.events.push({
                module: moduleName, // ✅ ADD THIS
                name,
                once: false,
                handler
            });
        },

        onceEvent(name, handler) {
            registry.events.push({
                module: moduleName, // ✅ ADD THIS
                name,
                once: true,
                handler
            });
        }
    };
}