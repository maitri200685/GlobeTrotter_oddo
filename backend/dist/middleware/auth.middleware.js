"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const supabase_1 = require("../config/supabase");
const errors_1 = require("../utils/errors");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new errors_1.UnauthorizedError('Missing Authorization header');
        }
        if (!authHeader.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('Invalid Authorization header format. Expected "Bearer <token>"');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new errors_1.UnauthorizedError('Missing token in Authorization header');
        }
        // Use admin client to strictly verify the token using Supabase Auth
        const supabase = (0, supabase_1.getAdminSupabaseClient)();
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            throw new errors_1.UnauthorizedError('Invalid or expired token');
        }
        // Attach verified user and token to request
        req.user = data.user;
        req.token = token;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireAuth = requireAuth;
