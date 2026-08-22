"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthSupabaseClient = exports.getAdminSupabaseClient = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
// Service role client - bypassing RLS
// Use strictly for backend-only administrative tasks
const getAdminSupabaseClient = () => {
    return (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
exports.getAdminSupabaseClient = getAdminSupabaseClient;
// Authenticated client - respects RLS
// Use for all user-scoped requests
const getAuthSupabaseClient = (jwt) => {
    return (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
exports.getAuthSupabaseClient = getAuthSupabaseClient;
