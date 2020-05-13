"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _ = /** @class */ (function () {
    function _(props) {
        var _this = this;
        this._props = Object.assign({}, props);
        this._raw = {
            clearProgress: Function.prototype,
            showProgress: Function.prototype
        };
        _.LEVELS.map(function (level) { return _this._raw[level] = _this.log(level); });
    }
    Object.defineProperty(_.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "silent", {
        get: function () {
            return this.props.silent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "raw", {
        get: function () {
            return this._raw;
        },
        enumerable: true,
        configurable: true
    });
    _.prototype.log = function (level) {
        var _this = this;
        return function (category) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return _this.silent || process.emit.apply(process, __spreadArrays(['log', level, category], args));
        };
    };
    return _;
}());
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
];
module.exports = _;
//# sourceMappingURL=Logger.js.map