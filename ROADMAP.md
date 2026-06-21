# CitePlex — Yol Haritası & Deploy Notları

Son güncelleme: 2026-06-19 · Canlı: https://citeplex.com

> Not: Bu dosya gizli anahtar **değeri** içermez; anahtarlar `.env.local`'dedir
> (git'e gitmez). Aşağıda yalnızca değişken **isimleri** geçer.

---

## ✅ Tamamlananlar (kod hazır, build geçiyor)

- 11 stilli atıf motoru + generator, stil sayfaları, 70+ `cite/*` rotası
- AI yazı araçları (paraphrase, summarize, thesis, outline, hook, conclusion)
  + günlük istek limiti (AI cost gating)
- Grammar, plagiarism (Winston AI — **canlı, test edildi**), word/character
  counter, case converter, annotated bibliography, punctuation checker
- Supabase auth (e-posta, Google OAuth, şifre sıfırlama), dashboard, projeler,
  kayıtlı atıflar + Word/BibTeX/RIS export
- Resend transactional e-posta + markalı Supabase e-posta şablonları
- Sentry hata izleme + `error.tsx` / `global-error.tsx` / `not-found.tsx`
  (uçtan uca test edildi — Issues'a hata düştü)
- Beyaz / modern açık tema
- Kod GitHub'da: https://github.com/CDCStream/citeplex-com (`main`)

---

## 🚀 Deploy — TAMAMLANDI (Vercel)

- [x] Vercel'e import edildi (Next.js, Root `./`), env'ler girildi, deploy edildi.
- [x] Canlı: https://citeplex.com (apex birincil; www → apex 308)
- [x] Canlı QA/smoke test (2026-06-18): 29/29 sayfa 200, tüm API'lar çalışıyor
      (cite, autofill/CrossRef, grammar/LanguageTool, AI/OpenAI, plagiarism/Winston),
      auth gate + graceful Dodo (503) doğrulandı. Atıf motoru 11 stilde doğru.

---

## 🔧 ŞİMDİ yapılacaklar (öncelik sırası)

- [x] **`NEXT_PUBLIC_SITE_URL` = `https://citeplex.com`** — doğrulandı (sitemap
      canlıda apex domaini gömüyor, localhost gitti).
- [x] **Domain bağla:** `citeplex.com` Vercel'e bağlı; **apex birincil (200)**,
      `www.citeplex.com` → 308 → apex. (2026-06-19 doğrulandı.)
- [x] **Supabase auth custom domain:** `auth.citeplex.com` aktif, trafiği servis
      ediyor. Google OAuth redirect URI buna göre eklendi
      (`https://auth.citeplex.com/auth/v1/callback`).
- [ ] **Supabase → Auth → URL Configuration**: Site URL = `https://citeplex.com`,
      Redirect URLs'de `/auth/callback` + `/reset-password` olduğunu doğrula
- [x] **Google Search Console**: domain DNS (TXT) doğrulandı → sitemap gönderildi,
      **"Başarılı" / 106 sayfa keşfedildi** (2026-06-19). Branding hatası çözüldü.
- [ ] **Google Cloud → OAuth consent**: branding (logo: `citeplex-logo-120.png`),
      ana sayfa/gizlilik URL'leri; gerekiyorsa "Testing" → "In production"
- [x] **Resend**: `EMAIL_FROM` → `noreply@citeplex.com` (Vercel env'de ayarlı)
- [x] Canlıda **manuel** uçtan uca test (2026-06-19): signup → e-posta onayı →
      `/verify-email` → login → Google OAuth → şifre sıfırlama →
      atıf oluştur/kaydet → export — hepsi geçti.
- [x] Sentry canlı hata testi (2026-06-20): prod'dan tetiklenen hata Issues'a
      düştü (environment: production) — doğrulandı.

---

## ⏭ Deploy sonrası (sıradaki işler)

### 1. Dodo Payments (abonelik) — LIVE ONAYLANDI ✅ → env swap kaldı
- [x] 4 ürün (pro/team × monthly/annual) — hem test hem live mode'da oluşturuldu
- [x] Env'ler dolduruldu (Vercel + local) — şu an **test_mode** aktif; live değerleri
      `.env.local`'da yorumda saklı
- [x] Supabase `0002_payments.sql` çalıştırıldı (profiles'a dodo kolonları)
- [x] Webhook: `https://citeplex.com/api/webhook/dodo` (test + live) — imza doğrulama OK
- [x] Test mode'da test kartıyla satın alma → webhook → plan yükseltme **doğrulandı**
- [x] **Live onay:** Product Info ✅, Identity ✅, Bank ✅ — **LIVE PAYMENTS ACTIVE**
- [ ] **ŞİMDİ:** Vercel env'lerini live'a çevir → redeploy → canlı checkout testi
- [ ] Dodo Live dashboard'da webhook URL + live `whsec_` secret doğrula
- [ ] Source map için `SENTRY_ORG/PROJECT/AUTH_TOKEN` ekle (okunabilir stack trace)

### 2. SEO & Analytics (arama motoru + ölçümleme bağlantıları)
- [ ] **Google Search Console (GSC)**: domain (veya URL-prefix) doğrula
      → `sitemap.xml` gönder → indexleme/performans takibi
- [x] **Bing Webmaster Tools**: GSC'den import edildi (2026-06-19)
- [x] **Google Analytics 4 (GA4)**: `G-FVMYQDKPE4` — canlıda yayında
      (`NEXT_PUBLIC_GA_ID` + `GoogleAnalytics` bileşeni). [ ] GSC ile bağlama (ops.)
- [x] **Ahrefs Web Analytics**: canlıda yayında (`AhrefsAnalytics` bileşeni, inline key)
- [x] `robots.txt` ve `sitemap.xml` canlıda doğrulandı (200, application/xml)

### 3. Google Cloud Console — brand & doğrulama
- [ ] **OAuth consent screen branding**: uygulama adı, logo, destek e-postası,
      ana sayfa + gizlilik/şartlar URL'leri (CitePlex markası)
- [ ] **Brand verification / domain ownership**: consent screen'i "Testing"den
      "In production"a al; gerekiyorsa Google brand doğrulama sürecini tamamla
      (logo onayı birkaç gün sürebilir)
- [ ] Authorized domains'e canlı domaini ekle

### 4. Supabase — add-on'lar & üretim ayarları
- [ ] Gerekli **add-on**'ları gözden geçir (ör. Custom SMTP / Auth e-posta limiti,
      Point-in-Time Recovery / yedekleme, compute/ölçek)
- [ ] Production'da **Custom SMTP** (Resend) ile auth e-postalarını gönder
      (rate limit + teslimat için)
- [ ] Auth → URL/Redirect ve e-posta şablonlarının canlı domaine göre ayarı

### 5. İçerik & Büyüme
- [ ] **outrank.so blog entegrasyonu**: blog'u siteye bağla (subpath `/blog`
      veya subdomain), otomatik içerik yayını + sitemap'e dahil et
- [ ] Google Ads stratejisi
- [x] Pricing sayfasında tüm araçlar listelendi ("Every tool, included" bölümü)
      + FAQ "6 styles" → "11 styles" düzeltildi (2026-06-20)

---

## 🖥 Yerel geliştirme notu (önemli)

Bu makinede **OneDrive + McAfee**, `.next` klasöründeki manifest dosyalarını
kilitliyor → `next dev` (Turbopack) sürekli `EPERM` ile çöküyor; `.next`
junction'ı da Sentry instrumentation hook'unu bozuyor.

**Çözüm (yerel önizleme için):**
```powershell
npm run build
npx next start -p 3001
```
`next start` sürekli yeniden derleme yapmadığı için kararlı. Vercel (Linux)
ortamında bu sorunların hiçbiri yok.

İdeal kalıcı çözüm: projeyi OneDrive **dışına** taşımak (ör. `C:\dev\citeplex`)
→ `next dev` hot-reload sorunsuz çalışır.

---

## 📌 Hızlı referans

- Repo: https://github.com/CDCStream/citeplex-com
- Supabase proje: `jirltqgatjarsbthowga`
- Sentry: proje `citeplex` (region: de)
- Plagiarism sağlayıcı: Winston AI (gowinston.ai) — 2 kredi/kelime
- Env şablonu: `.env.local` (git'e gitmez)
