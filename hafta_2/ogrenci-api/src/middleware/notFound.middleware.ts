import {Request,Response,NextFunction} from 'express';
import { ApiError } from '../utils/ApiError';

//route bulunamadı
export const notFoundError = (
    req:Request,
    _res:Response,
    next:NextFunction
):void => {
    next(ApiError.notFound(req.method+" "+req.originalUrl+" bulunamadı"))
};
