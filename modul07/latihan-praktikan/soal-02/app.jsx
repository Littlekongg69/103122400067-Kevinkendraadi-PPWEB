const { useEffect, useState } = React;

function AplikasiRegistrasi() {
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skenario, setSkenario] = useState("berhasil");
  const [percobaan, setPercobaan] = useState(0);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const [statusKirim, setStatusKirim] = useState("");
  const [hasilPost, setHasilPost] = useState(null);

  // GET otomatis ketika komponen dibuka, skenario berubah, atau dimuat ulang.
  useEffect(() => {
    const controller = new AbortController();
    let effectAktif = true;

    const konfigurasi = {
      berhasil: { url: "/api/users?delay=1000", timeout: 5000 },
      kosong: { url: "/api/users?mode=empty&delay=1000", timeout: 5000 },
      error: { url: "/api/users?mode=error&delay=1000", timeout: 5000 },
      timeout: { url: "/api/users?delay=2500", timeout: 700 }
    }[skenario];

    async function ambilPeserta() {
      setLoading(true);
      setError("");
      setPeserta([]);

      try {
        const response = await axios.get(konfigurasi.url, {
          timeout: konfigurasi.timeout,
          signal: controller.signal
        });
        if (effectAktif) setPeserta(response.data);
      } catch (err) {
        if (effectAktif && !axios.isCancel(err) && err.code !== "ERR_CANCELED") {
          if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
            setError(`Request timeout setelah ${konfigurasi.timeout} ms. Coba pilih Berhasil.`);
          } else if (err.response) {
            setError(`Gagal mengambil data: HTTP ${err.response.status}. Server mengembalikan error.`);
          } else {
            setError(`Gagal mengambil data: ${err.message}. Periksa server lokal.`);
          }
        }
      } finally {
        if (effectAktif) setLoading(false);
      }
    }

    ambilPeserta();
    return () => {
      effectAktif = false;
      controller.abort();
    };
  }, [skenario, percobaan]);

  async function kirimPendaftaran(event) {
    event.preventDefault();
    const namaBersih = nama.trim();
    const emailBersih = email.trim();
    const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namaBersih) {
      setStatusKirim("Nama wajib diisi dan tidak boleh hanya spasi.");
      setHasilPost(null);
      return;
    }
    if (!polaEmail.test(emailBersih)) {
      setStatusKirim("Format email belum valid. Contoh: nama@example.com.");
      setHasilPost(null);
      return;
    }

    setMengirim(true);
    setStatusKirim("Mengirim pendaftaran...");
    setHasilPost(null);

    try {
      const objekData = { name: namaBersih, email: emailBersih };
      const response = await axios.post("/api/users", objekData, {
        timeout: 5000,
        headers: { "Content-Type": "application/json" }
      });
      setHasilPost({
        status: response.status,
        ...response.data
      });
      setStatusKirim("Simulasi berhasil, data tidak disimpan.");
    } catch (err) {
      const pesan = err.response
        ? `HTTP ${err.response.status}: ${err.response.data?.message || "Permintaan gagal."}`
        : `Gagal mengirim: ${err.message}`;
      setStatusKirim(pesan);
    } finally {
      setMengirim(false);
    }
  }

  return (
    <>
      <header className="hero">
        <div className="eyebrow">LABORATORIUM • SISTEM REGISTRASI</div>
        <h1>Registrasi Peserta</h1>
        <p>Daftar peserta dimuat otomatis. Formulir pendaftaran dikirim melalui Axios POST.</p>
      </header>

      <div className="grid">
        <section className="panel" aria-busy={loading}>
          <h2>01 / Direktori peserta</h2>
          <p className="muted">Axios GET · useEffect · skenario response</p>
          <label htmlFor="skenario">Skenario GET</label>
          <select id="skenario" value={skenario} onChange={e => setSkenario(e.target.value)}>
            <option value="berhasil">Berhasil</option>
            <option value="kosong">Data kosong</option>
            <option value="error">Error HTTP</option>
            <option value="timeout">Timeout (700 ms)</option>
          </select>
          <div className="form-actions">
            <button type="button" disabled={loading}
              onClick={() => setPercobaan(n => n + 1)}>Muat ulang</button>
            <span className="muted">{loading ? "Request sedang berjalan" : "Siap menerima request"}</span>
          </div>
          <p className="result" role="status" aria-live="polite"
            data-state={error ? "error" : loading ? "loading" : "success"}>
            {loading ? "Memuat daftar peserta..." : error || (peserta.length ? `${peserta.length} peserta berhasil dimuat.` : "Data kosong. Tidak ada peserta untuk ditampilkan.")}
          </p>
          {!loading && !error && peserta.length > 0 && (
            <ul className="users">
              {peserta.map(user => (
                <li key={user.id}>
                  <strong>{user.name}</strong><br />
                  <span className="muted">{user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>02 / Form pendaftaran</h2>
          <p className="muted">Axios POST · validasi input · response simulasi</p>
          <form onSubmit={kirimPendaftaran}>
            <label htmlFor="nama">Nama</label>
            <input id="nama" type="text" value={nama}
              onChange={e => setNama(e.target.value)} placeholder="Nama lengkap" />
            <label htmlFor="email">Email</label>
            <input id="email" type="text" inputMode="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="nama@example.com" />
            <button type="submit" disabled={mengirim}>
              {mengirim ? "Mengirim..." : "Kirim pendaftaran"}
            </button>
          </form>
          <p className="result" role="status" aria-live="polite"
            data-state={statusKirim.startsWith("Simulasi") ? "success" : statusKirim && !statusKirim.startsWith("Mengirim") ? "error" : "loading"}>
            {statusKirim || "Belum ada pendaftaran yang dikirim."}
          </p>
          {hasilPost && (
            <pre className="result post-result">{JSON.stringify(hasilPost, null, 2)}</pre>
          )}
          <p className="note">Response POST ditampilkan terpisah. Endpoint hanya simulasi dan tidak menambah data ke daftar GET.</p>
        </section>
      </div>
      <p className="meta" style={{marginTop: 24}}>Soal 02 · React state/effect + Axios GET/POST</p>
    </>
  );
}

ReactDOM.createRoot(document.querySelector("#root")).render(<AplikasiRegistrasi />);
