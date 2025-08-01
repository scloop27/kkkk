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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import express from "express";
import { registerRoutes } from "./routes";
import dotenv from "dotenv";
import { createServer as createViteServer } from 'vite';
// Load environment variables
dotenv.config();
var app = express();
var PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
function setupVite() {
    return __awaiter(this, void 0, void 0, function () {
        var vite;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(process.env.NODE_ENV !== 'production')) return [3 /*break*/, 2];
                    return [4 /*yield*/, createViteServer({
                            server: { middlewareMode: true },
                            appType: 'spa',
                            root: './client',
                        })];
                case 1:
                    vite = _a.sent();
                    app.use(vite.ssrFixStacktrace);
                    app.use(vite.middlewares);
                    return [3 /*break*/, 3];
                case 2:
                    app.use(express.static('dist'));
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var server, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, setupVite()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, registerRoutes(app)];
                case 2:
                    server = _a.sent();
                    server.listen(PORT, '0.0.0.0', function () {
                        console.log("Lodge Management Server running on port ".concat(PORT));
                        console.log("Environment: ".concat(process.env.NODE_ENV || 'development'));
                        console.log("Access the application at: http://localhost:".concat(PORT));
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to start server:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
startServer();
