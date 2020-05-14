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
exports.DataFile = void 0;
var ejs_1 = __importDefault(require("ejs"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var DataFile = /** @class */ (function () {
    function DataFile(props) {
        this._props = Object.assign({}, props);
    }
    Object.defineProperty(DataFile.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataFile.prototype, "filepath", {
        get: function () {
            return this.props.filepath;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataFile.prototype, "dir", {
        get: function () {
            return this.props.dir;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataFile.prototype, "path", {
        get: function () {
            return (!this.dir || !this.filepath) ? "" : path_1.default.resolve(this.dir, this.filepath);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataFile.prototype, "exists", {
        get: function () {
            return this.path && fs_extra_1.default.existsSync(path_1.default.resolve(this.path));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataFile.prototype, "type", {
        get: function () {
            return this._type || DataFile.TYPES.ASSET;
        },
        enumerable: false,
        configurable: true
    });
    DataFile.prototype.detectType = function () {
        if (this._type) {
            // Not necessary
            return;
        }
        // Figure out the file's extension
        var ext = path_1.default.extname(this.path).toUpperCase().substring(1);
        for (var _i = 0, _a = Object.entries(DataFile.TYPES); _i < _a.length; _i++) {
            var _b = _a[_i], type = _b[0], values = _b[1];
            if (values.includes(ext)) {
                // Looks like we recognize this type
                this._type = values;
                return;
            }
        }
    };
    Object.defineProperty(DataFile.prototype, "isCompilable", {
        get: function () {
            return !DataFile.NONCOMPILABLE_TYPES.includes(this.type);
        },
        enumerable: false,
        configurable: true
    });
    DataFile.prototype.compile = function (args, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!this.isCompilable) {
            // No need to compile
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            try {
                // Attempt to load the file 
                var content = fs_extra_1.default.readFileSync(_this.path, 'utf8');
                if (!content) {
                    // Next let's make sure we stop right here for empty files
                    resolve("");
                    return;
                }
                // Try to parse the file and catch syntax errors
                var template = ejs_1.default.compile(content, {});
                // Finally, let's see if we can validate it
                var output = template(args);
                // We're good
                resolve(options.json ? JSON.parse(output) : output);
            }
            catch (error) {
                reject(new Error(DataFile.ERRORS.CANNOT_LOAD(error.message)));
            }
        });
    };
    DataFile.prototype.load = function (args, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.exists) {
                    // First make sure the file exists
                    return [2 /*return*/, Promise.reject(new Error(DataFile.ERRORS.CANNOT_LOAD('it does not exist')))];
                }
                // Let's see if this is a recognized file y]type 
                this.detectType();
                // Compile the file if necessary
                return [2 /*return*/, this.compile(args, options)];
            });
        });
    };
    DataFile.prototype.copy = function (dest) {
        return __awaiter(this, void 0, void 0, function () {
            var dir;
            var _this = this;
            return __generator(this, function (_a) {
                dir = path_1.default.resolve(dest, path_1.default.dirname(this.filepath));
                fs_extra_1.default.existsSync(dir) || fs_extra_1.default.mkdirs(dir);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // Let's move the file over
                        fs_extra_1.default.copySync(_this.path, path_1.default.resolve(dest, _this.filepath));
                        resolve();
                    })];
            });
        });
    };
    DataFile.prototype.save = function (dest, args) {
        if (args === void 0) { args = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var dir;
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.exists) {
                    // First make sure the file exists
                    return [2 /*return*/, Promise.reject(new Error(DataFile.ERRORS.CANNOT_SAVE('it does not exist')))];
                }
                if (!fs_extra_1.default.existsSync(dest)) {
                    // First make sure the destination location
                    return [2 /*return*/, Promise.reject(new Error(DataFile.ERRORS.CANNOT_SAVE('the destination does not exist')))];
                }
                // Let's see if this is a recognized file type 
                this.detectType();
                if (!this.isCompilable) {
                    // Let's move the file over
                    return [2 /*return*/, this.copy(dest)];
                }
                dir = path_1.default.resolve(dest, path_1.default.dirname(this.filepath));
                fs_extra_1.default.existsSync(dir) || fs_extra_1.default.mkdirsSync(dir);
                // Load and then save it
                return [2 /*return*/, this.load(args).then(function (output) {
                        fs_extra_1.default.writeFileSync(path_1.default.resolve(dest, _this.filepath), output, 'utf8');
                    })];
            });
        });
    };
    DataFile.ERRORS = {
        CANNOT_LOAD: function (reason) { return reason ? "Cannot load file because " + reason : "Cannot load file"; },
        CANNOT_SAVE: function (reason) { return reason ? "Cannot save file because " + reason : "Cannot save file"; }
    };
    DataFile.TYPES = {
        ASSET: "ASSET_TYPE",
        IMAGE: ["PNG", "JPG", "JPEG", "GIF", "SVG"],
        JSON: ["JSON"],
        JAVASCRIPT: ["JS"],
        CSS: ["CSS"],
        MARKDOWN: ["MD"]
    };
    DataFile.NONCOMPILABLE_TYPES = [DataFile.TYPES.ASSET, DataFile.TYPES.IMAGE];
    return DataFile;
}());
exports.DataFile = DataFile;
//# sourceMappingURL=DataFile.js.map