import { Schema, model, Document } from 'mongoose';

/**
 * Ogrenci dokumaninin TypeScript arayuzu.
 * Mongoose Document'inden extend edildigi icin _id, createdAt gibi alanlar otomatik gelir.
 */
export interface IOgrenci extends Document {
  ad: string;
  soyad: string;
  yas: number;
  sinif: string;
  okul: string;
  notOrtalamasi: number;
  email?: string;
  aktifMi: boolean;
  createdAt: Date;
  updatedAt: Date;

  tamAd(): string;
}

const sinifRegex = /^(9|1[0-2])-[A-D]$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ogrenciSchema = new Schema<IOgrenci>(
  {
    ad: {
      type: String,
      required: [true, 'Ad zorunludur'],
      trim: true,
      minlength: [2, 'Ad en az 2 karakter olmali'],
      maxlength: [50, 'Ad en fazla 50 karakter olabilir'],
    },
    soyad: {
      type: String,
      required: [true, 'Soyad zorunludur'],
      trim: true,
      minlength: [2, 'Soyad en az 2 karakter olmali'],
      maxlength: [50, 'Soyad en fazla 50 karakter olabilir'],
    },
    yas: {
      type: Number,
      required: [true, 'Yas zorunludur'],
      min: [13, 'Yas en az 13 olmali'],
      max: [20, 'Yas en fazla 20 olabilir'],
      validate: {
        validator: Number.isInteger,
        message: 'Yas tam sayi olmali',
      },
    },
    sinif: {
      type: String,
      required: [true, 'Sinif zorunludur'],
      trim: true,
      uppercase: true,
      match: [sinifRegex, 'Sinif formati gecersiz (orn: 10-A)'],
    },
    okul: {
      type: String,
      required: [true, 'Okul zorunludur'],
      trim: true,
      minlength: [2, 'Okul en az 2 karakter olmali'],
      maxlength: [100, 'Okul en fazla 100 karakter olabilir'],
    },
    notOrtalamasi: {
      type: Number,
      default: 0,
      min: [0, 'Not ortalamasi 0dan kucuk olamaz'],
      max: [100, 'Not ortalamasi 100den buyuk olamaz'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Email formati gecersiz'],
    },
    aktifMi: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ogrenciSchema.index({ sinif: 1 });
ogrenciSchema.index(
  { ad: 1, soyad: 1, sinif: 1 },
  {
    unique: true,
    collation: { locale: 'tr', strength: 2 },
    partialFilterExpression: { aktifMi: true },
  }
);
ogrenciSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      aktifMi: true,
      email: { $type: 'string' },
    },
  }
);

ogrenciSchema.methods.tamAd = function tamAd(): string {
  return `${this.ad} ${this.soyad}`;
};

export const OgrenciModel = model<IOgrenci>('Ogrenci', ogrenciSchema);
