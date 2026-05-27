const express = require('express');

const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

const {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/videoController');

router.get('/', verifyToken, getAllVideos);

router.get('/:id', verifyToken, getVideoById);

router.post('/', verifyToken, createVideo);

router.put('/:id', verifyToken, updateVideo);

router.delete('/:id', verifyToken, deleteVideo);

module.exports = router;