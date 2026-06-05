"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                message: 'User not authenticated'
            });
            return;
        }
        if (!allowedRoles.includes(req.user?.role ?? '')) {
            res.status(403).json({
                message: 'Access denied'
            });
            return;
        }
        next();
    };
};
exports.default = authorizeRole;
