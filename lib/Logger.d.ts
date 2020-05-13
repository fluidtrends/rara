export = _;
declare class _ {
    constructor(props: any);
    _props: any;
    _raw: {
        clearProgress: Function;
        showProgress: Function;
    };
    get props(): any;
    get silent(): any;
    get raw(): {
        clearProgress: Function;
        showProgress: Function;
    };
    log(level: any): (category: any, ...args: any[]) => any;
}
declare namespace _ {
    export const LEVELS: string[];
}
