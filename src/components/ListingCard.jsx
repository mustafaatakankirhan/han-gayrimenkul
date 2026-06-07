import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACTS, ICONS } from '../constants';
import { whatsappLink, ilanSlug, fotoListesi, ilkFoto, shareListing, shareToWhatsApp, optimizeCloudinaryUrl } from '../utils';
import { LogoIcon } from './ui';
import FavoriteButton from './FavoriteButton';

function ListingCard({ ilan, admin, ilanDuzenle, ilanSil, favorites, toggleFavorite }) {
  const fotolar = fotoListesi(ilan);
  const slug = ilanSlug(ilan);

  return (
    <article className="card">
      <Link to={`/ilan/${slug}`} className="cardMainLink">
        <div className="imageWrap">
          <img className="image" src={ilkFoto(ilan)} alt={ilan.title} loading="lazy" />
          <span className="status">{ilan.status || "Satılık"}</span>
          {ilan.featured && <span className="featuredBadge">⭐ Öne Çıkan</span>}
          {ilan.videoUrl && <span className="videoBadge">▶ Video</span>}
          {ilan.type && <span className="typeBadge">{ilan.type}</span>}
          {fotolar.length > 1 && <span className="photoCount">{fotolar.length} fotoğraf</span>}
          <FavoriteButton id={ilan.id} favorites={favorites} toggleFavorite={toggleFavorite} compact />
        </div>

        <div className="cardBody">
          <p className="location">Konum: {ilan.location}</p>
          <h3 className="cardTitle">{ilan.title}</h3>
          <p className="price">{ilan.price}</p>

          <div className="details">
            {ilan.rooms && <span>{ilan.rooms}</span>}
            {ilan.area && <span>{ilan.area} m²</span>}
            {ilan.type && <span>{ilan.type}</span>}
          </div>
        </div>
      </Link>

      <div className="buttonRow">
        <a href={whatsappLink(ilan)} target="_blank" rel="noreferrer" className="whatsapp">
          <LogoIcon type="whatsapp" /> WhatsApp
        </a>

        {ilan.instagram ? (
          <a href={ilan.instagram} target="_blank" rel="noreferrer" className="instagram">
            <LogoIcon type="instagram" /> Instagram
          </a>
        ) : (
          <a href={CONTACTS.instagram} target="_blank" rel="noreferrer" className="instagram">
            <LogoIcon type="instagram" /> Instagram
          </a>
        )}

        <button className="saveWaBtn" onClick={() => shareToWhatsApp(ilan)} title="Bu ilanı WhatsApp'a kaydet">
          💾 Kaydet
        </button>

        {admin && (
          <>
            <button className="editBtn" onClick={() => ilanDuzenle(ilan)}>Düzenle</button>
            <button className="deleteBtn" onClick={() => ilanSil(ilan.id)}>Sil</button>
          </>
        )}
      </div>
    </article>
  );
}


export default ListingCard;
