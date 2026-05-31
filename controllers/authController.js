const pool = require('../db');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


const register = async (req, res) => {

    try {

        const { username, password, role_id } = req.body;

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


     
        const newUser = result.rows[0];


      
        await pool.query(
            `
            INSERT INTO user_roles
            (user_id, role_id)
            VALUES ($1, $2)
            `,
            [newUser.id, role_id]
        );


        
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
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
            SELECT
                au.id,
                au.username,
                au.password,
                r.role_name
            FROM app_users au

            JOIN user_roles ur
                ON au.id = ur.user_id

            JOIN roles r
                ON ur.role_id = r.role_id

            WHERE au.username = $1
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


        const accesstoken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role_name
            },
            'secretkey',
            {
                expiresIn: '1h'
            }
        );

           const refreshToken = jwt.sign(
    {
        id: user.id
    },
    'refreshsecretkey',
    {
        expiresIn: '7d'
    }
);


        res.status(200).json({
            message: 'Login successful',
            accesstoken,refreshToken
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


const refreshAccessToken = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {

            return res.status(401).json({
                message: 'Refresh token missing'
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            'refreshsecretkey'
        );

        const newAccessToken = jwt.sign(
            {
                id: decoded.id
            },
            'secretkey',
            {
                expiresIn: '15m'
            }
        );

        res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {

        res.status(401).json({
            message: 'Invalid refresh token'
        });
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken
};