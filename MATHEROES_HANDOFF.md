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

- Game **jalan**, versi save `matheroes-v2`, `matheroes.html` ~3069 baris.
- Domain Bilangan **lengkap** (5 operasi). Pijar, adab, scaffold, reward usaha — **sudah ada**. **Adaptif kini KELIMA operasi** (ITEM 3).
- **ITEM 1 SELESAI** (soal AKM bernalar kelima operasi).
- **ITEM 2 SELESAI PENUH (lokal + sync).** Pengukuran before/after + sync Google Sheets (Apps Script Web App, offline-first). `MATHEROES_AppsScript.gs` + `MATHEROES_SETUP_ONLINE.md`. **SYNC_URL sudah dipasang Daffa** (Sheet "Matheroes" aktif, data masuk). Detail **CONTEXT §21**.
- **ITEM 3 SELESAI** (adaptif kelima operasi). `S.player.adaptF[op]` staircase ~80% per operasi, `genAdaptiveQ`/`ADAPT_BANDS`/`playLevel`/`adaptDifficulty`. Benih dari diagnosa; migrasi save lama. Terverifikasi: `verify_item3.js` 67/67 + render Edge. Detail **CONTEXT §9**.
- Prioritas berikutnya: **ITEM 4** (diagnosa pecahan → isi `pecahan_awal/akhir` + benih `adaptF.frac`) → **ITEM 5** (Pijar nebak miskonsepsi, refinement).
- Ringkasan ✅/❌ ada di **CONTEXT §0**. Backup: `_mh_verify/matheroes_pre_item2.html`, `matheroes_item2_done.html`, `matheroes_item3_done.html` (Downloads bukan repo git → backup = snapshot versi).

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

### ITEM 4 — Diagnosa cakup Pecahan
**Masalah:** Prolog 16 soal cuma tambah/kurang/kali/bagi (CONTEXT §15) — pecahan nggak ke-diagnosa.
**Kerjakan:** tambah band pecahan ke `genPrologQs` (atau extend), biar before/after Pecahan punya baseline.
**Definisi selesai:** diagnosa nyentuh kelima operasi.

### ITEM 5 *(refinement, bukan mendesak)* — Pijar diagnosa kesalahan spesifik
**Sekarang:** scaffold kuat & spesifik per operasi, TAPI petunjuk nggak nebak miskonsepsi dari **jawaban salah** anak.
**Kerjakan (nanti):** deteksi pola error umum (mis. lupa simpan puluhan, salah nilai tempat) dari jawaban yang dimasukin → petunjuk Pijar yang lebih nyasar. VISI sebut feedback spesifik = make-or-break, tapi ini peningkatan, bukan gap besar.

---

## ⏳ BUTUH KEPUTUSAN DAFFA (jangan diubah sebelum dia putuskan)

**Timer & reward kecepatan vs VISI #5/#7.**
- Sekarang: timer cuma nyala pas skill sudah `accurate`/`mastered` (✅ off pas anak masih belajar — bagus). TAPI "Ujian Kekuatan" + speed-XP GESIT **menghargai kecepatan** ("benar DAN cepat").
- VISI #5 ("paham dulu baru cepat") & #7 ("timer nggak menghukum") → ini **zona abu-abu**, bukan pelanggaran.
- **Pilihan Daffa:** (a) pertahankan apa adanya (timer ter-gate sudah cukup aman), atau (b) lembutin framing kecepatan (mis. kecepatan jadi bonus opsional, bukan jalur utama XP).
- **Claude Code: JANGAN ubah mekanik timer/kecepatan sampai Daffa pilih.**

---

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

*Update terakhir: 2026-06-28 — ITEM 2 (pengukuran + sync Sheets, URL sudah dipasang & data masuk) & ITEM 3 (adaptif kelima operasi) SELESAI & terverifikasi (48/48 + 37/37 + 67/67 + render Edge). Berikutnya ITEM 4 (diagnosa pecahan). Timer/kecepatan TIDAK disentuh.*
