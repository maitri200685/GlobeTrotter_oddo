"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const server = app_1.default.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Server listening on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
});
// Graceful Shutdown
const shutdown = () => {
    logger_1.logger.info('Shutting down gracefully...');
    server.close(() => {
        logger_1.logger.info('Closed out remaining connections.');
        process.exit(0);
    });
    // Force close after 10 seconds
    setTimeout(() => {
        logger_1.logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
