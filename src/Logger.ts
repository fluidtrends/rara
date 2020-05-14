export class Logger {
    protected _props: any;
    protected _raw: any;

    public static LEVELS = [
        'notice',
        'error',
        'warn',
        'info',
        'verbose',
        'http',
        'silly',
        'pause',
        'resume'
    ]

    constructor(props: any) {
        this._props = Object.assign({}, props)
        this._raw = {
            clearProgress: Function.prototype,
            showProgress: Function.prototype
        }
        Logger.LEVELS.map(level => this._raw[level] = this.log(level))
    }

    get props() {
        return this._props
    }

    get silent() {
        return this.props.silent
    }

    get raw() {
        return this._raw
    }

    log(level: string) {
    //    return (category: any, ...args:any) => this.silent || process.emit('log', level, category)
    }
}