import express from 'express';

import verifyToken from '../middleware/authMiddleware';
import authorizeRole from '../middleware/roleMiddleware';

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users. Requires one of admin, creator, or viewer role.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions (admin, creator, or viewer role required)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Requires admin, creator, or viewer role.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  verifyToken,
  authorizeRole('admin', 'creator', 'viewer'),
  getAllUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieves a specific user by its ID. Requires one of admin, creator, or viewer role.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the user
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions (admin, creator, or viewer role required)
 *         content:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Access denied. Requires admin, creator, or viewer role.
 *       404:
 *         description: User not found
 *         content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'creator', 'viewer'),
  getUserById
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user. Requires admin role.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *           example:
 *             username: newuser123
 *             email: newuser@example.com
 *             full_name: New User
 *             country_code: US
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions (admin role required)
 *         content:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Access denied. Admin role required.
 *       409:
 *         description: Username or email already exists
 *         content:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Username or Email already exists
 *       500:
 *         description: Internal server error
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  verifyToken,
  authorizeRole('admin'),
  createUser
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates an existing user's full name and country. Requires admin role.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the user to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Updated User Name
 *               country_code:
 *                 type: string
 *                 example: US
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or invalid user ID format
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions (admin role required)
 *         content:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Access denied. Admin role required.
 *       404:
 *         description: User not found
 *         content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID. Requires admin role.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the user to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User deleted successfully
 *       400:
 *         description: Invalid user ID format
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions (admin role required)
 *         content:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Access denied. Admin role required.
 *       404:
 *         description: User not found
 *         content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  deleteUser
);

export default router;
