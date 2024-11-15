import 'dotenv/config';
import 'reflect-metadata';
import compression from 'compression'
import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from 'morgan';
import router from './routes';
import { v4 as uuidv4 } from 'uuid';

import { KeyToken } from './shared/interface/keyToken.interface';
import { IdecodeUser } from './middlewares/authentication.middleware';
import { Decode } from './shared/interface/decode.interface';
import myLogger from './middlewares/mylogger.log';

interface Iapikey {
    key:string;
    status: boolean;
    permission: string[];
}

declare global{
    namespace Express{   
        interface Request {
            keyStore: KeyToken;
            user: Decode;
            shop: Decode;
            refreshToken: string;
            apiKey: Iapikey
            requestId: string
        }
    }
}
const app: Express = express();
//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use('/',router);

app.use((req: Request, res: Response, next: NextFunction)=>{
    const requestId = req.headers['x-request-id'] as string
    req.requestId = requestId ? requestId : uuidv4()
    myLogger.log(`input params ${req.method}`,[
        req.path,
        {requestId: req.requestId},
        req.method === 'POST' ? req.body : req.query
    ])
    next()
})

//error handling
interface CustomError extends Error {
    status?: number;
};
// middleware express version 5
app.use((error: CustomError, req: Request ,res: Response, next: NextFunction)=>{
    const statusCode = error.status || 500
    const resMessage = `${error.status} - ${Date.now}ms Response: ${JSON.stringify(error)}`;
    myLogger.error(resMessage, [
        req.path,
        {requestId: req.requestId},
        {message: error.message}
    ])
    res.status(statusCode).json({
        status:'error',
        code:statusCode,
        stack:error.stack,
        message:error.message || 'Internal Server Error'
    })
});

export default app