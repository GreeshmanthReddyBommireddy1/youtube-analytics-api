import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    username: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            res.status(401).json({
                message: 'Token missing'
            });

            return;
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            'secretkey'
        ) as JwtPayload;

        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).json({
            message: 'Invalid token'
        });
    }
};

export default verifyToken;