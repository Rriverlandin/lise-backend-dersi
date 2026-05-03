export interface Ogrenci {
    id:string;
    ad:string;
    soyad:string;
    yas:number;
    sinif:string;
    okul:string;
    notOrtalaması:number;
    olusturulmaTarihi:Date;
}

//DTO: data transfer object
export type OgrenciOlusturmaDTO= Omit<Ogrenci,"id" | "olusturulmaTarihi">;
//Yeni ogrenci olusturulurken ID ve olusturulma tarihini sistem verecek kullanıcıdan bu verileri almamıza gerek yok.
export type OgrenciGuncellemeDTO = Partial<OgrenciOlusturmaDTO>;
//OgrenciGuncellemeDTO: ogrenci güncellenirken tüm alanların güncellenmesi zorunlu değil, sadece güncellenmek istenen alanlar gönderilebilir. Partial<> ile tüm alanı opsiyonel hale getiriyoruz.