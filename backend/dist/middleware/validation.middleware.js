"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // We assume the schema might validate body, query, and params
            const validData = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Optionally re-assign validated data
            if (validData.body !== undefined)
                req.body = validData.body;
            // Object.assign is safer for query and params
            if (validData.query !== undefined)
                Object.assign(req.query, validData.query);
            if (validData.params !== undefined)
                Object.assign(req.params, validData.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(new errors_1.ValidationError('Validation failed', error.flatten().fieldErrors));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
