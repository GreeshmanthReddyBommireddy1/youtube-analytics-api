const express = require('express');

const router = express.Router();

const {
  getAllVideos,
  createVideo
} = require('../controllers/videoController');

router.get('/', getAllVideos);

router.post('/', createVideo);

module.exports = router;