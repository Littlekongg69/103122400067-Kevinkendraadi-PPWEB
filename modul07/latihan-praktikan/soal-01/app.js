// Elemen DOM untuk interaksi yang tidak bergantung pada request.
const catatanInput = document.querySelector("#catatan");
const angkaEl = document.querySelector("#angka");
const waktuAwalEl = document.querySelector("#waktu-awal");
const tombolTambah = document.querySelector("#tambah");

let hitungan = 0;
const waktuHalamanDibuka = new Date();
waktuAwalEl.textContent = waktuHalamanDibuka.toLocaleString("id-ID", {
  dateStyle: "full", timeStyle: "medium"
});

tombolTambah.addEventListener("click", () => {
  hitungan += 1;
  angkaEl.textContent = hitungan;
});

// Soal 1: XMLHttpRequest asynchronous untuk mengambil pengumuman.txt.
const tombolPengumuman = document.querySelector("#muat-pengumuman");
const areaPengumuman = document.querySelector("#pengumuman");

tombolPengumuman.addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  tombolPengumuman.disabled = true;
  areaPengumuman.textContent = "Memuat pengumuman...";

  xhr.open("GET", "pengumuman.txt", true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      areaPengumuman.textContent = xhr.responseText;
    } else {
      areaPengumuman.textContent =
        `Gagal memuat pengumuman (HTTP ${xhr.status}). Periksa lokasi berkas.`;
    }
    tombolPengumuman.disabled = false;
  };
  xhr.onerror = () => {
    areaPengumuman.textContent =
      "Gagal memuat pengumuman karena gangguan jaringan.";
    tombolPengumuman.disabled = false;
  };
  xhr.send();
});

// Soal 1: Fetch untuk API mock lokal atau JSONPlaceholder.
const pilihanSumber = document.querySelector("#sumber");
const tombolPeserta = document.querySelector("#ambil-peserta");
const statusPeserta = document.querySelector("#status-peserta");
const daftarPeserta = document.querySelector("#daftar-peserta");

tombolPeserta.addEventListener("click", async () => {
  const gunakanLokal = pilihanSumber.value === "lokal";
  const namaSumber = gunakanLokal ? "Mock lokal" : "JSONPlaceholder";
  const url = gunakanLokal
    ? "/api/users?delay=1500"
    : "https://jsonplaceholder.typicode.com/users";

  tombolPeserta.disabled = true;
  statusPeserta.dataset.state = "loading";
  statusPeserta.textContent = `Memuat peserta dari ${namaSumber}...`;
  daftarPeserta.replaceChildren();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const users = await response.json();
    const tigaPeserta = users.slice(0, 3);

    tigaPeserta.forEach((user) => {
      const item = document.createElement("li");
      item.textContent = `${user.name} — ${user.email}`;
      daftarPeserta.append(item);
    });

    statusPeserta.dataset.state = "success";
    statusPeserta.textContent =
      `${namaSumber} • ${tigaPeserta.length} dari ${users.length} data ditampilkan.`;
  } catch (error) {
    statusPeserta.dataset.state = "error";
    const detail = error.name === "TypeError"
      ? "Gangguan jaringan atau koneksi internet."
      : error.message;
    statusPeserta.textContent = `Gagal mengambil data (${detail}). ${
      gunakanLokal
        ? "Pastikan server lokal masih berjalan."
        : "Periksa internet atau pilih Mock lokal secara manual."
    }`;
  } finally {
    tombolPeserta.disabled = false;
  }
});
