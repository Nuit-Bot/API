/**
 * Auto-generated Supabase database types.
 * Regenerate with: supabase gen types typescript --linked > database.types.ts
 *
 * This is a stub — replace the contents of `Database` with the real generated output.
 */
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            guild_modules: {
                Row: {
                    guild_id: string;
                    module_id: string;
                    enabled: boolean;
                };
                Insert: {
                    guild_id: string;
                    module_id: string;
                    enabled?: boolean;
                };
                Update: {
                    guild_id?: string;
                    module_id?: string;
                    enabled?: boolean;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}

/** Shorthand for a specific table row type */
export type TableRow<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"];

/** Shorthand for a specific table insert type */
export type TableInsert<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"];

/** Shorthand for a specific table update type */
export type TableUpdate<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"];
