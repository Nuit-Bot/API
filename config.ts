export interface NuitConfig {
    /** Discord bot token */
    token: string;
    /** Discord application/client ID */
    clientId: string;
    /** Guild ID to scope commands and events to (dev mode) */
    guildId?: string;
    /** Supabase project URL */
    supabaseUrl: string;
    /** Supabase anon or service role key */
    supabaseKey: string;
    /** Whether the bot is running in development mode */
    dev?: boolean;
}
