function RingkasanPeserta({ total, hadir, belumHadir, ditampilkan }) {
  return (
    <dl className="ringkasan">
      <div>
        <dt>Total peserta</dt>
        <dd>{total}</dd>
      </div>
      <div>
        <dt>Hadir</dt>
        <dd>{hadir}</dd>
      </div>
      <div>
        <dt>Belum hadir</dt>
        <dd>{belumHadir}</dd>
      </div>
      <div>
        <dt>Hasil ditampilkan</dt>
        <dd>{ditampilkan}</dd>
      </div>
    </dl>
  )
}

export default RingkasanPeserta
