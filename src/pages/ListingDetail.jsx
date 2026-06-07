import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CONTACTS, ICONS, SITE_URL, DEFAULT_SEO_IMAGE, PROPERTY_TYPES, BLOG_POSTS } from '../constants';
import { slugify, fotoListesi, ilkFoto, ilanSlug, whatsappLink, buildFeatureList, shortPropertyNote, shareListing, shareToWhatsApp, optimizeCloudinaryUrl, toTitleCase } from '../utils';
import { LogoIcon, SEO, AnimatedCounter } from '../components/ui';
import Header from '../components/Header';
import AdminLogin from '../components/AdminLogin';
import FavoriteButton from '../components/FavoriteButton';
import ListingCard from '../components/ListingCard';
import { Contact } from './ContactPages';
import logo from '../assets/logo.png';
import heroVideo from '../assets/villa.mp4';

import { db, auth } from '../firebase';

function ListingDetail({ ilanlar, favorites, toggleFavorite }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [aktifFoto, setAktifFoto] = useState(0);
  const [fullGallery, setFullGallery] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [aktifSekme, setAktifSekme] = useState("aciklama");
  const [mounted, setMounted] = useState(false);
  const touchStartX = React.useRef(null);

  const ilan = useMemo(() => {
    const id = slug?.split("-").pop();
    return ilanlar.find((x) => x.id === id) || ilanlar.find((x) => slug?.startsWith(slugify(x.title)));
  }, [ilanlar, slug]);

  useEffect(() => {
    setAktifFoto(0); setZoomed(false); setAktifSekme("aciklama");
    window.scrollTo(0, 0);
    setMounted(false);
    setTimeout(() => setMounted(true), 80);
  }, [slug]);

  useEffect(() => { setZoomed(false); }, [aktifFoto]);

  const goListings = () => {
    navigate("/?scroll=ilanlar");
    setTimeout(() => { document.getElementById("ilanlar")?.scrollIntoView({ behavior: "smooth" }); }, 50);
  };

  const toTitleCase = (str) => {
    if (!str) return str;
    return str.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  if (!ilan) {
    return (
      <div className="page detailPage">
        <Header detail />
        <div className="notFound">
          <h2>İlan bulunamadı</h2>
          <button className="heroBtn" onClick={goListings}>İlanlara Dön</button>
        </div>
      </div>
    );
  }

  const fotolar = fotoListesi(ilan);
  const current = fotolar[aktifFoto] || ilkFoto(ilan);
  const oncekiFoto = () => { if (fotolar.length < 2) return; setAktifFoto((p) => (p === 0 ? fotolar.length - 1 : p - 1)); };
  const sonrakiFoto = () => { if (fotolar.length < 2) return; setAktifFoto((p) => (p === fotolar.length - 1 ? 0 : p + 1)); };
  const dokunmaBasla = (e) => { touchStartX.current = e.touches[0].clientX; };
  const dokunmaBitir = (e) => {
    if (touchStartX.current === null) return;
    const fark = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(fark) > 45) fark > 0 ? sonrakiFoto() : oncekiFoto();
    touchStartX.current = null;
  };

  const detailUrl = `${SITE_URL}/ilan/${ilanSlug(ilan)}`;
  const seoTitle = `${ilan.title} | ${ilan.location || "Karasu"} | Han Gayrimenkul`;
  const seoDescription = `${ilan.price || ""} ${ilan.status || ""} ${ilan.type || "gayrimenkul"} - ${ilan.location || "Sakarya Karasu"}.`;

  const sekmeler = [
    { id: "aciklama", label: "Açıklama" },
    { id: "ozellikler", label: "Özellikler" },
    { id: "yatirim", label: "Yatırım" },
    ...(ilan.videoUrl ? [{ id: "video", label: "Video" }] : []),
  ];

  return (
    <div className="page detailPage" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <SEO title={seoTitle} description={seoDescription} image={current || DEFAULT_SEO_IMAGE} url={detailUrl} type="article" />
      <Header detail />

      <div className="pdWrap">
        {/* SOL — FOTO KOLONU */}
        <div className="pdPhotoCol">
          <div className="pdMainPhoto" onTouchStart={dokunmaBasla} onTouchEnd={dokunmaBitir} onClick={() => setFullGallery(true)}>
            <img src={current} alt={ilan.title} key={aktifFoto} />
            <div className="pdPhotoOverlay" />
            {fotolar.length > 1 && (
              <>
                <button className="pdArr left" onClick={(e) => { e.stopPropagation(); oncekiFoto(); }}>&#8249;</button>
                <button className="pdArr right" onClick={(e) => { e.stopPropagation(); sonrakiFoto(); }}>&#8250;</button>
              </>
            )}
            <div className="pdPhotoMeta">
              <span className="pdPhotoCount">{aktifFoto + 1} / {fotolar.length}</span>
              <button className="pdPhotoFull" onClick={(e) => { e.stopPropagation(); setFullGallery(true); }}>&#9974; Galeri</button>
            </div>
          </div>

          {fotolar.length > 1 && (
            <div className="pdPhotoGrid">
              {fotolar.slice(0, 6).map((foto, i) => (
                <button key={i} className={`pdPhotoGridItem ${i === aktifFoto ? "active" : ""}`} onClick={() => setAktifFoto(i)}>
                  <img src={foto} alt={`${i + 1}`} />
                  {i === 5 && fotolar.length > 6 && (
                    <div className="pdMoreOverlay" onClick={(e) => { e.stopPropagation(); setFullGallery(true); }}>
                      +{fotolar.length - 6}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SAĞ — BİLGİ KOLONU */}
        <div className="pdInfoCol">
          <button className="pdBackBtn2" onClick={goListings}>&#8592; Geri Dön</button>

          <div className="pdBadgeRow">
            {ilan.status && <span className="pdB orange">{ilan.status}</span>}
            {ilan.type && <span className="pdB outline">{ilan.type}</span>}
          </div>

          <h1 className="pdH1">{toTitleCase(ilan.title)}</h1>
          <p className="pdLoc">&#128205; {ilan.location}</p>
          <p className="pdPriceMain">{ilan.price}</p>

          <div className="pdStatRow">
            {ilan.rooms && <div className="pdStat"><span>&#127985;</span><div><p>Oda</p><strong>{ilan.rooms}</strong></div></div>}
            {ilan.area && <div className="pdStat"><span>&#128208;</span><div><p>Alan</p><strong>{ilan.area} m²</strong></div></div>}
            {ilan.type && <div className="pdStat"><span>&#127968;</span><div><p>Tür</p><strong>{ilan.type}</strong></div></div>}
            {ilan.status && <div className="pdStat"><span>&#127991;</span><div><p>Durum</p><strong>{ilan.status}</strong></div></div>}
          </div>

          <div className="pdTabBar">
            {sekmeler.map(s => (
              <button key={s.id} className={`pdTabBtn ${aktifSekme === s.id ? "active" : ""}`} onClick={() => setAktifSekme(s.id)}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="pdTabBody">
            {aktifSekme === "aciklama" && (
              <div className="pdPane">
                <p className="pdDescText">{ilan.description || "Detaylı bilgi için bizimle iletişime geçebilirsiniz."}</p>
                {ilan.maps && <a href={ilan.maps} target="_blank" rel="noreferrer" className="pdMapA">&#128506; Haritada Görüntüle</a>}
              </div>
            )}
            {aktifSekme === "ozellikler" && (
              <div className="pdPane">
                <div className="pdFeatGrid">
                  {buildFeatureList(ilan).map((item, i) => (
                    <div className="pdFeatItem" key={i}>
                      <span>{item.icon}</span>
                      <div><p>{item.label}</p><strong>{item.value}</strong></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {aktifSekme === "yatirim" && (
              <div className="pdPane">
                <div className="pdYatirimBox">
                  <span>&#128161;</span>
                  <p>{shortPropertyNote(ilan)}</p>
                </div>
              </div>
            )}
            {aktifSekme === "video" && ilan.videoUrl && (
              <div className="pdPane">
                <video src={ilan.videoUrl} controls playsInline preload="metadata" style={{ width: "100%", borderRadius: 12 }} />
              </div>
            )}
          </div>

          <div className="pdCTAStack">
            <a href={whatsappLink(ilan)} target="_blank" rel="noreferrer" className="pdCtaWa">
              <img src={ICONS.whatsapp} alt="" style={{width:20,height:20}} /> WhatsApp ile Bilgi Al
            </a>
            <a href={ilan.instagram || CONTACTS.instagram} target="_blank" rel="noreferrer" className="pdCtaInsta">
              <LogoIcon type="instagram" /> Instagram'da İncele
            </a>
            {ilan.maps && <a href={ilan.maps} target="_blank" rel="noreferrer" className="pdCtaMap">&#128506; Haritada Aç</a>}
          </div>

          <div className="pdSecRow">
            <button onClick={() => shareToWhatsApp(ilan)}>&#128190; Kaydet</button>
            <button onClick={() => shareListing(ilan)}>&#8599; Paylaş</button>
            <FavoriteButton id={ilan.id} favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
        </div>
      </div>

      {fullGallery && (
        <div className="fullGalleryOverlay" onTouchStart={dokunmaBasla} onTouchEnd={dokunmaBitir}>
          <div className="fullGalleryTop">
            <button onClick={() => setFullGallery(false)}>&#10005; Kapat</button>
            <span>{aktifFoto + 1} / {fotolar.length || 1}</span>
            <button onClick={() => setZoomed((v) => !v)}>{zoomed ? "Uzaklaştır" : "Yakınlaştır"}</button>
          </div>
          <button className="fullArrow left" onClick={oncekiFoto}>&#8249;</button>
          <img src={current} alt={ilan.title} className={`fullGalleryImage ${zoomed ? "zoomed" : ""}`} onClick={() => setZoomed((v) => !v)} />
          <button className="fullArrow right" onClick={sonrakiFoto}>&#8250;</button>
          <div className="fullGalleryThumbs">
            {fotolar.map((foto, i) => (
              <button key={i} className={aktifFoto === i ? "active" : ""} onClick={() => setAktifFoto(i)}>
                <img src={foto} alt={`${i + 1}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      <BenzerIlanlar ilan={ilan} ilanlar={ilanlar} favorites={favorites} toggleFavorite={toggleFavorite} />
      <Contact />
    </div>
  );
}

function BenzerIlanlar({ ilan, ilanlar, favorites, toggleFavorite }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const benzerler = useMemo(() => {
    const ayniTur = ilanlar.filter(x => x.id !== ilan.id && x.type === ilan.type);
    const ayniStatus = ilanlar.filter(x => x.id !== ilan.id && x.status === ilan.status && x.type !== ilan.type);
    const combined = [...ayniTur, ...ayniStatus];
    const fallback = ilanlar.filter(x => x.id !== ilan.id);
    return (combined.length > 0 ? combined : fallback).slice(0, 3);
  }, [ilan, ilanlar]);

  if (benzerler.length === 0) return null;

  return (
    <section
      ref={ref}
      className="benzerSection"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
    >
      <p className="sectionLabel">BENZER İLANLAR</p>
      <h2 className="sectionTitle">Bunlara da bakın</h2>
      <div className="cards" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {benzerler.map(b => (
          <ListingCard key={b.id} ilan={b} admin={false} ilanDuzenle={() => {}} ilanSil={() => {}} favorites={favorites} toggleFavorite={toggleFavorite} />
        ))}
      </div>
    </section>
  );
}



export default ListingDetail;
