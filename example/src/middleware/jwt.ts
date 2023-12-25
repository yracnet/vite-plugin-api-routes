//@ts-ignore
import jwt from 'jsonwebtoken';
import { loadEnv } from "dotenv-local";

const JWT = loadEnv({
    envPrefix: 'JWT_',
    removeEnvPrefix: true,
    envInitial: {
        JWT_SECRET: '',
        JWT_EXPIRES: '30m'
    }
});

export const jwtSign = (data: any) => jwt.sign(data, JWT.SECRET, { expiresIn: JWT.EXPIRES });

export const jwtVerify = (token: string = '') => jwt.verify(token, JWT.SECRET);

export const jwtDecode = (token: string = '') => jwt.decode(token, {});

//export const JsonWebTokenError = jwt.JsonWebTokenError;
//export const NotBeforeError = jwt.NotBeforeError;
//export const TokenExpiredError = jwt.TokenExpiredError;
