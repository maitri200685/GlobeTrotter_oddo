"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const request_id_middleware_1 = require("./middleware/request-id.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const not_found_middleware_1 = require("./middleware/not-found.middleware");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
}));
// Body Parsing
app.use(express_1.default.json({ limit: '10kb' })); // Limit body size
// Request ID
app.use(request_id_middleware_1.requestIdMiddleware);
// Logging
app.use((0, pino_http_1.default)({
    logger: logger_1.logger,
    customProps: (req) => ({
        reqId: req.id || req.reqId,
    }),
}));
// API Routes
app.use('/api/v1', routes_1.default);
// 404 Handler
app.use(not_found_middleware_1.notFoundHandler);
// Centralized Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
