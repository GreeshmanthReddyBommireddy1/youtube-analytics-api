import express from 'express';

import verifyToken from '../middleware/authMiddleware';
import authorizeRole from '../middleware/roleMiddleware';

import {
  getAllChannels,
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel
} from '../controllers/channelController';

const router = express.Router();

/**
 * @swagger
 * /channels:
 *   get:
 *     summary: Get all channels
 *     description: Retrieves a list of all channels. Requires one of admin, creator, or viewer role.
 *     tags:
 *       - Channels
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of channels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Channel'
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
  getAllChannels
);

/**
 * @swagger
 * /channels/{id}:
 *   get:
 *     summary: Get channel by ID
 *     description: Retrieves a specific channel by its ID. Requires one of admin, creator, or viewer role.
 *     tags:
 *       - Channels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the channel
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved channel details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Invalid channel ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *       404:
 *         description: Channel not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'creator', 'viewer'),
  getChannelById
);

/**
 * @swagger
 * /channels:
 *   post:
 *     summary: Create a new channel
 *     description: Creates a new channel. Requires admin or creator role.
 *     tags:
 *       - Channels
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChannelRequest'
 *           example:
 *             user_id: 1
 *             channel_name: Tech Tutorials
 *             description: Learn about technology and programming
 *     responses:
 *       201:
 *         description: Channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel created successfully
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions (admin or creator role required)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Admin or creator role required.
 *       409:
 *         description: Conflict - Channel name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel name already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  verifyToken,
  authorizeRole('admin', 'creator'),
  createChannel
);

/**
 * @swagger
 * /channels/{id}:
 *   put:
 *     summary: Update channel information
 *     description: Updates an existing channel's information. Requires admin or creator role.
 *     tags:
 *       - Channels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the channel to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channel_name:
 *                 type: string
 *                 example: Updated Channel Name
 *               description:
 *                 type: string
 *                 example: Updated channel description
 *               is_verified:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel updated successfully
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Invalid input or invalid channel ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions (admin or creator role required)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Admin or creator role required.
 *       404:
 *         description: Channel not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel not found
 *       409:
 *         description: Conflict - Channel name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel name already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'creator'),
  updateChannel
);

/**
 * @swagger
 * /channels/{id}:
 *   delete:
 *     summary: Delete a channel
 *     description: Deletes a channel by ID. Requires admin role.
 *     tags:
 *       - Channels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the channel to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Channel deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel deleted successfully
 *       400:
 *         description: Invalid channel ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions (admin role required)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Admin role required.
 *       404:
 *         description: Channel not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  deleteChannel
);

export default router;