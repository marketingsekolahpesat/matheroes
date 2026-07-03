# MATHEROES — HANDOFF (Status & Antrian Kerja)

> **Baca file ini PERTAMA tiap sesi.** Lalu `MATHEROES_VISI.md` (prinsip) + `MATHEROES_CONTEXT.md` (peta kode).
> File ini = di mana posisi sekarang & apa yang dikerjakan berikutnya.

---

## ATURAN TETAP (berlaku tiap sesi, tanpa kecuali)

1. **Baca VISI + CONTEXT + HANDOFF dulu** sebelum menyentuh kode.
2. **Audit dulu, baru ngoding.** Cek apa yang sudah ada — jangan asumsi dari nama file/ingatan.
3. **Tiap perubahan: app harus tetap JALAN.** Single-file, offline-first dipertahankan.
4. **Commit tiap versi yang jalan.** Satu langkah = satu commit.
5. **Tunduk pada 6 larangan di CONTEXT §19** (single-file, mobile-first, salah ≠ hukuman, dll).

---

## STATUS SEKARANG

- Game **jalan**, versi save `matheroes-v2`, `matheroes.html` ~3421 baris (~762KB single-file, sudah termasuk art WebP inline).
- Domain Bilangan **lengkap** (5 operasi). Pijar, adab, scaffold, reward usaha — **sudah ada**. **Adaptif KELIMA operasi** (ITEM 3).
- **ITEM 1 SELESAI** (soal AKM bernalar kelima operasi).
- **ITEM 2 + Diagnosa v2 SELESAI (lokal + sync).** Diagnosa **adaptif** (pre=Prolog, post=Uji, setara): per topik **level kemampuan** (no plafon) + **kelancaran** (detik, diam-diam) + **nalar** (untimed) + ringkasan rata2; sync Google Sheets (offline-first). **SYNC_URL sudah dipasang Daffa** (data masuk). ✅ **Sheet v2 BERES** — Daffa sudah re-paste `.gs` + redeploy + clear Sheet lama; `SYNC_URL` diupdate ke deploy baru (`AKfycbxS…j5yNA/exec`). Detail **CONTEXT §15, §21**.
- **ITEM 3 SELESAI** (adaptif kelima operasi). `S.player.adaptF[op]`, `genAdaptiveQ`/`ADAPT_BANDS`. Detail **CONTEXT §9**.
- **ITEM 4 SELESAI** (diagnosa cakup pecahan) — pecahan ikut gelombang basic Diagnosa v2 → `pecahan_lvl/dtk` terisi + benih `adaptF.frac`.
- Terverifikasi: `verify_item2.js` 69/69 + `verify_item2_sync.js` 37/37 + `verify_item3.js` 67/67 + `verify_item1.js` 26/26 + render Edge (frac wave, rapor v2).
- **THEMING (pass terpisah, CLAUDE.md/MATHEROES_TEMA.md) — TAHAP A & TAHAP B SELESAI.** Keputusan Daffa dikunci: **nama hero Teguh/Bijak/Tangkas** (id internal adira/kira/reno TETAP → save & sprite aman), **flavor akhlak universal + ruang Islami**.
  - **Tahap A (kosmetik) SELESAI:** rename hero+watak, label "Wilayah · Nilai: Kolaborasi/Kemandirian/Kreativitas/Keadilan" di peta, bingkai Kesehatan (Pijar pas Istirahat), penanda Penalaran (🧠 "Saatnya bernalar"). Verifikasi `verify_tema.js` 14/14 + render Edge.
  - **Tahap B (naratif/kosmetik) SELESAI 2026-06-29:** hero cluster dimensi; musuh **"disadarkan → jadi teman"** (di victory + koleksi) = "Makhluk Kebiasaan"; **Penjaga Wilayah** (Tama/Wira/Bara/Bagas) intro sekali per wilayah; **Bintang Karakter 8 Dimensi Profil Lulusan** di Profil (dari milestone + perilaku, mis. jujur 7/8, Komunikasi nyusul); Lapis 2 Kesehatan/Penalaran naming + fix toast wrap. Verify harness lama tetap pass (no regresi), deploy di-rebase di atas upload `sprite-data.js` Daffa — commit `06eb820` live.
  - **ART FINAL WebP TERINTEGRASI 2026-06-29:** 17 sprite WebP (base64 dari `sprite-data.js`) di-embed inline ke `matheroes.html` lewat `SPRITE_IMG`; `setSprite` jadi image-first + fallback palette+rows; alias hero `hero_adira/kira/reno → teguh/bijak/tangkas`. Commit `3967964` live. `sprite-data.js` eksternal sudah **dihapus dari repo** (redundant, commit `d2080d0`) — file di Downloads cuma bahan, sudah ke-embed.
  - **FIX KEYBOARD MOBILE v2 (`visualViewport`)** commit `f668d59` — ⏳ **nunggu Daffa tes di HP.**
- **✅ Kekuatan MEKANIK hero — SELESAI (2026-06-29 sesi 4):** `HEROES[].power` + tampil di kartu pilih hero, intro toast (`confirmHero`), & Profil (`stats-power`). **Teguh "Pantang Mundur"** (`_pantangMundur`, `E.pantangUsed`): sekali/tarung, saat HP mau habis → tahan di ~15% HP (min 3), bukan tumbang; hook di `_handleDefendWrong`+`_handleBerserkWrong` (`if(hp<=0 && !G._pantangMundur())`). **Bijak "Pikiran Jernih"** (`bijakTimeMult`=1.5, `BIJAK_CUE`): soal nalar (bertahan+berserk) timer ×1.5 + petunjuk isyarat di `renderQuestion`. **Tangkas "Semangat Bersama"** (`heroStreakBonus` cap+5): bonus damage `floor(streak/3)` di `_handleAttackCorrect` + `addBond` ×1.5. Verif: `verify_timer_berserk` 115/115 + `verify_flow` 47/47 (§H) + render kartu hero. **→ THEMING TAHAP B SEPENUHNYA SELESAI.**
- Prioritas berikutnya (pilihan Daffa): **kekuatan MEKANIK hero (sisa Tahap B)** atau **ITEM 5** (Pijar nebak miskonsepsi). Lalu: domain AKM non-Bilangan & Reasoning multi-langkah (PISA) = konten lanjutan.
- Ringkasan ✅/❌ ada di **CONTEXT §0**. Backup: `_mh_verify/matheroes_pre_item2.html`, `matheroes_item2_done.html`, `matheroes_item3_done.html`, `matheroes_diagv2_item4_done.html`.

### ⚠️ KEJANGGALAN — VERIFIKASI SEBELUM JALANIN ULANG APA PUN
Ada dugaan file `PROMPT-LANJUT-MEKANIK.md` (M1–M9) **belum dijalankan**, TAPI mekanik M1–M9 (adaptif, soal nalar bertahan, damage bisa pulih, soal tebusan, reward usaha, anti-sombong) **sudah ADA di kode**. 
→ **JANGAN jalanin PROMPT-LANJUT-MEKANIK lagi.** Kemungkinan besar sudah selesai; menjalankan ulang = risiko dobel/konflik. Audit kode dulu, baru tentukan sisa yang belum.

---

## ANTRIAN KERJA (urut prioritas)

> Tiap item: tunduk ATURAN TETAP. Selesai 1 → update CONTEXT §0 & §17 → commit → lanjut.

### ✅ ITEM 1 — Soal nalar/AKM untuk 4 operasi lain — **SELESAI** *(gap VISI #2 — lever terbesar)*
**Hasil:** `SUB_/MUL_/DIV_/FRAC_AKM_TEMPLATES` + `genSubAkmQ/genMulAkmQ/genDivAkmQ/genFracAkmQ` dibuat (ikut pola `ADD_AKM_TEMPLATES`/`genAddAkmQ`). Dispatcher `genAkmQ(sid)` pilih per operasi; `genDefendQ` = `genAkmQ` (kelima operasi soal cerita saat bertahan). `genRedeemQ` diperbaiki → tebusan ikut operasi yang terlewat (dulu selalu Penjumlahan). Label "🧠 Soal AKM" kini tampil utk semua operasi. Isyarat per operasi: kurang=ambil/sisa/selisih, kali=kelompok sama, bagi=dibagi rata/dikelompokkan, pecahan=pecahan-satuan dari jumlah. Konteks personal/sosial-budaya/saintifik. Jawaban tetap angka (cocok input & guide CPA).
**Verifikasi:** harness `_mh_verify/verify_item1.js` (26/26: ans benar tiap operasi, story memuat angka, tebusan ikut operasi, Penjumlahan tak rusak) + boot Edge + proxy render. Timer/kecepatan TIDAK disentuh.
> Catatan VISI #2 terpenuhi: anak harus menalar *operasi mana*, bukan sekadar hitung angka yang dibungkus kalimat.

### ✅ ITEM 2 — Layer Pengukuran (before/after + sync Sheets) — **SELESAI PENUH**
**Tujuan:** guru/Daffa bisa lihat **kemampuan tiap anak naik apa nggak**, per topik.
**Hasil (kode di CONTEXT §21):**
1. ✅ **Identitas siswa minimal** — input "Kode kelas" di `s-name`; `S.student={id,kelas}`, `id` stabil (`genStudentId`).
2. ✅ **Baseline (pre)** — `_finishProlog`→`recordDiag('pre',…)` per topik + nalar (sekali, tak ditimpa).
3. ✅ **Diagnosa akhir (post)** — `genDiagSet` **sama** dipakai pre & post → setara dijamin (tombol peta "🎓 Uji Kemampuan", layar `s-posttest`). Keputusan: nalar diukur via **gelombang nalar di prolog** (20 soal) + post-test = **tombol di peta, selalu ada**.
4. ✅ **Snapshot per topik** — `s-measure`/`renderMeasure` (awal→akhir + gain) & `measureRow()` (baris flat: `{topik}_awal/akhir`, `nalar_awal/akhir`, `total_gain`, `menit_main`, dst). `pecahan_*` dicadangkan kosong (ITEM 4).
5. ✅ **Sync ke Google Sheets** — `syncMeasure()` POST `measureRow()` per **checkpoint** (`goMap` bila `dirty`, `_finishPost`, tombol "☁️ Sinkron sekarang"), **offline-first** (gagal/offline → tetap `dirty`, retry; resolve → `dirty=false`+`lastSync`). `fetch` mode `no-cors`+`text/plain`+`keepalive` (anti-CORS-preflight). **Apps Script Web App** (`MATHEROES_AppsScript.gs`): upsert **by nama+kelas**, header auto-buat, LockService anti-race. URL: `SYNC_URL` (konstanta) atau localStorage `matheroes-sync-url` (tombol "🔗 Atur URL Sheet") → single-file tetap utuh. **BUKAN** service account/Next.js.
**Definisi selesai:** ✅ anak main → progres + before/after kesimpen lokal → ter-sync ke 1 baris Sheets/anak, game tetap jalan offline. **Tinggal aksi Daffa:** deploy Web App & tempel URL (`MATHEROES_SETUP_ONLINE.md`).

### ✅ ITEM 3 — Kesulitan adaptif untuk KELIMA operasi — **SELESAI**
**Hasil:** staircase adaptif digeneralisasi ke kurang/kali/bagi/pecahan. `S.player.adaptF={add,sub,mul,div,frac}` (float 1–6, floor → ramah anak lemah, target ~80%). `adaptDifficulty(op,correct)` (recordAnswer, semua op, dari serangan ringan), `playLevel(op)`, `genAdaptiveQ(op,level,sid)` + `ADAPT_BANDS` (rentang per tingkat sejajar tangga skill; add tetap via `genTrialQ`). `genAttackQ` → `genAdaptiveQ` utk semua op. Benih `_finishTrial`: add dari Ujian Kekuatan, sub/mul/div dari skor Prolog, frac lembut. `ld()` migrasi save lama. `addLevelF` dijaga sbg cermin `adaptF.add`.
**Verifikasi:** `_mh_verify/verify_item3.js` 67/67 + render Edge (encounter mul adaptif). Timer/kecepatan TIDAK disentuh.
**Catatan utk review Daffa:** seperti Penjumlahan, tingkat span seluruh operasi → mastery skill rendah (mis. `mul_1_5`) praktis perlu tahan sampai faktor lebih besar. Konsisten dgn desain add yg sudah ada; kalau mau di-cap per-skill, itu revisi terpisah.

### ✅ ITEM 4 — Diagnosa cakup Pecahan — **SELESAI** (bareng Diagnosa v2)
**Hasil:** `DIAG_OPS` termasuk `frac` → pecahan dapat gelombang basic adaptif sendiri ("🍰 JURUS PECAHAN") di pre & post → `pecahan_lvl`/`pecahan_dtk` terisi, benih `adaptF.frac` dari level diagnosa. Diagnosa kini nyentuh **kelima operasi**.
**Verifikasi:** `verify_item2.js` (frac_lvl terukur) + render Edge (wave pecahan "½ dari 4 = ?").

### ✅ ITEM 5 — Pijar nebak miskonsepsi dari jawaban salah — **SELESAI (2026-06-29 sesi 5)**
**Hasil:** `diagnoseMistake(q,v)` (+ helper `digitsNoCarrySum`/`digitsAbsDiff`) menebak pola error umum dari **angka yang anak masukin** → 1 kalimat Pijar LEMBUT ("Sepertinya/Kayaknya…") sebelum cara umum. Pola: **add** lupa simpan puluhan / hampir(±2); **sub** kebalik (kurangi kecil-dari-besar → "pinjam"), tukar urutan; **mul** jadi tambah (=a+b), kurang/lebih 1 kelompok; **div** jadi kali (=a×b) / dikurangi (=a−b) / hampir; **frac** dikali penyebut / jawab jumlah / jawab penyebut. Integrasi: `E.lastWrong` (di-set `submitEnc`, reset saat `timedOut`/benar, init `startEncState`) → `renderGuide`→`renderExplain(q,wrong)`→diag dulu lalu `guideHint`. **Tak salah-tuduh:** benar/ngawur-jauh → null → petunjuk generik. **Timeout ≠ salah hitung** (lastWrong null). Untuk SEMUA operasi & soal cerita (pakai a,b,ans,op).
**Verifikasi:** `verify_item5.js` 27/27 (helper, deteksi tiap pola, anti-salah-tuduh) + harness lama no-regresi + render Edge (Guide "Kayaknya tiap angka dikurangi yang kecil dari yang besar — pinjam dulu…").

### ✅ DOMAIN AKM BARU — GEOMETRI v1 — **SELESAI (2026-06-29 sesi 7)** *(konten BONUS, belum diukur)*
**Hasil:** Region **"Negeri Bentuk"** (`group:'Geometri'`, muncul setelah Pecahan di peta otomatis). 2 skill: **`geo_kel`** (Keliling) & **`geo_luas`** (Luas) persegi & persegi panjang — jawaban ANGKA. `genGeoQ(op,maxSide)` (rumus 4s / 2(p+l) / s² / p×l), wired ke `genQ`/`genHardQ`/`genAdaptiveQ`+`ADAPT_BANDS.gkel/gluas` + AKM (`GEO_AKM`+`genGeoAkmQ`) + `qText`/`guideHint`/`buildGuideVisual` + peta (`GICON`/`GSTAT`/`STORY_REGIONS` Geometri) + `blankState.skills`+`geo_kel/luas` (ld auto-migrasi). Pakai ULANG semua mesin: combat, adaptif, gear, kekuatan hero, dedup, Guide. Musuh emoji (📐 Si Kusut, 🟦 Si Melebar — sprite art nyusul). **BELUM masuk `DIAG_OPS`** (tak ganggu Sheet). **Cara nambah domain: CONTEXT §17b.**
**Verifikasi:** `verify_geo.js` **47/47** (kebenaran rumus tiap generator, adaptif 6 tingkat, AKM) + harness lama no-regresi + render Edge (combat Keliling+Luas, peta region Geometri).
**Berikutnya (Geometri lanjutan):** satuan panjang (cm↔m), keliling/luas segitiga & lingkaran, volume. **Atau domain lain:** Aljabar / Data & Ketidakpastian. **Kalau mau geo DIUKUR** (pre/post+Sheet) → tambah ke `DIAG_OPS` + Daffa redeploy `.gs`.

### ✅ KEYPAD DINAMIS + BILANGAN BULAT (negatif) — **SELESAI (2026-06-29 sesi 8)** *(konten BONUS, belum diukur)*
**Keypad dinamis:** `buildNumpad` tambah tombol tersembunyi `−`(`np-neg`) & `,`(`np-dot`) full-width; `updateNumpadKeys(op,scEl)` tampilin sesuai op (di `renderQuestion`+`renderGuide`); `npFeed` handle toggle `−` & sekali `.`; `inp-enc`/`inp-guide` → **`type="text"`** (biar terima "−"; number-input nolak "-" sendirian) + `data-max`. Keyboard fisik "-"/"." jalan. **Buka jalan buat desimal (`,`) & √ nanti.** **Bilangan Bulat:** region **"Kutub Beku"** (`iadd`/`isub`, setelah Geometri), jawaban BISA negatif. `genIntQ(op,maxN)` (a,b ∈ [−maxN,maxN], ans a±b); wired genQ/genHardQ/genAdaptiveQ+`ADAPT_BANDS.iadd/isub` + AKM (`genIntAkmQ`: suhu/lift-basement/penyelam) + `qText`(negatif dibungkus kurung: `(−5) + 4`) + `guideHint`/`buildGuideVisual` (garis bilangan) + peta + `blankState.skills`. Musuh ❄️ Si Beku, 🥶 Si Dingin. ITEM 5 diagnoseMistake → null utk int (aman). Detail keypad+cara di CONTEXT §17b.
**Verifikasi:** `verify_int.js` **51/51** (a±b benar, negatif muncul, adaptif 6 tingkat, AKM, qText/guideHint, keypad wiring) + harness lama no-regresi (verify_geo assertion SKILL_ORDER diupdate) + render Edge (combat "3−8=?" + input "-12" + tombol "−" muncul). Backup `matheroes_int_v1_done.html`.
**Berikutnya (paling nyambung): DESIMAL** (`,` sudah siap di keypad; `dadd`/`dsub` pakai tenths anti-floating-point + `parseFloat`) — melengkapi Bilangan. Lalu Geometri lanjutan / Aljabar / Data.

---

## ✅ TIMER — KEPUTUSAN DAFFA SUDAH DIAMBIL (2026-06-29): "timer LEMBUT"

Daffa minta **2 fitur timer** (dulu zona parkir) — dieksekusi dengan arah **"timer LEMBUT"** (hormati VISI #5):
1. **Ujian Kekuatan berwaktu KELIMA operasi** (dulu cuma Penjumlahan). "Timer"-nya = **bar jendela-cepat** (bonus kalau cepat, **BUKAN** timeout/hukuman) → sejalan VISI #5. Tiap babak: add 6 soal, sub/mul/div/frac **3 soal** (ringkas). Benih `adaptF[op]` kini dari hasil Ujian Kekuatan tiap operasi (fallback level diagnosa). Detail CONTEXT §15.
2. **MODE BERSERK** — tiap musuh, saat HP mau habis (ditahan jadi 1), "berserk" & lepas **`BERSERK_N`=2 soal nalar** yang harus ditangkis → **jaminan tiap pertarungan ada soal bernalar**. Timer **LONGGAR** (`BERSERK_TIME`=28s, nalar butuh mikir). **Salah/telat = damage yang BISA pulih + dituntun (Guide), lalu lanjut** (keputusan Daffa: "kena damage bisa-pulih + dituntun"). Detail CONTEXT §7b.
3. **DEDUP SOAL (anti-kembar)** — soal tak boleh sama beruntun: `qKey`+set `seen` di Ujian Kekuatan (`genTrialQOpFresh`) & diagnosa Prolog (`DG.seen`), `freshAttackQ` (hindari kembar beruntun) di combat. Terbukti 0 kembar dlm 3.500 simulasi.
4. **SKIP CERDAS + Penjaga** — operasi (non-add) yang anak LEMAH di diagnosa (`pre.{op}_lvl ≤ TRIAL_SKIP_LVL`=1) → layar `s-guardian`: pilihan **"Minta tolong Penjaga [Tama/Wira/Bara/Bagas; Pecahan=Pijar]"** (skip ujian → baseline `{op}_lvl`=0, benih `adaptF`=1, narasi "Penjaga hancurin Monster") **atau "Aku mau coba sendiri"** (ujian jalan, level keukur). Onboarding jadi cepat utk anak lemah, tetap ada pilihan. Diagnosa AKHIR tetap via tombol peta "Uji Kemampuan & Rapor" (soal mirip).
5. **SKIP DIAGNOSA + HADIAH GEAR** (keputusan Daffa) — di Prolog (diagnosa awal lawan Kekacauan) tiap soal ada tombol **"🤔 Belum bisa, lewati"** (`skipProlog`): skip = **dihitung 0** utk pengukuran (jujur, `diagAnswer(NaN)`) TAPI **serangan tetap kena musuh** (progress jalan, nggak nge-stuck, toast hangat). **HADIAH** (`S.player.gear`, `GEAR_TIERS`): hargai **USAHA bukan benar** → **0 skip = `legendaris`** (+3 dmg, +15 HP), ada skip = `biasa` (+1 dmg, +5 HP). Bonus via `gearObj(st)` di `computeMaxHP`/`computeDamage`; tampil di Profil & layar hasil diagnosa (`dr-gear`). Diinfoin di awal (prolog-intro). **Baseline tetap utuh** (diagnosa nggak di-skip total, cuma per-soal). Detail CONTEXT §15b.

> **Sisa yang MASIH parkir (jangan diubah tanpa Daffa):** speed-XP GESIT (timer in-combat reguler ter-gate `accurate`/`mastered`) — itu belum disentuh, tetap apa adanya.

---

## 📱 MOBILE LAYOUT + PWA (2026-06-29 sesi 6)
- **Layout padat HP:** `@media(max-height:780px)` & `650px` — kecilkan sprite musuh, padding q-box/input, keypad `.np-key`, `.btn`, `.comp-bubble`. Layar tarung muat 1 layar (✓-keypad = submit selalu kelihatan). Desktop tak berubah.
- **PWA:** `manifest.json` (standalone, icons 192/512) + `sw.js` (**network-first**: online=fresh, offline=cache) + meta di `<head>` + `icon-192/512.png`. Bisa **Add to Home Screen → fullscreen tanpa address bar**. ⚠️ **Daftar SW `<script>` HARUS sebelum `</body>`** — kalau di `<head>` jadi `<script>` pertama, semua harness (`m[1]`) baca script itu bukan game → fail total. File PWA sejajar `index.html` di repo.

## CARA RUN & VERIFIKASI

- Buka `matheroes.html` langsung di browser (HP/desktop). Tidak ada build step.
- Tes offline: matiin internet → game harus tetap jalan penuh.
- Tiap perubahan: main sampai minimal 1 encounter selesai + 1 jawaban salah (cek Guide) sebelum commit.
- Save lama harus tetap kebaca (cek migrasi `ld()` kalau nambah field state).

---

## CATATAN: bikin soal diagnosa awal & akhir SETARA (kritis buat ITEM 2 & 4)

Kalau diagnosa akhir kebetulan lebih gampang → `gain` palsu (keliatan naik padahal soalnya enteng). Kalau lebih susah → keliatan nggak naik padahal bisa. Syarat setara:
- **Range angka sama** per topik (mis. pre & post pengurangan sama-sama dari rentang yang sama).
- **Jumlah & proporsi tipe soal sama** (berapa knowing, berapa applying/cerita).
- **Soal beda boleh** (jangan persis sama biar nggak dihafal), tapi **bobot/tingkat kesulitan harus mirip.**
- Idealnya: tarik dari generator yang sama dengan parameter kesulitan yang sama untuk pre & post.

---

## FILE DOKUMEN (mana yang di repo, mana yang bukan)

| File | Di repo (Claude Code baca)? |
|---|---|
| `MATHEROES_VISI.md` | ✅ ya (prinsip) |
| `MATHEROES_CONTEXT.md` | ✅ ya (peta kode — yang FRESH, buang yang basi) |
| `MATHEROES_HANDOFF.md` | ✅ ya (file ini) |
| `MATHEROES_ROLLOUT.md` | ❌ tidak (rencana pilot, buat Daffa/stakeholder) |
| `PROMPT-LANJUT-MEKANIK.md` | ❌ arsipkan (kemungkinan sudah selesai) |

---

*Update terakhir: 2026-06-29 (sesi 2) — **TIMER LEMBUT** (keputusan Daffa): (1) **Ujian Kekuatan berwaktu KELIMA operasi** (bar jendela-cepat lembut; sub/mul/div/frac 3 soal; benih `adaptF` dari hasil ujian tiap op) + (2) **MODE BERSERK** (musuh mau mati → tahan HP 1 → `BERSERK_N`=2 soal nalar berwaktu longgar `BERSERK_TIME`=28s; salah=damage bisa-pulih+dituntun → jaminan tiap fight ada nalar). Verifikasi: harness lama no-regresi (item1 26, item2 73, item2_sync 37, item3 67, tema 14; m1/m5 fail = stale lama, identik di backup) + harness baru `verify_timer_berserk.js` 73/73 + `verify_flow.js` (runtime kontroler) 17/17 + render Edge (boot + layar Ujian Kekuatan Perkalian). Backup: `_mh_verify/matheroes_pre_timer_berserk.html` & `matheroes_timer_berserk_done.html`. Catatan UI backlog: tombol angka statik (nanti dinamis utk akar √ dll). Berikutnya: kekuatan MEKANIK hero (sisa Tahap B) atau ITEM 5.*

*(2026-06-29 sesi 1 — THEMING **Tahap B** (hero cluster dimensi, musuh "disadarkan→jadi teman", Penjaga Wilayah Tama/Wira/Bara/Bagas, Bintang Karakter 8 Dimensi, Lapis 2 Kesehatan/Penalaran + fix toast wrap) SELESAI; **ART FINAL WebP** (17 sprite di-embed inline via `SPRITE_IMG`, `setSprite` image-first, alias hero) TERINTEGRASI; **fix keyboard HP v2** (`visualViewport`). Commit live: `06eb820` (Tahap B) → `3967964` (art) → `d2080d0` (hapus `sprite-data.js` redundan) → `f668d59` (fix keyboard). Verify harness lama tetap pass, no regresi. ⏳ Nunggu Daffa tes keyboard di HP. Sheet v2 BERES (Daffa sudah redeploy `.gs` + clear Sheet, `SYNC_URL` diupdate, data masuk). Berikutnya: kekuatan MEKANIK hero (sisa Tahap B) atau ITEM 5. Timer/kecepatan TIDAK disentuh.*

*(Riwayat sebelumnya — 2026-06-28: ITEM 2+Diagnosa v2, ITEM 3 adaptif 5 op, ITEM 4 diagnosa pecahan, + THEMING Tahap A SELESAI & terverifikasi 69+37+67+26+14 + render Edge.)*
