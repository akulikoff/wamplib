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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var WAMP = /** @class */ (function () {
    function WAMP(url) {
        this.url = url;
        this.ws = null;
        this.sessionId = null;
        this.callId = null;
        this.heartbeatCounter = 0;
        this.isConnected = false;
    }
    WAMP.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ws = new ws_1.default(this.url);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.ws.onopen = function () {
                                    if (_this.ws.readyState === ws_1.default.OPEN) {
                                        _this.isConnected = true;
                                        resolve();
                                    }
                                    else {
                                        reject(new Error("WebSocket connection failed"));
                                    }
                                };
                                _this.ws.onerror = function (error) {
                                    reject(error);
                                };
                            })];
                    case 1:
                        _a.sent();
                        this.ws.onmessage = function (event) {
                            return _this.onMessage(event);
                        };
                        this.ws.onclose = function () {
                            _this.isConnected = false;
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    WAMP.prototype.ensureConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isConnected) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    WAMP.prototype.onMessage = function (event) {
        var message = JSON.parse(event.data.toString());
        var messageType = message[0];
        switch (messageType) {
            case 0: // Welcome
                this.sessionId = message[1];
                console.log("Welcome message received. Session ID: ".concat(this.sessionId));
                break;
            case 3: // CallResult
                console.log("Call result received. Call ID: ".concat(message[1], ", Result: ").concat(message[2]));
                break;
            case 4: // CallError
                console.log("Call error received. Call ID: ".concat(message[1], ", Error URI: ").concat(message[2], ", Error Desc: ").concat(message[3], ", Error Details: ").concat(message[4]));
                break;
            case 8: // Event
                console.log("Event received. URI: ".concat(message[1], ", Event: ").concat(message[2]));
                break;
            case 20: // Heartbeat
                console.log("Heartbeat received. Counter: ".concat(message[1]));
                break;
            default:
                console.log("Unknown message type");
        }
    };
    WAMP.prototype.call = function (uri) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        this.callId = this.generateId();
                        message = JSON.stringify(__spreadArray([2, this.callId, uri], args, true));
                        console.log(message);
                        this.ws.send(message);
                        return [2 /*return*/];
                }
            });
        });
    };
    WAMP.prototype.subscribe = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        message = JSON.stringify([5, uri]);
                        this.ws.send(message);
                        return [2 /*return*/];
                }
            });
        });
    };
    WAMP.prototype.unsubscribe = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        message = JSON.stringify([6, uri]);
                        this.ws.send(message);
                        return [2 /*return*/];
                }
            });
        });
    };
    WAMP.prototype.heartbeat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        message = JSON.stringify([20, this.heartbeatCounter++]);
                        this.ws.send(message);
                        return [2 /*return*/];
                }
            });
        });
    };
    WAMP.prototype.generateId = function () {
        return Math.random().toString(36).substr(2, 16);
    };
    return WAMP;
}());
exports.default = WAMP;
