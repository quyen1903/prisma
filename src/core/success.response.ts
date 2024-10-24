import { Response } from "express"
import { StatusCodes, ReasonPhrases } from "http-status-codes"

interface SuccessResponseProperties {
    message?: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: any;
}

class SuccessResponse{
    message: string;
    status: number;
    metadata: any;
    constructor({
        message,
        statusCode = StatusCodes.OK,
        reasonStatusCode=ReasonPhrases.OK,
        metadata = {} 
    }: SuccessResponseProperties){
        this.message = message || reasonStatusCode
        this.status = statusCode
        this.metadata = metadata
    }
    send(res: Response){
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse{
    constructor({message,metadata = {} }: SuccessResponseProperties){
        super({message,metadata})
    }
}

interface CREATEDProperty extends SuccessResponseProperties {
    options?: any;
}

class CREATED extends SuccessResponse{
    options: any;
    constructor({
        options = {},
        message,
        statusCode=StatusCodes.CREATED,
        reasonStatusCode=ReasonPhrases.CREATED,
        metadata
    }:CREATEDProperty){
        super({message,statusCode,reasonStatusCode,metadata})
        this.options = options
    }   
}

export { OK, CREATED, SuccessResponse }