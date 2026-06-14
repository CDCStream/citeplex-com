# CitePlex — Yol Haritası & Deploy Notları

Son güncelleme: 2026-06-14

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

## 🚀 Deploy (devam ediyor — Vercel)

1. [vercel.com/new](https://vercel.com/new) → `CDCStream/citeplex-com` import
   (Framework: Next.js otomatik, Root Directory: `./`).
2. Environment Variables ekle (Production + Preview + Development):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AI_API_KEY`, `OPENAI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`
   - `LANGUAGETOOL_API_URL`
   - `PLAGIARISM_API_KEY`, `PLAGIARISM_API_URL`
   - `RESEND_API_KEY`, `EMAIL_FROM`
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `NEXT_PUBLIC_SITE_URL`  ← **canlı domain** (deploy sonrası düzelt + redeploy)
   - **EKLEME (boş/placeholder):** `DODO_*`, `SENTRY_ORG/PROJECT/AUTH_TOKEN`
3. Deploy → canlı URL'i not et.

---

## 🔧 Deploy hemen sonrası (canlı URL gelince)

- [ ] `NEXT_PUBLIC_SITE_URL`'i gerçek domain'le güncelle → redeploy
- [ ] **Supabase → Auth → URL Configuration**: Site URL + Redirect URLs'e
      canlı domaini ekle (`/auth/callback`, `/reset-password`)
- [ ] **Google Cloud → OAuth**: Authorized JavaScript origins + redirect URI'ye
      canlı domaini ekle; gerekiyorsa consent screen'i "Testing"den çıkar
- [ ] **Resend**: `EMAIL_FROM`'u `onboarding@resend.dev` yerine doğrulanmış
      domaine çevir
- [ ] Canlıda smoke test: signup → e-posta onayı → login → Google OAuth →
      şifre sıfırlama → bir atıf oluştur/kaydet → export → plagiarism taraması
- [ ] Sentry'de canlı ortamdan bir test hatası göründüğünü doğrula

---

## ⏭ Deploy sonrası (sıradaki işler)

### 1. Dodo Payments (abonelik) — kod hazır, sadece yapılandırma
- [ ] Dodo dashboard'da ürünleri oluştur (plan × billing: pro/team, monthly/annual)
- [ ] `DODO_PAYMENTS_API_KEY`, `DODO_PAYMENTS_WEBHOOK_SECRET`,
      `DODO_PAYMENTS_ENVIRONMENT`, `DODO_PRODUCT_*` env'leri doldur (Vercel + local)
- [ ] `supabase/migrations/0002_payments.sql`'i Supabase'de çalıştır
- [ ] Webhook URL'ini Dodo'ya tanıt: `https://<domain>/api/webhook/dodo`
- [ ] Test mode'da satın alma → webhook → plan yükseltme akışını doğrula
- [ ] Source map için `SENTRY_ORG/PROJECT/AUTH_TOKEN` ekle (okunabilir stack trace)

### 2. SEO & Analytics (arama motoru + ölçümleme bağlantıları)
- [ ] **Google Search Console (GSC)**: domain (veya URL-prefix) doğrula
      → `sitemap.xml` gönder → indexleme/performans takibi
- [ ] **Bing Webmaster Tools**: site ekle + doğrula → sitemap gönder
      (GSC'den içe aktarma seçeneği de var, hızlı yol)
- [ ] **Google Analytics 4 (GA4)**: property aç → measurement ID'yi siteye ekle
      (env: `NEXT_PUBLIC_GA_ID` + layout'a script) → GSC ile bağla
- [ ] **Ahrefs**: site ekle (Webmaster Tools/dashboard) → backlink + anahtar
      kelime + arama performansı takibi
- [ ] `robots.txt` ve `sitemap.xml` canlıda kontrol (zaten üretiliyor)

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
- [ ] Pricing sayfasında yeni araçların (punctuation, conclusion vb.) listelenmesi

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
