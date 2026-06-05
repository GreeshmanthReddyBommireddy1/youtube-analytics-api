"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            orderBy: {
                user_id: 'asc'
            }
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await prisma_1.default.user.findUnique({
            where: {
                user_id: id
            }
        });
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const { username, email, full_name, country_code } = req.body;
        const user = await prisma_1.default.user.create({
            data: {
                username,
                email,
                full_name,
                country_code
            }
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { full_name, country_code } = req.body;
        const user = await prisma_1.default.user.update({
            where: {
                user_id: id
            },
            data: {
                full_name,
                country_code
            }
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.default.user.delete({
            where: {
                user_id: id
            }
        });
        res.status(200).json({
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
exports.deleteUser = deleteUser;
