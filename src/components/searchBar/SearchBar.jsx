import { useState, useMemo } from "react";
import { Search, List } from "lucide-react";
import { motion } from "framer-motion";
import "./searchBar.scss";

const SearchBar = ({ setQuery, setCategoria, setActivateSearch }) => {
  const [localQuery, setLocalQuery] = useState("");

  const categorias = useMemo(
    () => ["Natureza", "Pessoas", "Tecnologia", "Animais", "Esportes"],
    []
  );

  const handleSearch = (e) => {
    if (e?.preventDefault) e.preventDefault();
    setQuery(localQuery.trim());
    setCategoria("");
    setActivateSearch(true);
  };

  return (
    <motion.form
      className="search-bar"
      role="search"
      aria-label="Pesquisar fotos"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSearch}
    >
      <div className="input-wrapper">
        <Search className="icon" size={18} aria-hidden="true" focusable="false" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Pesquisar fotos..."
          aria-label="Campo de busca de fotos"
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>

      <button className="search-btn" type="submit" aria-label="Executar pesquisa">
        <Search className="icon" size={18} aria-hidden="true" focusable="false" />
        Pesquisar
      </button>

      <div className="select-wrapper">
        <List className="icon" size={18} aria-hidden="true" focusable="false" />
        <select
          defaultValue=""
          name="categoria"
          onChange={(e) => {
            setCategoria(e.target.value);
            setActivateSearch(true);
          }}
          aria-label="Selecionar categoria"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="liked">Curtidas</option>
          <option value="downloaded">Baixadas</option>
        </select>
      </div>
    </motion.form>
  );
};

export default SearchBar;