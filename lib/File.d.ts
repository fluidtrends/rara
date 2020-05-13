export = _;
declare class _ {
    constructor(props: any);
    _props: any;
    get props(): any;
    get filepath(): any;
    get dir(): any;
    get path(): string | null;
    get exists(): any;
    get type(): string | string[];
    detectType(): void;
    _type: string | string[] | undefined;
    get isCompilable(): boolean;
    compile(args: any, options?: {}): Promise<any>;
    load(args: any, options?: {}): Promise<any>;
    copy(dest: any): Promise<any>;
    save(dest: any, args?: {}): Promise<any>;
}
declare namespace _ {
    export namespace ERRORS {
        export function CANNOT_LOAD(reason: any): string;
        export function CANNOT_SAVE(reason: any): string;
    }
    export namespace TYPES {
        export const ASSET: string;
        export const IMAGE: string[];
        export const JSON: string[];
        export const JAVASCRIPT: string[];
        export const CSS: string[];
        export const MARKDOWN: string[];
    }
    export const NONCOMPILABLE_TYPES: (string | string[])[];
}
