export declare class Logger {
    protected _props: any;
    protected _raw: any;
    static LEVELS: string[];
    constructor(props: any);
    get props(): any;
    get silent(): any;
    get raw(): any;
    log(level: string): void;
}
