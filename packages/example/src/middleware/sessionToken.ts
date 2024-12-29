import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "./jwt";

export const assertToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = <string>req.query.token;
        if (!token) {
            token = <string>req.headers['token'];
        }
        if (!token) {
            token = <string>req.cookies?.token;
        }
        if (!token) {
            throw Error("Token required");
        }
        const session = await jwtVerify(token);
        req.session = session;
        req.roles = session.roles;
        next();
    } catch (error) {
        next(error);
    }
}

export const createAllowRoles = (allowRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionRoles = req.roles || [];
            const ok = allowRoles.every(role => sessionRoles.includes(role));
            if (!ok) {
                throw Error(`Not Allowed - Role required: ${allowRoles.join(',')}`);
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}
