import {Ogrenci} from '../types/ogrenci.types';

export const ogrenciler: Ogrenci[] = [
    {
        id:'001',
        ad:'Ahmet',
        soyad:"Savaş",
        yas:17,
        sinif:"11-D",
        okul:"ÇOK Okulu",
        notOrtalamasi:75.5,
        olusturma_tarihi: new Date('2026,05-03'),
    },
    {
        id:'002',
        ad:'Elif',
        soyad:"Kaya",
        yas:16,
        sinif:"10-A",
        okul:"Atatürk Lisesi",
        notOrtalamasi:82.3,
        olusturma_tarihi: new Date('2026-05-03'),
    },
    {
        id:'003',
        ad:'Mehmet',
        soyad:"Demir",
        yas:18,
        sinif:"12-B",
        okul:"Cumhuriyet Lisesi",
        notOrtalamasi:68.9,
        olusturma_tarihi: new Date('2026-05-03'),
    },
    {
        id:'004',
        ad:'Zeynep',
        soyad:"Aydın",
        yas:15,
        sinif:"9-C",
        okul:"Şehitler Anadolu Lisesi",
        notOrtalamasi:90.1,
        olusturma_tarihi: new Date('2026-05-03'),
    },
    {
        id:'005',
        ad:'Burak',
        soyad:"Yılmaz",
        yas:17,
        sinif:"11-E",
        okul:"Fen Lisesi",
        notOrtalamasi:77.6,
        olusturma_tarihi: new Date('2026-05-03'),
    }
]