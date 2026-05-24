import {Request,Response,NextFunction} from 'express';
import { ZodSchema,ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

type RequestPart = 'body' | 'query' | "params";

export const validate = (
    schema:ZodSchema,
    source:RequestPart = 'body',
    ) => (
        req:Request,
        _res:Response,
        next:NextFunction):void => {
            try {
                const validated = schema.parse(req[source]);
                req[source] = validated;
                next();
            } catch (error) {
                if (error instanceof ZodError){
                    const details = error.issues.map((issue) => ({
                        alan : issue.path.join('.'),
                        mesaj : issue.message,
                    }));
                    
                    next(ApiError.badRequest('Validasyon-Doğrulama Hatası',details));
                    return;
                }
                next(error);
            }
        }
