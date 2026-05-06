import type { Client, ClientEvents, Interaction } from "discord.js";
import type { SharedSlashCommand } from "@discordjs/builders";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { NuitConfig } from "./config";

/**
 * Minimal structural interface for the Supabase client.
 * Defined locally so the api package does not import from @supabase/supabase-js,
 * avoiding dual-install type-identity mismatches with the consuming package.
 */
export interface NuitDb {
    from(relation: string): any;
    rpc(fn: string, args?: Record<string, unknown>): any;
}

export type { NuitConfig } from "./config";
export type {
    Database,
    Tables as TableRow,
    TablesInsert as TableInsert,
    TablesUpdate as TableUpdate,
} from "./database.types";

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

export interface BaseCtx {
    client: Client;
    supabase: SupabaseClient<Database>;
    config: Readonly<NuitConfig>;
}

export interface ModuleContext extends BaseCtx {
    api: NuitAPI;
}

// ---------------------------------------------------------------------------
// Module / command / event types
// ---------------------------------------------------------------------------

export type NuitModuleKind = "internal" | "essential" | "optional";

export interface NuitCommandInput {
    /** Slash command builder — any variant (with options, subcommands, etc.) */
    data: SharedSlashCommand;
    execute: (interaction: Interaction, ctx: BaseCtx) => any;
}

export interface NuitCommand {
    module: string;
    kind: NuitModuleKind | null;
    data: SharedSlashCommand;
    execute: (interaction: Interaction, ctx: BaseCtx) => any;
}

export interface NuitEventOptions {
    guildScoped?: boolean;
}

export type NuitEventHandler<
    K extends keyof ClientEvents = keyof ClientEvents,
> = (...args: ClientEvents[K]) => Promise<void> | void;

export interface NuitEvent<K extends keyof ClientEvents = keyof ClientEvents> {
    name: K;
    once: boolean;
    guildScoped: boolean;
    handler: NuitEventHandler<K>;
    module: string;
}

export interface ModuleRegistry {
    commands: NuitCommand[];
    events: NuitEvent[];
    config: ConfigField[];
}

// ---------------------------------------------------------------------------
// API surface
// ---------------------------------------------------------------------------

export interface NuitAPI {
    registerCommand(cmd: NuitCommandInput): void;
    onEvent<K extends keyof ClientEvents>(
        name: K,
        handler: NuitEventHandler<K>,
        options?: NuitEventOptions,
    ): void;
    onceEvent<K extends keyof ClientEvents>(
        name: K,
        handler: NuitEventHandler<K>,
        options?: NuitEventOptions,
    ): void;
    registerConfig(config: ModuleConfigField[]): void;
}

// ---------------------------------------------------------------------------
// Config surface
// ---------------------------------------------------------------------------

export type ConfigFieldType =
    | "string"
    | "number"
    | "boolean"
    | "select"
    | "channel"
    | "role"
    | "user"
    | "secret";

interface BaseField {
    key: string;
    label: string;
    description?: string;
    group?: string;
    optional?: boolean;
    module: string;
}

interface StringField extends BaseField {
    type: "string";
    default?: string;
    min?: number; // length
    max?: number;
}

interface NumberField extends BaseField {
    type: "number";
    default?: number;
    min?: number;
    max?: number;
}

interface BooleanField extends BaseField {
    type: "boolean";
    default?: boolean;
}

interface SelectField extends BaseField {
    type: "select";
    options: { label: string; value: string }[];
    default?: string;
}

interface ChannelField extends BaseField {
    type: "channel";
    default?: string; // snowflake
}

interface RoleField extends BaseField {
    type: "role";
    default?: string;
}

interface UserField extends BaseField {
    type: "user";
    default?: string;
}

interface SecretField extends BaseField {
    type: "secret";
}

export type ConfigField =
    | StringField
    | NumberField
    | BooleanField
    | SelectField
    | ChannelField
    | RoleField
    | UserField
    | SecretField;

export type ModuleConfigField = ConfigField extends infer T
    ? T extends ConfigField
        ? Omit<T, "module">
        : never
    : never;

export type ConfigSchema = Record<string, ConfigField>;
