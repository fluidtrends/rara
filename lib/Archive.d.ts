export = _;
declare class _ {
    constructor(props: any);
    _props: any;
    _installer: import("./Installer");
    _logger: import("./Logger");
    get props(): any;
    get installer(): import("./Installer");
    get logger(): import("./Logger");
    get id(): any;
    get archiveId(): any;
    get version(): any;
    get dir(): any;
    get path(): string | null;
    get exists(): any;
    get files(): any;
    get templates(): {} | undefined;
    get manifest(): any;
    get npmOptions(): {
        log: {
            clearProgress: Function;
            showProgress: Function;
        };
    };
    initialize(): any;
    _version: any;
    _manifest: any;
    installDependencies(): any;
    loadTemplates(): void;
    _templates: {} | undefined;
    ignoreFileIfNecessary(f: any): boolean;
    loadFiles(): Promise<_>;
    _files: any;
    load(): any;
    save(dest: any, args?: {}): any;
    download(): any;
}
declare namespace _ {
    export namespace ERRORS {
        export function CANNOT_LOAD(reason: any): string;
    }
    export const IGNORES: string[];
}
