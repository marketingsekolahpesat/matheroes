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

### 8b. KEKUATAN KHAS HERO (mekanik, Tahap B SELESAI 2026-06-29)
`HEROES[h].power={name,emoji,desc}` — pasif, tampil di kartu pilih hero, intro toast `confirmHero`, & Profil (`stats-power` di `renderStats`).
- **Teguh (adira) "Pantang Mundur"** — `_pantangMundur()` (state `E.pantangUsed`): sekali/tarung, saat HP mau habis → tahan di `max(3, 15% maxHP)` + toast + Bintang `mandiri`, bukan tumbang. Hook: `_handleDefendWrong` & `_handleBerserkWrong` (`if(S.player.hp<=0 && !G._pantangMundur())`).
- **Bijak (kira) "Pikiran Jernih"** — `bijakTimeMult()`=1.5: timer soal bertahan (`_startDefendTurn`) & berserk (`_nextBerserkQ`) ×1.5; + `BIJAK_CUE[op]` isyarat ekstra di `renderQuestion` (label akm).
- **Tangkas (reno) "Semangat Bersama"** — `heroStreakBonus()`=`min(5, floor(streak/3))` ditambah ke damage di `_handleAttackCorrect`; `addBond` ×1.5 (Pijar tumbuh cepat).
Default hero lain = 0/×1 (no-regresi). Tak ada state save baru (derive dari `S.player.hero`; `E.pantangUsed` volatil). Verif: `verify_timer_berserk.js` (§1f) + `verify_flow.js` (§H).

## 9. Kesulitan Adaptif — M5 / ITEM 3 (KELIMA OPERASI)

- Tingkat adaptif **per operasi** di `S.player.adaptF={add,sub,mul,div,frac}` (float 1–6). `addLevelF` lama tetap dijaga sebagai cermin `adaptF.add` (back-compat).
- `adaptDifficulty(op, correct)`: staircase berbobot menuju **~80% benar** (zona belajar). Benar `+0.2`, salah `−0.8`. Dipanggil di `recordAnswer` **hanya dari SERANGAN RINGAN** (sinyal kemampuan), semua operasi.
- `playLevel(op)` pakai **floor** (bukan round) → anak bertahan di tingkat mudah lebih lama = **ramah anak lemah**.
- `genAdaptiveQ(op,level,sid)` bangun soal `tier:'ringan'` pada tingkat itu; rentang per tingkat di **`ADAPT_BANDS`** (sub=maxA, mul/div=maxFactor, frac=maxDen/maxK; add tetap pakai `genTrialQ`/`TRIAL_LEVELS`). `genAttackQ(sid)` = `genAdaptiveQ(op, playLevel(op), sid)` untuk **semua** operasi.
- **Benih awal** (`_finishTrial`): `adaptF.add` dari Ujian Kekuatan (presisi); `sub/mul/div/frac` dari **level kemampuan Diagnosa v2** (`pre.{op}_lvl`) — termasuk pecahan (ITEM 4). `ld()` migrasi save lama (bangun `adaptF`, `add` ikut `addLevelF`).
- **Catatan**: seperti Penjumlahan, tingkat span seluruh operasi (mis. mastery `mul_1_5` praktis perlu tahan sampai faktor besar) — konsisten dgn desain add. **TIDAK menyentuh timer/kecepatan.**

### 9b. KESULITAN SISTEMATIS — OPSI 2 (keputusan guru senior via Daffa 2026-07-08)
Guru senior yang menguji lapor kesulitan "mudah–susah–mudah" (tidak sistematis). Akar (terkonfirmasi): giliran **serang** = soal adaptif ringan se-level anak (mudah), tapi giliran **bertahan** (`genAkmQ`) ambil angka dari **maksimum SKILL** (sengaja "condong ke paruh atas → berat"), **tak ikut level anak** → lonjakan susah yang terasa acak. **Opsi 2 dipilih:** seragamkan ke SATU tingkat yang naik pelan & rata.
- **Perbaikan:** `gen*AkmQ(sid, level)` kini terima **`level` opsional** — kalau ada, angka diambil dari band level adaptif (`TRIAL_LEVELS`/`ADAPT_BANDS`, sama dengan soal serang); tanpa `level` = perilaku max-skill lama. `genAkmQ(sid, level)` teruskan ke tiap generator (8 op: add/sub/mul/div/frac/geo/int/dec).
- **Satu tingkat per fight:** `startEncState` KUNCI `E.level=playLevel(op)` di awal (soal pertama dibuat SETELAH E.level di-set). `genAttackQ` **dan** `genDefendQ` **dan** `genRedeemQ` pakai `(E&&E.level!=null)?E.level:…` → serang, bertahan, berserk, tebusan **semua se-level**. Level naik bertahap ANTAR-fight lewat staircase `adaptDifficulty` yang sudah ada (tak diubah → "naik pelan & rata").
- **Diagnosa TAK berubah:** `genDiagNalarQ` panggil `genAkmQ(DIAG_NALAR_SID[op])` **tanpa level** → instrumen pre/post tetap konsisten (validitas ukur terjaga). Timer/berserk timing TAK disentuh (cuma difficulty soal yang ikut level).
- **Story problems DIPERTAHANKAN** (di-level, bukan dihapus) → variasi & nalar tetap; kalau mau kurangi frekuensi bertahan-AKM, tinggal `ENEMY_SKILL_EVERY`/`shouldDefendTurn` (belum diubah).
- Verifikasi: **`verify_systematic.js` 32/32** (angka AKM masuk band tiap level 1–6, monoton naik, E.level wiring, "no lonjakan" serang=bertahan≤band, startEncState kunci level, diagnosa tetap) + harness lama no-regresi (2 asersi teks-sumber `genDefendQ`/`genAttackQ` + 3 dispatch geo/int/dec diupdate ke bentuk baru) + render Edge (encounter anak lemah → `8−6`, E.level=2). Backup `_mh_verify/matheroes_pre_sistematis.html`.

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

> Scaffold-nya **kuat & spesifik per operasi**. ✅ **ITEM 5 SELESAI** — `diagnoseMistake(q,v)` nebak miskonsepsi dari **angka salah anak** (add: lupa simpan/`digitsNoCarrySum`; sub: kebalik/`digitsAbsDiff`→pinjam; mul: jadi tambah/kelompok ±1; div: jadi kali/kurang; frac: dikali penyebut/jawab jumlah/penyebut) → 1 kalimat Pijar lembut sebelum `guideHint`. Wired via `E.lastWrong` (`submitEnc`→set, `timedOut`→null, `renderGuide`→`renderExplain(q,wrong)`). Benar/ngawur-jauh/timeout → null (generik, tak salah-tuduh). Verif `verify_item5.js` 27/27.

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

### 15b. SKIP DIAGNOSA + HADIAH GEAR (keputusan Daffa 2026-06-29)
Tiap soal Prolog ada tombol **"🤔 Belum bisa, lewati"** (`skipProlog`): skip = `diagAnswer(DG, NaN)` → **dihitung 0** (jujur, level tak naik, `DG.skipped++`) TAPI **serangan tetap kena musuh** (anim-hit + floatDmg kecil → progress jalan, nggak nge-stuck; toast hangat "nanti kita pelajari bareng"). **Baseline TETAP utuh** (diagnosa nggak optional, cuma per-soal skip). **HADIAH GEAR** (`S.player.gear`: `none|biasa|legendaris`, `GEAR_TIERS`): hargai **USAHA bukan benar/salah** → di `_finishProlog`: **0 skip → `legendaris`** (+3 dmg, +15 HP), ada skip → `biasa` (+1 dmg, +5 HP). Bonus diterapkan via `gearObj(st)` di `computeMaxHP`/`computeDamage` (default none = 0). Tampil di Profil (`renderStats`) + reveal di layar hasil diagnosa (`dr-gear` di `_renderDiagResult`). Diinfoin di awal (`s-prolog-intro`). Migrasi `ld()`: save lama → `gear='none'`. Verifikasi: `verify_timer_berserk.js` + `verify_flow.js` (§F/§G).

### 15c. SKOR POIN — gabungan BENAR-SALAH + WAKTU (keputusan Daffa 2026-07-08)
Ganti tampilan headline rapor dari "Level 4/3" jadi **SKOR poin** (Daffa: *"daripada nilainya 4 3, lebih [baik] gabungan benar-salah + waktu; gpp semuanya diwaktukan biar sama; tidak ada negatif sama sekali"*). Prinsip **DIKUNCI: SELALU POSITIF** (hormati anak takut matematika + VISI #5 — kecepatan cuma BONUS di atas kebenaran, bukan syarat/hukuman). `skorSoal(correct,dtk)` (dekat `diagInit`): benar & cepat (≤`SKOR_CEPAT`=3s)=`SKOR_MAX`=5000; benar makin lambat → turun linear ke `SKOR_DASAR`=2000 (di ≥`SKOR_LAMBAT`=15s / waktu habis); benar tapi waktu tak terukur=3500; **salah/skip=`SKOR_SALAH`=100** (kecil tapi tetap NAMBAH). `fmtSkor` = ribuan pakai titik (gaya ID). `diagAnswer` akumulasi `acc.skor` (basic) & `DG.nalar.skor` (nalar kini **ikut diwaktukan tapi HANYA bonus**); waktu tiap soal `el` dihitung sekali dari `DG.startedAt` (di-set per soal di `_showProlog`/`_showPost`, basic & nalar). `diagResult` keluarkan `{op}_skor`, `nalar_skor`, `total_skor` (= Σ op + nalar) **di samping** `{op}_lvl` lama (level TETAP → benih adaptif tak berubah). `skorGain()` = kenaikan `total_skor` awal→akhir (headline; fallback ke `diagGain` level kalau baseline format lama tanpa `total_skor`). `measureRow` + kolom `{topik}_skor_awal/akhir`, `nalar_skor_*`, `total_skor_*`. **`renderMeasure`**: SKOR jadi angka utama (baris fleksibel `flex-wrap` anti-terpotong di HP sempit), level+detik jadi detail kecil, + baris **🏆 SKOR TOTAL**; `_renderDiagResult` banner "Skor Awalmu". **Apps Script HEADER** (`MATHEROES_AppsScript.gs`, Downloads+repo) + kolom skor → **⚠️ Daffa WAJIB re-paste `.gs` + redeploy (New version)** biar skor masuk Sheet; **kolom lama aman, TAK perlu clear Sheet** (auto-append). Verifikasi: **`verify_skor.js` 56/56** (kurva 5000/3500/2000/100, invarian selalu-positif & benar>salah [VISI #5], total=Σop+nalar, measureRow, skorGain, migrasi) + harness lama no-regresi + render Edge (rapor pre→post). Backup `_mh_verify/matheroes_pre_skor.html`.

### 15d. ROBUSTNESS BOOT — layar Memuat + jaring-pengaman browser jadul (2026-07-11)
Menyerang **isu #2** ("gak bisa di HP/browser lain") dari sisi yang bisa dikerjakan TANPA menunggu info penguji: sebelumnya kalau file (~800KB) lambat diunduh **atau** script gagal parse di browser tua → **layar putih tanpa penjelasan**.
- **Layar Memuat** `#boot-loading`: **HTML+CSS murni** (BUKAN script baru → `<script>` game tetap yang pertama, aturan harness aman), ditaruh **paling atas `<body>`** → ke-paint duluan saat file masih streaming. CSS pakai **warna hardcoded tanpa `var()`/fitur baru** biar tetap tampil di browser tua. Spinner + "Memuat petualangan…".
- **BOOT sukses** (ujung script game, setelah `attachNumpads`/style): `window.__mhBooted=1` + `#boot-loading` di-`display:none` (dibungkus try/catch).
- **Jaring pengaman** = `<script>` **SETELAH script game** (sebelum SW; harness tetap baca script game): IIFE **JS lawas** (`var`/`function`/`setTimeout`, TANPA arrow/`?.`/`let`/`const`) → tetap jalan walau script game **gagal parse** di browser tua. `setTimeout(fallback, 9000)`: kalau `!window.__mhBooted` → ganti isi overlay jadi pesan ramah 😕 "Matheroes belum kebuka" + saran (cek koneksi / **Chrome versi terbaru**) + tombol **Coba Lagi** (`location.reload`). Guard `if(!el || window.__mhBooted) return` → tak ganggu kalau game keburu boot (mis. jaringan lambat lalu berhasil di detik ke-10 → BOOT tetap menyembunyikan overlay).
- Menangani DUA kasus sekaligus tanpa perlu membedakannya: jaringan lambat & browser jadul.
- Verifikasi: **`verify_robust.js` 14/14** (overlay ada, BOOT tandai+sembunyikan, watchdog JS-lawas & tak ganggu, **script pertama tetap script GAME**, overlay sebelum script, SW tetap di akhir, parse) + 16 harness lama no-regresi + **render Edge 2 skenario**: boot normal → overlay hilang & intro tampil; simulasi gagal-boot (inject `throw` di BOOT) → pesan ramah muncul. Backup `_mh_verify/matheroes_pre_robust.html`.

---

## 16. Lain-lain

- **Misi harian** (`genDailyMissions`, pool acak), **koleksi monster + treasure** (sprite pixel, shiny 10%), **SFX** WebAudio (mute toggle), **welcome screen** harian (sambutan + progres kemarin).
- **AUDIO L2 — SFX event game (2026-07-11):** `SFX.LIB` diperluas dari 'tap' saja jadi 13 suara sintesis (Web Audio, tanpa file): `correct` (benar/serang, naik ceria), `wrong` (**LEMBUT 1 nada turun — VISI #2, bukan buzzer**), `defend`/`hurt`, `berserk`, `victory`, `mastery`, `star`, `reward`, `bond` (Pijar naik-tahap saja, anti-berisik), `select`, `newday`. Di-hook via `SFX.play(name)` di handler: `_handleAttackCorrect/Wrong`, `_handleDefendCorrect/Wrong`, berserk-wrong, `_startBerserk`, `_showVictory`, `renderMastery`, `awardStar`, `dropTreasure`, `addBond` (stage-up), `confirmHero`, `_renderWelcome`, + submit prolog/trial/post (diagnosa). Semua pendek/pelan (HP murah), mute toggle tetap. **SFX aman-inert saat AudioContext gagal** (harness/no-audio → try/catch+null). Verif `verify_audio.js` 29/29 (semua suara ada/berbunyi/senyap-saat-muted; `wrong`=1 nada) + 14 harness lama no-regresi. Backup `_mh_verify/matheroes_pre_audio.html`. **Tak menyentuh Sheet/.gs.**
- **MUSIK LATAR L3 — chiptune sintesis (2026-07-11):** BGM opt-in di dalam IIFE `SFX`: progresi hangat I–vi–IV–V (C–Am–F–G, `M_CHORDS`) arpeggio lembut + bass pelan, lookahead scheduler (`mSchedule` via `setInterval` 25ms, `M_STEP`=0.42s, loop 16 langkah), `musicGain` SENDIRI (independen `master`/🔊 SFX mute), fade in/out. API `SFX.music.{toggle,begin,halt,isOn}`; `unlock()` lanjutkan musik bila intent ON (autoplay perlu gesture). **Default OFF (opt-in)** — key `matheroes-music`, tombol **🎵 terpisah** (`#music-btn` kiri `#mute-btn`, class `.on`=highlight emas) via `toggleMusic()`/`updateMusicBtn()`. Keputusan Daffa: chiptune (bukan file — tak nambah berat, aman isu #2) + default off (hormati fokus matematika + kelas). Verif `verify_audio.js` **40/40** (music opt-in/toggle/persist/scheduler/independen SFX) + render Edge (tombol 🎵 tampil). Backup `_mh_verify/matheroes_pre_bgm.html`. ⚠️ **Suara asli tak bisa dites headless → user perlu dengar di HP/laptop.**

---

## 17. MAPPING AKM — Status TERKINI

| Domain AKM | Status | Catatan |
|---|---|---|
| **Bilangan** | ✅ **Lengkap++** | 5 operasi + **Bilangan Bulat/negatif** (`iadd`/`isub`, "Kutub Beku") + **Desimal** (2026-06-29: `dadd`/`dsub` 1-angka-koma, region "Telaga Titik", keypad "," dinamis, hitung via tenths anti-FP). Belum: perkalian/pembagian desimal, pecahan↔desimal. |
| **Geometri & Pengukuran** | 🟡 **v1 (2026-06-29)** | 2 skill: **Keliling** & **Luas** persegi/persegi panjang (`gkel`/`gluas`, region "Negeri Bentuk" setelah Pecahan). Konten BONUS — BELUM masuk diagnosa/Sheet. Berikutnya: satuan panjang, keliling/luas segitiga/lingkaran, volume. |
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

### 17b. CARA NAMBAH DOMAIN AKM BARU (pola dari Geometri v1)
Titik sentuh (semua di `matheroes.html`): (1) `SKILL_DEFS` skill baru {op unik, group, range param, enemy, xpStat, prev/next} + sambung `.next` skill terakhir sebelumnya; (2) `SKILL_ORDER` append; (3) `blankState().skills` + `ld()` sudah auto-migrasi via loop `SKILL_ORDER` (skill hilang → blankSkill); (4) generator: `genQ`/`genHardQ`/`genAdaptiveQ`+`ADAPT_BANDS` per op + AKM story (`gen<X>AkmQ` + dispatch di `genAkmQ`); (5) `qText` (tampilan) + `guideHint` (1-baris) + `buildGuideVisual` (CPA, boleh return '' → aman); (6) peta OTOMATIS dari `group` — cukup tambah `GICON`/`GSTAT`/`STORY_REGIONS` (opsional `GDIM`/`GPENJAGA` kalau wilayah Penjaga); (7) `renderQuestion` `classList.toggle('story',...)` utk teks panjang; (8) musuh tanpa sprite → fallback `d.icon` emoji (aman). **adaptF pakai fallback default 3 + self-init** (tak perlu ubah blankState.adaptF/harness item3). Domain BONUS = JANGAN masuk `DIAG_OPS` (biar skema Sheet tak berubah). Verif: bikin `verify_<domain>.js` (uji kebenaran rumus tiap generator). Geometri: `verify_geo.js` 47/47.

**KEYPAD DINAMIS (2026-06-29, buat jawaban non-standar mis. negatif/desimal):** `buildNumpad` punya tombol tersembunyi `np-neg`("−") & `np-dot`(",") full-width; `updateNumpadKeys(op, scEl)` tampilin sesuai op (dipanggil di `renderQuestion` & `renderGuide`); `npFeed` handle `neg`(toggle "-") & `dot`(sekali "."); input `inp-enc`/`inp-guide` = `type="text"` (biar terima "−"/"."; number-input nolak "-" sendirian); `data-max` ganti `max` utk batas digit; keyboard fisik "-"/"." juga jalan. Buat domain baru dgn jawaban negatif → set op ke cek di `updateNumpadKeys` + parsing pakai `parseInt` (int) / nanti `parseFloat`+tenths (desimal). Bilangan Bulat (`iadd`/`isub`): region "Kutub Beku", musuh ❄️🥶, AKM konteks suhu/lift/penyelam, guide garis bilangan. `verify_int.js` 51/51. **DESIMAL** (`dadd`/`dsub`, region "Telaga Titik" 💧): 1 angka di belakang koma, hitung di **TENTHS** (integer) anti floating-point (`genDecQ` simpan `aT`/`bT` + `ans:ansT/10`); jawaban lewat `parseAnswer(raw,op)` (desimal → `parseFloat(koma→titik)`) + `answerCorrect(v,ans,op)` (banding `Math.round(v*10)===Math.round(ans*10)`), dipakai di `submitEnc`+`submitGuide`; qText/guideHint pakai koma (`String(n).replace('.',',')`); sub jaga hasil ≥ 0; AKM uang/meter/liter/kg. `verify_dec.js` 48/48 (incl. round-trip FP end-to-end).

### 17c. EMBER SKOR (`SCORE_OP`) + MATERI ×÷ DESIMAL — Pass 1 (2026-07-11)
**Aturan Daffa yang dikunci:** materi boleh tumbuh sebanyak apa pun, **kolom skor rapor/Sheet TIDAK ikut melebar**. Embernya ditentukan **OPERASI yang dikerjakan, BUKAN bentuk angkanya**. Contoh Daffa: *"½ + 1,4 → ember Penjumlahan"*, *"2/4 disederhanakan → BUKAN Pembagian (masuk Pecahan)"*.
- **`SCORE_OP`** (dekat `SKILL_ORDER`) = peta **by-OP** (bukan per-skill → tak perlu disentuh tiap nambah skill) + helper **`scoreOpOf(sid)`**. Isi: `add/sub/mul/div/frac` (inti) · `iadd→add, isub→sub` · `dadd→add, dsub→sub` · `dmul→mul, ddiv→div` · `gkel/gluas→null` (keliling/luas bukan operasi dasar → tak nyetor ember). **Ember sah = 5 + null.** Dijaga harness: tiap skill wajib punya ember sah & **jumlah ember ≤5** → kolom Sheet dijamin tak melebar. *(Catatan: skor rapor sendiri tetap berasal dari DIAGNOSA/`DIAG_OPS` — `SCORE_OP` mengunci ATURAN pemetaan materi & siap dipakai kalau nanti latihan ikut menyetor skor.)*
- **Materi baru (Pass 1):** `dec_mul` (op `dmul`, "0,5 × 2", musuh Si Pusar 🌀) & `dec_div` (op `ddiv`, "1,5 ÷ 3", Si Percik 💦) — **group `Desimal`** (pakai ulang region "Telaga Titik" → **tak perlu GICON/GSTAT/STORY_REGIONS baru**). Rantai `dec_sub → dec_mul → dec_div → null`; `SKILL_ORDER` + `blankState().skills` ditambah (18 skill).
- **Anti floating-point:** `genDecMulDivQ(op, band, sid, tier, hard)` hitung di **PERSEPULUHAN**; `dmul`: ansT=aT×b; `ddiv` **dibangun MUNDUR** (aT=qT×b) → **selalu habis, tak ada sisa**; pengali/pembagi selalu **bilangan bulat** → hasil dijamin 1 angka koma. Band `ADAPT_BANDS.dmul{maxT,maxB}`/`ddiv{maxQ,maxB}` 6 tingkat. Wire: `genQ`/`genHardQ`/`genAdaptiveQ`/`genAkmQ`(→`genDecMulDivAkmQ`, konteks botol/tali/bagi-rata).
- **Input:** `DEC_ANS_OPS=['dadd','dsub','dmul','ddiv']` + `isDecAnsOp(op)` dipakai `parseAnswer`/`answerCorrect`/`updateNumpadKeys` → **tombol koma otomatis muncul** utk semua op berjawaban desimal (tak perlu input baru).
- **Guide:** `qText` (`0,5 × 2 = ?`), `guideHint` + `buildGuideVisual` pakai **trik persepuluhan** ("lupakan komanya dulu: 0,5 = 5 persepuluhan → 5×2=10 → pasang koma → 1").
- Verif: **`verify_materi.js` 60/60** (hasil 1-koma bersih, ÷ habis, round-trip FP, 6 tingkat dalam band, qText/guide, **aturan SCORE_OP + ember ≤5**, blankState/rantai) + 17 harness lama no-regresi + render Edge (`0,5 × 2` + keypad koma). Backup `_mh_verify/matheroes_pre_materi1.html`.
- **Pass 2 — PECAHAN LANJUT SELESAI (2026-07-11):** `frac_dec` (op `fdec`, "½ = ? (desimal)", Si Samar 🎯, **ember frac**) & `frac_add` (op `fadd`, "½ + 1,4 = ?" / "½ + ⅕ = ?", Si Campur 🧩, **ember add** ← contoh headline Daffa). **Urutan sengaja KONVERSI dulu baru PENJUMLAHAN** (½=0,5 adalah bekal utk ½+1,4): rantai `dec_div → frac_dec → frac_add → null`; group **`Pecahan`** (pakai ulang Taman Pecahan → tak perlu peta baru); SKILL_ORDER+blankState = **20 skill**. **Penyebut DIBATASI {2,5,10}** → `fracToTenths(k,den)=k×(10/den)` PASTI bulat di persepuluhan → jawaban DESIMAL 1 koma, **tanpa input pecahan**; `fracSym(k,den)` = ½/⅕ unicode atau "3/5". `genFracDecQ(op, band{dens,maxW|maxT,mix,useK})`: fdec proper→improper (maxW = bagian bulat), fadd 2 varian (pecahan+desimal ~60% / pecahan+pecahan ~40% saat mix). Band `ADAPT_BANDS.fdec/fadd` 6 tingkat. Wire genQ/genHardQ/genAdaptiveQ/genAkmQ(→`genFracDecAkmQ`, konteks santan/pita/botol). `DEC_ANS_OPS` += fadd/fdec (keypad koma otomatis). Guide: fdec "ubah penyebut jadi 10" (½=5/10=0,5), fadd "ubah ke desimal dulu, jumlahkan sejajar koma". Verif **`verify_materi2.js` 57/57** (fracToTenths, 800 soal bersih/op, round-trip FP, 6 tingkat, qText "½ + 1,4 = ?", **ember: fadd→add & fdec→frac & tetap ≤5**, rantai/blankState) + 18 harness lama no-regresi (verify_materi rantai diupdate: dec_div→frac_dec) + render Edge (½ + 0,3). Backup `_mh_verify/matheroes_pre_materi2.html`. **Input pecahan (tombol `/`) tetap pass TERPISAH** — hanya perlu utk `2/4→½` & `½+¼=¾` (banding pembilang+penyebut, bukan nilai).

### 17d. PASS 3 — PECAHAN SEJATI + INPUT "/" (2026-07-11)
Jawaban BENTUK PECAHAN kini bisa: `frac_simp` (op `fsimp`, "Sederhanakan: 2/4 = ?", Si Ruwet 🪢, **ember frac** ← contoh Daffa "sederhanakan ≠ pembagian") & `frac_sum` (op `fsum`, "½ + ¼ = ?", Si Belah 🍕, **ember add**). Rantai `frac_add → frac_simp → frac_sum → null`, group Pecahan, **22 skill**.
- **Input:** `FRAC_ANS_OPS=['fsimp','fsum']`+`isFracAnsOp`; tombol **`np-slash`** ("/") di keypad dinamis (pola np-extra spt −/,), `npFeed('slash')` (sekali, wajib ada angka dulu; regex batas digit += `/`), keyboard fisik `/`. `parseFrac("n/d")` → `parseAnswer` return **string kanonik "n/d"** (BUKAN angka!) → **`validAnswer(v,op)`** menggantikan cek `isNaN` di `submitEnc`/`submitGuide` (isNaN("1/2")=true → dulu pasti tertolak).
- **`answerCorrect`:** `fsimp` = banding **pembilang+penyebut PERSIS** (2/4 DITOLAK walau senilai — bentuk paling sederhana ITULAH skill-nya); `fsum` = kali silang (**bentuk senilai 6/8=¾ DITERIMA** → tak menghukum, VISI).
- **Generator:** `gcd`/`simplifyFrac`; `genFracSimpQ` bikin pecahan sederhana (gcd=1) lalu ×m≥2 → soal PASTI bisa disederhanakan, `ans="n0/d0"` kanonik; `genFracSumQ` 3 mode band (`same` penyebut sama → `nest` kelipatan → `any` beda LCD≤12), jawaban kanonik tersederhana; `genFracTrueAkmQ` (pizza/loyang/kebun, "tulis pecahan"). `ADAPT_BANDS.fsimp{maxD0,maxM}`/`fsum{mode,maxD}`.
- **Fix laten `qKey`:** dulu geo/fdec/fadd jatuh ke `${op}-undefined-undefined` → dedup diam-diam mati; kini tiap bentuk soal punya kunci sendiri (frac/geo/fdec/fadd/fsimp/fsum/default a-b).
- `diagnoseMistake` aman (guard `isNaN(v)` → jawaban string op baru → null/generik). Verif **`verify_materi3.js` 74/74** (soal pasti-bisa-disederhanakan, jawaban kanonik, **"2/4" ditolak utk fsimp 300×**, "6/8" diterima utk fsum, round-trip, 6 tingkat, qKey fix, ember: fsimp→frac & fsum→add & ≤5, 22 skill) + 19 harness lama no-regresi (asersi rantai materi2 diupdate) + render Edge (`2/4 + 2/8` + tombol `/`). Backup `_mh_verify/matheroes_pre_materi3.html`. **MATERI PECAHAN KINI TUNTAS SEMUA** (simple/konversi/jumlah-desimal/sederhanakan/jumlah-sejati).

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

### 21b. TRACKING PILOT — Paket A (2026-07-11)
Audit kesiapan pilot menemukan gain-score & sync SIAP, tapi retensi/churn/frustrasi/crash BELUM kekejar. **Paket (A) = counter kumulatif murah ditambah ke snapshot `measureRow`** (bukan event-stream — cukup untuk pilot 10–20 anak). 8 kolom baru: `hari_main` (=meta.totalDays, retensi), `streak_hari` (=dayStreak), `tanggal_mulai` (dari `measure.pre.ts`, utk D1/D7), `skill_sekarang` (=currentSkill, titik churn per operasi), `salah_beruntun_max` (proxy frustrasi), `pijar_bond` (engagement), `bintang` (Σ stars earned), `error_terakhir` (crash log). State baru: `S.player.records.maxWrongStreak` (persisten; `_wrongRun` volatil di `recordAnswer` — benar→reset, salah→++ & update max) + `S.meta.lastError` (via `logError(msg,src,line)` yg dipanggil handler `window.addEventListener('error'|'unhandledrejection')` di BOOT → simpan ≤140 char + set `measure.dirty`). Migrasi `ld()` (save lama → default 0/null). **Apps Script HEADER + 8 kolom** (repo+Downloads) → ⚠️ Daffa re-paste `.gs` + New version (SEKALIAN dengan kolom SKOR — satu re-paste untuk dua-duanya; kolom lama aman, tak clear). Verifikasi: **`verify_tracking.js` 53/53** (recordAnswer beneran: akumulasi/persist/reset frustrasi; logError; measureRow 8 field; migrasi) + 13 harness lama no-regresi + boot render Edge. Backup `_mh_verify/matheroes_pre_tracking.html`. **Belum dikejar (butuh event-stream/paket B, ditunda ke versi web):** kurva D1/D7 per-hari penuh, durasi per-sesi terpisah.

### 21c. SURVEI TAKUT-MATEMATIKA — indikator VISI Tingkat 1 (2026-07-11)
Indikator "turun takut matematika" (VISI §4 T1) yang belum ada → skala **wajah 1..5** (`MOOD_OPTS`: 1😄 suka … 5😰 takut, `MOOD_FACE`). Layar `s-mood` (opsi di-render dari `MOOD_OPTS` via `askMood(phase)`), `answerMood(n)` simpan ke `S.measure.moodPre`/`moodPost` (+dirty) lalu routing: **pre**→`show('prolog-intro')`, **post**→`_beginPost()` (diagInit+posttest). **Baseline** disisip di `confirmName`→`askMood('pre')` (sebelum Prolog); **akhir** di `startPostTest`→`askMood('post')` (sebelum Uji Kemampuan; body lama startPostTest pindah ke `_beginPost`). `measureRow` + `takut_awal`/`takut_akhir`; `renderMeasure` baris "😌 Rasa ke matematika X→Y (▼ makin nyaman bila turun)". blankState.measure +`moodPre/moodPost:null` + migrasi `ld`. **Apps Script HEADER +`takut_awal`/`takut_akhir`** (repo+Downloads) — ikut re-paste `.gs` yg sama (skor+tracking+takut, satu kali). `_moodPhase` volatil. Verif **`verify_mood.js` 26/26** (drive askMood/answerMood beneran: pre simpan+route, post simpan+_beginPost, baseline tak tertimpa, measureRow, migrasi) + 15 harness lama no-regresi + render Edge (5 wajah). Backup `_mh_verify/matheroes_pre_mood.html`.

---

*Diperbarui 2026-06-29: ITEM 2 (pengukuran + sync Sheets), ITEM 3 (adaptif kelima operasi), Diagnosa v2 (adaptif/kelancaran/nalar) & ITEM 4 (diagnosa pecahan) SELESAI & terverifikasi; + THEMING Tahap A & B + ART FINAL WebP terintegrasi (kosmetik/naratif, tak menyentuh mekanik); + (sesi 2) **TIMER LEMBUT** keputusan Daffa: Ujian Kekuatan berwaktu KELIMA operasi (§15) + MODE BERSERK soal nalar (§7b) — verifikasi `verify_timer_berserk.js` 73/73 + `verify_flow.js` 17/17 + render Edge, harness lama no-regresi. Ditulis dari pembacaan langsung `matheroes.html`. Menggantikan CONTEXT.md basi sebelumnya.*
