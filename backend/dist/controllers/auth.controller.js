"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const response_1 = require("../utils/response");
const getMe = (req, res) => {
    // req.user is guaranteed to exist because of requireAuth middleware
    res.json((0, response_1.sendSuccess)({
        user: {
            id: req.user.id,
            email: req.user.email,
        },
    }));
};
exports.getMe = getMe;
