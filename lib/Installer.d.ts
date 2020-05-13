export = _;
declare class _ {
    constructor(archive: any);
    _archive: any;
    get archive(): any;
    get npmManifestFile(): string;
    _npm(command: any, options: any): Promise<any>;
    install(): Promise<any>;
}
