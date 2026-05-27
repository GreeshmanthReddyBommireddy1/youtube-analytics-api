const express = require('express');

const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

const {
    getChannels,
    getChannelById,
    createChannel,
    updateChannel,
    deleteChannel
} = require('../controllers/channelController');



router.get('/', verifyToken, getChannels);

router.get('/:id', verifyToken, getChannelById);

router.post('/', verifyToken, createChannel);

router.put('/:id', verifyToken, updateChannel);

router.delete('/:id', verifyToken, deleteChannel);

module.exports = router;