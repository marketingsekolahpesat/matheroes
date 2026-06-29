# MATHEROES — Konteks Proyek & Status Kode

> **Dokumen ini ditulis ulang dari `matheroes.html` yang BENERAN jalan (~3421 baris, ~762KB, SAVE_KEY `matheroes-v2`).**
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
- ✅ **Layer pengukuran (ITEM 2) + Diagnosa v2** → **SELESAI (lokal + sync).** Identitas ringan (nama+kode kelas+id stabil); diagnosa **ADAPTIF** (pre=Prolog, post=Uji Kemampuan, algoritma sama → setara): tiap operasi skor = **level kemampuan** (no plafon) + **kelancaran** (detik, direkam diam-diam) + **nalar** (untimed) + ringkasan rata2; `menit_main`; rapor in-game; **sync Google Sheets** (Apps Script, `SYNC_URL`/localStorage, offline-first, 1 baris/anak per checkpoint). File: `Downloads\MATHEROES_AppsScript.gs`. Lihat §4, §15, §21.
- ✅ **Adaptif KELIMA operasi (ITEM 3)** — staircase ~80% per operasi (`S.player.adaptF[op]`, `genAdaptiveQ`, `ADAPT_BANDS`). Lihat §9.
- ✅ **Diagnosa cakup Pecahan (ITEM 4)** — pecahan ikut gelombang basic Diagnosa v2 → `pecahan_lvl/dtk` terisi + benih `adaptF.frac` dari diagnosa.
- ❌ Domain AKM lain (Geometri, Aljabar, Data) — belum ada. **Reasoning multi-langkah** (level PISA tinggi) — belum (konten lanjutan; adaptif menaikkan plafon kesulitan ANGKA, bukan level kognitif).

> **Pola kunci:** ITEM 1 (soal nalar) + ITEM 3 (adaptif) + Diagnosa v2/ITEM 4 → **kelima operasi SETARA & terukur** (kemampuan adaptif + kelancaran + nalar, pre/post). Sisa besar: domain AKM non-Bilangan & Reasoning multi-langkah.

- ✅ **THEMING Tahap A & B SELESAI (2026-06-29)** *(pass terpisah — detail di `MATHEROES_TEMA.md` + HANDOFF, bukan mekanik inti)*: nama hero sifat (Teguh/Bijak/Tangkas, id internal adira/kira/reno TETAP), label Wilayah·Nilai 8 Dimensi Profil Lulusan, musuh "disadarkan→jadi teman" (Makhluk Kebiasaan), Penjaga Wilayah (Tama/Wira/Bara/Bagas), **Bintang Karakter 8 Dimensi** (`S.meta.stars`), Lapis 2 Kesehatan/Penalaran naming. **ART FINAL WebP** (17 sprite base64 di-embed inline via `SPRITE_IMG`; `setSprite` image-first + fallback palette+rows). **Tidak menyentuh mekanik timer/adaptif/measurement.**

> **Backlog UI (catatan Daffa, BELUM dikerjakan):** tombol angka input sekarang **statik** (0–9) — gpp untuk sekarang. **Nanti** dibikin **dinamis** mengikuti tipe soal (mis. soal yang butuh simbol akar √ dll) supaya bisa nampung soal non-numerik murni. Bukan prioritas saat ini.

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

### 7b. MODE BERSERK (keputusan Daffa "timer LEMBUT" 2026-06-29)
Tiap musuh, saat HP **mau habis**, ditahan jadi 1 lalu **berserk**: lepas `BERSERK_N`=2 **soal nalar** (`genDefendQ`=AKM, ditandai `q.berserk`) yang harus ditangkis → **jaminan TIAP pertarungan ada soal bernalar**. Timer **LONGGAR** (`BERSERK_TIME`=28s; nalar butuh mikir; selalu nyala saat berserk meski skill belum mastered — pengecualian sadar yg disetujui Daffa, dibingkai bonus/drama bukan hukuman). **Salah/telat = `defendDamage` (bisa pulih, tak mematikan dari sehat) + Guide (dituntun), lalu lanjut** soal berikutnya. Semua nalar tuntas → `_showVictory` (musuh "disadarkan"). Kode di `G`: `_maybeBerserk` (intercept di `_handleAttackCorrect` & jalur jurus), `_startBerserk`, `_nextBerserkQ`, `_handleBerserkCorrect`/`_handleBerserkWrong`; state `E.berserk`/`E.berserkDone`; `startTimer(dur)` terima durasi (`timerTotal`). Jurus dinonaktifkan saat berserk. Verifikasi: `verify_timer_berserk.js` + `verify_flow.js`.

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
- **Benih awal** (`_finishTrial`): `adaptF.add` dari Ujian Kekuatan (presisi); `sub/mul/div/frac` dari **level kemampuan Diagnosa v2** (`pre.{op}_lvl`) — termasuk pecahan (ITEM 4). `ld()` migrasi save lama (bangun `adaptF`, `add` ikut `addLevelF`).
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

## 15. Diagnosa v2 — ADAPTIF & FLUENCY-AWARE (mesin `DG`, pre=Prolog & post=Uji, ALGORITMA SAMA → setara)

> Engine tunggal: `diagInit(mode)` → `diagGenQ`/`diagAnswer`/`diagFinished`/`diagResult`/`diagWaveLabel`. Konstanta: `DIAG_OPS=['add','sub','mul','div','frac']`, `DIAG_NALAR_OPS` (4), `DIAG_BASIC_PER_OP=4`, `DIAG_START_LVL=2`, `DIAG_TOTAL=24`. State global `DG` (DX/PX lama mati).

- **Gelombang BASIC adaptif** tiap operasi (incl. **pecahan**): mulai lvl 2, **benar → soal naik** (`genAdaptiveQ` + `ADAPT_BANDS`), salah → turun (clamp 1–6). **Skor = `maxLvl`** (level tertinggi yang dijawab benar = kemampuan, no plafon). **Kelancaran** = rata2 detik jawab BENAR, **direkam diam-diam** (`DG.startedAt=nowMs()`, tanpa countdown). 4 soal/op → ceiling teramati maks 5.
- **Gelombang NALAR** (`genDiagNalarQ`, `DIAG_NALAR_SID` tetap): 4 soal cerita AKM, **TANPA waktu** (mikir boleh lama). Skor = jumlah benar.
- `diagResult(DG)` → `{op}_lvl`, `{op}_dtk`, `nalar`, `rata_lvl`, `rata_dtk`.

1. **Prolog "Sang Legenda"** (`startPrologFight`→`_showProlog`/`submitProlog`/`_finishProlog`): 24 soal, 6 gelombang (➕➖✖️➗🍰 + 🧠 NALAR). `_finishProlog` → `recordDiag('pre', diagResult)` + head-start stat ∝ level tiap operasi + penempatan skill awal dari level.
2. **Ujian Kekuatan — KELIMA OPERASI** (keputusan Daffa "timer LEMBUT" 2026-06-29): `_startTrials`→`_showTrialQ`/`submitTrial`/`_nextTrialOp`/`_finishTrials`; `genTrialQOp(op,level)` (add=`genTrialQ`/`TRIAL_LEVELS`, lain=`genAdaptiveQ`/`ADAPT_BANDS`). Babak per operasi (`TRIAL_OPS`): add `TRIAL_N`=6, sub/mul/div/frac `TRIAL_N_OTHER`=3. "Timer" = **bar jendela-cepat** (`fastThreshold`, bonus kalau cepat — **BUKAN** timeout/hukuman → hormati VISI #5). Benih level tiap babak (`_trialSeed`): add dari penempatan Prolog, lain dari `pre.{op}_lvl`. `_finishTrials` benih `adaptF` dari **hasil Ujian Kekuatan tiap operasi** (`TR.results`, fallback level diagnosa). Label operasi via `trial-eyebrow`/`trial-ename`/`TRIAL_OP_META`. **Anti-kembar:** `genTrialQOpFresh`+`qKey`+set `TR.seen` (reset tiap babak) → soal tak berulang; diagnosa Prolog (`DG.seen`) & combat (`freshAttackQ`) juga dedup. **SKIP CERDAS:** operasi non-add yg anak LEMAH (`pre.{op}_lvl`≤`TRIAL_SKIP_LVL`=1) → layar `s-guardian` (`_offerGuardian`/`_guardianHelp`/`_tryAnyway`/`_trialWeak`, `trialGuardian` map op→Penjaga, frac=Pijar): pilih **minta Penjaga** (skip → `pre.{op}_lvl`=0 + benih `adaptF`=1 + narasi) ATAU **coba sendiri** (ujian jalan). Verifikasi: `verify_timer_berserk.js` 91/91 + `verify_flow.js` 26/26.
3. **Uji Kemampuan / POST-TEST** (`startPostTest`→`_showPost`/`submitPost`/`_finishPost`, layar `s-posttest`): `diagInit('post')` — engine **sama** → `recordDiag('post', …)` (run terbaru menang). Tombol peta "🎓 Uji Kemampuan & Rapor"; **tak menyentuh skill/stat/timer**. Rapor before/after di `s-measure` (`renderMeasure`): per topik Lv awal→akhir + ⏱ detik + nalar + ringkasan.

> **Plafon kesulitan ANGKA** dinaikkan (level 1–6) — bukan level kognitif. **Reasoning PISA multi-langkah = konten lanjutan**, belum ada.

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

## 21. Layer Pengukuran (ITEM 2 + Diagnosa v2 + ITEM 4) — peta kode

**Tujuan:** guru lihat kemampuan tiap anak naik/nggak, per topik (VISI Tingkat 1 — gain score).

**Sudah ada (LOKAL, offline-first):**
- **Identitas ringan:** input "Kode kelas" di `s-name` (`inp-kelas`); `S.student={id,kelas}`, `id` stabil (`genStudentId`, prefix `mh_`) = kunci. **Sync upsert by nama+kelas** (id disertakan).
- **Diagnosa v2 (lihat §15):** pre=`_finishProlog`→`recordDiag('pre', diagResult)`; post=`_finishPost`. Tiap topik: `{op}_lvl` (kemampuan adaptif, no plafon) + `{op}_dtk` (kelancaran detik, diam-diam) + `nalar` (untimed) + `rata_lvl`/`rata_dtk`. **Pecahan ikut** (ITEM 4).
- **Snapshot before/after:** `s-measure` (`renderMeasure`) — per topik Lv awal→akhir (+▲/▼) + ⏱ detik + nalar + ringkasan rata2 + `menit_main` + kode anak. `diagGain` = Σ kenaikan level + nalar.
- **Waktu main:** `startPlayClock` (`_startEnc`) + `accruePlay` (`_showVictory`/`_showBreak`/mastery/`goMap`). **Murni wall-clock — TIDAK menyentuh timer/kecepatan gameplay.**
- **`measureRow()`** = SATU baris flat: id,nama,kelas, `{topik}_lvl_awal/akhir`, `{topik}_dtk_awal/akhir` (5 topik incl. **pecahan**), `nalar_awal/akhir`, `rata_lvl_*`, `rata_dtk_*`, `total_gain`, `menit_main`, `sesi`, `terakhir`, `versi` — **payload POST**. `DIAG_NAMA` map op→nama Indonesia.
- **Migrasi:** `ld()` nambah `student`/`measure`/`adaptF`; `measure.dirty`/`lastSync`. renderMeasure deteksi pre format-lama (`add_lvl==null`) → minta mulai baru.
- **Verifikasi:** `_mh_verify/verify_item2.js` (69/69: engine adaptif, kelancaran, nalar, pecahan, measureRow v2, gain, migrasi) + `verify_item2_sync.js` (37/37) + `verify_item3.js` (67/67) + render Edge (frac wave, rapor v2).

**Sync Google Sheets — SELESAI (offline-first):**
- **`SYNC_URL`** (konstanta, dekat `SAVE_KEY` — **sudah diisi URL Web App Daffa**) ATAU override per-perangkat `localStorage['matheroes-sync-url']` (`SYNC_URL_KEY`) via tombol "🔗 Atur URL Sheet" di Rapor. `effectiveSyncUrl()` = override > konstanta.
- **`syncMeasure(force)`**: kirim `measureRow()` cuma kalau ada URL + `dirty` (atau `force`) + `isOnline()`. `fetch` **mode `no-cors` + `text/plain` + `keepalive`** (tanpa preflight; respons opaque → resolve = terkirim → `dirty=false`,`lastSync` set; reject/offline → tetap `dirty`, retry). **Bukan per jawaban** — dipanggil di **checkpoint**: `goMap()` (bila dirty), `_finishPost()`, tombol "☁️ Sinkron sekarang" (`G.syncNow`). `accruePlay()` set `dirty` → tiap sesi snapshot terbaru terkirim saat balik ke peta.
- **Apps Script** `Downloads\MATHEROES_AppsScript.gs`: `HEADER` kanonik **v2** (per topik `_lvl_awal/akhir` & `_dtk_awal/akhir`, incl. pecahan, + ringkasan `rata_*`); `doPost` upsert **by nama+kelas** (LockService anti-race), header auto-dibuat + auto-tambah kolom yg kurang; `doGet` status; opsi `TOKEN`. **⚠️ Setelah ganti skema v2, Daffa WAJIB re-paste `.gs` + redeploy (New version) + clear Sheet lama** biar header bersih.
- **Single-file tetap utuh**, game **penuh offline** tanpa URL. Status sync di panel Rapor (`syncStatusText`).

---

*Diperbarui 2026-06-29: ITEM 2 (pengukuran + sync Sheets), ITEM 3 (adaptif kelima operasi), Diagnosa v2 (adaptif/kelancaran/nalar) & ITEM 4 (diagnosa pecahan) SELESAI & terverifikasi; + THEMING Tahap A & B + ART FINAL WebP terintegrasi (kosmetik/naratif, tak menyentuh mekanik); + (sesi 2) **TIMER LEMBUT** keputusan Daffa: Ujian Kekuatan berwaktu KELIMA operasi (§15) + MODE BERSERK soal nalar (§7b) — verifikasi `verify_timer_berserk.js` 73/73 + `verify_flow.js` 17/17 + render Edge, harness lama no-regresi. Ditulis dari pembacaan langsung `matheroes.html`. Menggantikan CONTEXT.md basi sebelumnya.*
