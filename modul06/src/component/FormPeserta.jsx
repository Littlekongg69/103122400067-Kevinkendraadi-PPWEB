function FormPeserta({ form, modeEdit, pesan, onChange, onSubmit, onBatal }) {
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label>
        Nama mahasiswa
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={onChange}
          placeholder="Contoh: Dina"
        />
      </label>

      <label>
        NIM
        <input
          type="text"
          name="nim"
          value={form.nim}
          onChange={onChange}
          placeholder="8 digit"
          inputMode="numeric"
        />
      </label>

      <label>
        Kelas
        <select name="kelas" value={form.kelas} onChange={onChange}>
          <option value="">Pilih kelas</option>
          <option value="TI-2A">TI-2A</option>
          <option value="TI-2B">TI-2B</option>
        </select>
      </label>

      <div className="aksi-form">
        <button type="submit" className="btn btn-utama">
          {modeEdit ? 'Simpan perubahan' : 'Tambah peserta'}
        </button>
        {modeEdit && (
          <button type="button" className="btn" onClick={onBatal}>
            Batal
          </button>
        )}
      </div>

      {pesan && (
        <p className="pesan-error" role="alert">
          {pesan}
        </p>
      )}
    </form>
  )
}

export default FormPeserta
