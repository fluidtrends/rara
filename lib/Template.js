"use strict";
var path = require('path');
var fs = require('fs-extra');
var cpy = require('cpy');
var _ = /** @class */ (function () {
    function _(props) {
        this._props = Object.assign({}, props);
        this._name = this.props.name;
        this._dir = this.props.dir;
        this._path = path.resolve(this.dir, 'templates', this.name);
    }
    Object.defineProperty(_.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "dir", {
        get: function () {
            return this._dir;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "exists", {
        get: function () {
            return fs.existsSync(this.path);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    _.prototype.load = function (props) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var Template = require(_this.path);
                _this._content = new Template(props);
                resolve(_this);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    _.prototype.saveGlobs = function (_a) {
        var dest = _a.dest, glob = _a.glob, props = _a.props;
        return cpy(glob, dest, props);
    };
    _.prototype.save = function (dest, props) {
        var _this = this;
        if (!this.content || !this.content.files) {
            // Let's not break, but don't do anything
            return Promise.resolve();
        }
        // Make sure the destination is available
        fs.existsSync(dest) || fs.mkdirsSync(dest);
        // Save all the local and global globs
        return Promise.all(this.content.files.map(function (glob) { return _this.saveGlobs({ dest: dest, glob: glob, props: { cwd: _this.path, parents: true } }); })
            .concat(this.content.archiveFiles.map(function (glob) { return _this.saveGlobs({ dest: dest, glob: glob, props: { cwd: _this.dir, parents: true } }); })));
    };
    return _;
}());
module.exports = _;
//# sourceMappingURL=Template.js.map