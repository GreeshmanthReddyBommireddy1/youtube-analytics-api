const express = require('express');

const verifyToken = require('../middleware/authMiddleware');

const authorizeRole = require('../middleware/roleMiddleware');

const router = express.Router();

const {
    getChannels,
    getChannelById,
    createChannel,
    updateChannel,
    deleteChannel
} = require('../controllers/channelController');


router.get(
    '/',
    verifyToken,
    authorizeRole('admin', 'creator', 'viewer'),
    getChannels
);

router.get(
    '/:id',
    verifyToken,
    authorizeRole('admin', 'creator', 'viewer'),
    getChannelById
);

router.post(
    '/',
    verifyToken,
    authorizeRole('admin', 'creator'),
    createChannel
);

router.put(
    '/:id',
    verifyToken,
    authorizeRole('admin', 'creator'),
    updateChannel
);

router.delete(
    '/:id',
    verifyToken,
    authorizeRole('admin'),
    deleteChannel
);

module.exports = router;