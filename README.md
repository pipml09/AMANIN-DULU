# AmaninDulu — Paket Wrapper Domain Custom + PWA

Paket ini **tidak mengubah** `index.html`/`code.gs` Apps Script Anda sama sekali.
Isinya cuma "kulit" statis yang menampilkan aplikasi Apps Script Anda di dalam
iframe, supaya orang yang buka `domain-anda.com` tidak melihat `script.google.com`
di address bar, dan aplikasinya bisa di-"Add to Home Screen" seperti app asli.

## Isi paket
- `index.html` — halaman wrapper (loading screen + iframe)
- `manifest.json` — konfigurasi PWA (nama, ikon, warna)
- `icon-192.png`, `icon-512.png` — ikon app (dari brand mark yang sudah ada)
- `sw.js` — service worker minimal (syarat teknis biar bisa diinstal)

## LANGKAH WAJIB SEBELUM DEPLOY

1. Buka `index.html`, cari baris:
   ```js
   const APP_URL = 'GANTI_DENGAN_URL_APPS_SCRIPT_ANDA';
   ```
   Ganti dengan URL `/exec` deployment Apps Script Anda yang **aktif** (ambil dari
   Apps Script Editor → Deploy → Manage deployments → copy "Web app" URL).

2. Pastikan di `code.gs`, `doGet()` masih ada baris:
   ```js
   .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
   ```
   (Ini sudah ada dari awal, jangan dihapus — tanpa ini, iframe akan diblokir browser.)

## OPSI A: Deploy ke GitHub Pages (gratis, paling simpel)

1. Buat repo baru di GitHub, upload ke-4 file di paket ini (bukan folder, filenya langsung di root repo).
2. Masuk ke **Settings → Pages** di repo tersebut.
3. Source: pilih branch `main`, folder `/ (root)` → Save.
4. Tunggu 1-2 menit, GitHub kasih URL seperti `https://username.github.io/nama-repo/`.
5. (Opsional) Domain sendiri: **Settings → Pages → Custom domain**, isi domain Anda,
   lalu di pengelola domain (Niagahoster/Domainesia/dll) tambahkan record CNAME
   yang mengarah ke `username.github.io`.

## OPSI B: Deploy ke Vercel (gratis untuk pemakaian pribadi/non-komersial)

1. Buat akun di vercel.com, hubungkan ke GitHub.
2. Push ke-4 file ini ke repo GitHub (sama seperti Opsi A).
3. Di Vercel: **Add New → Project** → pilih repo tadi → Deploy (tidak perlu
   setting build command apa pun, ini situs statis murni).
4. Vercel kasih URL `https://nama-project.vercel.app`.
5. (Opsional) Domain sendiri: **Project Settings → Domains** → tambahkan domain Anda,
   ikuti instruksi DNS yang muncul.

   ⚠️ **Catatan penting**: kalau ini dipakai untuk jualan/komersial (bukan cuma
   dipakai sendiri), baca dulu ketentuan pemakaian komersial Vercel di
   https://vercel.com/docs — tier gratisnya (Hobby) untuk pemakaian pribadi/testing,
   bukan untuk produk yang dijual ke banyak pelanggan.

## OPSI C: Deploy ke Cloudflare Pages (gratis, ketentuan pemakaian lebih longgar)

Cloudflare Pages juga gratis untuk situs statis seperti ini, dan berbeda dari Vercel,
ketentuan tier gratisnya tidak melarang pemakaian komersial/jualan. Cocok kalau
rencananya nanti dijual sebagai produk.

1. Buat akun di dash.cloudflare.com (gratis).
2. Push ke-4 file ini ke repo GitHub (sama seperti Opsi A/B).
3. Di dashboard Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** →
   pilih repo tadi.
4. Build settings: kosongkan "Build command", "Build output directory" isi `/`
   (situs statis murni, tidak perlu proses build apa pun) → Save and Deploy.
5. Cloudflare kasih URL `https://nama-project.pages.dev`.
6. (Opsional) Domain sendiri: **Custom domains** di project tersebut → tambahkan
   domain Anda. Kalau domain Anda sudah pakai Cloudflare sebagai DNS, ini biasanya
   otomatis dalam hitungan detik.

## Ketiga opsi di atas — mana yang dipilih tidak masalah

GitHub Pages, Vercel, dan Cloudflare Pages semuanya infrastruktur besar yang dipakai
jutaan situs (bukan layanan abal-abal), otomatis pakai HTTPS, dan gratis untuk
kebutuhan seperti ini karena yang di-hosting cuma 4 file statis kecil — tidak ada
server yang perlu dirawat, tidak ada proses build, tidak ada biaya kejutan. "Gratis"
di sini bukan berarti kurang aman, cuma karena bebannya memang ringan.

## Setelah live

- Cek dari HP: buka domain barunya, coba **Add to Home Screen** (Android: menu ⋮ →
  "Tambahkan ke layar Utama"; iPhone: tombol Share → "Add to Home Screen"). Ikon &
  nama "AmaninDulu" seharusnya muncul, dan saat dibuka tidak ada address bar
  browser sama sekali (mode standalone).
- Kalau nanti Anda **re-deploy** Apps Script dan dapat URL `/exec` baru, WAJIB
  update `APP_URL` di `index.html` juga (lalu push ulang ke GitHub) — kalau tidak,
  wrapper akan menampilkan versi lama/error.
