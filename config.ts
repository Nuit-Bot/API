export interface NuitConfigRegistry {
    raw?: string;
    path?: string;
}

export interface NuitConfig {
    host: {
        hosters: string[];
        allow_command_reloading: boolean;
        allow_external_modules: boolean;
    };
    registries: NuitConfigRegistry[];
}
