import { Archive } from '.';
export declare class Installer {
    protected _archive: Archive;
    constructor(archive: Archive);
    get archive(): Archive;
    get npmManifestFile(): string;
    _npm(command: string, options: any): Promise<unknown>;
    install(options: any): Promise<unknown>;
}
