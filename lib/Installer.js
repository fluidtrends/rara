"use strict";
var npm = require('npm');
var libnpm = require('libnpm');
var fs = require('fs-extra');
var path = require('path');
var _ = /** @class */ (function () {
    function _(archive) {
        this._archive = archive;
    }
    Object.defineProperty(_.prototype, "archive", {
        get: function () {
            return this._archive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_.prototype, "npmManifestFile", {
        get: function () {
            return path.resolve(this.archive.path, 'package.json');
        },
        enumerable: true,
        configurable: true
    });
    _.prototype._npm = function (command, options) {
        if (fs.existsSync(path.resolve(this.archive.path, 'node_modules'))) {
            return Promise.resolve({ totalTime: 0, alreadyInstalled: true });
        }
        var startTime = Date.now();
        var pkg = JSON.parse(fs.readFileSync(this.npmManifestFile, 'utf8'));
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.___ = "npm " + command + " " + options.join(' ');
        var stdout = process.stdout.write;
        process.stdout.write = Function.prototype;
        var opts = Object.assign({}, {
            dir: this.archive.path,
            silent: true,
            stdio: ['ignore', 'ignore', 'ignore'],
            config: {}
        }, this.archive.npmOptions);
        return new Promise(function (resolve, reject) {
            libnpm.runScript(pkg, "___", null, opts)
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
    _.prototype.install = function () {
        var npmManifest = this.npmManifestFile;
        if (!fs.existsSync(npmManifest)) {
            return Promise.resolve({ totalTime: 0, skipped: true });
        }
        return this._npm('install', ['--loglevel=error', '--no-progress', '--silent', '--no-audit']);
    };
    return _;
}());
module.exports = _;
//# sourceMappingURL=Installer.js.map