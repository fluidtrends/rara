"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archive = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var fs_readdir_recursive_1 = __importDefault(require("fs-readdir-recursive"));
var _1 = require(".");
var Archive = /** @class */ (function () {
    function Archive(props) {
        this._props = Object.assign({}, props);
        this._installer = new _1.Installer(this);
        this._logger = new _1.Logger(props);
    }
    Object.defineProperty(Archive.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "installer", {
        get: function () {
            return this._installer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "id", {
        get: function () {
            return this.props.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "archiveId", {
        get: function () {
            return this.id + (this.version ? "@" + this.version : "");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "version", {
        get: function () {
            return this.props.version || this._version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "dir", {
        get: function () {
            return this.props.dir;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "path", {
        get: function () {
            return (!this.dir || !this.id || !this.version) ? null : path_1.default.resolve(this.dir, this.id, this.version, this.id);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "exists", {
        get: function () {
            return this.path && fs_extra_1.default.existsSync(path_1.default.resolve(this.path));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "files", {
        get: function () {
            return this._files;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "templates", {
        get: function () {
            return this._templates;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "manifest", {
        get: function () {
            return this._manifest;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Archive.prototype, "npmOptions", {
        get: function () {
            return { log: this.logger.raw };
        },
        enumerable: false,
        configurable: true
    });
    Archive.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var manifest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.version) {
                            // No need to fetch the version
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, _1.Registry.manifest(this.archiveId)];
                    case 1:
                        manifest = _a.sent();
                        this._version = "" + manifest.version;
                        this._manifest = Object.assign({}, manifest);
                        return [2 /*return*/];
                }
            });
        });
    };
    Archive.prototype.installDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.installer.install()];
                }
            });
        });
    };
    Archive.prototype.loadTemplates = function () {
        var _this = this;
        var templatesDir = path_1.default.resolve(this.path, 'templates');
        this._templates = {};
        fs_extra_1.default.existsSync(templatesDir) && fs_extra_1.default.readdirSync(templatesDir).map(function (name) { return _this._templates[name] = new _1.Template({ dir: _this.path, name: name }); });
    };
    Archive.prototype.ignoreFileIfNecessary = function (f) {
        return Archive.IGNORES.filter(function (i) { return f.startsWith(i); }).length === 0;
    };
    Archive.prototype.loadFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawFiles;
            var _this = this;
            return __generator(this, function (_a) {
                rawFiles = fs_readdir_recursive_1.default(path_1.default.resolve(this.path)).filter(function (f) { return _this.ignoreFileIfNecessary(f); });
                // Look for the ones we care about
                this._files = rawFiles.map(function (filepath) { return new _1.DataFile({ dir: _this.path, filepath: filepath }); });
                // Let's actually load all the files
                return [2 /*return*/, Promise.all(this.files.map(function (file) { return file.load(); })).then(function () { return _this; })];
            });
        });
    };
    Archive.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.initialize().then(function () {
                        if (!_this.exists) {
                            // First make sure the archive exists
                            return Promise.reject(new Error(Archive.ERRORS.CANNOT_LOAD('it does not exist')));
                        }
                        // Let's look up templates, if any
                        _this.loadTemplates();
                        // Load up all the files we care about
                        return _this.loadFiles();
                    })];
            });
        });
    };
    Archive.prototype.save = function (dest, args) {
        if (args === void 0) { args = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Make sure the destination exists
                fs_extra_1.default.existsSync(dest) || fs_extra_1.default.mkdirsSync(dest);
                return [2 /*return*/, this.load().then(function () { return Promise.all(_this.files.map(function (file) { return file.save(dest, args); })); })];
            });
        });
    };
    Archive.prototype.download = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.initialize()
                        .then(function () { return _1.Registry.extract(_this.archiveId, _this.path, _this.npmOptions); })];
            });
        });
    };
    Archive.ERRORS = {
        CANNOT_LOAD: function (reason) { return reason ? "Cannot load archive because " + reason : "Cannot load archive"; }
    };
    Archive.IGNORES = [
        "node_modules",
        "test",
        "package.json",
        "package-lock.json",
        "assets/text/intro.md"
    ];
    return Archive;
}());
exports.Archive = Archive;
//# sourceMappingURL=Archive.js.map