import { IDataFile } from '.';
export declare class DataFile implements IDataFile {
    static ERRORS: {
        CANNOT_LOAD: (reason: string) => string;
        CANNOT_SAVE: (reason: string) => string;
    };
    static TYPES: {
        ASSET: string;
        IMAGE: string[];
        JSON: string[];
        JAVASCRIPT: string[];
        CSS: string[];
        MARKDOWN: string[];
    };
    static NONCOMPILABLE_TYPES: (string | string[])[];
    protected _props: any;
    protected _type?: string | string[];
    constructor(props?: any);
    get props(): any;
    get filepath(): any;
    get dir(): any;
    get path(): string;
    get exists(): boolean | "";
    get type(): string | string[];
    detectType(): void;
    get isCompilable(): boolean;
    compile(args: any, options?: any): Promise<unknown>;
    load(args?: any, options?: {}): Promise<unknown>;
    copy(dest: string): Promise<unknown>;
    save(dest?: string, args?: {}): Promise<unknown>;
}
