"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(4000),
    CORS_ORIGIN: zod_1.z.string().trim().default('http://localhost:5173'),
    SUPABASE_URL: zod_1.z.string().trim().url('SUPABASE_URL must be a valid URL'),
    SUPABASE_ANON_KEY: zod_1.z.string().trim().min(1, 'SUPABASE_ANON_KEY is required'),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().trim().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.log('DEBUG CORS_ORIGIN:', JSON.stringify(process.env.CORS_ORIGIN));
    console.error('❌ Invalid environment variables:');
    console.error(parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsedEnv.data;
