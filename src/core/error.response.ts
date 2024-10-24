import {
	ReasonPhrases,
	StatusCodes
} from 'http-status-codes';
import myLogger from '../middlewares/mylogger.log'

class ErrorResponse extends Error{
    status: number
    constructor(message: string,status: number){
        super(message),
        this.status = status
        Error.captureStackTrace(this,this.constructor)
        //log error winston        
    }
}

class AuthFailureError extends ErrorResponse{
    constructor(message: string,statusCode=StatusCodes.UNAUTHORIZED){
        super(message,statusCode)
    }
}

class BadRequestError extends ErrorResponse{
    constructor(message: string, statusCode = StatusCodes.BAD_REQUEST){
        super(message,statusCode)
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor(message: string, statusCode=StatusCodes.CONFLICT){
        super(message,statusCode)
    }
}


class NotFoundError extends ErrorResponse{
    constructor(message: string,statusCode=StatusCodes.NOT_FOUND){
        super(message,statusCode)
    }
}

class ForbiddenError extends ErrorResponse{
    constructor(message: string, statusCode=StatusCodes.FORBIDDEN){
        super(message,statusCode)
    }
}

class RedisErrorResponse extends ErrorResponse{
    constructor(message= ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode=StatusCodes.INTERNAL_SERVER_ERROR){
        super(message,statusCode)
    }
}

export {
    AuthFailureError,
    BadRequestError,
    ConflictRequestError,
    NotFoundError,
    ForbiddenError,
    RedisErrorResponse
}