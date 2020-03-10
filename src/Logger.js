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

    log(level) {
       return (category, ...args) => this.silent || process.emit('log', level, category, ...args)
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