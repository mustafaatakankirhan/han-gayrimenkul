import React from 'react';

function FavoriteButton({ id, favorites, toggleFavorite, compact = false }) {
  const active = favorites.includes(id);

  return (
    <button
      className={`favoriteBtn ${active ? "active" : ""} ${compact ? "compact" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
      }}
      title={active ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      {active ? "♥" : "♡"} {compact ? "" : active ? "Favoride" : "Favori"}
    </button>
  );
}


export default FavoriteButton;
