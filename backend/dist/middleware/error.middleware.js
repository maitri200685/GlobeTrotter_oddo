"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    if (err instanceof errors_1.AppError) {
        logger_1.logger.warn({ err, reqId: req.reqId }, `AppError: ${err.message}`);
        return res.status(err.statusCode).json((0, response_1.sendError)(err.code, err.message, err.details));
    }
    // Unhandled internal errors
    logger_1.logger.error({ err, reqId: req.reqId }, 'Unhandled Internal Server Error');
    return res.status(500).json((0, response_1.sendError)('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'));
};
exports.errorHandler = errorHandler;
