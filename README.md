<div align="center">
<img width="1200" height="475" alt="RuangRiung Banner" src="public/assets/ruangriung.png" />

# RuangRiung AI Studio 🚀
A modern, responsive, and high-performance AI Image & Video Generator powered by React, Vite, Tailwind CSS, and Pollinations.ai.
</div>

## ✨ Fitur Utama

- **🎨 AI Image & Video Generator**: Hasilkan gambar dan video berkualitas tinggi hanya dengan deskripsi teks (Prompt).
- **⚡ Super Cepat & Ringan**: Dibangun dengan Vite dan React untuk performa maksimal.
- **📱 Responsif & Modern**: UI/UX premium bergaya *Glassmorphism* yang dioptimalkan untuk perangkat Desktop maupun Mobile.
- **💾 Riwayat Lokal (IndexedDB)**: Gambar yang di-generate otomatis tersimpan di riwayat *browser* tanpa memakan *storage* server. Mendukung *Lazy Loading* untuk menghemat RAM.
- **🛠 Pengaturan Lanjutan**: Kustomisasi rasio aspek (Kotak, Portrait, Lansekap, Kustom), Kualitas (HD/Normal), dan penyempurna Prompt Otomatis (*Enhance Prompt*).
- **⌨️ Pintasan Cepat**: Tekan `Ctrl + Enter` (atau `Cmd + Enter`) untuk langsung memulai proses *Generate*.
- **☁️ Cloudflare Proxy**: Menggunakan Cloudflare Functions sebagai *backend* proksi untuk manajemen API Key yang aman.

## 💻 Teknologi yang Digunakan

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **Build Tool**: Vite
- **AI SDK**: `@pollinations/sdk` (SDK Resmi Pollinations AI)
- **Backend / Proxy**: Cloudflare Pages Functions (`functions/api/...`)
- **Penyimpanan Lokal**: IndexedDB

## 🚀 Cara Menjalankan Secara Lokal (Local Development)

**Prasyarat:** Pastikan Anda telah menginstal **Node.js** dan **PNPM**.

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/ruangriung/rr-coming-soon.git
   cd rr-coming-soon
   ```

2. **Instal dependensi:**
   Sangat disarankan menggunakan `pnpm` agar struktur folder `node_modules` tetap aman saat menggunakan Wrangler.
   ```bash
   pnpm install
   ```

3. **Jalankan server pengembangan (Frontend & Backend/Proxy):**
   ```bash
   pnpm run dev:all
   ```
   *Perintah ini akan menyalakan Vite Server di Port 3000 sekaligus Cloudflare Wrangler API Proxy di Port 8788 secara bersamaan.*

4. **Buka di Browser:**
   Akses `http://localhost:3000` di *browser* Anda.

## 🔑 Pengaturan API Key (Opsional)

Secara bawaan, aplikasi ini memanfaatkan *tier* gratis dari Pollinations yang tidak membutuhkan pengaturan. Jika Anda memiliki API Key resmi/Pro, Anda bisa menggunakannya dengan dua cara:
- **Klien (Browser)**: Di UI aplikasi, masukkan API Key Anda saat diminta (disimpan dengan aman di `localStorage`).
- **Server (Cloudflare)**: Atur *Environment Variable* `POLLINATIONS_API_KEY` pada *dashboard* Cloudflare Pages Anda.

## 🤝 Kontribusi

*Pull Request* selalu diterima. Untuk perubahan arsitektur yang besar, harap buka *Issue* terlebih dahulu untuk mendiskusikannya.
