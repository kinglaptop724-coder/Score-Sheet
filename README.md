# 📝 ระบบบันทึกคะแนนนักเรียน

หน้าเว็บบน **GitHub Pages** ทำหน้าที่เป็น "เปลือก" (ไอคอน + ติดตั้งเป็นแอป) ส่วนตัวระบบจริงอยู่ที่ **Google Apps Script**
→ ต้องการแก้โค้ดหรือหน้าตา ให้แก้ที่ Apps Script อย่างเดียว ไม่ต้องแตะ GitHub

```
ผู้ใช้ ──► GitHub Pages (index.html + ไอคอน) ──iframe──► Apps Script (Code.gs + Index.html) ──► Google Sheets
```

## 1) ตั้งค่า Apps Script (ครั้งแรก)

1. เปิด Apps Script → วางไฟล์ `Code.gs` และ `Index.html` (ชื่อไฟล์ต้องเป็น `Index` ตรงกับใน `doGet`)
2. รันฟังก์ชัน `setup` หนึ่งครั้งเพื่ออนุญาตสิทธิ์
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. คัดลอกลิงก์ที่ลงท้ายด้วย `/exec`

> ใน `Code.gs` มี `.setXFrameOptionsMode(ALLOWALL)` อยู่แล้ว จึงฝังใน iframe ได้

## 2) ตั้งค่าลิงก์ใน GitHub

เปิด `config.js` แล้ววางลิงก์:

```js
window.APP_CONFIG = {
  APP_URL: "https://script.google.com/macros/s/AKfycb.../exec",
  APP_NAME: "ระบบบันทึกคะแนนนักเรียน"
};
```

## 3) เปิด GitHub Pages

1. สร้าง repo ใหม่ → อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ (หรือ `git push`)
2. **Settings → Pages → Build and deployment**
   - Source: *Deploy from a branch*
   - Branch: `main` / โฟลเดอร์ `/ (root)`
3. รอ ~1 นาที จะได้ลิงก์ `https://<ชื่อผู้ใช้>.github.io/<ชื่อ-repo>/`

## 4) เวลาแก้ไขระบบ

| ต้องการแก้ | ทำที่ไหน | ต้องทำอะไรต่อ |
|---|---|---|
| โค้ด / หน้าตา / ตรรกะ | Apps Script | **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** (ลิงก์ `/exec` เดิมไม่เปลี่ยน) |
| ลองแก้ก่อนปล่อยจริง | Apps Script | ใช้ลิงก์ `/dev` (Test deployment) ใส่ใน `config.js` ชั่วคราว |
| เปลี่ยนไอคอน / ชื่อแอป | GitHub | แก้ `icons/*` หรือ `config.js` |

## 5) ใส่ไอคอนให้แท็บของ Apps Script (ถ้าเปิดลิงก์ `/exec` ตรง ๆ)

แก้ `doGet` ใน `Code.gs` เพิ่มบรรทัด `setFaviconUrl`:

```js
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ระบบบันทึกคะแนนนักเรียน')
    .setFaviconUrl('https://<ชื่อผู้ใช้>.github.io/<ชื่อ-repo>/icons/favicon-32.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

## 5.1) พาคนที่เข้าลิงก์เดิมมาเว็บใหม่

ใน `Code.gs` ใส่ลิงก์ GitHub Pages ที่ตัวแปร `NEW_SITE_URL_` แล้ว Deploy เวอร์ชันใหม่
ใครเปิดลิงก์ `/exec` เดิมตรง ๆ จะเห็นหน้า "เว็บไซต์ย้ายที่อยู่แล้ว" และถูกพาไปเว็บใหม่ (มีปุ่มสำรองให้กด)
หน้า GitHub เรียก Apps Script ด้วย `?embed=1` อยู่แล้ว จึงไม่วนลูป — ผู้ดูแลที่อยากเข้าลิงก์เดิมให้ต่อท้าย `?embed=1`

**ลำดับสำคัญ:** อัปโหลดเวอร์ชันนี้ขึ้น GitHub ให้เว็บใหม่ใช้ได้ก่อน แล้วค่อยตั้ง `NEW_SITE_URL_` และ Deploy

## 6) ระบบติดตั้งแอป

หน้าเว็บมีปุ่ม **"ติดตั้งแอป"** มุมซ้ายล่างให้อัตโนมัติ (ซ่อนเองเมื่อติดตั้งแล้ว กด ✕ เพื่อซ่อน 7 วัน)

- **Android / Chrome / Edge (คอมพิวเตอร์):** กดปุ่มแล้วขึ้นหน้าต่างติดตั้งทันที
- **iPhone / iPad (Safari):** กดปุ่มแล้วมีขั้นตอนสอน → แชร์ → *เพิ่มไปยังหน้าจอโฮม*
- **เปิดจาก LINE / Facebook:** ติดตั้งไม่ได้ในเบราว์เซอร์ของแอปเหล่านั้น ปุ่มจะแนะนำให้เปิดด้วย Chrome/Safari พร้อมปุ่มคัดลอกลิงก์

## โครงสร้างไฟล์

```
index.html            หน้าเปลือก (iframe → Apps Script)
config.js             ใส่ลิงก์ /exec ที่นี่
manifest.webmanifest  ข้อมูลสำหรับติดตั้งเป็นแอป
sw.js                 service worker (แคชเฉพาะเปลือก ไม่แคชตัวระบบ)
favicon.svg           ไอคอนแท็บ
icons/                ไอคอนทุกขนาด (SVG ต้นฉบับ + PNG 32/180/192/512 + maskable)
```

## ⚠️ ความปลอดภัย

- `Code.gs` มี **Sheet ID ของชีตทะเบียนครู/นักเรียน** — **ไม่ควรอัปโหลดขึ้น repo สาธารณะ** (repo นี้จึงไม่รวมไฟล์นั้น และ `.gitignore` กัน `apps-script/` ไว้ให้)
- ถ้าอยากเก็บสำรองโค้ดบน GitHub ให้ใช้ repo แบบ **Private**
- ชีตต้นทางควรแชร์ให้เฉพาะบัญชีที่ deploy สคริปต์เท่านั้น
