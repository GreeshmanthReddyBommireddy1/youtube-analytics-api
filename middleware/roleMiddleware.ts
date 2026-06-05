import { Request, Response, NextFunction } from 'express';

const authorizeRole = (...allowedRoles: string[]) => {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {

        if (!req.user) {

            res.status(401).json({
                message: 'User not authenticated'
            });

            return;
        }

        if (!allowedRoles.includes(req.user?.role ?? '')) {

            res.status(403).json({
                message: 'Access denied'
            });

            return;
        }

        next();
    };
};

export default authorizeRole;