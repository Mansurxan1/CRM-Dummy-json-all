# 🛍 E-Commerce Dashboard

**E-Commerce Dashboard** — bu zamonaviy React + Redux Toolkit asosidagi admin panel bo‘lib, mahsulotlar, postlar, kommentlar, savatlar va vazifalarni boshqarish imkonini beradi. Ilova TypeScript va Tailwind CSS yordamida ishlab chiqilgan.

---

## ✨ Xususiyatlar

### 📦 Mahsulotlar boshqaruvi:
- Yangi mahsulot qo‘shish (nomi, narxi, tavsifi)
- Tahrirlash va o‘chirish
- Narx maydoni uchun qulay placeholder va validatsiya

### 📝 Postlar boshqaruvi:
- Sarlavha, matn va foydalanuvchi ID bilan qo‘shish
- Tahrirlash va o‘chirish
- Sahifalash bilan tartibli ko‘rsatish

### 💬 Kommentlar boshqaruvi:
- Matn, post ID va user ID bilan komment qo‘shish
- Tahrirlash va o‘chirish

### 🛒 Savatlar boshqaruvi:
- Foydalanuvchi ID, narx, miqdor bilan savat qo‘shish
- Narx va miqdorni tahrirlash
- Savatni o‘chirish

### ✅ Vazifalar boshqaruvi:
- Matn, holat, foydalanuvchi ID bilan vazifa qo‘shish
- Holatni o‘zgartirish (bajarildi/bajarilmadi)
- Tahrirlash va o‘chirish

### 🌟 Foydalanuvchi tajribasi:
- 0 o‘rniga aniq placeholderlar
- Tailwind CSS bilan responsive UI
- Xato va muvaffaqiyat xabarlari

### 🔌 API integratsiyasi:
- **Redux Toolkit Query** orqali tezkor va real vaqtli so‘rovlar
- `refetch` funksiyasi orqali avtomatik yangilanish

### 📄 Sahifalash:
- Har bir bo‘limda qulay navigatsiya uchun sahifalash

---

## 📋 Texnologiyalar

- **Frontend:** React 18, TypeScript  
- **State Management:** Redux Toolkit, RTK Query  
- **Styling:** Tailwind CSS  
- **API:** REST API (`dummyjson.com`)  
- **Linting & Format:** ESLint, Prettier  

---

## 🚀 O‘rnatish

1. Repozitoriyani klonlash:

```bash
git clone https://github.com/Mansurxan1/CRM-Dummy-json-all.git
cd CRM-Dummy-json-all
Paketlarni o‘rnatish:

bash
Copy
Edit
npm install
Loyihani ishga tushirish:

bash
Copy
Edit
npm run dev
📍 Ilova ochiladi: http://localhost:5173

API sozlamasi:

src/store/features/api/apiSlice.ts faylida baseUrl ni sozlang:

ts
Copy
Edit
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  ...
});
🛠 Foydalanish
📦 Mahsulotlar:
“Yangi Mahsulot” formasini to‘ldiring

Tahrirlash tugmasi orqali o‘zgartiring

📝 Postlar:
Sarlavha, matn, user ID bilan yangi post yarating

Sahifalash yordamida navigatsiya qiling

💬 Kommentlar:
Matn, post ID va user ID bilan komment qo‘shing

O‘chirish tugmasi orqali olib tashlang

🛒 Savatlar:
Foydalanuvchi ID, narx va miqdor kiriting

Tahrirlash orqali o‘zgartiring

✅ Vazifalar:
Vazifa matni, holati, user ID kiriting

Holatni bajargan sifatida belgilang yoki o‘chiring

📸 Skrinshotlar
🔽 Skrinshotlarni loyihangizdan yuklab qo‘shing:

📦 Mahsulotlar

🛒 Savatlar
(shaxsiy skrinshotlarni bu yerga joylashingiz mumkin)

🤝 Hissadorlik
Siz ham loyiha rivojiga hissa qo‘shishingiz mumkin:

bash
Copy
Edit
# Fork qiling
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
🔃 So‘ngra Pull Request oching.

📬 Aloqa
Savol va takliflar uchun:

📩 Telegram: @mansurxan1

⭐ Yoqdimi?
Repozitoriyga ⭐ yulduzcha qo‘ying va do‘stlaringiz bilan ulashing!
