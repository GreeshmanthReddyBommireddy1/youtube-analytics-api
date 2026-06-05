import express from 'express';

import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/videoController';

import verifyToken from '../middleware/authMiddleware';
import authorizeRole from '../middleware/roleMiddleware';

const router = express.Router();

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Get all videos
 *     description: Retrieves a list of all videos. Requires one of admin, creator, or viewer role.
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
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
  getVideos
);

/**
 * @swagger
 * /videos/{id}:
 *   get:
 *     summary: Get video by ID
 *     description: Retrieves a specific video by its ID. Requires one of admin, creator, or viewer role.
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the video
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved video details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       400:
 *         description: Invalid video ID format
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
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video not found
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
  getVideoById
);

/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Create a new video
 *     description: Creates a new video. Requires admin or creator role.
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideoRequest'
 *           example:
 *             channel_id: 1
 *             genre_id: 1
 *             title: How to Learn TypeScript
 *             description: A comprehensive guide to learning TypeScript
 *             duration_seconds: 3600
 *             is_public: true
 *     responses:
 *       201:
 *         description: Video created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video created successfully
 *                 video:
 *                   $ref: '#/components/schemas/Video'
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
 *       404:
 *         description: Channel or genre not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel or genre not found
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
  createVideo
);

/**
 * @swagger
 * /videos/{id}:
 *   put:
 *     summary: Update video information
 *     description: Updates an existing video's information. Requires admin or creator role.
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the video to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Video Title
 *               description:
 *                 type: string
 *                 example: Updated video description
 *               duration_seconds:
 *                 type: integer
 *                 example: 7200
 *               is_public:
 *                 type: boolean
 *                 example: true
 *               genre_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video updated successfully
 *                 video:
 *                   $ref: '#/components/schemas/Video'
 *       400:
 *         description: Invalid input or invalid video ID format
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
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video not found
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
  updateVideo
);

/**
 * @swagger
 * /videos/{id}:
 *   delete:
 *     description: Deletes a video by ID. Requires admin role.
 *     summary: Delete a video
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the video to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video deleted successfully
 *       400:
 *         description: Invalid video ID format
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
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video not found
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
  deleteVideo
);

export default router;