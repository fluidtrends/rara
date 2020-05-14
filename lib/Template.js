"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var cpy_1 = __importDefault(require("cpy"));
var Template = /** @class */ (function () {
    function Template(props) {
        this._props = Object.assign({}, props);
        this._name = this.props.name;
        this._dir = this.props.dir;
        this._path = path_1.default.resolve(this.dir, 'templates', this.name);
    }
    Object.defineProperty(Template.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "dir", {
        get: function () {
            return this._dir;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "exists", {
        get: function () {
            return fs_extra_1.default.existsSync(this.path);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: false,
        configurable: true
    });
    Template.prototype.load = function (props) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var Tpl = require(_this.path);
                _this._content = new Tpl(props);
                resolve(_this);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    Template.prototype.saveGlobs = function (data) {
        return cpy_1.default(data.glob, data.dest, data.props);
    };
    Template.prototype.save = function (dest, props) {
        var _this = this;
        if (!this.content || !this.content.files) {
            // Let's not break, but don't do anything
            return Promise.resolve();
        }
        // Make sure the destination is available
        fs_extra_1.default.existsSync(dest) || fs_extra_1.default.mkdirsSync(dest);
        // Save all the local and global globs
        return Promise.all(this.content.files.map(function (glob) { return _this.saveGlobs({ dest: dest, glob: glob, props: { cwd: _this.path, parents: true } }); })
            .concat(this.content.archiveFiles.map(function (glob) { return _this.saveGlobs({ dest: dest, glob: glob, props: { cwd: _this.dir, parents: true } }); })));
    };
    return Template;
}());
exports.Template = Template;
//# sourceMappingURL=Template.js.map