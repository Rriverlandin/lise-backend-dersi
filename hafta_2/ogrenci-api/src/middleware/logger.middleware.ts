import {Request,Response,NextFunction} from 'express';

export const logger = (
    req:Request,
    res:Response,
    next:NextFunction
):void => {
    const start = Date.now();
    const {method, originalUrl } =req;
    res.on('finish', () => {
        const duration = Date.now() - start;
        const {statusCode} = res;

        const log_seviyesi = statusCode == 500 ? 'KRİTİK HATA' : statusCode == 400 ? "CLIENT HATA" : statusCode == 200 ? "BAŞARILI" : "TANIMSIZ HATA";
        const timestamp = new Date().toISOString();
        // console.log(duration)
        // console.log(log_seviyesi)
        // console.log(timestamp)
        // console.log(method)
        // console.log(originalUrl)
        // console.log(statusCode.toString())
        // console.log(duration.toString())
        // console.log(ip)
        console.log(
            log_seviyesi +" "+timestamp+" "+method+" "+originalUrl+" "+statusCode.toString()+" "+duration.toString()+"ms " //ip ? ip : "ip bulunamadı"
        )
    })
    next();

};


//  tarih - işlem türü - hangi_endpoint - ip