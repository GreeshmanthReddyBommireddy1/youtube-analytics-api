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

const getVideoById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM videos WHERE video_id = $1',
      [id]
    );

    res.status(200).json(result.rows[0]);

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
      duration_seconds,
      view_count,
      like_count,
      dislike_count,
      is_public
    } = req.body;

    const result = await pool.query(
      `INSERT INTO videos
      (
        channel_id,
        genre_id,
        title,
        description,
        duration_seconds,
        view_count,
        like_count,
        dislike_count,
        is_public
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        channel_id,
        genre_id,
        title,
        description,
        duration_seconds,
        view_count,
        like_count,
        dislike_count,
        is_public
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const updateVideo = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      description,
      like_count,
      view_count
    } = req.body;

    const result = await pool.query(
      `UPDATE videos
       SET title = $1,
           description = $2,
           like_count = $3,
           view_count = $4
       WHERE video_id = $5
       RETURNING *`,
      [
        title,
        description,
        like_count,
        view_count,
        id
      ]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const deleteVideo = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      'DELETE FROM videos WHERE video_id = $1',
      [id]
    );

    res.status(200).json({
      message: 'Video deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
};