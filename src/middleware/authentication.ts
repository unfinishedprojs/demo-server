import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { env } from "process";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ message: 'No token provided!' });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(token, env.private as string, (err, decoded: any) => {
        if (err) {
            return res.status(401).send({ error: 'Unauthorized!' });
        }
        req.body.id = decoded?.id;
        req.body.password = decoded?.password;
        next();
    });
};
