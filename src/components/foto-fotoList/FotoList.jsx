import Foto from "./Foto";
import "./foto.scss";

const FotoList = ({ fotos, setFotoAmpliada }) => {
  return (
    <div className="album" aria-label="Lista de fotos" role="list">
      {fotos.map((foto) => (
        <Foto key={foto.id} dados={foto} setFotoAmpliada={setFotoAmpliada} />
      ))}
    </div>
  );
};

export default FotoList;