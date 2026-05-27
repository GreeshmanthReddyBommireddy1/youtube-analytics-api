const pool = require('../db');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const register = async (req, res) => {

    try {

        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO app_users
            (username, password)
            VALUES ($1, $2)
            RETURNING id, username
            `,
            [username, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {

    try {

        const { username, password } = req.body;

        const result = await pool.query(
            `
            SELECT *
            FROM app_users
            WHERE username = $1
            `,
            [username]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: 'Invalid username'
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            'secretkey',
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};