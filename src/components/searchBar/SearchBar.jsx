import { useState } from "react";
import { Search, List } from "lucide-react";
import { motion } from "framer-motion";
import './searchBar.scss';

const SearchBar = ({ setQuery, setCategoria, setActivateSearch }) => {
  const [localQuery, setLocalQuery] = useState("");
  const categorias = [
    "Natureza",
    "Pessoas",
    "Tecnologia",
    "Animais",
    "Esportes",
  ];

  // Busca (Enter ou botão)
  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setQuery(localQuery);
    setCategoria("");           
    setActivateSearch(true);
  };

  return (
    <motion.form
      className="search-bar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSearch}
    >
      <div className="input-wrapper">
        <Search className="icon" size={18} />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Pesquisar fotos..."
          aria-label="Campo de busca de fotos"
        />
      </div>

      <button
        className="search-btn"
        type="submit"
        aria-label="Pesquisar imagens"
      >
        <Search className="icon" size={18} />
        Pesquisar
      </button>

      <div className="select-wrapper">
        <List className="icon" size={18} />
        <select
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