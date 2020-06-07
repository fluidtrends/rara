import { Archive } from '.';
export declare class Installer {
    protected _archive: Archive;
    constructor(archive: Archive);
    get archive(): Archive;
    get npmManifestFile(): string;
    install(msg?: [string, string]): Promise<{
        totalTime: number;
        alreadyInstalled: boolean;
    } | {
        totalTime: number;
        installed: boolean;
        alreadyInstalled?: undefined;
    } | {
        id: any;
        to: any;
        version: string;
        name: string;
        deps: Record<string, string> | undefined;
        totalTime: number;
        installed: boolean;
        alreadyInstalled?: undefined;
    }>;
}
