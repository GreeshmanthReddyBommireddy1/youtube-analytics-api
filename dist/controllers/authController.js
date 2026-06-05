"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const register = async (req, res) => {
    try {
        const { username, password, role_id } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma_1.default.appUser.create({
            data: {
                username,
                password: hashedPassword
            }
        });
        await prisma_1.default.userRole.create({
            data: {
                user_id: newUser.id,
                role_id
            }
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma_1.default.appUser.findFirst({
            where: {
                username
            },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        if (!user) {
            res.status(401).json({
                message: 'Invalid username'
            });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                message: 'Invalid password'
            });
            return;
        }
        const roleName = user.userRoles[0]?.role.role_name || 'viewer';
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
            username: user.username,
            role: roleName
        }, 'secretkey', {
            expiresIn: '1h'
        });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: user.id
        }, 'refreshsecretkey', {
            expiresIn: '7d'
        });
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
exports.login = login;
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({
                message: 'Refresh token missing'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, 'refreshsecretkey');
        const user = await prisma_1.default.appUser.findUnique({
            where: {
                id: decoded.id
            },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
            return;
        }
        const roleName = user.userRoles[0]?.role.role_name || 'viewer';
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
            username: user.username,
            role: roleName
        }, 'secretkey', {
            expiresIn: '1h'
        });
        res.status(200).json({
            accessToken
        });
    }
    catch (error) {
        res.status(401).json({
            message: 'Invalid refresh token'
        });
    }
};
exports.refreshAccessToken = refreshAccessToken;
