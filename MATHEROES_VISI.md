# MATHEROES — Visi & Indikator Keberhasilan

> Dokumen ini mengunci **kenapa** Matheroes ada dan **apa yang dihitung sebagai berhasil**.
> Tujuannya: jadi rujukan tetap buat saya, Rizky, dan Claude Code — supaya setiap fitur baru bisa diuji satu pertanyaan: *"ini ndukung visi atau cuma nambah ramai?"*
>
> Status angka target: **draft awal**. Dikunci beneran setelah pilot pertama. Yang tidak boleh berubah adalah **prinsip desain** di Bagian 3, bukan angkanya.

---

## 0. Definisi sukses dalam satu kalimat

> **Anak yang biasanya nyerah atau takut matematika malah minta soal lagi — dan dari situ kemampuan numerasinya beneran naik, terukur.**

Kalau dua hal itu kejadian (anak mau lanjut sendiri **dan** angka kemampuannya naik), Matheroes berhasil. Kalau cuma salah satu, berarti masih ada yang bocor.

---

## 1. Visi (berlapis)

Matheroes itu bukan "bikin game matematika". Ada tiga lapis, dari yang paling besar ke yang paling konkret.

### Lapis 1 — North Star (jangka terbesar)
Naikin **numerasi & literasi anak Indonesia di mata internasional.** Matheroes (numerasi) jalan bareng Literanger (literasi) sebagai satu keluarga produk dengan misi yang sama.

Patokan datanya — sengaja ditempel ke angka nyata, bukan klaim kosong:
- **PISA 2022:** skor matematika Indonesia **366**; cuma **~18%** anak nyampe kompetensi minimum (Level 2). Pembanding: rata-rata OECD ~69%, Vietnam 489.
- **Target nasional (RPJMN 2025–2029):** numerasi naik ke **419 pada 2028** lewat Gerakan Numerasi Nasional → ini "true north" angka.
- **AKM/ANBK (Rapor Pendidikan 2025):** ~66% anak nyampe kompetensi minimum numerasi secara nasional, dengan disparitas tajam (Indonesia timur paling tertinggal).

> Catatan jujur: PISA dan AKM **beda populasi & beda standar**. Jangan pernah dicampur di materi pemasaran. PISA = framing dampak besar; AKM = ukuran yang relevan dipetakan ke game.

### Lapis 2 — Inti misi (yang sebenarnya dikejar)
> **"Yang gak tahu jadi tahu, yang gak bisa jadi bisa."**

Sasaran utamanya **bukan** anak yang udah jago — tapi anak yang katanya "nggak bisa matematika" atau **takut** matematika. Merekalah yang paling banyak nyumbang ke angka ~18% itu, dan merekalah yang paling sering ditinggalkan edtech lain.

### Lapis 3 — Hukum desain yang bikin misi ini mungkin
> **Jawaban benar = serangan. Matematika itu aksinya, bukan pajak buat akses bagian seru.**

Plus: kalau anak salah, **nggak ada "Salah!" merah yang nakutin.** Soal dipecah jadi lebih kecil, anak dituntun sampai bisa, baru dikasih soal "penebusan" yang mirip. Companion **Pijar** yang nuntun.

Ini turunan langsung dari prinsip besar saya:
- **adab → sistem** — nilai diterjemahin jadi mekanik yang jalan sendiri, bukan ceramah.
- **struktur > hukuman** — rasa takut bikin anak diam, makna bikin dia gerak.

---

## 2. Untuk siapa (dan untuk siapa BUKAN)

| | |
|---|---|
| **Pemain utama** | Anak SD–SMP yang takut / merasa "nggak bisa" matematika |
| **Pembeli / peninjau** | Guru & sekolah (bisa pantau anak latihan, lihat progres ala AKM) |
| **Bukan target** | Anak yang sudah jago & nyari tantangan kompetitif tinggi (boleh ikut main, tapi bukan untuk mereka game ini didesain) |

Model akses: **gratis penuh buat anak**, jalan **offline**, buka di **HP apa pun**. Pemasukan dari sekolah/guru (B2B) + cosmetic opsional — **tidak pernah** dari transaksi anak.

---

## 3. Prinsip desain yang TIDAK boleh diganggu gugat

Ini "konstitusi" produk. Setiap fitur baru harus lolos semua poin ini. Kalau ada fitur yang melanggar salah satu, fiturnya yang dibatalin — bukan prinsipnya.

1. **Matematika = aksi, bukan pajak.** Jawab soal *itu* gameplay-nya. Loot, job, cerita cuma frosting tipis.
2. **Salah ≠ hukuman.** Nggak ada merah nakutin. Dipecah → dituntun → soal penebusan. Tujuannya bikin bisa, bukan bikin malu.
3. **Visual dulu, angka belakangan** (CPA): **benda → gambar → angka**. Baru lanjut kalau konkretnya nyantol.
4. **Adaptif ke kemampuan anak** (ZPD): kesulitan nempel di "tepi" kemampuan sekarang — nggak terlalu gampang (bosan), nggak terlalu susah (nyerah).
5. **Paham dulu, baru cepat.** Kecepatan **tidak pernah** dihargai sebelum pemahaman. Anti drill-buta.
6. **Sehat, bisa distop kapan saja.** Ada titik berhenti alami, bukan loop yang bikin nagih tanpa ujung. Idealnya ada reminder/info ke orang tua bahwa ini buat naikin numerasi.
7. **Anti-sombong, tertanam di mekanik.** Rayakan kemenangan kecil, dorong perilaku prososial, **hindari** ranking adu-jago yang bikin anak minder.

---

## 4. Indikator Keberhasilan

Disusun 4 tingkat, dari yang paling dekat sama kontrol kita (produk) ke yang paling jauh (visi nasional). **Yang paling penting Tingkat 1 — itu pembuktian bahwa game-nya beneran ngajarin, bukan cuma seru.**

> Semua angka target = **hipotesis awal**. Diisi/dikoreksi pakai data pilot nyata. Yang penting *mekanisme ukurnya* udah jelas dari sekarang.

### Tingkat 0 — Indikator Produk (game-nya jalan & dipakai?)

| Indikator | Cara ukur | Target draft |
|---|---|---|
| Core loop tuntas | Anak nyelesain ≥1 sesi penuh tanpa stuck/error | ≥ 90% sesi |
| Anak balik main | Retention D1 / D7 (localStorage event) | D1 ≥ 40%, D7 ≥ 20% |
| Stage completion | % stage diselesaikan dari yang dibuka | ≥ 70% |
| **"Minta soal lagi"** | Anak lanjut sesi berikutnya **tanpa disuruh** (bukti hukum desain Lapis 3 jalan) | Tren naik; catat kualitatif dari guru |

### Tingkat 1 — Indikator Belajar (anak beneran jadi bisa?) ⭐ paling penting

| Indikator | Cara ukur | Target draft |
|---|---|---|
| **Gain score** | Pre-test vs post-test per domain (mulai **Bilangan + Applying**) | Kenaikan jelas, mis. Cohen's *d* ≥ 0.5 (efek medium) atau +20–30% jawaban benar |
| Mastery per skill | % anak yang nyampe ambang mastery tiap skill | ≥ 80% dari yang nyelesain stage |
| **Pemulihan dari salah** | % anak yang awalnya salah → setelah dituntun → jawab soal penebusan **benar** | ≥ 70% |
| Turun takut matematika | Self-report sederhana (mis. skala 1–5 "seberapa takut matematika") sebelum vs sesudah | Turun ≥ 1 poin rata-rata |

### Tingkat 2 — Indikator Dampak (validasi di sekolah nyata)

| Indikator | Cara ukur | Target draft |
|---|---|---|
| **Pilot tervalidasi** | Minimal **1 sekolah**, pre-post test, punya angka gain yang bisa dibawa ke mana-mana | 1 pilot kelar dengan data bersih |
| Korelasi ke AKM/ANBK | Bandingin intensitas main ↔ skor latihan AKM | Korelasi positif terlihat |
| Adopsi guru/sekolah | Jumlah guru/sekolah yang pakai untuk meninjau siswa | Tumbuh dari 1 → beberapa |

### Tingkat 3 — Indikator Visi Besar (jangka panjang, jujur: di luar kendali penuh produk)

| Indikator | Cara ukur | Catatan |
|---|---|---|
| Jangkauan | Jumlah anak yang main | Makin luas makin bagus |
| Kontribusi ke numerasi nasional | Arah skor AKM/PISA di komunitas pengguna | **Indikator arah, bukan klaim sebab-akibat.** Banyak faktor lain main; jangan pernah ngaku "PISA naik karena Matheroes". |

---

## 5. Anti-tujuan (yang BUKAN tanda berhasil)

Sengaja ditulis biar nggak salah ngejar metrik yang kelihatan bagus tapi mengkhianati visi:

- ❌ **Lama main (engagement time)** bukan tujuan. Anak boleh berhenti cepat kalau udah paham.
- ❌ **Skor tinggi dari hafalan / asal cepat** tanpa paham — itu kegagalan yang nyamar jadi sukses.
- ❌ **Ranking kompetitif** yang bikin anak lemah makin minder.
- ❌ **Pemasukan dari anak.** Anak selalu gratis.
- ❌ **Banyak fitur "seru"** yang malah ngegeser matematika jadi pajak lagi.

---

## 6. Cara ukur (ringkas, buat dieksekusi)

- **Logging in-game:** event di localStorage — sesi dimulai/selesai, benar/salah per soal per skill, jumlah "soal penebusan", titik anak berhenti.
- **Instrumen pre-post:** set soal pendek per domain, dipakai sebelum & sesudah periode main. Mulai dari **Bilangan + Applying** dulu (paling ringan didesain, paling berdampak).
- **Protokol pilot:** 1 sekolah, kelompok kecil, periode tetap (mis. 2–4 minggu), pre-post + catatan kualitatif guru ("anak yang biasanya nyerah jadi gimana").
- **Self-report kecemasan:** skala 1–5 sederhana, anonim, sebelum & sesudah.

---

## 7. Cara pakai dokumen ini

- **Mau nambah fitur?** Cek dulu lolos 7 prinsip di Bagian 3 + bukan anti-tujuan Bagian 5.
- **Mau klaim "berhasil"?** Tunjuk angka di Bagian 4 — minimal Tingkat 1 harus ada datanya.
- **Mau cerita ke investor/sekolah?** Pakai framing Lapis 1–2, tapi yang dibuktikan pakai data Tingkat 1–2. Jangan over-claim Tingkat 3.

---

*Bagian Visi (1–3) langsung dari arah yang saya tetapkan. Bagian Indikator (4–6) adalah kerangka yang diusulkan — angka targetnya sengaja dibikin bisa dikoreksi setelah pilot.*
