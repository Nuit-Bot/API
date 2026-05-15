import type { Client, ClientEvents, Interaction } from "discord.js";
import type { SharedSlashCommand } from "@discordjs/builders";
import type { Database } from "./database.types";
import type { NuitConfig } from "./config";
import type { MessageBus } from "./message";

/**
 * Minimal structural interface for the Drizzle database instance.
 * Kept intentionally small so modules can depend on the shared context shape
 * without importing Drizzle implementation details from the bot package.
 */
export interface NuitDb {
    select(...args: unknown[]): any;
    insert(...args: unknown[]): any;
    update(...args: unknown[]): any;
    delete(...args: unknown[]): any;
    execute(...args: unknown[]): any;
    transaction(...args: unknown[]): any;
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
    db: NuitDb;
    config: Readonly<NuitConfig>;
    bus: MessageBus;
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
