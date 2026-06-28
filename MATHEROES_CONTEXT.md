# MATHEROES — Konteks Proyek & Status Kode

> **Dokumen ini ditulis ulang dari `matheroes.html` yang BENERAN jalan (2706 baris, SAVE_KEY `matheroes-v2`).**
> Versi CONTEXT sebelumnya sudah BASI (nulis "penjumlahan doang, Pijar tidak ada") — **buang yang lama, pakai ini.**
> Baca ini + `MATHEROES_VISI.md` + `MATHEROES_HANDOFF.md` sebelum menyentuh kode apa pun.

---

## 0. RINGKASAN STATUS (baca dulu sebelum yang lain)

Game ini **jauh lebih matang** dari yang diduga. Yang **sudah jalan**:

- ✅ **Kelima operasi Bilangan** (tambah, kurang, kali, bagi, pecahan) — 10 skill
- ✅ **Pijar** (companion) penuh: penamaan, tumbuh bertahap, reuni harian, petunjuk
- ✅ **Soal AKM/kontekstual saat bertahan** — **KELIMA operasi** (tambah/kurang/kali/bagi/pecahan) *(ITEM 1 selesai)*
- ✅ **Kesulitan adaptif (ZPD)** — TAPI **hanya untuk Penjumlahan**
- ✅ **Reaksi salah ramah anak** (Guide "yuk tebus" + breakdown CPA per operasi + soal tebusan)
- ✅ **XP berbasis usaha & rekor diri** (bukan kesulitan soal) — anti-sombong tertanam
- ✅ **"Adab → sistem"** ke-coding (Pijar nanamin akhlak subtil)
- ✅ Spaced repetition, mastery system, misi harian, koleksi monster, sprite pixel, SFX

Yang **BELUM ada / jadi GAP** (detail di §17 dan di HANDOFF):

- ✅ ~~Soal nalar untuk 4 operasi lain~~ → **SELESAI (ITEM 1):** kurang/kali/bagi/pecahan kini punya bank soal cerita AKM sendiri (lihat §7)
- ✅ **Layer pengukuran (ITEM 2)** → **SELESAI (lokal + sync).** Identitas ringan (nama+kode kelas+id stabil), baseline pre (prolog rekam skor per topik+nalar), post-test setara (tombol "Uji Kemampuan" di peta), snapshot before/after + `menit_main`, rapor in-game, **+ sync Google Sheets** (Apps Script Web App, `SYNC_URL`/localStorage, offline-first, 1 baris/anak per checkpoint). File Apps Script: `Downloads\MATHEROES_AppsScript.gs`. Lihat §4, §15, §21.
- ✅ **Adaptif KELIMA operasi (ITEM 3)** — staircase ~80% per operasi (`S.player.adaptF[op]`, `genAdaptiveQ`, `ADAPT_BANDS`). Lihat §9.
- ❌ Diagnosa belum nyentuh pecahan (ITEM 4) — kolom `pecahan_awal/akhir` dicadangkan tapi kosong
- ❌ Domain AKM lain (Geometri, Aljabar, Data) — belum ada

> **Pola kunci:** Setelah ITEM 1 (soal nalar) & ITEM 3 (adaptif), **kelima operasi sudah SETARA** — masing-masing punya soal AKM cerita **dan** kesulitan adaptif. Sisa pembeda: diagnosa pecahan (ITEM 4).

---

## 1. Apa itu Matheroes?

Game numerasi RPG **HTML single-file**, 100% offline (localStorage), mobile-first (max-width 440px). Anak SD–SMP belajar matematika lewat mechanic combat.

Hukum desain inti (dari VISI):
> **Jawaban benar = serangan. Matematika adalah aksinya, bukan pajak.**
> Kalau salah: bukan "SALAH!" merah — dipecah, dituntun, kasih soal tebusan.

---

## 2. Struktur File (`matheroes.html`)

```
<style>           — CSS variables + styling (dark RPG theme)
HTML screens      — ~18 screen, id "s-{name}", ditampilkan via show('name')
<script>
  CONSTANTS       — SAVE_KEY, TIMER_BASE(15), HEROES, JOBS, SKILL_DEFS, SKILL_ORDER,
                    COMPANION_STAGES, COMP_LINES, SPRITES, ADAB, *_TEMPLATES
  AUDIO           — SFX (WebAudio), toggleMute()
  STATE + COMPUTE — S (state), computeStats/MaxHP/MaxMana/Damage/Timer/MissChance
  COMPANION       — compStage, addBond, companionSay, checkNewDay (Pijar)
  NARASI/MISI     — genDailyMissions, rekor-diri (M7), ADAB (M8), koleksi/treasure
  STATE FACTORY   — blankState(), blankSkill(), sv()/ld() (+ migrasi save)
  QUESTION ENGINE — genQ, genHardQ, genAttackQ, genAddAkmQ, genDefendQ, qText
  ENCOUNTER       — startEncState, shouldDefendTurn, render*, timer
  RECORD+MASTERY  — recordAnswer, checkMastery, scheduleReview, checkJobUp
  GUIDE           — buildGuideVisual, guideHint, genRedeemQ, renderGuide
  MAP/STATS       — renderMap, renderMastery, renderStats, renderCollection
  DIAGNOSIS       — genPrologQs (16 soal), Ujian Kekuatan (genTrialQ, adaptif berwaktu)
  ADAPTIVE        — addPlayLevel, adaptAddDifficulty (M5, Penjumlahan)
  REWARD          — answerRewards (M6, usaha & rekor)
  G = { ... }     — controller (semua action, ~600 baris)
  BOOT            — ld() + show('intro')
```

---

## 3. Game Flow (urutan layar — AKURAT)

```
intro → name → prolog-intro → prolog (DIAGNOSA: 16 soal, 4 gelombang ➕➖✖️➗)
   → trial (UJIAN KEKUATAN: penjumlahan adaptif + berwaktu, 6 soal)
   → diagresult → hero select → buddy (kasih nama Pijar)
   → teach (CPA 3 langkah) → map
                              ↓
        encounter (serang/bertahan) ←→ guide (kalau salah → tebus)
                              ↓
         victory / mastery / break(HP habis) → jobup (setelah 2 skill mastered)
                              ↓
                    stats / collection (layar terpisah)
```

---

## 4. State Model (`S`) — dari `blankState()`

```javascript
S = {
  player:{
    name, hero:'adira'|'kira'|'reno', level, jobLevel, job:'ksatria'|'penyihir'|'pemanah'|null,
    hp, mana,
    companion:{ name:'Pijar', bond:number },          // bond → tahap Pijar
    statXP:{ kuat, tegar, pintar, gesit },            // 10 XP = 1 level stat
    adaptF:{add,sub,mul,div,frac}, // (ITEM 3) tingkat kesulitan adaptif per operasi (float 1–6); addLevelF=cermin add (legacy)
    effort:number,       // (M6) total percobaan, buat reward usaha
    records:{ bestStreak }
  },
  skills:{
    [skillId]:{ status:'locked'|'learning'|'accurate'|'mastered',
                accuracyRecent, streak, attempts, correct,
                nextReviewSession, reviewInterval, sessionAnswers:bool[10] }
  },
  session:{ count },
  meta:{ lastDay, dayStreak, totalDays, firstWinDay, missions:[], missionDay },
  collection:{ monsters:{}, treasures:{} },
  student:{ id:string, kelas:string },               // (ITEM 2) identitas ringan; id stabil = kunci 1 baris/anak
  measure:{                                           // (ITEM 2) layer pengukuran — LOKAL
    pre:  { tambah,kurang,kali,bagi,nalar, ts } | null,   // baseline dari Prolog (sekali, tak ditimpa)
    post: { tambah,kurang,kali,bagi,nalar, ts } | null,   // dari "Uji Kemampuan" (run terbaru menang)
    playSeconds:number, dirty:boolean                      // dirty = ada perubahan belum ter-sync
  },
  diagDone:boolean,
  currentSkill:string
}
```

> **Layer pengukuran (ITEM 2) — STATUS:** skor diagnosa **kini DIREKAM** (`measure.pre`/`measure.post`, tiap topik 0–`DIAG_MAX`=4 benar + `nalar`). Helper di section **MEASUREMENT** (setelah `ld()`): `genStudentId`, `recordDiag('pre'|'post')`, `diagGain()`, `measureRow()` (baris snapshot siap-sync), `startPlayClock()`/`accruePlay()` (waktu main, **tak memengaruhi gameplay/timer**), `syncMeasure()`/`effectiveSyncUrl()`/`syncStatusText()` (sync best-effort ke Sheets). `ld()` punya migrasi: save lama otomatis dapat `student.id` + `measure` kosong (baseline lama tak bisa dipulihkan — mulai baru utk baseline). **Sync Google Sheets AKTIF** (lihat §21).

---

## 5. Storage

- `SAVE_KEY = 'matheroes-v2'`, `sv()` = simpan, `ld()` = muat.
- `ld()` punya **migrasi**: nambah field yang hilang (skill baru, statXP, companion, meta, collection) biar save lama nggak rusak. **Pertahankan pola ini** tiap nambah field state.
- localStorage murni. **Jangan** ganti ke IndexedDB/server tanpa keputusan eksplisit.

---

## 6. Skill & SKILL_DEFS (10 skill, semua domain Bilangan)

`SKILL_ORDER` (urutan linear, tiap mastered buka berikutnya):
```
add_0_10 → add_0_20 → add_0_100 → sub_0_20 → sub_0_100
→ mul_1_5 → mul_1_10 → div_1_5 → div_1_10 → frac_simple
```

| group | skill | op | stat tumbuh |
|---|---|---|---|
| Penjumlahan | add_0_10/20/100 | add | KUAT 💪 |
| Pengurangan | sub_0_20/100 | sub | TEGAR 🛡️ |
| Perkalian | mul_1_5/10 | mul | PINTAR ✨ |
| Pembagian | div_1_5/10 | div | PINTAR ✨ |
| Pecahan | frac_simple (½,⅓,¼ dari jumlah) | frac | PINTAR ✨ |

**Mastery (di `checkMastery`):**
- `learning → accurate`: `accuracyRecent ≥ 0.85` **dan** `streak ≥ 3` → **timer NYALA**
- `accurate → mastered`: `accuracyRecent ≥ 0.9` **dan** `streak ≥ 5` **dan** `correct ≥ 8` → level up, buka skill berikutnya, jadwalkan review
- Job up: setelah `jobLevel ≥ 2` (2 skill dikuasai)

---

## 7. Question Engine — sistem TIER & asimetris (penting)

Soal punya `tier`:
- **`ringan`** = giliran SERANG (kita nyerang) → fluency, lebih mudah
- **`akm` / `berat`** = giliran BERTAHAN (musuh nyerang) → menantang/bernalar

Generator:
- `genQ(sid)` — soal dasar `a OP b` (semua operasi)
- `genHardQ(sid)` — range ~30% lebih besar (kini hanya dipakai jurus/`useSkill`)
- `genAttackQ(sid)` — **Penjumlahan ikut tingkat adaptif (M5)**; operasi lain = `genQ`
- `{ADD,SUB,MUL,DIV,FRAC}_AKM_TEMPLATES` + `gen{Add,Sub,Mul,Div,Frac}AkmQ` — **bank soal cerita AKM per operasi** (jawaban tetap ANGKA → cocok input & guide)
- `genAkmQ(sid)` — **dispatcher** pilih generator AKM sesuai operasi
- `genDefendQ(sid)` = `genAkmQ(sid)` — bertahan: **KELIMA operasi → soal cerita bernalar**
- `genRedeemQ(missed)` — tebusan: AKM → `genAkmQ` (operasi SAMA), ringan → `genQ`

> ✅ **Gap #2 (VISI) TERATASI — ITEM 1:** kelima operasi punya soal AKM kontekstual saat bertahan (konteks: personal, sosial-budaya, saintifik). Isyarat per operasi: kurang=ambil/sisa/selisih, kali=kelompok sama, bagi=dibagi rata/dikelompokkan, pecahan=pecahan-satuan dari jumlah. Anak menalar OPERASI mana, bukan sekadar hitung. **Sisa:** level `Reasoning` multi-langkah & domain non-Bilangan.

---

## 8. Sistem Stat (RPG)

| Stat | Tumbuh dari | Efek (formula) |
|---|---|---|
| KUAT 💪 | jawab serang benar | damage = `3 + kuatLv/2` |
| TEGAR 🛡️ | jawab bertahan benar | maxHP = `20 + tegarLv*5` |
| PINTAR ✨ | kali/bagi/pecahan benar | maxMana = `15 + pintarLv*5`, miss% = `30 − pintarLv` |
| GESIT ⚡ | jawab cepat (sisa waktu > ½) | timer = `15 + gesitLv/2` |

- 10 statXP = 1 level stat. Hero awal kasih bonus (Adira: kuat, Kira: pintar, Reno: gesit).
- **Damage bertahan saat salah** (`defendDamage`): moderat (~13–18% maxHP), **bisa pulih, nggak mematikan dari kondisi sehat** (sisakan min 1 HP).
- **Menang heal** ~25% maxHP → kesalahan bisa ditebus dengan terus maju.

---

## 9. Kesulitan Adaptif — M5 / ITEM 3 (KELIMA OPERASI)

- Tingkat adaptif **per operasi** di `S.player.adaptF={add,sub,mul,div,frac}` (float 1–6). `addLevelF` lama tetap dijaga sebagai cermin `adaptF.add` (back-compat).
- `adaptDifficulty(op, correct)`: staircase berbobot menuju **~80% benar** (zona belajar). Benar `+0.2`, salah `−0.8`. Dipanggil di `recordAnswer` **hanya dari SERANGAN RINGAN** (sinyal kemampuan), semua operasi.
- `playLevel(op)` pakai **floor** (bukan round) → anak bertahan di tingkat mudah lebih lama = **ramah anak lemah**.
- `genAdaptiveQ(op,level,sid)` bangun soal `tier:'ringan'` pada tingkat itu; rentang per tingkat di **`ADAPT_BANDS`** (sub=maxA, mul/div=maxFactor, frac=maxDen/maxK; add tetap pakai `genTrialQ`/`TRIAL_LEVELS`). `genAttackQ(sid)` = `genAdaptiveQ(op, playLevel(op), sid)` untuk **semua** operasi.
- **Benih awal** (`_finishTrial`): `adaptF.add` dari Ujian Kekuatan (presisi); `sub/mul/div` dari skor Prolog (0–4 → lvl 1–5); `frac` mulai lembut (2, belum didiagnosa → ITEM 4). `ld()` migrasi save lama (bangun `adaptF`, `add` ikut `addLevelF`).
- **Catatan**: seperti Penjumlahan, tingkat span seluruh operasi (mis. mastery `mul_1_5` praktis perlu tahan sampai faktor besar) — konsisten dgn desain add. **TIDAK menyentuh timer/kecepatan.**

---

## 10. Reward Usaha & Rekor Diri — M6/M7

- XP dari: **mencoba** (tiap 10 percobaan, `💗 Semangat berlatihmu tumbuh!`), **menebus** setelah salah, **mecahin rekor streak sendiri**, **milestone mastery**.
- M7: bandingin anak dengan **dirinya kemarin** (`🎉 Kamu lampaui dirimu kemarin!`). **Bukan** ranking antar-anak. → VISI #9.

---

## 11. Pijar (Companion)

- Dinamai anak (default "Pijar"). Tumbuh via **bond** (`COMPANION_STAGES`): 🥚 Telur Semangat → ✨ Pijar Kecil → 🔥 Pijar → ☄️ Pijar Agung → 🌟 Pijar Legenda.
- Bond naik dari: main, menang, **reuni harian** (`checkNewDay` → +2 bond, streak harian LEMBUT tanpa hukuman).
- `COMP_LINES`: reaksi benar/salah — **reaksi salah SELALU nyemangati** ("Nggak apa-apa, coba lagi!", "Aku percaya kamu bisa!"). Muncul sebagai gelembung di arena + petunjuk di Guide.

---

## 12. Adab dalam Sistem — M8

- `ADAB` + `maybeAdab`/`pijarSays`: Pijar nanamin akhlak **subtil, sesekali** (pakai cooldown `_adabCD` biar nggak menggurui). Termasuk anti-sombong ("Juara yang baik bikin teman ikut semangat, bukan minder").
- Ini implementasi langsung filosofi **"adab → sistem"**. **Jaga nada: tidak menggurui.**

---

## 13. Guide / Scaffold (alur jawaban SALAH)

Saat salah → layar `s-guide`:
1. **Petunjuk 1-baris dari Pijar** (`guideHint`) — spesifik per operasi (mis. "Mulai dari {a}, ambil {b} → sisanya {ans}").
2. **Breakdown CPA visual** (`buildGuideVisual`) — tersembunyi default, bisa dibuka ("Lihat caranya 👁️") atau di-skip. Spesifik per operasi: pecah nilai-tempat (add/sub besar), pengelompokan (kali/bagi), partisi (pecahan).
3. **Soal tebusan** (`genRedeemQ`) — serupa, **tier sama** (AKM→AKM, ringan→ringan).
4. Mode "Kenapa? 🤔" — anak penasaran bisa lihat penjelasan walau nggak salah.

> Scaffold-nya **kuat & spesifik per operasi**. Yang belum: **diagnosa kesalahan spesifik anak** (nebak miskonsepsi dari jawaban salah yang dia masukin) — itu refinement, bukan gap besar.

---

## 14. Spaced Repetition

- `scheduleReview`: interval gandakan `1 → 2 → 4 → 7` sesi (cap 7). `dueReviews` munculin skill mastered yang due. Berbasis `session.count`.

---

## 15. Diagnosa (instrumen pre/post SETARA — `genDiagSet`)

> **(ITEM 2)** Pre (prolog) & post (Uji Kemampuan) tarik dari **satu generator** `genDiagSet()` → kesulitan dijamin setara (soal beda, bobot sama). 20 soal: 16 `phase:'knowing'` + 4 `phase:'nalar'`. `diagScores(qs,res)` → skor per topik + nalar.

1. **Prolog "Sang Legenda"** (`genDiagSet` = `genPrologQs` 16 knowing + 4 nalar cerita): **20 soal, 5 gelombang** — knowing add/sub/mul/div (4 tiap, makin sulit) + **🧠 JURUS NALAR** (1 soal cerita/operasi, sid TETAP `DIAG_NALAR_SID` → non-adaptif). `_finishProlog` → `recordDiag('pre', …)` (**baseline kini DISIMPAN**) + head-start stat dari knowing saja. ⚠️ **Belum nyentuh pecahan** (ITEM 4).
2. **Ujian Kekuatan** (`genTrialQ`, adaptif berwaktu, `TRIAL_N=6`): khusus Penjumlahan, staircase (benar-cepat +2, benar-lambat +1, salah −1). "Kekuatan = benar DAN cepat." *(mekanik berwaktu — zona keputusan Daffa, jangan diutak-atik.)*
3. **Uji Kemampuan / POST-TEST** (`startPostTest`→`_showPost`/`submitPost`/`_finishPost`, layar `s-posttest`): instrumen `genDiagSet` yang **sama** → `recordDiag('post', …)` (run terbaru menang). Tombol di peta "🎓 Uji Kemampuan & Rapor"; **tak menyentuh skill/stat/timer** (murni ukur). Rapor before/after di `s-measure` (`renderMeasure`).

---

## 16. Lain-lain

- **Misi harian** (`genDailyMissions`, pool acak), **koleksi monster + treasure** (sprite pixel, shiny 10%), **SFX** WebAudio (mute toggle), **welcome screen** harian (sambutan + progres kemarin).

---

## 17. MAPPING AKM — Status TERKINI

| Domain AKM | Status | Catatan |
|---|---|---|
| **Bilangan** | ✅ **Lengkap** | 5 operasi (tambah/kurang/kali/bagi/pecahan) |
| **Geometri & Pengukuran** | ❌ | Belum ada |
| **Aljabar** | ❌ | Belum ada |
| **Data & Ketidakpastian** | ❌ | Belum ada |

| Level Kognitif | Status | Catatan |
|---|---|---|
| **Knowing** | ✅ | Semua soal `ringan` (serang) |
| **Applying** | ✅ | Soal AKM cerita untuk **kelima operasi** (ITEM 1) — `*_AKM_TEMPLATES` + `genAkmQ` |
| **Reasoning** | ❌ | Belum ada soal inferensi/analisis multi-langkah |

| Konteks | Status |
|---|---|
| Personal | ✅ kelima operasi (mainan, baca, kelas) |
| Sosial-budaya | ✅ kelima operasi (toko, bagi-bagi, tim, lomba) |
| Saintifik | ✅ liter air, cm pita/tali (template kurang/bagi/pecahan) |

---

## 18. Konvensi Kode

- JS camelCase, CSS/HTML kebab-case. Screen id `s-{name}`, tampil via `show('name')`.
- Skill id `{op}_{range}` (mis. `mul_1_5`). Setelah ubah `S`, panggil `sv()`.
- **No dependencies** — pure vanilla JS. **Single file** kecuali keputusan eksplisit.

---

## 19. JANGAN Diubah Tanpa Diskusi

1. **Single-file + offline-first** (localStorage) — fitur, bukan keterbatasan.
2. **Mobile-first** (max-width 440px).
3. **Dark RPG theme** (CSS variables).
4. **CPA teach** (concrete → pictorial → abstract).
5. **Hukum "jawaban = aksi"** + **"salah ≠ hukuman"** + **"adab → sistem"** — ini prinsip VISI, jangan dilanggar demi fitur.
6. **Reaksi salah selalu menyemangati** (jangan pernah bikin "SALAH!" yang nakutin).

---

## 20. Konteks Proyek

- **Pembuat:** Daffa Fauzan — Direktorat Pendidikan, Yayasan Pesat Birrul Walidain, Bogor (dibangun bareng Rizky via Claude Code).
- **Target:** siswa SD–SMP (7–15) + guru. **Visi:** naikin numerasi Indonesia (~82% di bawah standar PISA).
- **Stack:** HTML + CSS + Vanilla JS, single file, no build, no server.

---

## 21. Layer Pengukuran (ITEM 2) — peta kode & SISA KERJA

**Tujuan:** guru lihat kemampuan tiap anak naik/nggak, per topik (VISI Tingkat 1 — gain score).

**Sudah ada (LOKAL, offline-first):**
- **Identitas ringan:** input "Kode kelas" di layar `s-name` (`inp-kelas`); `S.student={id,kelas}`. `id` stabil (`genStudentId`, prefix `mh_`) = kunci 1 baris/anak saat sync.
- **Baseline (pre):** `_finishProlog` → `recordDiag('pre',…)` (sekali, tak ditimpa). Skor tiap topik 0–4 + `nalar` 0–4.
- **Post-test setara:** layar `s-posttest`, instrumen `genDiagSet` yang **sama** dgn prolog → `recordDiag('post',…)`. Tombol peta "🎓 Uji Kemampuan & Rapor" (`openMeasure`→`s-measure`; jalankan via `startPostTest`).
- **Snapshot before/after:** `s-measure` (`renderMeasure`) tampilkan awal→akhir + gain per topik, total gain (`diagGain`), `menit_main`, kode anak.
- **Waktu main:** `startPlayClock` (di `_startEnc`) + `accruePlay` (di `_showVictory`/`_showBreak`/mastery/`goMap`). **Murni akuntansi wall-clock — TIDAK menyentuh timer/kecepatan gameplay.**
- **`measureRow()`** = SATU baris flat (id, nama, kelas, `{topik}_awal/akhir`, `nalar_awal/akhir`, `total_gain`, `menit_main`, `sesi`, dst) — **payload yang di-POST.** Kolom `pecahan_awal/akhir` dicadangkan kosong (nunggu ITEM 4).
- **Migrasi:** `ld()` nambah `student`/`measure` ke save lama; `measure.dirty` nandai ada data belum ter-sync; `measure.lastSync` = timestamp sukses.
- **Verifikasi:** `_mh_verify/verify_item2.js` (48/48: genDiagSet, kesetaraan pre/post, diagScores, recordDiag, measureRow, gain, migrasi) + `verify_item2_sync.js` (37/37: sync) + render Edge (name/prolog-nalar/measure/map/enc/sync).

**Sync Google Sheets — SELESAI (offline-first):**
- **`SYNC_URL`** (konstanta, dekat `SAVE_KEY`, default kosong) ATAU override per-perangkat `localStorage['matheroes-sync-url']` (`SYNC_URL_KEY`) via tombol "🔗 Atur URL Sheet" di Rapor. `effectiveSyncUrl()` = override > konstanta.
- **`syncMeasure(force)`**: kirim `measureRow()` cuma kalau ada URL + `dirty` (atau `force`) + `isOnline()`. `fetch` **mode `no-cors` + `text/plain` + `keepalive`** (tanpa preflight; respons opaque → resolve = terkirim → `dirty=false`,`lastSync` set; reject/offline → tetap `dirty`, retry). **Bukan per jawaban** — dipanggil di **checkpoint**: `goMap()` (bila dirty), `_finishPost()`, tombol "☁️ Sinkron sekarang" (`G.syncNow`). `accruePlay()` set `dirty` → tiap sesi snapshot terbaru terkirim saat balik ke peta.
- **Apps Script** `Downloads\MATHEROES_AppsScript.gs`: `doPost` upsert **by nama+kelas** (LockService anti-race), header **auto-dibuat** (langkah 8 panduan jadi opsional) + auto-tambah kolom kanonik yg kurang; `doGet` = cek status; opsi `TOKEN`. Daffa deploy sebagai Web App "Anyone" → tempel URL.
- **Single-file tetap utuh**, game **penuh offline** tanpa URL. Status sync tampil di panel Rapor (`syncStatusText`).

---

*Diperbarui Juni 2026: ITEM 2 (pengukuran + sync Sheets) & ITEM 3 (adaptif kelima operasi) SELESAI & terverifikasi. Ditulis dari pembacaan langsung `matheroes.html`. Menggantikan CONTEXT.md basi sebelumnya.*
