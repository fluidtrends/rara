"use strict";
var fs = require('fs-extra');
var path = require('path');
var readDir = require('fs-readdir-recursive');
var File = require('./File');
var Template = require('./Template');
var Installer = require('./Installer');
var Logger = require('./Logger');
var libnpm = require('libnpm');
var _ = /** @class */ (function () {
    function _(props) {
        this._props = Object.assign({}, props);
        this._installer = new Installer(this);
        this._logger = new Logger(props);
    }
    Object.defineProperty(_.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "installer", {
        get: function () {
            return this._installer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "id", {
        get: function () {
            return this.props.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "archiveId", {
        get: function () {
            return this.id + (this.version ? "@" + this.version : "");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "version", {
        get: function () {
            return this.props.version || this._version;
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
            return (!this.dir || !this.id || !this.version) ? null : path.resolve(this.dir, this.id, this.version, this.id);
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
    Object.defineProperty(_.prototype, "files", {
        get: function () {
            return this._files;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "templates", {
        get: function () {
            return this._templates;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "manifest", {
        get: function () {
            return this._manifest;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "npmOptions", {
        get: function () {
            return { log: this.logger.raw };
        },
        enumerable: true,
        configurable: true
    });
    _.prototype.initialize = function () {
        var _this = this;
        if (this.version) {
            // No need to fetch the version
            return Promise.resolve();
        }
        return libnpm.manifest(this.archiveId, this.npmOptions).then(function (manifest) {
            _this._version = "" + manifest.version;
            _this._manifest = Object.assign({}, manifest);
        });
    };
    _.prototype.installDependencies = function () {
        var _this = this;
        return this.initialize()
            .then(function () { return _this.installer.install(_this.npmOptions); });
    };
    _.prototype.loadTemplates = function () {
        var _this = this;
        var templatesDir = path.resolve(this.path, 'templates');
        this._templates = {};
        fs.existsSync(templatesDir) && fs.readdirSync(templatesDir).map(function (name) { return _this._templates[name] = new Template({ dir: _this.path, name: name }); });
    };
    _.prototype.ignoreFileIfNecessary = function (f) {
        return _.IGNORES.filter(function (i) { return f.startsWith(i); }).length === 0;
    };
    _.prototype.loadFiles = function () {
        var _this = this;
        // List out all the files
        var rawFiles = readDir(path.resolve(this.path)).filter(function (f) { return _this.ignoreFileIfNecessary(f); });
        // Look for the ones we care about
        this._files = rawFiles.map(function (filepath) { return new File({ dir: _this.path, filepath: filepath }); });
        // Let's actually load all the files
        return Promise.all(this.files.map(function (file) { return file.load(); })).then(function () { return _this; });
    };
    _.prototype.load = function () {
        var _this = this;
        return this.initialize().then(function () {
            if (!_this.exists) {
                // First make sure the archive exists
                return Promise.reject(new Error(_.ERRORS.CANNOT_LOAD('it does not exist')));
            }
            // Let's look up templates, if any
            _this.loadTemplates();
            // Load up all the files we care about
            return _this.loadFiles();
        });
    };
    _.prototype.save = function (dest, args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        // Make sure the destination exists
        fs.existsSync(dest) || fs.mkdirsSync(dest);
        return this.load().then(function () { return Promise.all(_this.files.map(function (file) { return file.save(dest, args); })); });
    };
    _.prototype.download = function () {
        var _this = this;
        return this.initialize()
            .then(function () { return libnpm.extract(_this.archiveId, _this.path, _this.npmOptions); });
    };
    return _;
}());
_.ERRORS = {
    CANNOT_LOAD: function (reason) { return reason ? "Cannot load archive because " + reason : "Cannot load archive"; }
};
_.IGNORES = [
    "node_modules",
    "test",
    "package.json",
    "package-lock.json",
    "assets/text/intro.md"
];
module.exports = _;
//# sourceMappingURL=Archive.js.map