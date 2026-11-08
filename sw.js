// แคชเฉพาะ "เปลือก" (หน้า index + ไอคอน) เพื่อให้ติดตั้งเป็นแอปได้
// ตัวระบบจริงอยู่ที่ Apps Script จึงไม่ถูกแคช — แก้ที่ Apps Script แล้วเห็นผลทันที
const CACHE = 'shell-v1';
const SHELL = ['./', 'index.html', 'config.js', 'favicon.svg', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // network-first: แก้ config.js แล้วเห็นผลทันที ออฟไลน์ค่อยใช้แคช
  e.respondWith(fetch(r).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(r, copy)).catch(() => {});
    return res;
  }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
