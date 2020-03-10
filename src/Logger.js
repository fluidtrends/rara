class _ {
    constructor(props) {
        this._props = Object.assign({}, props)
        this._raw = {}
        _.LEVELS.map(level => this._raw[level] = this.log(level))
    }

    get props() {
        return this._props
    }

    get silent() {
        return this.props.silent
    }

    raw() {
        return this._raw
    }

    _log(level) {
       return (category, ...args) => process.emit('log', level, category, ...args)
    }

    log(level) {
        this.silent || this._log(level)
    }
}

_.LEVELS = [
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

module.exports = _