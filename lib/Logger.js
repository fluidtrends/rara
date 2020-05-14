"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger(props) {
        var _this = this;
        this._props = Object.assign({}, props);
        this._raw = {
            clearProgress: Function.prototype,
            showProgress: Function.prototype
        };
        Logger.LEVELS.map(function (level) { return _this._raw[level] = _this.log(level); });
    }
    Object.defineProperty(Logger.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "silent", {
        get: function () {
            return this.props.silent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "raw", {
        get: function () {
            return this._raw;
        },
        enumerable: false,
        configurable: true
    });
    Logger.prototype.log = function (level) {
        //    return (category: any, ...args:any) => this.silent || process.emit('log', level, category)
    };
    Logger.LEVELS = [
        'notice',
        'error',
        'warn',
        'info',
        'verbose',
        'http',
        'silly',
        'pause',
        'resume'
    ];
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map