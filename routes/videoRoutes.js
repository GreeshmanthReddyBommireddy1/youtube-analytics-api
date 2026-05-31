const express = require('express');

const verifyToken = require('../middleware/authMiddleware');

const authorizeRole = require('../middleware/roleMiddleware');

const router = express.Router();

const {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/videoController');


router.get(
    '/',
    verifyToken,
    authorizeRole('admin', 'creator', 'viewer'),
    getAllVideos
);

router.get(
    '/:id',
    verifyToken,
    authorizeRole('admin', 'creator', 'viewer'),
    getVideoById
);

router.post(
    '/',
    verifyToken,
    authorizeRole('admin', 'creator'),
    createVideo
);

router.put(
    '/:id',
    verifyToken,
    authorizeRole('admin', 'creator'),
    updateVideo
);

router.delete(
    '/:id',
    verifyToken,
    authorizeRole('admin'),
    deleteVideo
);

module.exports = router;