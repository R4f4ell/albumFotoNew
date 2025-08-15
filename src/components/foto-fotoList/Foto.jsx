const Foto = ({ dados, setFotoAmpliada }) => {
  const {
    urls: { small },
    alt_description,
  } = dados;

  const handleClick = () => setFotoAmpliada(dados);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFotoAmpliada(dados);
    }
  };

  return (
    <button
      type="button"
      className="foto"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Visualizar foto ampliada"
    >
      <img src={small} alt={alt_description || 'Foto'} />
    </button>
  );
};

export default Foto;