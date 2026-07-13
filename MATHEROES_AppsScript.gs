/***********************************************************************
 * MATHEROES — Apps Script penerima data pengukuran (Google Sheets)
 * ---------------------------------------------------------------------
 * Cara pakai (lihat MATHEROES_SETUP_ONLINE.md, Bagian C):
 *   1. Buka Sheet → Extensions → Apps Script.
 *   2. HAPUS isi default, TEMPEL seluruh file ini, Save.
 *   3. Deploy → New deployment → Web app:
 *        Execute as: Me   |   Who has access: Anyone   → Deploy → Authorize.
 *   4. Copy "Web app URL", tempel ke matheroes.html (SYNC_URL) ATAU
 *      isi lewat tombol "Atur URL" di layar Rapor (panel guru).
 *
 * Yang dilakukan:
 *   - doPost(e): terima 1 baris JSON dari game → UPDATE baris anak kalau
 *     sudah ada (cari pakai nama+kelas), atau APPEND baris baru.
 *   - Header dibuat OTOMATIS kalau Sheet masih kosong (langkah 8 di panduan
 *     jadi opsional). Kalau kamu sudah bikin header, kolom yang kurang
 *     ditambah otomatis di kanan — kolommu yang lama tidak diutak-atik.
 *   - LockService cegah dua tulisan bentrok (race condition).
 *   - doGet(): buka URL-nya di browser → tampil status "aktif" (cek deploy).
 *
 * Privasi: Sheet tetap private. Yang "Anyone" hanya endpoint ini.
 * Opsional keamanan: isi TOKEN (di bawah) dengan kata rahasia, lalu kabari
 *   Claude Code agar game ikut mengirim token yang sama. Kosong = nonaktif.
 ***********************************************************************/

// Urutan kolom kanonik (Diagnosa v2 + SKOR). Tiap topik: _lvl (kemampuan 0–6), _dtk (kelancaran, detik),
// & _skor (poin gabungan benar-salah + waktu, selalu positif — headline rapor per 2026-07-08).
var HEADER = [
  'nama','kelas',
  'tambah_lvl_awal','tambah_lvl_akhir','tambah_dtk_awal','tambah_dtk_akhir','tambah_skor_awal','tambah_skor_akhir',
  'kurang_lvl_awal','kurang_lvl_akhir','kurang_dtk_awal','kurang_dtk_akhir','kurang_skor_awal','kurang_skor_akhir',
  'kali_lvl_awal','kali_lvl_akhir','kali_dtk_awal','kali_dtk_akhir','kali_skor_awal','kali_skor_akhir',
  'bagi_lvl_awal','bagi_lvl_akhir','bagi_dtk_awal','bagi_dtk_akhir','bagi_skor_awal','bagi_skor_akhir',
  'pecahan_lvl_awal','pecahan_lvl_akhir','pecahan_dtk_awal','pecahan_dtk_akhir','pecahan_skor_awal','pecahan_skor_akhir',
  'nalar_awal','nalar_akhir','nalar_skor_awal','nalar_skor_akhir',
  'total_skor_awal','total_skor_akhir',
  'rata_lvl_awal','rata_lvl_akhir','rata_dtk_awal','rata_dtk_akhir',
  'total_gain','menit_main','skill_dikuasai','akurasi_latihan','level_pemain',
  'hari_main','streak_hari','tanggal_mulai','skill_sekarang','salah_beruntun_max','pijar_bond','bintang','error_terakhir',
  'takut_awal','takut_akhir',
  'sesi','terakhir','id','versi','waktu_server'
];

var TOKEN = ''; // kosong = tanpa pemeriksaan. Isi utk batasi pengirim (lihat catatan di atas).

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (err) {
    return json_({ ok: false, error: 'sibuk, coba lagi' });
  }
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (pe) { data = {}; }
    }
    // fallback: kalau dikirim sbg form field (mode darurat)
    if ((!data || !data.nama) && e && e.parameter && e.parameter.payload) {
      try { data = JSON.parse(e.parameter.payload); } catch (pe2) {}
    }
    if (TOKEN && String(data.token || '') !== TOKEN) {
      return json_({ ok: false, error: 'token salah' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var header = ensureHeader_(sheet);

    // peta nama kolom → indeks (0-based)
    var col = {};
    for (var i = 0; i < header.length; i++) col[header[i]] = i;

    var keyNama  = norm_(data.nama);
    var keyKelas = norm_(data.kelas);

    // cari baris anak (nama+kelas) di antara data yg sudah ada
    var lastRow = sheet.getLastRow();
    var foundRow = -1;
    if (lastRow >= 2) {
      var values = sheet.getRange(2, 1, lastRow - 1, header.length).getValues();
      for (var r = 0; r < values.length; r++) {
        var n = norm_(values[r][col['nama']]);
        var k = norm_(values[r][col['kelas']]);
        if (n === keyNama && k === keyKelas) { foundRow = r + 2; break; }
      }
    }

    // susun baris sesuai urutan header (hanya kolom yang dikenal)
    var stamp = new Date();
    var row = new Array(header.length).fill('');
    for (var c = 0; c < header.length; c++) {
      var name = header[c];
      if (name === 'waktu_server') { row[c] = stamp; continue; }
      if (data.hasOwnProperty(name) && data[name] !== null && data[name] !== undefined) {
        row[c] = data[name];
      }
    }

    var action;
    if (foundRow > 0) {
      sheet.getRange(foundRow, 1, 1, header.length).setValues([row]);
      action = 'update';
    } else {
      sheet.appendRow(row);
      action = 'append';
      foundRow = sheet.getLastRow();
    }
    return json_({ ok: true, action: action, row: foundRow });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'matheroes-sync', status: 'aktif' });
}

// pastikan baris header ada & memuat semua kolom kanonik (tambah yg kurang di kanan)
function ensureHeader_(sheet) {
  var lastCol = sheet.getLastColumn();
  var cur = lastCol >= 1 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  // bersihkan sel kosong di ekor
  while (cur.length && (cur[cur.length - 1] === '' || cur[cur.length - 1] === null)) cur.pop();

  if (cur.length === 0) {
    sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
    sheet.setFrozenRows(1);
    return HEADER.slice();
  }
  // header sudah ada → tambahkan kolom kanonik yang belum ada
  var have = {};
  for (var i = 0; i < cur.length; i++) have[String(cur[i])] = true;
  var added = [];
  for (var j = 0; j < HEADER.length; j++) if (!have[HEADER[j]]) added.push(HEADER[j]);
  if (added.length) {
    sheet.getRange(1, cur.length + 1, 1, added.length).setValues([added]);
    cur = cur.concat(added);
  }
  sheet.setFrozenRows(1);
  return cur;
}

function norm_(v) { return String(v == null ? '' : v).trim().toLowerCase(); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
