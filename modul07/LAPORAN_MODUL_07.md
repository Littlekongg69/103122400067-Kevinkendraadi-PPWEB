# Laporan Praktikum Modul 07 — AJAX dan Konsumsi API

**Nama:** [kevin kendra adi sebastian]  
**NIM:** [103122400067]  
**Kelas:** [SE-08-02]  
**Tanggal:** [5 november]

## 1. Soal 01 — Portal Informasi Praktikum

### Implementasi
- Catatan praktikan, hitungan, dan waktu pembukaan halaman dibuat terpisah dari request. Karena itu, proses AJAX tidak memuat ulang halaman atau menghapus nilai tersebut.
- Tombol **Muat pengumuman** memicu event `click`, lalu `XMLHttpRequest` mengirim GET asynchronous ke `pengumuman.txt`. Perubahan `readyState` diperiksa sampai `XMLHttpRequest.DONE`; status 2xx menampilkan `responseText`, sedangkan status selain 2xx dan event `error` menampilkan pesan gagal.
- Tombol **Ambil peserta** memicu Fetch ke `/api/users?delay=1500` untuk Mock lokal atau `https://jsonplaceholder.typicode.com/users` untuk JSONPlaceholder. Program memeriksa `response.ok`, membaca JSON, lalu menampilkan maksimal tiga nama dan email dari response.
- Saat Fetch berlangsung, tombol request dinonaktifkan dan pesan loading ditampilkan. Tombol hitungan tetap aktif. Sumber tidak berpindah otomatis ketika API eksternal gagal.

### Alur request dan DOM
1. Pengguna menekan tombol.
2. Event handler mengirim request XHR atau Fetch.
3. Browser menerima response; XHR menggunakan `readyState`, `status`, dan `responseText`, sedangkan Fetch memeriksa `response.ok` lalu memanggil `response.json()`.
4. Elemen `<pre>` pengumuman atau status dan daftar peserta diperbarui. Tidak ada reload halaman.

## 2. Soal 02 — Aplikasi Registrasi Peserta React

### Implementasi
- `useState` mengelola daftar peserta, status loading, error, pilihan skenario, penghitung reload, nilai input, status pengiriman, dan response POST.
- `useEffect` menjalankan Axios GET ketika komponen pertama kali dibuka, pilihan skenario berubah, atau tombol Muat ulang ditekan.
- Setiap effect menggunakan `AbortController` dan penanda `effectAktif`. Cleanup membatalkan request sebelumnya dan mencegah response lama mengubah state setelah pilihan berubah atau komponen dilepas.
- Skenario Berhasil, Data kosong, Error HTTP, dan Timeout memakai URL serta batas waktu sesuai soal. Skenario Timeout mengirim request dengan jeda 2500 ms dan timeout Axios 700 ms.
- Form mencegah reload menggunakan `preventDefault()`, memvalidasi nama setelah `trim()` dan format email, lalu mengirim `{ name, email }` dengan `axios.post("/api/users", objekData)`.
- Response POST ditampilkan terpisah dari daftar GET. Server mengembalikan HTTP 201, id 101, dan `simulated: true`; data tidak disimpan sehingga daftar GET tetap berisi tiga pengguna.

### Peran state dan effect
`useState` menyimpan data yang perlu memicu render ulang ketika berubah. `useEffect` menangani efek samping berupa request GET dan berjalan kembali saat dependency berubah. Cleanup effect membatalkan request lama agar hasil skenario sebelumnya tidak menimpa pilihan terbaru.

## 3. Hasil pengujian endpoint lokal

Pengujian endpoint dilakukan pada server lokal dari paket awal. Hasil aktual:

| Pengujian | Hasil aktual |
|---|---|
| `GET /api/users` | HTTP 200, mengembalikan tiga pengguna |
| `GET /api/users?mode=empty` | HTTP 200, body `[]` |
| `GET /api/users?mode=error` | HTTP 503 |
| `POST /api/users` dengan Rina Praktikan dan `rina@example.com` | HTTP 201, id 101, nama/email sesuai input, `simulated: true` |
| Buka halaman Soal 01 | HTTP 200 |
| Buka halaman Soal 02 | HTTP 200 |
| Ambil `pengumuman.txt` | HTTP 200, isi sesuai ketentuan soal |

### Checklist uji manual di browser

Jalankan seluruh skenario berikut di browser sebelum pengumpulan. Beri tanda dan catat hasil aktual setelah dicoba.

- [ ] Soal 01: muat pengumuman, ubah `pengumuman.txt`, lalu muat ulang dan pastikan isi terbaru tampil.
- [ ] Soal 01: sementara ubah URL XHR di `app.js` menjadi `hilang.txt`; pastikan pesan HTTP 404 tampil, lalu kembalikan ke `pengumuman.txt`.
- [ ] Soal 01: pilih Mock lokal, mulai request, ketik catatan dan tekan Tambah hitungan tiga kali. Pastikan data peserta tampil dan catatan/hitungan/waktu awal tidak berubah.
- [ ] Soal 01: pilih JSONPlaceholder. Pastikan maksimal tiga pengguna tampil atau pesan gagal yang jelas muncul jika internet/layanan tidak tersedia. Pastikan sumber tetap JSONPlaceholder.
- [ ] Soal 02: buka halaman dan pastikan GET berjalan otomatis; tekan Muat ulang untuk request berikutnya.
- [ ] Soal 02: pilih Data kosong dan Error HTTP. Pastikan pesan sesuai kondisi dan daftar lama dibersihkan.
- [ ] Soal 02: pilih Timeout, tunggu pesan timeout, lalu pilih Berhasil dan pastikan aplikasi pulih.
- [ ] Soal 02: ganti pilihan ketika request masih berjalan; pastikan hasil akhir sesuai pilihan terbaru.
- [ ] Soal 02: kirim `Rina Praktikan` dan `rina@example.com`; pastikan HTTP 201, id 101, data sesuai, `simulated: true`, dan GET tetap tiga peserta.
- [ ] Soal 02: coba nama berisi spasi saja dan email tidak valid; pastikan form menolak pengiriman dan menampilkan petunjuk.

## 4. Bukti tangkapan layar

Sisipkan tangkapan layar aktual setelah menjalankan aplikasi:
1. `Bukti-01-portal.png` — Soal 01 menampilkan pengumuman dan direktori peserta.
2. `Bukti-01-loading-counter.png` — Soal 01 ketika request berjalan, catatan terisi, dan hitungan bertambah.
3. `Bukti-02-registrasi.png` — Soal 02 menampilkan daftar peserta dan form.
4. `Bukti-02-post-201.png` — hasil POST Rina Praktikan dengan HTTP 201.
5. `Bukti-error.png` — salah satu kondisi gagal, misalnya HTTP 503 atau timeout.

**Catatan:** hasil pengujian endpoint lokal di atas telah diperiksa. Checklist interaksi browser dan tangkapan layar perlu dilengkapi berdasarkan percobaan langsung pada komputer praktikan; jangan menandai skenario manual sebagai berhasil sebelum dicoba.

## 5. Cara menjalankan

1. Ekstrak seluruh ZIP.
2. Pastikan Node.js versi 18 atau lebih baru tersedia.
3. Jalankan `JALANKAN.bat` dari folder utama paket, atau buka terminal di folder tersebut lalu jalankan `node server.cjs`.
4. Buka:
   - `http://127.0.0.1:3007/latihan-praktikan/soal-01/`
   - `http://127.0.0.1:3007/latihan-praktikan/soal-02/`
5. Biarkan terminal server tetap berjalan. Tekan `Ctrl+C` untuk menghentikan server.

Tidak perlu `npm install`. API lokal dapat digunakan tanpa internet; JSONPlaceholder memerlukan koneksi internet.
