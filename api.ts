export interface NuitCommandInput {
    data: any;
    execute: (interaction: any, ctx: ModuleContext) => Promise<void>;
}

export interface NuitCommand {
    module: string;
    data: any;
    execute: (interaction: any, ctx: BaseCtx) => Promise<void>;
}

export interface NuitEvent {
    name: string;
    once: boolean;
    handler: (...args: any[]) => Promise<void> | void;
    module: string;
}

export interface ModuleRegistry {
    commands: NuitCommand[];
    events: NuitEvent[];
}

export interface ModuleContext {
    client: any;
    supabase: any;
    config: Readonly<any>;
    api: NuitAPI;
}

export interface NuitAPI {
    registerCommand(cmd: NuitCommandInput): void;
    onEvent(name: string, handler: NuitEvent["handler"]): void;
    onceEvent(name: string, handler: NuitEvent["handler"]): void;
}

export interface BaseCtx {
    supabase: any,
    client: any,
    config: any
}