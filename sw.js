// Service worker minimal. Tujuannya HANYA memenuhi syarat teknis supaya browser
// mengizinkan "Add to Home Screen" / instal sebagai app. Yang di-cache cuma file
// shell (halaman wrapper ini sendiri), BUKAN isi aplikasi di dalam iframe --
// isi aplikasi tetap butuh koneksi internet ke Apps Script seperti biasa.

const CACHE_NAME = 'amanindulu-shell-v1';
const SHELL_FILES = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // Biarkan semua request ke luar (termasuk ke Apps Script di dalam iframe) lewat apa adanya --
  // hanya file shell kita sendiri (origin sama) yang dicoba dari cache dulu.
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
