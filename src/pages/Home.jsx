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

function Home({
  ilanlar,
  admin,
  adminOpen,
  setAdminOpen,
  setAdmin,
  email,
  setEmail,
  sifre,
  setSifre,
  girisYap,
  form,
  setForm,
  duzenlenenId,
  ilanKaydet,
  setDuzenlenenId,
  bosForm,
  ilanDuzenle,
  ilanSil,
  favorites,
  toggleFavorite,
  blogs,
}) {
  const [filtre, setFiltre] = useState("Tümü");
  const [tur, setTur] = useState("Tümü");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [minFiyat, setMinFiyat] = useState("");
  const [maxFiyat, setMaxFiyat] = useState("");

  const parseFiyat = (fiyatStr) => {
    if (!fiyatStr) return null;
    const num = parseInt(fiyatStr.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? null : num;
  };

  const gorunenIlanlar = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const min = minFiyat ? parseInt(minFiyat.replace(/\D/g, ""), 10) : null;
    const max = maxFiyat ? parseInt(maxFiyat.replace(/\D/g, ""), 10) : null;

    return ilanlar
      .filter((ilan) => {
        const statusOk = filtre === "Tümü" || ilan.status === filtre;
        const typeOk = tur === "Tümü" || ilan.type === tur;
        const favOk = !onlyFavorites || favorites.includes(ilan.id);

        const fiyatNum = parseFiyat(ilan.price);
        const minOk = !min || !fiyatNum || fiyatNum >= min;
        const maxOk = !max || !fiyatNum || fiyatNum <= max;

        const searchable = [
          ilan.title, ilan.price, ilan.location, ilan.rooms,
          ilan.area, ilan.status, ilan.type, ilan.description, ilan.investmentNote,
        ].filter(Boolean).join(" ").toLowerCase();

        const searchOk = !q || searchable.includes(q);

        return statusOk && typeOk && favOk && searchOk && minOk && maxOk;
      })
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [ilanlar, filtre, tur, onlyFavorites, favorites, searchTerm, minFiyat, maxFiyat]);

  const publishedBlogs = useMemo(() => (blogs || []).filter((x) => x.isPublished !== false).slice(0, 3), [blogs]);

  return (
    <div className="page">
      <SEO
        title="Han Gayrimenkul | Sakarya Karasu Satılık ve Kiralık Gayrimenkul"
        description="Sakarya Karasu’da satılık, kiralık, arsa, villa, daire ve yatırım odaklı gayrimenkul portföyleri. Han Gayrimenkul ile güvenilir emlak danışmanlığı."
        image={DEFAULT_SEO_IMAGE}
        url={SITE_URL}
      />
      <section className="hero">
        <video className="heroVideo" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="heroShade"></div>

        <Header admin={admin} setAdmin={setAdmin} setAdminOpen={setAdminOpen} />

        {adminOpen && !admin && (
          <AdminLogin email={email} setEmail={setEmail} sifre={sifre} setSifre={setSifre} girisYap={girisYap} />
        )}

        <div className="heroContent">
          <span className="badge">Sakarya / Karasu</span>
          <h2 className="heroTitle">Gayrimenkulde güven, yatırımda değer.</h2>
          <p className="heroText">
            Han Gayrimenkul; satılık, kiralık ve yatırım odaklı portföyleri güvenilir,
            şeffaf ve profesyonel şekilde sunar.
          </p>

          <div className="heroActions">
            <a href={`https://wa.me/${CONTACTS.whatsapp}`} target="_blank" rel="noreferrer" className="heroBtn">
              <LogoIcon type="whatsapp" /> WhatsApp ile İletişime Geç
            </a>
            <Link to="/?scroll=ilanlar" className="ghostBtn">İlanları İncele</Link>
          </div>

          <div className="statsGrid">
            <div className="statBox">
              <strong><AnimatedCounter target={ilanlar.length || 12} suffix="+" /></strong>
              <span>Aktif İlan</span>
            </div>
            <div className="statBox">
              <strong><AnimatedCounter target={3} suffix="+" /></strong>
              <span>Yıllık Deneyim</span>
            </div>
            <div className="statBox">
              <strong><AnimatedCounter target={50} suffix="+" /></strong>
              <span>Mutlu Müşteri</span>
            </div>
            <div className="statBox">
              <strong>Karasu</strong>
              <span>Bölge Uzmanlığı</span>
            </div>
          </div>
        </div>
      </section>
<section id="ilanlar" className="listings">
        <p className="sectionLabel">PORTFÖYLERİMİZ</p>
        <h2 className="sectionTitle">Güncel İlanlar</h2>

        <div className="smartSearchBox">
          <span>🔎</span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Daire, villa, arsa, 2+1, denize yakın..."
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")}>Temizle</button>
          )}
        </div>

        <div className="filters">
          {["Tümü", "Satılık", "Kiralık"].map((x) => (
            <button
              key={x}
              className={`filterBtn ${filtre === x ? "active" : ""}`}
              onClick={() => setFiltre(x)}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="typeFilters">
          {PROPERTY_TYPES.map((x) => (
            <button
              key={x}
              className={`typeFilter ${tur === x ? "active" : ""}`}
              onClick={() => setTur(x)}
            >
              {tur === x ? "●" : "○"} {x}
            </button>
          ))}
        </div>

        <div className="priceRangeRow">
          <span className="priceRangeLabel">💰 Fiyat Aralığı</span>
          <input
            className="priceInput"
            placeholder="Min (ör: 1000000)"
            value={minFiyat}
            onChange={(e) => setMinFiyat(e.target.value)}
          />
          <span className="priceRangeDash">—</span>
          <input
            className="priceInput"
            placeholder="Max (ör: 5000000)"
            value={maxFiyat}
            onChange={(e) => setMaxFiyat(e.target.value)}
          />
          {(minFiyat || maxFiyat) && (
            <button className="clearPriceBtn" onClick={() => { setMinFiyat(""); setMaxFiyat(""); }}>✕ Temizle</button>
          )}
        </div>

        <div className="favoriteFilterRow">
          <button
            className={`favoriteFilter ${onlyFavorites ? "active" : ""}`}
            onClick={() => setOnlyFavorites((v) => !v)}
          >
            {onlyFavorites ? "♥ Favoriler Gösteriliyor" : "♡ Favori İlanlarım"}
          </button>

          {onlyFavorites && (
            <button className="clearFavFilter" onClick={() => setOnlyFavorites(false)}>
              Tüm İlanlara Dön
            </button>
          )}
        </div>

        {gorunenIlanlar.length === 0 ? (
          <div className="emptyState">
            {onlyFavorites
              ? "Henüz favori ilanınız yok. Beğendiğiniz ilanlarda kalp ikonuna basabilirsiniz."
              : "Bu filtreye uygun ilan bulunamadı."}
          </div>
        ) : (
          <div className="cards">
            {gorunenIlanlar.map((ilan) => (
              <ListingCard
                key={ilan.id}
                ilan={ilan}
                admin={admin}
                ilanDuzenle={ilanDuzenle}
                ilanSil={ilanSil}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      <section id="yatirim" className="guide reveal">
        <p className="sectionLabel">YATIRIM REHBERİ</p>
        <h2 className="sectionTitle">Karasu’da doğru yatırım için kısa notlar</h2>
        <div className="guideGrid">
          <div><h3>Konum Değeri</h3><p>Denize, merkeze ve ana yollara yakın portföyler daha güçlü talep görür.</p></div>
          <div><h3>Kira Potansiyeli</h3><p>Yazlık ve merkezi dairelerde dönemsel kira getirisi ayrıca değerlendirilmelidir.</p></div>
          <div><h3>Arsa ve Tarla</h3><p>İmar, yol cephesi ve gelişim aksı mutlaka detaylı kontrol edilmelidir.</p></div>
        </div>
      </section>

      <section className="whyUsSection reveal">
        <p className="sectionLabel">NEDEN HAN GAYRİMENKUL?</p>
        <h2 className="sectionTitle">Güven veren dijital gayrimenkul deneyimi</h2>

        <div className="whyUsGrid">
          <div><span>🏠</span><h3>Bölge Uzmanlığı</h3><p>Karasu ve çevresindeki portföyleri konum, talep ve yatırım potansiyeliyle değerlendiriyoruz.</p></div>
          <div><span>🤝</span><h3>Şeffaf Danışmanlık</h3><p>Portföy bilgilerini açık, net ve güvenilir şekilde sunarak doğru karar almanıza yardımcı oluyoruz.</p></div>
          <div><span>📸</span><h3>Güçlü Dijital Sunum</h3><p>Fotoğraf, video, detay sayfası ve hızlı iletişimle portföyleri modern şekilde sergiliyoruz.</p></div>
          <div><span>💰</span><h3>Yatırım Odaklı Bakış</h3><p>Sadece bugünkü fiyatı değil, gelecekteki değer potansiyelini de dikkate alıyoruz.</p></div>
        </div>
      </section>

      <section className="testimonialsSection reveal">
        <p className="sectionLabel">MÜŞTERİ DENEYİMİ</p>
        <h2 className="sectionTitle">Güven, hız ve doğru yönlendirme</h2>

        <div className="testimonialGrid">
          <div><strong>“İlgili ve hızlı dönüş aldık.”</strong><p>Portföy bilgileri netti, süreç boyunca hızlı iletişim kuruldu.</p><span>Han Gayrimenkul müşterisi</span></div>
          <div><strong>“Karasu bölgesi için doğru yönlendirme.”</strong><p>Yatırım açısından konum ve portföy değerlendirmesi çok yardımcı oldu.</p><span>Yatırım amaçlı alıcı</span></div>
          <div><strong>“Modern ve güven veren sunum.”</strong><p>İlan detayları, fotoğraflar ve iletişim süreci oldukça profesyoneldi.</p><span>Portföy inceleyen müşteri</span></div>
        </div>
      </section>

      <section id="blog" className="blogSection reveal">
        <p className="sectionLabel">KARASU REHBERİ</p>
        <h2 className="sectionTitle">Yatırım ve Gayrimenkul Rehberi</h2>

        <div className="blogGrid">
          {publishedBlogs.length === 0 ? (
            <div className="emptyState">Henüz yayında blog yazısı yok.</div>
          ) : (
            publishedBlogs.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blogCard" key={post.id || post.slug}>
                {post.coverImage && <img src={post.coverImage} alt={post.title} className="blogCardImage" />}
                <span>{post.category || "Rehber"}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <strong>Devamını Oku →</strong>
              </Link>
            ))
          )}
        </div>

        <div className="blogMoreRow">
          <Link to="/blog" className="heroBtn">Tüm Blog Yazıları</Link>
        </div>
      </section>


      <Contact />

      <a
        href={`https://wa.me/${CONTACTS.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="floatingWhatsapp"
        aria-label="WhatsApp ile iletişime geç"
      >
        <img src={ICONS.whatsapp} alt="WhatsApp" />
        <span>Bize Ulaşın</span>
      </a>
    </div>
  );
}


export default Home;
