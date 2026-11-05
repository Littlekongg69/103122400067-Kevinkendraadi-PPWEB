function FilterPeserta({ keyword, filterKelas, onKeywordChange, onFilterChange }) {
  return (
    <div className="filter">
      <label>
        Cari nama atau NIM
        <input
          type="search"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Ketik kata pencarian"
        />
      </label>
      <label>
        Filter kelas
        <select
          value={filterKelas}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="Semua kelas">Semua kelas</option>
          <option value="TI-2A">TI-2A</option>
          <option value="TI-2B">TI-2B</option>
        </select>
      </label>
    </div>
  )
}

export default FilterPeserta
