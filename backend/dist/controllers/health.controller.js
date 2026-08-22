"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readinessCheck = exports.healthCheck = void 0;
const response_1 = require("../utils/response");
const supabase_1 = require("../config/supabase");
const healthCheck = (req, res) => {
    res.json((0, response_1.sendSuccess)({ status: 'ok', service: 'globetrotter-backend' }));
};
exports.healthCheck = healthCheck;
const readinessCheck = async (req, res, next) => {
    try {
        // Verify Supabase connectivity
        const supabase = (0, supabase_1.getAdminSupabaseClient)();
        // A simple query to ensure connectivity. 
        // We limit to 1 so it's extremely fast and lightweight.
        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
            throw new Error(`Database connection failed: ${error.message}`);
        }
        res.json((0, response_1.sendSuccess)({ status: 'ready', database: 'connected' }));
    }
    catch (error) {
        next(error);
    }
};
exports.readinessCheck = readinessCheck;
