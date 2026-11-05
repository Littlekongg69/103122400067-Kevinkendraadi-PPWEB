import ItemPeserta from './ItemPeserta.jsx'

function DaftarPeserta({ peserta, adaData, editId, onEdit, onHapus, onToggleHadir }) {
  if (!adaData) {
    return <p className="kosong">Belum ada peserta.</p>
  }
  if (peserta.length === 0) {
    return <p className="kosong">Peserta tidak ditemukan.</p>
  }

  return (
    <ul className="daftar">
      {peserta.map((p) => (
        <ItemPeserta
          key={p.id}
          peserta={p}
          sedangDiedit={p.id === editId}
          onEdit={onEdit}
          onHapus={onHapus}
          onToggleHadir={onToggleHadir}
        />
      ))}
    </ul>
  )
}

export default DaftarPeserta
