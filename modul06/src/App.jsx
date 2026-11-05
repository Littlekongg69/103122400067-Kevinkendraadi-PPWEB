import { useState } from 'react'
import FormPeserta from './components/FormPeserta.jsx'
import FilterPeserta from './components/FilterPeserta.jsx'
import DaftarPeserta from './components/DaftarPeserta.jsx'
import RingkasanPeserta from './components/RingkasanPeserta.jsx'

const DATA_AWAL = [
  { id: 'm-1', nama: 'Ani', nim: '10121001', kelas: 'TI-2A', hadir: true },
  { id: 'm-2', nama: 'Budi', nim: '10121002', kelas: 'TI-2B', hadir: false },
  { id: 'm-3', nama: 'Citra', nim: '10121003', kelas: 'TI-2A', hadir: false },
]

const FORM_KOSONG = { nama: '', nim: '', kelas: '' }

function App() {
  // State utama
  const [peserta, setPeserta] = useState(DATA_AWAL)
  const [nextId, setNextId] = useState(4)
  const [form, setForm] = useState(FORM_KOSONG)
  const [editId, setEditId] = useState(null)
  const [pesan, setPesan] = useState('')
  const [keyword, setKeyword] = useState('')
  const [filterKelas, setFilterKelas] = useState('Semua kelas')

  // Data turunan
  const kata = keyword.trim().toLowerCase()
  const terlihat = peserta.filter((p) => {
    const cocokKata =
      kata === '' ||
      p.nama.toLowerCase().includes(kata) ||
      p.nim.toLowerCase().includes(kata)
    const cocokKelas = filterKelas === 'Semua kelas' || p.kelas === filterKelas
    return cocokKata && cocokKelas
  })

  const totalHadir = peserta.filter((p) => p.hadir).length
  const ringkasan = {
    total: peserta.length,
    hadir: totalHadir,
    belumHadir: peserta.length - totalHadir,
    ditampilkan: terlihat.length,
  }

  function resetForm() {
    setForm(FORM_KOSONG)
    setEditId(null)
    setPesan('')
  }

  function handleChangeForm(e) {
    const { name, value } = e.target
    setForm((lama) => ({ ...lama, [name]: value }))
  }

  function validasi(nama, nim, kelas) {
    if (nama === '') return 'Nama wajib diisi.'
    if (nama.length < 3) return 'Nama minimal 3 karakter.'
    if (nim === '') return 'NIM wajib diisi.'
    if (!/^\d{8}$/.test(nim)) return 'NIM harus terdiri atas tepat 8 digit angka.'
    if (kelas !== 'TI-2A' && kelas !== 'TI-2B') return 'Kelas belum dipilih.'
    const dipakai = peserta.some((p) => p.nim === nim && p.id !== editId)
    if (dipakai) return 'NIM ' + nim + ' sudah digunakan peserta lain.'
    return ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nama = form.nama.trim()
    const nim = form.nim.trim()
    const kelas = form.kelas

    const error = validasi(nama, nim, kelas)
    if (error) {
      setPesan(error) // data dan isi form tetap
      return
    }

    if (editId === null) {
      const baru = { id: 'm-' + nextId, nama, nim, kelas, hadir: false }
      setPeserta((lama) => [...lama, baru])
      setNextId((n) => n + 1)
    } else {
      setPeserta((lama) =>
        lama.map((p) => (p.id === editId ? { ...p, nama, nim, kelas } : p)),
      )
    }
    resetForm()
  }

  function handleEdit(id) {
    const target = peserta.find((p) => p.id === id)
    if (!target) return
    setForm({ nama: target.nama, nim: target.nim, kelas: target.kelas })
    setEditId(id)
    setPesan('')
  }

  function handleHapus(id) {
    setPeserta((lama) => lama.filter((p) => p.id !== id))
    if (editId === id) resetForm()
  }

  function handleToggleHadir(id) {
    setPeserta((lama) =>
      lama.map((p) => (p.id === id ? { ...p, hadir: !p.hadir } : p)),
    )
  }

  const adaData = peserta.length > 0

  return (
    <main className="app">
      <header className="header">
        <h1>Manajemen Peserta Praktikum</h1>
        <RingkasanPeserta {...ringkasan} />
      </header>

      <section className="panel">
        <h2>{editId === null ? 'Tambah peserta' : 'Ubah peserta'}</h2>
        <FormPeserta
          form={form}
          modeEdit={editId !== null}
          pesan={pesan}
          onChange={handleChangeForm}
          onSubmit={handleSubmit}
          onBatal={resetForm}
        />
      </section>

      <section className="panel">
        <h2>Daftar peserta</h2>
        <FilterPeserta
          keyword={keyword}
          filterKelas={filterKelas}
          onKeywordChange={setKeyword}
          onFilterChange={setFilterKelas}
        />
        <DaftarPeserta
          peserta={terlihat}
          adaData={adaData}
          editId={editId}
          onEdit={handleEdit}
          onHapus={handleHapus}
          onToggleHadir={handleToggleHadir}
        />
      </section>
    </main>
  )
}

export default App
