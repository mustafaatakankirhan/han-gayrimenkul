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
const WHATSAPP_NUMBER = "905308954919";
const EMAIL = "hangayrimenkulkarasu@gmail.com";

function App() {
  const [ilanlar, setIlanlar] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [sifre, setSifre] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [filtre, setFiltre] = useState("Tümü");
  const [seciliIlan, setSeciliIlan] = useState(null);

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
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setIlanlar(data);
  };

  useEffect(() => {
    ilanlariGetir();
  }, []);

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
    ilanlariGetir();
    setSeciliIlan(null);
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

  const whatsappLink = (ilan) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20${encodeURIComponent(
      ilan?.title || "gayrimenkul"
    )}%20ilanı%20hakkında%20bilgi%20almak%20istiyorum.`;

  const gorunenIlanlar =
    filtre === "Tümü" ? ilanlar : ilanlar.filter((ilan) => ilan.status === filtre);

  return (
    <div className="page">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #050505; }
        .page {
          min-height: 100vh;
          background: #050505;
          color: white;
          font-family: Arial, sans-serif;
        }
        .header {
          min-height: 86px;
          padding: 18px 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: rgba(0,0,0,.78);
          border-bottom: 1px solid rgba(255,255,255,.12);
          backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 20;
          flex-wrap: wrap;
        }
        .logo { margin: 0; color: #ff8a00; font-size: 34px; font-weight: 900; }
        .slogan { margin: 2px 0 0; color: #ddd; font-size: 14px; }
        .adminArea { display: flex; gap: 10px; flex-wrap: wrap; }
        .passwordInput, .input, .textarea {
          padding: 13px;
          border-radius: 14px;
          border: 1px solid #333;
          background: #111;
          color: white;
          outline: none;
        }
        .passwordInput { border-radius: 999px; }
        .adminBtn, .filterBtn {
          padding: 12px 20px;
          border-radius: 999px;
          border: 1px solid #ff8a00;
          background: transparent;
          color: white;
          cursor: pointer;
          font-weight: 800;
        }
        .hero {
          padding: 120px 7%;
          background:
            linear-gradient(to right, rgba(0,0,0,.95), rgba(0,0,0,.42)),
            url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop");
          background-size: cover;
          background-position: center;
        }
        .badge {
          display: inline-block;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,138,0,.45);
          background: rgba(255,138,0,.12);
          color: #ff8a00;
          font-weight: 800;
        }
        .heroTitle {
          max-width: 850px;
          font-size: clamp(42px, 7vw, 76px);
          line-height: 1.02;
          margin: 22px 0;
          font-weight: 900;
        }
        .heroText {
          max-width: 690px;
          color: #ddd;
          font-size: 20px;
          line-height: 1.7;
        }
        .heroBtn, .addBtn, .whatsapp, .instagram, .mapsBtn, .editBtn, .deleteBtn, .cancelBtn {
          display: inline-block;
          padding: 13px 20px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          cursor: pointer;
          border: none;
        }
        .heroBtn, .addBtn {
          background: #ff8a00;
          color: #000;
          margin-top: 24px;
        }
        .adminPanel {
          max-width: 1150px;
          margin: 45px auto;
          padding: 32px;
          border: 1px solid rgba(255,138,0,.42);
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(255,138,0,.12), rgba(255,255,255,.04));
        }
        .adminTitle { color: #ff8a00; margin-top: 0; }
        .formGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 13px;
        }
        .textarea {
          min-height: 110px;
          resize: vertical;
          grid-column: 1 / -1;
        }
        .cancelBtn {
          margin-left: 10px;
          background: transparent;
          color: white;
          border: 1px solid #777;
        }
        .listings {
          padding: 75px 7%;
        }
        .sectionLabel {
          color: #ff8a00;
          letter-spacing: 4px;
          font-weight: 900;
          font-size: 14px;
        }
        .sectionTitle {
          font-size: 46px;
          margin: 10px 0 20px;
        }
        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 28px;
        }
        .card {
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,138,0,.36);
          border-radius: 30px;
          overflow: hidden;
          cursor: pointer;
          transition: .25s ease;
          box-shadow: 0 20px 50px rgba(0,0,0,.25);
        }
        .card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,138,0,.85);
          background: rgba(255,255,255,.08);
        }
        .imageWrap {
          height: 255px;
          position: relative;
          overflow: hidden;
        }
        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: .45s ease;
        }
        .card:hover .image {
          transform: scale(1.06);
        }
        .status {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #ff8a00;
          color: #000;
          padding: 9px 16px;
          border-radius: 999px;
          font-weight: 900;
        }
        .cardBody { padding: 24px; }
        .location { color: #aaa; }
        .cardTitle {
          min-height: 62px;
          font-size: 23px;
          line-height: 1.3;
          margin: 10px 0;
        }
        .price {
          color: #ff8a00;
          font-size: 29px;
          font-weight: 900;
          margin: 12px 0;
        }
        .details {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          color: #eee;
          font-weight: 800;
        }
        .details span {
          background: rgba(255,255,255,.08);
          padding: 8px 12px;
          border-radius: 12px;
        }
        .buttonRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 18px;
          align-items: center;
        }
        .whatsapp { background: #25D366; color: white; }
        .instagram { background: #E1306C; color: white; }
        .mapsBtn { background: #ff8a00; color: #000; }
        .editBtn { background: #1f6feb; color: white; }
        .deleteBtn { background: #b00020; color: white; }
        .contact {
          margin: 35px 7%;
          padding: 42px;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(255,138,0,.12), rgba(255,255,255,.05));
          border: 1px solid rgba(255,255,255,.1);
        }
        .footer {
          padding: 35px;
          text-align: center;
          color: #777;
          border-top: 1px solid rgba(255,255,255,.12);
        }
        .modalBackdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.82);
          z-index: 100;
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
          border-radius: 30px;
          box-shadow: 0 30px 90px rgba(0,0,0,.65);
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
        .modalContent {
          padding: 34px;
        }
        .closeBtn {
          float: right;
          background: transparent;
          color: white;
          border: 1px solid #555;
          border-radius: 999px;
          padding: 8px 14px;
          cursor: pointer;
        }
        .modalTitle {
          font-size: 34px;
          line-height: 1.2;
          margin: 40px 0 12px;
        }
        .modalPrice {
          color: #ff8a00;
          font-size: 34px;
          font-weight: 900;
        }
        .modalDesc {
          color: #ccc;
          line-height: 1.7;
          font-size: 16px;
        }
        @media (max-width: 800px) {
          .header, .hero, .listings { padding-left: 22px; padding-right: 22px; }
          .hero { padding-top: 80px; padding-bottom: 80px; }
          .modalGrid { grid-template-columns: 1fr; }
          .modalImg { min-height: 300px; }
          .contact { margin: 25px 22px; padding: 28px; }
          .sectionTitle { font-size: 36px; }
        }
      `}</style>

      <header className="header">
        <div>
          <h1 className="logo">Han Gayrimenkul</h1>
          <p className="slogan">Yatırımınıza güvenle değer</p>
        </div>

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
      </header>

      <section className="hero">
        <p className="badge">Sakarya / Karasu</p>
        <h2 className="heroTitle">Gayrimenkulde güven, yatırımda değer.</h2>
        <p className="heroText">
          Han Gayrimenkul; satılık, kiralık ve yatırım odaklı portföyleri
          güvenilir, şeffaf ve profesyonel şekilde sunar.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20gayrimenkul%20hakkında%20bilgi%20almak%20istiyorum.`}
          target="_blank"
          rel="noreferrer"
          className="heroBtn"
        >
          WhatsApp ile İletişime Geç
        </a>
      </section>

      {admin && (
        <section className="adminPanel">
          <h2 className="adminTitle">
            {duzenlenenId ? "İlan Düzenle" : "İlan Ekle"}
          </h2>

          <div className="formGrid">
            <input placeholder="İlan başlığı" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
            <input placeholder="Fiyat örn: 3.500.000 TL" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
            <input placeholder="Konum yazısı örn: Sakarya / Karasu" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" />
            <input placeholder="Oda örn: 2+1" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: e.target.value })} className="input" />
            <input placeholder="m² örn: 120" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input" />

            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
              <option>Satılık</option>
              <option>Kiralık</option>
            </select>

            <input placeholder="Fotoğraf direkt linki" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" />
            <input placeholder="Instagram ilan linki" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="input" />
            <input placeholder="Google Maps konum linki" value={form.maps} onChange={(e) => setForm({ ...form, maps: e.target.value })} className="input" />

            <textarea
              placeholder="İlan açıklaması"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="textarea"
            />
          </div>

          <button onClick={ilanKaydet} className="addBtn">
            {duzenlenenId ? "İlanı Güncelle" : "İlan Ekle"}
          </button>

          {duzenlenenId && (
            <button
              onClick={() => {
                setDuzenlenenId(null);
                setForm(bosForm);
              }}
              className="cancelBtn"
            >
              Vazgeç
            </button>
          )}
        </section>
      )}

      <section className="listings">
        <p className="sectionLabel">PORTFÖYLER</p>
        <h2 className="sectionTitle">Güncel İlanlar</h2>

        <div className="filters">
          {["Tümü", "Satılık", "Kiralık"].map((x) => (
            <button
              key={x}
              onClick={() => setFiltre(x)}
              className="filterBtn"
              style={{
                background: filtre === x ? "#ff8a00" : "transparent",
                color: filtre === x ? "#000" : "#fff",
              }}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="cards">
          {gorunenIlanlar.map((ilan) => (
            <div key={ilan.id} className="card" onClick={() => setSeciliIlan(ilan)}>
              <div className="imageWrap">
                <img src={ilan.image} alt={ilan.title} className="image" />
                <span className="status">{ilan.status || "Satılık"}</span>
              </div>

              <div className="cardBody">
                <p className="location">{ilan.location}</p>
                <h3 className="cardTitle">{ilan.title}</h3>
                <p className="price">{ilan.price}</p>

                <div className="details">
                  {ilan.rooms && <span>{ilan.rooms}</span>}
                  {ilan.area && <span>{ilan.area} m²</span>}
                </div>

                <div className="buttonRow">
                  <a
                    href={whatsappLink(ilan)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="whatsapp"
                  >
                    WhatsApp
                  </a>

                  {ilan.instagram && (
                    <a
                      href={ilan.instagram}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="instagram"
                    >
                      Instagram
                    </a>
                  )}

                  {ilan.maps && (
                    <a
                      href={ilan.maps}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mapsBtn"
                    >
                      Konumu Gör
                    </a>
                  )}

                  {admin && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          ilanDuzenle(ilan);
                        }}
                        className="editBtn"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          ilanSil(ilan.id);
                        }}
                        className="deleteBtn"
                      >
                        Sil
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {seciliIlan && (
        <div className="modalBackdrop" onClick={() => setSeciliIlan(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalGrid">
              <img src={seciliIlan.image} alt={seciliIlan.title} className="modalImg" />

              <div className="modalContent">
                <button className="closeBtn" onClick={() => setSeciliIlan(null)}>
                  Kapat
                </button>

                <span className="status">{seciliIlan.status}</span>
                <h2 className="modalTitle">{seciliIlan.title}</h2>
                <p className="location">{seciliIlan.location}</p>
                <p className="modalPrice">{seciliIlan.price}</p>

                <div className="details">
                  {seciliIlan.rooms && <span>{seciliIlan.rooms}</span>}
                  {seciliIlan.area && <span>{seciliIlan.area} m²</span>}
                </div>

                <p className="modalDesc">
                  {seciliIlan.description ||
                    "Bu ilan hakkında detaylı bilgi almak için WhatsApp üzerinden bizimle iletişime geçebilirsiniz."}
                </p>

                <div className="buttonRow">
                  <a href={whatsappLink(seciliIlan)} target="_blank" rel="noreferrer" className="whatsapp">
                    WhatsApp ile Bilgi Al
                  </a>

                  {seciliIlan.instagram && (
                    <a href={seciliIlan.instagram} target="_blank" rel="noreferrer" className="instagram">
                      Instagram’da Gör
                    </a>
                  )}

                  {seciliIlan.maps && (
                    <a href={seciliIlan.maps} target="_blank" rel="noreferrer" className="mapsBtn">
                      Google Maps’te Konumu Gör
                    </a>
                  )}

                  {admin && (
                    <>
                      <button onClick={() => ilanDuzenle(seciliIlan)} className="editBtn">
                        Düzenle
                      </button>
                      <button onClick={() => ilanSil(seciliIlan.id)} className="deleteBtn">
                        Sil
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="contact">
        <h2>İletişim</h2>
        <p>Telefon: 0530 895 4919</p>
        <p>E-posta: {EMAIL}</p>
        <p>Adres: Sakarya / Karasu</p>
      </section>

      <footer className="footer">
        © 2026 Han Gayrimenkul — Yatırımınıza güvenle değer
      </footer>
    </div>
  );
}

export default App;