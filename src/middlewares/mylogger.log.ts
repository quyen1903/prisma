import { createLogger, format,level, transports }  from 'winston';
import 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, printf, align } = format; 

class MyLogger{
    logger;
    constructor(){
        const formatPrint = printf(
            ({level, message, context, requestId, timestamp, metadata})=>{
                return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
            }
        )
        this.logger = createLogger({
            format:combine(timestamp({format: 'YYYY-MM-DD hh:mm:ss'}), formatPrint),
            transports:[
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname:'logs',
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format:combine(timestamp({format: 'YYYY-MM-DD hh:mm:ss'}), formatPrint),
                    level: 'info',
                }),
                new transports.DailyRotateFile({
                    dirname:'logs',
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format:combine(timestamp({format: 'YYYY-MM-DD hh:mm:ss'}), formatPrint),
                    level: 'error',
                })
            ]
        })
    }
    commonParams(params: []| {}){
        let context, req, metadata;
        if(!Array.isArray(params)) context = params
        else [context, req, metadata] = params

        const requestId = req.requestId || uuidv4()
        return {
            requestId, context, metadata
        }
    }
    log(message: string, params: {}){
        const paramsLog = this.commonParams(params)
        const logObject = Object.assign({message}, paramsLog)
        this.logger.info(logObject)
    }
    error(message: string, params: {}){
        const paramsLog = this.commonParams(params)
        const logObject = Object.assign({message}, paramsLog)
        this.logger.info(logObject)
    }
}
export default new MyLogger()