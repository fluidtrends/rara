import cpy from 'cpy';
export declare class Template {
    protected _props: any;
    protected _name: string;
    protected _dir: string;
    protected _path: string;
    protected _content?: any;
    constructor(props: any);
    get props(): any;
    get name(): string;
    get dir(): string;
    get path(): string;
    get exists(): boolean;
    get content(): any;
    load(props: any): Promise<unknown>;
    saveGlobs(data: any): Promise<string[]> & cpy.ProgressEmitter;
    save(dest: string, props: any): Promise<void> | Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
}
