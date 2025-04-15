E-Commerce Dashboard

E-Commerce Dashboard — bu React va Redux Toolkit yordamida qurilgan, mahsulotlar, postlar, kommentlar, savatlar va vazifalarni boshqarish uchun mo‘ljallangan zamonaviy veb-ilova. U foydalanuvchilarga ma’lumotlarni osongina qo‘shish, tahrirlash, o‘chirish va sahifalash imkonini beradi. Loyiha TypeScript va Tailwind CSS dan foydalanadi, bu esa kod sifatini va UI dizaynini yuqori darajada ushlab turadi.
✨ Xususiyatlar

Mahsulotlar boshqaruvi:
Yangi mahsulot qo‘shish (nomi, narxi, tavsifi).
Mavjud mahsulotlarni tahrirlash va o‘chirish.
Narx maydonida foydalanuvchi uchun qulay placeholder va validatsiya.


Postlar boshqaruvi:
Postlar qo‘shish, tahrirlash va o‘chirish (sarlavha, matn, foydalanuvchi ID).
Ma’lumotlarni sahifalash orqali tartibli ko‘rsatish.


Kommentlar boshqaruvi:
Kommentlar qo‘shish (matn, post ID, foydalanuvchi ID).
Kommentlarni tahrirlash va o‘chirish.


Savatlar boshqaruvi:
Savat qo‘shish (foydalanuvchi ID, umumiy narx, miqdor).
Narx va miqdor maydonlarini tahrirlash imkoniyati.
Savatlarni o‘chirish.


Vazifalar boshqaruvi:
Vazifa qo‘shish (matn, holat, foydalanuvchi ID).
Vazifalarni tahrirlash (bajarildi/bajarilmadi) va o‘chirish.


Foydalanuvchi tajribasi:
Raqamli maydonlarda 0 ko‘rinmaydi, o‘rniga aniq placeholderlar.
Xato va muvaffaqiyat xabarlari bilan qulay interfeys.
Tailwind CSS yordamida zamonaviy va javob beruvchan dizayn.


API integratsiyasi:
Redux Toolkit Query yordamida tezkor va samarali API so‘rovlari.
Ma’lumotlarni real vaqtda yangilash (refetch).


Sahifalash:
Har bir bo‘limda ma’lumotlarni sahifalash orqali qulay navigatsiya.



📋 Texnologiyalar

Frontend: React 18, TypeScript
State Management: Redux Toolkit, RTK Query
Styling: Tailwind CSS
API: REST API (masalan, JSONPlaceholder yoki maxsus API)
Linter va Formatter: ESLint, Prettier

🚀 O‘rnatish
Loyihani mahalliy muhitda ishga tushirish uchun quyidagi qadamlarni bajaring:
1. Repozitoriyani klonlash
git clone https://github.com/Mansurxan1/CRM-Dummy-json-all.git
cd CRM-Dummy-json-all

2. Kerakli paketlarni o‘rnatish
npm install

3. Loyihani ishga tushirish
npm start

Ilova http://localhost:5173 manzilida ochiladi.
4. API sozlamalari

Loyiha RTK Query orqali API bilan ishlaydi. API manzilingizni src/store/features/api/apiSlice.ts faylida sozlang:export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  ...
});



🛠 Foydalanish

Mahsulotlar bo‘limi:
“Yangi Mahsulot” formasida nom, narx va tavsifni kiriting.
“Tahrirlash” tugmasi orqali mavjud mahsulotni o‘zgartiring.


Postlar bo‘limi:
Sarlavha, matn va foydalanuvchi ID kiritib yangi post qo‘shing.
Sahifalash tugmalari yordamida postlarni ko‘ring.


Kommentlar bo‘limi:
Komment matni, post ID va foydalanuvchi ID bilan komment qo‘shing.
“O‘chirish” tugmasi orqali keraksiz kommentlarni olib tashlang.


Savatlar bo‘limi:
Foydalanuvchi ID, umumiy narx va miqdor kiritib savat qo‘shing.
“Tahrirlash” orqali narx va miqdorlarni yangilang.


Vazifalar bo‘limi:
Vazifa matni, holati (bajarildi/bajarilmadi) va foydalanuvchi ID kiritib vazifa qo‘shing.
Vazifalarni tahrirlash yoki o‘chirish mumkin.



📸 Skrinshotlar



Mahsulotlar
Savatlar







(Skrinshotlarni o‘zingizning loyihangizdan qo‘shishingiz mumkin)
🤝 Hissadorlik
Loyihaga hissa qo‘shmoqchi bo‘lsangiz:

Repozitoriyani fork qiling.
Yangi branch yarating: git checkout -b feature/your-feature.
O‘zgarishlarni kiriting va commit qiling: git commit -m "Add your feature".
Branch’ni push qiling: git push origin feature/your-feature.
Pull Request oching.

📬 Aloqa
Savollar yoki takliflar uchun:
Telegram: https://t.me/mansurxan1


⭐ Loyiha sizga yoqdimi? Repozitoriyga yulduzcha qo‘ying va do‘stlaringiz bilan ulashing!

