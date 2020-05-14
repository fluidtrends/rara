"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Installer = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var _1 = require(".");
var Installer = /** @class */ (function () {
    function Installer(archive) {
        this._archive = archive;
    }
    Object.defineProperty(Installer.prototype, "archive", {
        get: function () {
            return this._archive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Installer.prototype, "npmManifestFile", {
        get: function () {
            return path_1.default.resolve(this.archive.path, 'package.json');
        },
        enumerable: false,
        configurable: true
    });
    Installer.prototype._npm = function (command, options) {
        if (fs_extra_1.default.existsSync(path_1.default.resolve(this.archive.path, 'node_modules'))) {
            return Promise.resolve({ totalTime: 0, alreadyInstalled: true });
        }
        var startTime = Date.now();
        var pkg = JSON.parse(fs_extra_1.default.readFileSync(this.npmManifestFile, 'utf8'));
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.___ = "npm " + command + " " + options.join(' ');
        var stdout = process.stdout.write;
        process.stdout.write = Function.prototype;
        var opts = Object.assign({}, {
            path: this.archive.path,
            pkg: pkg,
            event: "___",
            silent: true,
            stdio: ['ignore', 'ignore', 'ignore'],
            config: {}
        }, this.archive.npmOptions);
        return new Promise(function (resolve, reject) {
            _1.Registry.runScript(opts)
                .then(function () {
                var totalTime = (Date.now() - startTime);
                process.stdout.write = stdout;
                resolve({ totalTime: totalTime, installed: true });
            })
                .catch(function (error) {
                process.stdout.write = stdout;
                reject(error);
            });
        });
    };
    Installer.prototype.install = function (options) {
        var npmManifest = this.npmManifestFile;
        if (!fs_extra_1.default.existsSync(npmManifest)) {
            return Promise.resolve({ totalTime: 0, skipped: true });
        }
        return this._npm('install', ['--loglevel=error', '--no-progress', '--silent', '--no-audit']);
    };
    return Installer;
}());
exports.Installer = Installer;
//# sourceMappingURL=Installer.js.map