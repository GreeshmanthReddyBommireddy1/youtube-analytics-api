"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, (0, roleMiddleware_1.default)('admin'), userController_1.getAllUsers);
router.get('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)('admin'), userController_1.getUserById);
router.post('/', authMiddleware_1.default, (0, roleMiddleware_1.default)('admin'), userController_1.createUser);
router.put('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)('admin'), userController_1.updateUser);
router.delete('/:id', authMiddleware_1.default, (0, roleMiddleware_1.default)('admin'), userController_1.deleteUser);
exports.default = router;
