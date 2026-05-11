export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

type TableDefinition<Row, Insert, Update> = {
    Row: Row;
    Insert: Insert;
    Update: Update;
    Relationships: readonly unknown[];
};

export type Database = {
    public: {
        Tables: {
            guild_modules: TableDefinition<
                {
                    config: Json;
                    enabled: boolean;
                    guild_id: string;
                    module_id: string;
                    updated_at: string;
                },
                {
                    config?: Json;
                    enabled?: boolean;
                    guild_id: string;
                    module_id: string;
                    updated_at?: string;
                },
                {
                    config?: Json;
                    enabled?: boolean;
                    guild_id?: string;
                    module_id?: string;
                    updated_at?: string;
                }
            >;
            guilds: TableDefinition<
                {
                    available: boolean;
                    config: Json;
                    guild_id: string;
                    joined_at: string;
                    locale: string;
                },
                {
                    available?: boolean;
                    config?: Json;
                    guild_id: string;
                    joined_at?: string;
                    locale?: string;
                },
                {
                    available?: boolean;
                    config?: Json;
                    guild_id?: string;
                    joined_at?: string;
                    locale?: string;
                }
            >;
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
};

type DefaultSchema = Database["public"];

export type Tables<
    TableName extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][TableName]["Row"];

export type TablesInsert<
    TableName extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][TableName]["Insert"];

export type TablesUpdate<
    TableName extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][TableName]["Update"];

export type Enums<
    EnumName extends keyof DefaultSchema["Enums"],
> = DefaultSchema["Enums"][EnumName];

export type CompositeTypes<
    CompositeTypeName extends keyof DefaultSchema["CompositeTypes"],
> = DefaultSchema["CompositeTypes"][CompositeTypeName];
