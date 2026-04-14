export interface NuitCommand {
    module: string;
    data: any; // SlashCommandBuilder
    execute: (interaction: any, ctx: ModuleContext) => Promise<void>;
}

export interface NuitEvent {
    name: string;
    once: boolean;
    handler: (...args: any[]) => Promise<void> | void;
}

export interface ModuleRegistry {
    commands: NuitCommand[];
    events: NuitEvent[];
}

export interface ModuleContext {
    client: any;      // Discord Client
    supabase: any;    // Supabase DB
    config: Readonly<any>; // Config
    api: NuitAPI;
}

export interface NuitAPI {
    registerCommand(cmd: NuitCommand): void;
    onEvent(name: string, handler: NuitEvent["handler"]): void;
    onceEvent(name: string, handler: NuitEvent["handler"]): void;
}