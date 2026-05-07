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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappLink = (ilan) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20${encodeURIComponent(
      ilan?.title || "gayrimenkul"
    )}%20ilanı%20hakkında%20bilgi%20almak%20istiyorum.`;

  const gorunenIlanlar =
    filtre === "Tümü"
      ? ilanlar
      : ilanlar.filter((ilan) => ilan.status === filtre);

  return (
    <div className="page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #050505;
        }

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

        .logo {
          margin: 0;
          color: #ff8a00;
          font-size: 34px;
          font-weight: 900;
        }

        .slogan {
          margin: 2px 0 0;
          color: #ddd;
          font-size: 14px;
        }

        .adminArea {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .passwordInput,
        .input,
        .textarea {
          padding: 13px;
          border-radius: 14px;
          border: 1px solid #333;
          background: #111;
          color: white !important;
          outline: none;
          width: 100%;
        }

        .passwordInput {
          border-radius: 999px;
          width: auto;
        }

        .adminBtn,
        .filterBtn {
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
          word-break: break-word;
        }

        .heroText {
          max-width: 690px;
          color: #ddd;
          font-size: 20px;
          line-height: 1.7;
        }

        .heroBtn,
        .addBtn,
        .whatsapp,
        .instagram,
        .mapsBtn,
        .editBtn,
        .deleteBtn,
        .cancelBtn {
          display: inline-block;
          padding: 13px 20px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          cursor: pointer;
          border: none;
        }

        .heroBtn,
        .addBtn {
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
          background: linear-gradient(
            135deg,
            rgba(255,138,0,.12),
            rgba(255,255,255,.04)
          );
        }

        .adminTitle {
          color: #ff8a00;
          margin-top: 0;
        }

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

        .cardBody {
          padding: 24px;
        }

        .location {
          color: #aaa;
        }

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

        .whatsapp {
          background: #25D366;
          color: white;
        }

        .instagram {
          background: #E1306C;
          color: white;
        }

        .mapsBtn {
          background: #ff8a00;
          color: #000;
        }

        .editBtn {
          background: #1f6feb;
          color: white;
        }

        .deleteBtn {
          background: #b00020;
          color: white;
        }

        .contact {
          margin: 35px 7%;
          padding: 42px;
          border-radius: 28px;
          background: linear-gradient(
            135deg,
            rgba(255,138,0,.12),
            rgba(255,255,255,.05)
          );
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
          .header,
          .hero,
          .listings {
            padding-left: 22px;
            padding-right: 22px;
          }

          .hero {
            padding-top: 80px;
            padding-bottom: 80px;
          }

          .modalGrid {
            grid-template-columns: 1fr;
          }

          .modalImg {
            min-height: 300px;
          }

          .contact {
            margin: 25px 22px;
            padding: 28px;
          }

          .sectionTitle {
            font-size: 36px;
          }

          .buttonRow {
            flex-direction: column;
            align-items: stretch;
          }

          .buttonRow a,
          .buttonRow button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <header className="header">
        <div>
          <h1 className="logo">Han Gayrimenkul</h1>
          <p className="slogan">
            Doğru yatırım, güvenle değer katar
          </p>
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
            <button
              onClick={() => setAdmin(false)}
              className="adminBtn"
            >
              Admin Çıkış
            </button>
          )}
        </div>
      </header>

      <section className="hero">
        <p className="badge">Sakarya / Karasu</p>

        <h2 className="heroTitle">
          Gayrimenkulde güven, yatırımda değer.
        </h2>

        <p className="heroText">
          Han Gayrimenkul; satılık, kiralık ve yatırım
          odaklı portföyleri güvenilir, şeffaf ve profesyonel
          şekilde sunar.
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="heroBtn"
        >
          WhatsApp ile İletişime Geç
        </a>
      </section>
    </div>
  );
}

export default App;