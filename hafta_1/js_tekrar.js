console.log("js başlangıç");
console.log("js başlangıç2");

//let, const ve var
let ad ="mehmet";//string
const yil ="2000";//number
let bilgi = true;//bool


let isimler = ["baran","nisa","goktug"]//array

let ogrenciler = {
    ad: "ahmet",
    okul: "çakır"
}//object

// koşullar
if (2026 - yil < 22) {
    console.log("ogrenci kart")
} else if (2026 - yil > 65) {
    console.log("65 yas üstü kart.")
} else {
    console.log("tam kart")
}

// döngüler
for (let i = 0; i < isimler.length; i++) {
    console.log(isimler[i])
}

let sayac = 0
while (sayac < isimler.length) {
    console.log(isimler[sayac])
    sayac++
}

// en az bir kere çalışır
do {
    console.log("Sayac degeri : ", sayac, "birkere calistir her zaman")
} while (sayac < 3)

// foreach (for...of)
for (let isim of isimler) {
    console.log("isim: ", isim)
}

// Fonksiyonlar

// 1. Parametreli Dönüşlü
function veri_uret(a, b) {
    return a + b
}

let sonuc = veri_uret(10, 15)
console.log(sonuc)

// 2. Parametreli Dönüşsüz
function param_donussuz(a) {
    console.log(a, "donussuz")
}

param_donussuz(15)

// 3. Parametresiz Dönüşlü
function noparam_donuslu() {
    return 10
}

console.log(noparam_donuslu())

// 4. Parametresiz Dönüşsüz
function noparam_donussuz() {
    console.log("merhaba")
}

noparam_donussuz()

// ES6 arrow function
const carp = (x, y) => {
    return x * y
}

console.log("carp:", carp(5, 6))








