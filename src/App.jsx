import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const ADMIN_PASSWORD = "1234";

const CONTACTS = {
  officePhone: "0530 895 49 19",
  secondOfficePhone: "0532 593 37 16",
  mustafaName: "Mustafa Atakan Kırhan",
  mustafaPhone: "0530 895 49 19",
  muzafferName: "Muzaffer Kırhan",
  muzafferPhone: "0532 593 37 16",
  email: "hangayrimenkulkarasu@gmail.com",
  whatsapp: "905308954919",
  instagram: "https://www.instagram.com/hangayrimenkulkarasu/?hl=tr",
  tiktok: "https://www.tiktok.com/@han_gayrimenkul",
  facebook: "https://www.facebook.com/hangayrimenkulkarasu",
};

function TurkishFlag() {
  return (
    <div className="flagBox" title="Türk Bayrağı">
      <svg viewBox="0 0 1200 800" className="flagSvg" aria-label="Türk Bayrağı">
        <rect width="1200" height="800" fill="#E30A17" />
        <circle cx="425" cy="400" r="200" fill="#fff" />
        <circle cx="475" cy="400" r="160" fill="#E30A17" />
        <polygon
          fill="#fff"
          points="680,400 625.6,417.7 625.6,474.9 592,428.6 537.6,446.3 571.2,400 537.6,353.7 592,371.4 625.6,325.1 625.6,382.3"
          transform="scale(1.35) translate(-110,-105)"
        />
      </svg>
    </div>
  );
}

function App() {
  const [ilanlar, setIlanlar] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [sifre, setSifre] = useState("");
  const [filtre, setFiltre] = useState("Tümü");
  const [seciliIlan, setSeciliIlan] = useState(null);
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  const bosForm = {
    title: "",
    price: "",
    location: "Sakarya / Karasu",
    rooms: "",
    area: "",
    status: "Satılık",
    image: "",
    instagram: "",
    maps: "",
    description: "",
  };

  const [form, setForm] = useState(bosForm);

  const ilanlariGetir = async () => {
    const snapshot = await getDocs(collection(db, "ilanlar"));
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setIlanlar(data);
  };

  useEffect(() => {
    ilanlariGetir();
  }, []);

  const whatsappLink = (ilan) =>
    `https://wa.me/${CONTACTS.whatsapp}?text=Merhaba,%20${encodeURIComponent(
      ilan?.title || "gayrimenkul"
    )}%20ilanı%20hakkında%20bilgi%20almak%20istiyorum.`;

  const girisYap = () => {
    if (sifre === ADMIN_PASSWORD) {
      setAdmin(true);
      setSifre("");
    } else {
      alert("Şifre yanlış.");
    }
  };

  const ilanKaydet = async () => {
    if (!form.title || !form.price || !form.image) {
      alert("Başlık, fiyat ve fotoğraf linki zorunlu.");
      return;
    }

    if (duzenlenenId) {
      await updateDoc(doc(db, "ilanlar", duzenlenenId), form);
      setDuzenlenenId(null);
    } else {
      await addDoc(collection(db, "ilanlar"), {
        ...form,
        createdAt: new Date(),
      });
    }

    setForm(bosForm);
    ilanlariGetir();
  };

  const ilanSil = async (id) => {
    if (!confirm("Bu ilan silinsin mi?")) return;
    await deleteDoc(doc(db, "ilanlar", id));
    setSeciliIlan(null);
    ilanlariGetir();
  };

  const ilanDuzenle = (ilan) => {
    setForm({
      title: ilan.title || "",
      price: ilan.price || "",
      location: ilan.location || "Sakarya / Karasu",
      rooms: ilan.rooms || "",
      area: ilan.area || "",
      status: ilan.status || "Satılık",
      image: ilan.image || "",
      instagram: ilan.instagram || "",
      maps: ilan.maps || "",
      description: ilan.description || "",
    });

    setDuzenlenenId(ilan.id);
    setSeciliIlan(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gorunenIlanlar =
    filtre === "Tümü"
      ? ilanlar
      : ilanlar.filter((ilan) => ilan.status === filtre);

  return (
    <div className="page">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #050505; }

        .page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #101418 0%, #050505 45%, #030303 100%);
          color: white;
          font-family: Arial, sans-serif;
        }

        .topHero {
          min-height: 720px;
          background:
            linear-gradient(to bottom, rgba(0,0,0,.32), rgba(0,0,0,.94)),
            linear-gradient(to right, rgba(0,0,0,.70), rgba(0,0,0,.32)),
            url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2200&auto=format&fit=crop");
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid rgba(255,138,0,.28);
        }

        .header {
          padding: 28px 7%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 22px;
          flex-wrap: wrap;
        }

        .brandName {
          margin: 0;
          color: #ff8a00;
          font-size: 38px;
          font-weight: 950;
          letter-spacing: -1px;
        }

        .brandSlogan {
          margin: 6px 0 0;
          color: #ffffff;
          font-size: 22px;
          font-style: italic;
          font-family: "Brush Script MT", "Segoe Script", cursive;
          opacity: .95;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 26px;
          flex-wrap: wrap;
        }

        .adminArea {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .passwordInput {
          padding: 13px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.45);
          background: rgba(0,0,0,.35);
          color: white;
          outline: none;
        }

        .adminBtn {
          padding: 13px 25px;
          border-radius: 999px;
          border: 1px solid #ff8a00;
          background: rgba(0,0,0,.35);
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .flagBox {
          width: 92px;
          height: 62px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0,0,0,.45);
          border: 1px solid rgba(255,255,255,.22);
          animation: flagWave 2s ease-in-out infinite;
          background: #e30a17;
        }

        .flagSvg {
          width: 100%;
          height: 100%;
          display: block;
        }

        @keyframes flagWave {
          0%, 100% { transform: rotate(-1.5deg) scale(1); }
          50% { transform: rotate(2deg) scale(1.035); }
        }

        .heroContent {
          text-align: center;
          padding: 45px 7% 100px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .badge {
          display: inline-block;
          padding: 13px 30px;
          border-radius: 999px;
          border: 1px solid rgba(255,138,0,.75);
          background: rgba(255,138,0,.10);
          color: #ff8a00;
          font-weight: 950;
          font-size: 20px;
        }

        .heroTitle {
          margin: 34px auto 25px;
          max-width: 1000px;
          font-size: clamp(46px, 8vw, 92px);
          line-height: 1.02;
          font-weight: 950;
          letter-spacing: -3px;
          text-shadow: 0 10px 30px rgba(0,0,0,.55);
        }

        .divider {
          width: 150px;
          height: 3px;
          background: linear-gradient(to right, transparent, #ff8a00, transparent);
          margin: 0 auto 24px;
          position: relative;
        }

        .divider::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 13px;
          height: 13px;
          background: #ff8a00;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .heroText {
          max-width: 760px;
          margin: 0 auto;
          color: #eee;
          font-size: 21px;
          line-height: 1.7;
        }

        .heroBtn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 34px;
          padding: 17px 34px;
          background: #ff8a00;
          color: #000;
          border-radius: 999px;
          border: 2px solid white;
          text-decoration: none;
          font-weight: 950;
          font-size: 18px;
          box-shadow: 0 15px 35px rgba(255,138,0,.25);
        }

        .adminPanel {
          max-width: 1160px;
          margin: 45px auto 0;
          padding: 32px;
          border-radius: 28px;
          border: 1px solid rgba(255,138,0,.42);
          background: linear-gradient(135deg, rgba(255,138,0,.12), rgba(255,255,255,.05));
        }

        .adminTitle { color: #ff8a00; margin-top: 0; }

        .formGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 13px;
        }

        .input, .textarea {
          padding: 14px;
          border-radius: 14px;
          border: 1px solid #333;
          background: #111;
          color: white;
          outline: none;
          width: 100%;
        }

        .textarea {
          min-height: 110px;
          resize: vertical;
          grid-column: 1 / -1;
        }

        .addBtn, .cancelBtn {
          display: inline-block;
          margin-top: 18px;
          padding: 14px 26px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-weight: 900;
        }

        .addBtn { background: #ff8a00; color: #000; }

        .cancelBtn {
          margin-left: 10px;
          background: transparent;
          color: white;
          border: 1px solid #777;
        }

        .listings { padding: 70px 7% 40px; }

        .sectionLabel {
          text-align: center;
          color: #ff8a00;
          font-weight: 950;
          letter-spacing: 1px;
          margin: 0;
        }

        .sectionTitle {
          text-align: center;
          font-size: 44px;
          margin: 10px 0 20px;
        }

        .filters {
          display: flex;
          justify-content: center;
          gap: 22px;
          flex-wrap: wrap;
          margin-bottom: 34px;
        }

        .filterBtn {
          min-width: 95px;
          padding: 13px 22px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.35);
          background: transparent;
          color: white;
          cursor: pointer;
          font-weight: 900;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 30px;
        }

        .card {
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: .25s ease;
          box-shadow: 0 18px 45px rgba(0,0,0,.30);
        }

        .card:hover {
          transform: translateY(-7px);
          border-color: rgba(255,138,0,.75);
        }

        .imageWrap {
          height: 240px;
          position: relative;
          overflow: hidden;
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: .4s ease;
        }

        .card:hover .image { transform: scale(1.05); }

        .status {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 8px 13px;
          border-radius: 999px;
          background: #ff8a00;
          color: #000;
          font-weight: 950;
        }

        .cardBody { padding: 22px; }
        .location { color: #bbb; font-size: 14px; }

        .cardTitle {
          font-size: 21px;
          line-height: 1.3;
          min-height: 54px;
          margin: 12px 0;
        }

        .price {
          color: #ff8a00;
          font-size: 27px;
          font-weight: 950;
          margin: 12px 0;
        }

        .details {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin: 14px 0;
        }

        .details span {
          padding: 7px 10px;
          border-radius: 9px;
          border: 1px solid rgba(255,255,255,.18);
          color: #eee;
          font-size: 13px;
        }

        .buttonRow {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 15px;
          border-top: 1px solid rgba(255,255,255,.10);
        }

        .whatsapp, .instagram, .mapsBtn, .editBtn, .deleteBtn {
          padding: 10px 13px;
          border-radius: 10px;
          text-decoration: none;
          color: white;
          font-weight: 900;
          font-size: 13px;
          border: none;
          cursor: pointer;
        }

        .whatsapp { background: rgba(37,211,102,.18); border: 1px solid rgba(37,211,102,.45); }
        .instagram { background: rgba(225,48,108,.18); border: 1px solid rgba(225,48,108,.45); }
        .mapsBtn { background: rgba(255,138,0,.18); border: 1px solid rgba(255,138,0,.55); }
        .editBtn { background: #1f6feb; }
        .deleteBtn { background: #b00020; }

        .moreBtnWrap { text-align: center; margin-top: 40px; }

        .moreBtn {
          display: inline-block;
          padding: 16px 40px;
          border-radius: 999px;
          color: white;
          border: 1px solid #ff8a00;
          text-decoration: none;
          font-weight: 900;
        }

        .contact {
          margin: 30px 7% 0;
          padding: 55px 0;
          border-top: 1px solid rgba(255,255,255,.12);
          text-align: center;
        }

        .contactTitle {
          font-size: 42px;
          margin: 0 0 35px;
        }

        .contactGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          align-items: stretch;
        }

        .contactItem {
          padding: 24px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 16px;
          background: rgba(255,255,255,.035);
        }

        .contactIcon {
          color: #ff8a00;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .contactName {
          color: white;
          margin: 0 0 8px;
          font-weight: 800;
        }

        .contactPhone {
          color: #ff8a00;
          margin: 4px 0;
          font-weight: 950;
          font-size: 18px;
        }

        .emailText { color: white; word-break: break-word; }

        .follow {
          margin-top: 35px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,.12);
        }

        .followTitle {
          display: inline-block;
          margin-bottom: 18px;
          font-weight: 900;
          color: #ddd;
        }

        .socials {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .socialBtn {
          min-width: 160px;
          padding: 13px 25px;
          border-radius: 999px;
          border: 1px solid #ff8a00;
          color: white;
          text-decoration: none;
          font-weight: 900;
        }

        .footer {
          padding: 30px;
          text-align: center;
          color: #aaa;
        }

        .footer strong { color: #ff8a00; }

        .modalBackdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0,0,0,.82);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .modal {
          width: min(1100px, 100%);
          max-height: 92vh;
          overflow: auto;
          background: #0b0b0b;
          border: 1px solid rgba(255,138,0,.5);
          border-radius: 28px;
          box-shadow: 0 30px 90px rgba(0,0,0,.7);
        }

        .modalGrid {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
        }

        .modalImg {
          width: 100%;
          height: 100%;
          min-height: 520px;
          object-fit: cover;
        }

        .modalContent { padding: 34px; position: relative; }

        .closeBtn {
          float: right;
          background: transparent;
          color: white;
          border: 1px solid #666;
          border-radius: 999px;
          padding: 8px 14px;
          cursor: pointer;
        }

        .modalTitle {
          font-size: 34px;
          line-height: 1.2;
          margin: 42px 0 12px;
        }

        .modalPrice {
          color: #ff8a00;
          font-size: 34px;
          font-weight: 950;
        }

        .modalDesc {
          color: #ccc;
          line-height: 1.7;
          font-size: 16px;
        }

        @media (max-width: 800px) {
          .topHero { min-height: auto; }
          .header { padding: 20px 22px; }
          .brandName { font-size: 30px; }
          .brandSlogan { font-size: 18px; }
          .flagBox { width: 72px; height: 48px; }
          .heroContent { padding: 45px 22px 75px; }
          .heroTitle { letter-spacing: -1px; }
          .listings { padding: 55px 22px 30px; }
          .modalGrid { grid-template-columns: 1fr; }
          .modalImg { min-height: 300px; }
          .buttonRow a, .buttonRow button { flex: 1; text-align: center; }
        }
      `}</style>

      <section className="topHero">
        <header className="header">
          <div>
            <h1 className="brandName">Han Gayrimenkul</h1>
            <p className="brandSlogan">Doğru yatırım, güvenle değer katar</p>
          </div>

          <div className="headerRight">
            <div className="adminArea">
              {!admin ? (
                <>
                  <input
                    type="password"
                    placeholder="Admin şifre"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    className="passwordInput"
                  />
                  <button onClick={girisYap} className="adminBtn">
                    Admin Giriş
                  </button>
                </>
              ) : (
                <button onClick={() => setAdmin(false)} className="adminBtn">
                  Admin Çıkış
                </button>
              )}
            </div>
            <TurkishFlag />
          </div>
        </header>

        <div className="heroContent">
          <span className="badge">Sakarya / Karasu</span>
          <h2 className="heroTitle">Gayrimenkulde güven, yatırımda değer.</h2>
          <div className="divider"></div>
          <p className="heroText">
            Han Gayrimenkul; satılık, kiralık ve yatırım odaklı portföyleri
            güvenilir, şeffaf ve profesyonel şekilde sunar.
          </p>
          <a
            href={`https://wa.me/${CONTACTS.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="heroBtn"
          >
            WhatsApp ile Hemen İletişime Geç
          </a>
        </div>
      </section>

      {admin && (
        <section className="adminPanel">
          <h2 className="adminTitle">{duzenlenenId ? "İlan Düzenle" : "İlan Ekle"}</h2>

          <div className="formGrid">
            <input className="input" placeholder="İlan başlığı" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="input" placeholder="Fiyat örn: 3.500.000 TL" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="input" placeholder="Konum" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="input" placeholder="Oda örn: 2+1" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: e.target.value })} />
            <input className="input" placeholder="m² örn: 120" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Satılık</option>
              <option>Kiralık</option>
            </select>
            <input className="input" placeholder="Fotoğraf direkt linki" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <input className="input" placeholder="Instagram ilan linki" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            <input className="input" placeholder="Google Maps konum linki" value={form.maps} onChange={(e) => setForm({ ...form, maps: e.target.value })} />
            <textarea className="textarea" placeholder="İlan açıklaması" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <button className="addBtn" onClick={ilanKaydet}>
            {duzenlenenId ? "İlanı Güncelle" : "İlan Ekle"}
          </button>

          {duzenlenenId && (
            <button className="cancelBtn" onClick={() => { setDuzenlenenId(null); setForm(bosForm); }}>
              Vazgeç
            </button>
          )}
        </section>
      )}

      <section className="listings">
        <p className="sectionLabel">PORTFÖYLERİMİZ</p>
        <h2 className="sectionTitle">Güncel İlanlar</h2>

        <div className="filters">
          {["Tümü", "Satılık", "Kiralık"].map((x) => (
            <button
              key={x}
              className="filterBtn"
              onClick={() => setFiltre(x)}
              style={{
                background: filtre === x ? "#ff8a00" : "transparent",
                color: filtre === x ? "#000" : "#fff",
                borderColor: filtre === x ? "#ff8a00" : "rgba(255,255,255,.35)",
              }}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="cards">
          {gorunenIlanlar.map((ilan) => (
            <div className="card" key={ilan.id} onClick={() => setSeciliIlan(ilan)}>
              <div className="imageWrap">
                <img className="image" src={ilan.image} alt={ilan.title} />
                <span className="status">{ilan.status || "Satılık"}</span>
              </div>

              <div className="cardBody">
                <p className="location">Konum: {ilan.location}</p>
                <h3 className="cardTitle">{ilan.title}</h3>
                <p className="price">{ilan.price}</p>

                <div className="details">
                  {ilan.rooms && <span>{ilan.rooms}</span>}
                  {ilan.area && <span>{ilan.area} m²</span>}
                </div>

                <div className="buttonRow">
                  <a href={whatsappLink(ilan)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="whatsapp">WhatsApp</a>
                  {ilan.instagram && <a href={ilan.instagram} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="instagram">Instagram</a>}
                  {ilan.maps && <a href={ilan.maps} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="mapsBtn">Konumu Gör</a>}
                  {admin && (
                    <>
                      <button className="editBtn" onClick={(e) => { e.stopPropagation(); ilanDuzenle(ilan); }}>Düzenle</button>
                      <button className="deleteBtn" onClick={(e) => { e.stopPropagation(); ilanSil(ilan.id); }}>Sil</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="moreBtnWrap">
          <a href="#contact" className="moreBtn">Tüm ilanlar için iletişime geç →</a>
        </div>
      </section>

      {seciliIlan && (
        <div className="modalBackdrop" onClick={() => setSeciliIlan(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalGrid">
              <img className="modalImg" src={seciliIlan.image} alt={seciliIlan.title} />
              <div className="modalContent">
                <button className="closeBtn" onClick={() => setSeciliIlan(null)}>Kapat</button>
                <h2 className="modalTitle">{seciliIlan.title}</h2>
                <p className="location">Konum: {seciliIlan.location}</p>
                <p className="modalPrice">{seciliIlan.price}</p>

                <div className="details">
                  {seciliIlan.rooms && <span>{seciliIlan.rooms}</span>}
                  {seciliIlan.area && <span>{seciliIlan.area} m²</span>}
                  {seciliIlan.status && <span>{seciliIlan.status}</span>}
                </div>

                <p className="modalDesc">
                  {seciliIlan.description || "Bu ilan hakkında detaylı bilgi almak için WhatsApp üzerinden bizimle iletişime geçebilirsiniz."}
                </p>

                <div className="buttonRow">
                  <a href={whatsappLink(seciliIlan)} target="_blank" rel="noreferrer" className="whatsapp">WhatsApp ile Bilgi Al</a>
                  {seciliIlan.instagram && <a href={seciliIlan.instagram} target="_blank" rel="noreferrer" className="instagram">Instagram’da Gör</a>}
                  {seciliIlan.maps && <a href={seciliIlan.maps} target="_blank" rel="noreferrer" className="mapsBtn">Google Maps’te Aç</a>}
                  {admin && (
                    <>
                      <button className="editBtn" onClick={() => ilanDuzenle(seciliIlan)}>Düzenle</button>
                      <button className="deleteBtn" onClick={() => ilanSil(seciliIlan.id)}>Sil</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="contact" className="contact">
        <h2 className="contactTitle">İletişim</h2>

        <div className="contactGrid">
          <div className="contactItem">
            <div className="contactIcon">☎</div>
            <p className="contactName">Han Gayrimenkul</p>
            <p className="contactPhone">{CONTACTS.officePhone}</p>
            <p className="contactPhone">{CONTACTS.secondOfficePhone}</p>
          </div>

          <div className="contactItem">
            <div className="contactIcon">👤</div>
            <p className="contactName">{CONTACTS.mustafaName}</p>
            <p className="contactPhone">{CONTACTS.mustafaPhone}</p>
          </div>

          <div className="contactItem">
            <div className="contactIcon">👤</div>
            <p className="contactName">{CONTACTS.muzafferName}</p>
            <p className="contactPhone">{CONTACTS.muzafferPhone}</p>
          </div>

          <div className="contactItem">
            <div className="contactIcon">✉</div>
            <p className="contactName">E-posta</p>
            <p className="emailText">{CONTACTS.email}</p>
          </div>
        </div>

        <p style={{ marginTop: 28, fontSize: 18 }}>Konum: Sakarya / Karasu</p>

        <div className="follow">
          <span className="followTitle">Bizi Takip Edin</span>
          <div className="socials">
            <a className="socialBtn" href={CONTACTS.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="socialBtn" href={CONTACTS.tiktok} target="_blank" rel="noreferrer">TikTok</a>
            <a className="socialBtn" href={CONTACTS.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2026 <strong>Han Gayrimenkul</strong> — Doğru yatırım, güvenle değer katar
      </footer>
    </div>
  );
}

export default App;