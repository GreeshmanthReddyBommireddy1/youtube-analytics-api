const express = require('express');

const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

router.get('/', verifyToken, getAllUsers);

router.get('/:id',verifyToken, getUserById);

router.post('/', verifyToken, createUser);

router.put('/:id', verifyToken, updateUser);

router.delete('/:id', verifyToken, deleteUser);

module.exports = router;