import { Archive } from '.';
export declare class Installer {
    protected _archive: Archive;
    constructor(archive: Archive);
    get archive(): Archive;
    get npmManifestFile(): string;
    _npm(command: string, options: any): Promise<{
        totalTime: number;
        alreadyInstalled: boolean;
        installed?: undefined;
    } | {
        totalTime: number;
        installed: boolean;
        alreadyInstalled?: undefined;
    }>;
    install(): Promise<{
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
}
