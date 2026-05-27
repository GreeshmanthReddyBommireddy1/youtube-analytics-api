const pool = require('../db');

const getChannels = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM channels
            ORDER BY channel_id
            `
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getChannelById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM channels
            WHERE channel_id = $1
            `,
            [id]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const createChannel = async (req, res) => {

    try {

        const {
            user_id,
            channel_name,
            description,
            is_verified
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO channels
            (
                user_id,
                channel_name,
                description,
                is_verified
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                user_id,
                channel_name,
                description,
                is_verified
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const updateChannel = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            channel_name,
            description,
            is_verified
        } = req.body;

        const result = await pool.query(
            `
            UPDATE channels
            SET
                channel_name = $1,
                description = $2,
                is_verified = $3
            WHERE channel_id = $4
            RETURNING *
            `,
            [
                channel_name,
                description,
                is_verified,
                id
            ]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const deleteChannel = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            `
            DELETE FROM channels
            WHERE channel_id = $1
            `,
            [id]
        );

        res.status(200).json({
            message: 'Channel deleted successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getChannels,
    getChannelById,
    createChannel,
    updateChannel,
    deleteChannel
};