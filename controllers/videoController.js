const pool = require('../db');

const getAllVideos = async (req, res) => {
  try {

    const result = await pool.query(
      'SELECT * FROM videos ORDER BY video_id'
    );

    res.status(200).json(result.rows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createVideo = async (req, res) => {
  try {

    const {
      channel_id,
      genre_id,
      title,
      description,
      duration_seconds
    } = req.body;

    const result = await pool.query(
      `INSERT INTO videos
      (channel_id, genre_id, title, description, duration_seconds)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        channel_id,
        genre_id,
        title,
        description,
        duration_seconds
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllVideos,
  createVideo
};