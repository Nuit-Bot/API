export interface NuitCommandInput {
    data: any;
    execute: (interaction: any, ctx: ModuleContext) => Promise<void>;
}

export type NuitModuleKind = 'internal' | 'essential' | 'optional';

export interface NuitCommand {
    module: string;
    kind: NuitModuleKind | null;
    data: any;
    execute: (interaction: any, ctx: BaseCtx) => Promise<void>;
}

export interface NuitEvent {
    name: string;
    once: boolean;
    guildScoped: boolean;
    handler: (...args: any[]) => Promise<void> | void;
    module: string;
}

export interface BaseCtx {
    client: any;
    supabase: any;
    config: Readonly<any>;
}

export interface ModuleContext extends BaseCtx {
    api: NuitAPI;
}

export interface ModuleRegistry {
    commands: NuitCommand[];
    events: NuitEvent[];
}

export interface NuitEventOptions {
    guildScoped?: boolean;
}

export interface NuitAPI {
    registerCommand(cmd: NuitCommandInput): void;
    onEvent(name: string, handler: NuitEvent["handler"], options?: NuitEventOptions): void;
    onceEvent(name: string, handler: NuitEvent["handler"], options?: NuitEventOptions): void;
}