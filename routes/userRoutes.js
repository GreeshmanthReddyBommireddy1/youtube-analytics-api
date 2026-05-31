const express = require('express');

const verifyToken = require('../middleware/authMiddleware');

const authorizeRole = require('../middleware/roleMiddleware');

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');



router.get(
    '/',
    verifyToken,
    authorizeRole('admin'),
    getAllUsers
);

router.get(
    '/:id',
    verifyToken,
    authorizeRole('admin'),
    getUserById
);

router.post(
    '/',
    verifyToken,
    authorizeRole('admin'),
    createUser
);

router.put(
    '/:id',
    verifyToken,
    authorizeRole('admin'),
    updateUser
);

router.delete(
    '/:id',
    verifyToken,
    authorizeRole('admin'),
    deleteUser
);

module.exports = router;