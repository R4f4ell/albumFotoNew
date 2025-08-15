import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Download } from 'lucide-react';
import './fotoAmpliada.scss';

import {
  getInteraction,
  incrementLike,
  incrementDownload,
} from '../../utils/interactions';

const FotoAmpliada = ({ foto, setFotoAmpliada }) => {
  const [liked, setLiked] = useState(false);
  const imageRef = useRef(null);

  // fecha modal com Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setFotoAmpliada(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setFotoAmpliada]);

  // bloqueia scroll ao abrir
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // carrega estado de like
  useEffect(() => {
    const load = async () => {
      const interaction = await getInteraction(foto.id);
      if (interaction?.likes > 0) setLiked(true);
    };
    if (foto?.id) load();
  }, [foto]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      incrementLike(foto.id).catch(console.error);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    const res = await fetch(foto.urls.full);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${foto.id}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
    incrementDownload(foto.id).catch(console.error);
  };

  const handleClose = () => setFotoAmpliada(null);

  const onMove = (e) => {
    if (window.innerWidth < 1024) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  const onEnter = () => {
    if (window.innerWidth < 1024) return;
    imageRef.current.style.transform = 'scale(2)';
  };

  const onLeave = () => {
    if (window.innerWidth < 1024) return;
    imageRef.current.style.transform = 'scale(1)';
    imageRef.current.style.transformOrigin = 'center center';
  };

  return (
    <div className="foto-ampliada-backdrop" onClick={handleClose}>
      <div
        className="foto-ampliada-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="close-btn"
          onClick={handleClose}
          aria-label="Fechar imagem ampliada"
        >
          <X />
        </button>
        <img
          ref={imageRef}
          src={foto.urls.regular}
          alt={foto.alt_description}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        />
        <div className="modal-actions">
          <button
            className="like-btn"
            onClick={handleLike}
            aria-label="Curtir imagem"
          >
            <Heart
              fill={liked ? '#ff0000' : 'none'}
              color={liked ? '#ff0000' : '#ffffff'}
            />
          </button>
          <button
            className="download-btn"
            onClick={handleDownload}
            aria-label="Baixar imagem"
          >
            <Download />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FotoAmpliada;