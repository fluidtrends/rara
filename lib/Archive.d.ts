import { DataFile, Logger, Installer } from '.';
export declare class Archive {
    protected _props: any;
    protected _installer: Installer;
    protected _logger: Logger;
    protected _version?: string;
    protected _manifest?: any;
    protected _files?: DataFile[];
    protected _templates?: any;
    static ERRORS: {
        CANNOT_LOAD: (reason: string) => string;
    };
    static IGNORES: string[];
    constructor(props: any);
    get props(): any;
    get installer(): Installer;
    get logger(): Logger;
    get id(): any;
    get archiveId(): string;
    get version(): any;
    get dir(): any;
    get path(): string | null;
    get exists(): boolean | "" | null;
    get files(): DataFile[] | undefined;
    get templates(): any;
    get manifest(): any;
    get npmOptions(): {
        log: any;
    };
    initialize(): Promise<undefined>;
    installDependencies(): Promise<{
        totalTime: number;
        alreadyInstalled: boolean;
        installed?: undefined;
    } | {
        totalTime: number;
        installed: boolean;
        alreadyInstalled?: undefined;
    } | {
        totalTime: number;
        skipped: boolean;
    }>;
    loadTemplates(): void;
    ignoreFileIfNecessary(f: string): boolean;
    loadFiles(): Promise<this>;
    load(): Promise<this>;
    save(dest: string, args?: {}): Promise<unknown[]>;
    download(): Promise<import("pacote").FetchResult>;
}
