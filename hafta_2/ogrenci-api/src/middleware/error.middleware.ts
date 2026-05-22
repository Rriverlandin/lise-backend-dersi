import {Request,Response,NextFunction} from 'express';

//route bulunamadı
export const notFoundError = (
    req:Request,
    res:Response
):void => {
    res.status(404).json({
        success:false,
        error:req.method+" "+req.originalUrl+ " adresi bulunamadı",
    });
};


//genel api hataları
export const errorHandler = (
    error:Error,
    req:Request,
    res:Response
):void => {
    console.log("hata : ",error.message);
    res.status(500).json({
        success:false,
        error:"Sunucu Hatası Oluştu",
    });
};