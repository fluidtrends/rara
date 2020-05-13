"use strict";
var ejs = require('ejs');
var fs = require('fs-extra');
var path = require('path');
var _a = require('binda'), FileAdapter = _a.FileAdapter, ImageAdapter = _a.ImageAdapter;
var _ = /** @class */ (function () {
    function _(props) {
        this._props = Object.assign({}, props);
    }
    Object.defineProperty(_.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "filepath", {
        get: function () {
            return this.props.filepath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "dir", {
        get: function () {
            return this.props.dir;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "path", {
        get: function () {
            return (!this.dir || !this.filepath) ? null : path.resolve(this.dir, this.filepath);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "exists", {
        get: function () {
            return this.path && fs.existsSync(path.resolve(this.path));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "type", {
        get: function () {
            return this._type || _.TYPES.ASSET;
        },
        enumerable: true,
        configurable: true
    });
    _.prototype.detectType = function () {
        if (this._type) {
            // Not necessary
            return;
        }
        // Figure out the file's extension
        var ext = path.extname(this.path).toUpperCase().substring(1);
        for (var _i = 0, _a = Object.entries(_.TYPES); _i < _a.length; _i++) {
            var _b = _a[_i], type = _b[0], values = _b[1];
            if (values.includes(ext)) {
                // Looks like we recognize this type
                this._type = values;
                return;
            }
        }
    };
    Object.defineProperty(_.prototype, "isCompilable", {
        get: function () {
            return !_.NONCOMPILABLE_TYPES.includes(this.type);
        },
        enumerable: true,
        configurable: true
    });
    _.prototype.compile = function (args, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!this.isCompilable) {
            // No need to compile
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            try {
                // Attempt to load the file 
                var content = fs.readFileSync(_this.path, 'utf8');
                if (!content) {
                    // Next let's make sure we stop right here for empty files
                    resolve("");
                    return;
                }
                // Try to parse the file and catch syntax errors
                var template = ejs.compile(content, {});
                // Finally, let's see if we can validate it
                var output = template(args);
                // We're good
                resolve(options.json ? JSON.parse(output, null, 2) : output);
            }
            catch (error) {
                reject(new Error(_.ERRORS.CANNOT_LOAD(error.message)));
            }
        });
    };
    _.prototype.load = function (args, options) {
        if (options === void 0) { options = {}; }
        if (!this.exists) {
            // First make sure the file exists
            return Promise.reject(new Error(_.ERRORS.CANNOT_LOAD('it does not exist')));
        }
        // Let's see if this is a recognized file y]type 
        this.detectType();
        // Compile the file if necessary
        return this.compile(args, options);
    };
    _.prototype.copy = function (dest) {
        var _this = this;
        // Create sub directories if necessary
        var dir = path.resolve(dest, path.dirname(this.filepath));
        fs.existsSync(dir) || fs.mkdirs(dir);
        return new Promise(function (resolve, reject) {
            // Let's move the file over
            fs.copySync(_this.path, path.resolve(dest, _this.filepath));
            resolve();
        });
    };
    _.prototype.save = function (dest, args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        if (!this.exists) {
            // First make sure the file exists
            return Promise.reject(new Error(_.ERRORS.CANNOT_SAVE('it does not exist')));
        }
        if (!fs.existsSync(dest)) {
            // First make sure the destination location
            return Promise.reject(new Error(_.ERRORS.CANNOT_SAVE('the destination does not exist')));
        }
        // Let's see if this is a recognized file type 
        this.detectType();
        if (!this.isCompilable) {
            // Let's move the file over
            return this.copy(dest);
        }
        // Create sub directories if necessary
        var dir = path.resolve(dest, path.dirname(this.filepath));
        fs.existsSync(dir) || fs.mkdirsSync(dir);
        // Load and then save it
        return this.load(args).then(function (output) {
            fs.writeFileSync(path.resolve(dest, _this.filepath), output, 'utf8');
        });
    };
    return _;
}());
_.ERRORS = {
    CANNOT_LOAD: function (reason) { return reason ? "Cannot load file because " + reason : "Cannot load file"; },
    CANNOT_SAVE: function (reason) { return reason ? "Cannot save file because " + reason : "Cannot save file"; }
};
_.TYPES = {
    ASSET: "ASSET_TYPE",
    IMAGE: ["PNG", "JPG", "JPEG", "GIF", "SVG"],
    JSON: ["JSON"],
    JAVASCRIPT: ["JS"],
    CSS: ["CSS"],
    MARKDOWN: ["MD"]
};
_.NONCOMPILABLE_TYPES = [_.TYPES.ASSET, _.TYPES.IMAGE];
module.exports = _;
//# sourceMappingURL=File.js.map