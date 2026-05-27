const pool = require('../db');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY user_id'
    );

    res.status(200).json(result.rows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [id]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {

    const {
      username,
      email,
      full_name,
      country_code
    } = req.body;

    const result = await pool.query(
      `INSERT INTO users
      (username, email, full_name, country_code)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [username, email, full_name, country_code]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      full_name,
      country_code
    } = req.body;

    const result = await pool.query(
      `UPDATE users
      SET full_name = $1,
          country_code = $2
      WHERE user_id = $3
      RETURNING *`,
      [full_name, country_code, id]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      'DELETE FROM users WHERE user_id = $1',
      [id]
    );

    res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};