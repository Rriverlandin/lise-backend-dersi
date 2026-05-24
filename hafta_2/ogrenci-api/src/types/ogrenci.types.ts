export interface Ogrenci {
    id:string;
    ad:string;
    soyad:string;
    yas:number;
    sinif:string;
    okul:string;
    notOrtalamasi:number;
    olusturma_tarihi:Date;
}
// DTO data transfer object
export type OgrenciOlusturmaDTO = Omit<Ogrenci, 'id' | 'olusturma_tarihi'>;
//yeni ogrenci olusturulurken id ve olusturma tarihini sistem vericek.
//kullanıcıdan bu verileri almamıza gerek yok.

export type OgrenciGuncellemeDTO = Partial<OgrenciOlusturmaDTO>;