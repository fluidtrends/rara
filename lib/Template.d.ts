export = _;
declare class _ {
    constructor(props: any);
    _props: any;
    _name: any;
    _dir: any;
    _path: string;
    get props(): any;
    get name(): any;
    get dir(): any;
    get path(): string;
    get exists(): any;
    get content(): any;
    load(props: any): Promise<any>;
    _content: any;
    saveGlobs({ dest, glob, props }: {
        dest: any;
        glob: any;
        props: any;
    }): Promise<string[]> & import("cpy").ProgressEmitter;
    save(dest: any, props: any): Promise<void> | Promise<[any, any, any, any, any, any, any, any, any, any]>;
}
