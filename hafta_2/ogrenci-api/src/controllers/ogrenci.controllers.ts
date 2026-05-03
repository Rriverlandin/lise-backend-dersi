import { Request,Response } from "express";
import {ogrenciler} from "../data/ogrenciler";

import {Ogrenci,
    OgrenciOlusturmaDTO,
    OgrenciGuncellemeDTO
} from "../types/ogrenci.types";
import { request } from "node:http";

// GET /api/ogrenciler 

export const tumOgrencileriGetir = (
    req:Request,
    res:Response
): void => {
    res.status(200).json({
        success:true,
        data:ogrenciler,
        count:ogrenciler.length,
    });
};
