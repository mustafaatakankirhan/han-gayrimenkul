import React, { useEffect, useRef, useState } from "react";
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

const ICONS = {
  whatsapp: "https://img.icons8.com/color/48/whatsapp--v1.png",
  instagram: "https://img.icons8.com/fluency/48/instagram-new.png",
  facebook: "https://img.icons8.com/color/48/facebook-new.png",
  tiktok: "https://img.icons8.com/color/48/tiktok--v1.png",
};

function LogoIcon({ type }) {
  return <img src={ICONS[type]} alt={type} className="logoIcon" />;
}

function TurkishFlag() {
  return (
    <div className="flagBox">
      <svg viewBox="0 0 1200 800" className="flagSvg">
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
  const [aktifFoto, setAktifFoto] = useState(0);
  const [fotoYon, setFotoYon] = useState("right");
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  const scrollRef = useRef(0);
  const touchStartX = useRef(null);

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

  const fotoListesi = (ilan) => {
    return (ilan.image || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const ilkFoto = (ilan) => fotoListesi(ilan)[0] || "";

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
      alert("Başlık, fiyat ve en az 1 fotoğraf linki zorunlu.");
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
    kapatModal();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 80);
  };

  const ilanAc = (ilan) => {
    scrollRef.current = window.scrollY;
    setSeciliIlan(ilan);
    setAktifFoto(0);
    setFotoYon("right");
  };

  const kapatModal = () => {
    setSeciliIlan(null);
    setTimeout(() => {
      window.scrollTo({ top: scrollRef.current, behavior: "instant" });
    }, 50);
  };

  const fotoDegistir = (index) => {
    if (index === aktifFoto) return;
    setFotoYon(index > aktifFoto ? "right" : "left");
    setAktifFoto(index);
  };

  const oncekiFoto = () => {
    if (!seciliIlan) return;
    const fotolar = fotoListesi(seciliIlan);
    if (fotolar.length < 2) return;
    setFotoYon("left");
    setAktifFoto((prev) => (prev === 0 ? fotolar.length - 1 : prev - 1));
  };

  const sonrakiFoto = () => {
    if (!seciliIlan) return;
    const fotolar = fotoListesi(seciliIlan);
    if (fotolar.length < 2) return;
    setFotoYon("right");
    setAktifFoto((prev) => (prev === fotolar.length - 1 ? 0 : prev + 1));
  };

  const dokunmaBasla = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const dokunmaBitir = (e) => {
    if (touchStartX.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const fark = touchStartX.current - endX;

    if (Math.abs(fark) > 45) {
      if (fark > 0) sonrakiFoto();
      else oncekiFoto();
    }

    touchStartX.current = null;
  };

  const gorunenIlanlar =
    filtre === "Tümü"
      ? ilanlar
      : ilanlar.filter((ilan) => ilan.status === filtre);

  const seciliFotolar = seciliIlan ? fotoListesi(seciliIlan) : [];

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
          color: #ffffff;
          text-shadow:
            0 4px 0 rgba(0,0,0,.35),
            0 14px 40px rgba(0,0,0,.95);
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
          color: #fff;
          font-size: 21px;
          line-height: 1.7;
          text-shadow: 0 8px 24px rgba(0,0,0,.95);
        }

        .heroBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
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

        .logoIcon {
          width: 22px;
          height: 22px;
          object-fit: contain;
          display: inline-block;
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

        .hint {
          grid-column: 1 / -1;
          color: #bbb;
          font-size: 13px;
          margin-top: -5px;
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
          transition: .2s ease;
        }

        .filterBtn:hover {
          transform: translateY(-2px);
          border-color: #ff8a00;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 30px;
        }

        .card {
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease, background .28s ease;
          box-shadow: 0 18px 45px rgba(0,0,0,.30);
          transform: scale(1);
        }

        .card:hover {
          transform: scale(1.045) translateY(-8px);
          border-color: rgba(255,138,0,.85);
          background: rgba(255,255,255,.075);
          box-shadow: 0 32px 80px rgba(255,138,0,.13);
          z-index: 2;
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
          transition: transform .45s ease;
        }

        .card:hover .image {
          transform: scale(1.11);
        }

        .photoCount {
          position: absolute;
          right: 14px;
          top: 14px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(0,0,0,.62);
          border: 1px solid rgba(255,255,255,.22);
          color: white;
          font-size: 13px;
          font-weight: 900;
        }

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
          display: inline-flex;
          align-items: center;
          gap: 7px;
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
          min-width: 165px;
          padding: 13px 25px;
          border-radius: 999px;
          border: 1px solid #ff8a00;
          color: white;
          text-decoration: none;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
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
          background: rgba(0,0,0,.86);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .modal {
          width: min(1180px, 100%);
          max-height: 92vh;
          overflow: auto;
          background: #0b0b0b;
          border: 1px solid rgba(255,138,0,.5);
          border-radius: 28px;
          box-shadow: 0 30px 90px rgba(0,0,0,.7);
          animation: modalIn .18s ease;
        }

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modalGrid {
          display: grid;
          grid-template-columns: 1.12fr .88fr;
        }

        .modalGallery {
          padding: 18px;
        }

        .sliderFrame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #050505;
          border-radius: 22px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modalImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
          animation: slidePhoto .24s ease;
        }

        @keyframes slidePhoto {
          from {
            opacity: .55;
            transform: translateX(var(--slide-start, 20px)) scale(1.01);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .galleryArrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.35);
          background: rgba(0,0,0,.55);
          color: white;
          font-size: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          transition: .2s ease;
          backdrop-filter: blur(8px);
        }

        .galleryArrow:hover {
          background: rgba(255,138,0,.9);
          color: #000;
        }

        .arrowLeft { left: 14px; }
        .arrowRight { right: 14px; }

        .photoDots {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(0,0,0,.45);
          backdrop-filter: blur(8px);
          z-index: 4;
        }

        .photoDot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          border: none;
          background: rgba(255,255,255,.45);
          cursor: pointer;
          transition: .2s ease;
        }

        .photoDot.active {
          width: 27px;
          background: #ff8a00;
        }

        .thumbs {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
        }

        .thumb {
          height: 70px;
          border-radius: 12px;
          object-fit: cover;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: .72;
          transition: .2s ease;
        }

        .thumb:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        .thumb.active {
          border-color: #ff8a00;
          opacity: 1;
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
          .topHero {
            min-height: 100vh;
            background:
              linear-gradient(to bottom, rgba(0,0,0,.72), rgba(0,0,0,.96)),
              linear-gradient(to right, rgba(0,0,0,.76), rgba(0,0,0,.72)),
              url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop");
            background-size: cover;
            background-position: center;
          }

          .header {
            padding: 22px 22px 10px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 18px;
            align-items: center;
          }

          .brandName {
            font-size: 37px;
            line-height: .95;
            text-align: left;
          }

          .brandSlogan {
            font-size: 20px;
            line-height: 1.2;
            max-width: 95%;
            text-shadow: 0 8px 18px rgba(0,0,0,.75);
          }

          .headerRight {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: 14px;
          }

          .adminArea {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
            gap: 10px;
          }

          .passwordInput {
            width: 100%;
            min-width: 0;
            padding: 16px 17px;
            font-size: 16px;
            background: rgba(10,10,10,.55);
          }

          .adminBtn {
            width: 100%;
            padding: 16px 14px;
            font-size: 16px;
            white-space: nowrap;
            background: rgba(10,10,10,.55);
          }

          .flagBox {
            width: 70px;
            height: 47px;
            justify-self: end;
          }

          .heroContent {
            padding: 70px 22px 70px;
          }

          .badge {
            font-size: 20px;
            padding: 13px 28px;
            background: rgba(0,0,0,.42);
            box-shadow: 0 10px 30px rgba(0,0,0,.45);
          }

          .heroTitle {
            margin: 34px auto 24px;
            font-size: clamp(42px, 13vw, 64px);
            line-height: .98;
            letter-spacing: -2px;
            color: #fff !important;
            text-shadow:
              0 3px 0 rgba(0,0,0,.65),
              0 10px 22px rgba(0,0,0,1),
              0 0 35px rgba(0,0,0,1);
          }

          .divider {
            width: 145px;
            margin-bottom: 28px;
          }

          .heroText {
            font-size: 25px;
            line-height: 1.55;
            color: #fff;
            text-shadow:
              0 2px 0 rgba(0,0,0,.55),
              0 10px 24px rgba(0,0,0,1);
          }

          .heroBtn {
            width: 100%;
            max-width: 420px;
            padding: 20px 18px;
            font-size: 20px;
            line-height: 1.2;
            margin-top: 34px;
            box-shadow: 0 18px 40px rgba(255,138,0,.32);
          }

          .logoIcon {
            width: 26px;
            height: 26px;
          }

          .listings {
            padding: 55px 22px 30px;
          }

          .sectionTitle {
            font-size: 36px;
          }

          .cards {
            grid-template-columns: 1fr;
          }

          .card:hover {
            transform: none;
          }

          .modalBackdrop {
            padding: 10px;
            align-items: flex-start;
            overflow-y: auto;
          }

          .modal {
            width: 100%;
            max-height: none;
            border-radius: 22px;
            margin-top: 10px;
          }

          .modalGrid {
            grid-template-columns: 1fr;
          }

          .modalGallery {
            padding: 10px;
          }

          .sliderFrame {
            aspect-ratio: 4 / 3;
            border-radius: 18px;
            background: #000;
          }

          .modalImg {
            object-fit: contain;
            background: #000;
          }

          .galleryArrow {
            width: 42px;
            height: 42px;
            font-size: 28px;
          }

          .arrowLeft { left: 10px; }
          .arrowRight { right: 10px; }

          .thumbs {
            display: flex;
            overflow-x: auto;
            padding-bottom: 6px;
            margin-top: 12px;
            gap: 8px;
          }

          .thumb {
            min-width: 74px;
            width: 74px;
            height: 58px;
            border-radius: 12px;
          }

          .modalContent {
            padding: 16px 18px 22px;
          }

          .modalTitle {
            margin-top: 10px;
            font-size: 24px;
            line-height: 1.2;
          }

          .modalPrice {
            font-size: 34px;
            margin: 10px 0;
          }

          .modalDesc {
            font-size: 15px;
            line-height: 1.55;
          }

          .details {
            margin-top: 10px;
          }

          .buttonRow a,
          .buttonRow button {
            flex: 1;
            text-align: center;
            justify-content: center;
          }

          .contact {
            margin-left: 22px;
            margin-right: 22px;
          }
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
            <LogoIcon type="whatsapp" />
            WhatsApp ile Hemen İletişime Geç
          </a>
        </div>
      </section>

      {admin && (
        <section className="adminPanel">
          <h2 className="adminTitle">
            {duzenlenenId ? "İlan Düzenle" : "İlan Ekle"}
          </h2>

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

            <input
              className="input"
              placeholder="Fotoğraf linkleri: link1, link2, link3"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />

            <p className="hint">
              Birden fazla fotoğraf için linkleri virgülle ayır: https://foto1.jpg, https://foto2.jpg
            </p>

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
          {gorunenIlanlar.map((ilan) => {
            const fotolar = fotoListesi(ilan);

            return (
              <div className="card" key={ilan.id} onClick={() => ilanAc(ilan)}>
                <div className="imageWrap">
                  <img className="image" src={ilkFoto(ilan)} alt={ilan.title} />
                  <span className="status">{ilan.status || "Satılık"}</span>
                  {fotolar.length > 1 && (
                    <span className="photoCount">{fotolar.length} fotoğraf</span>
                  )}
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
                    <a href={whatsappLink(ilan)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="whatsapp">
                      <LogoIcon type="whatsapp" /> WhatsApp
                    </a>

                    {ilan.instagram && (
                      <a href={ilan.instagram} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="instagram">
                        <LogoIcon type="instagram" /> Instagram
                      </a>
                    )}

                    {ilan.maps && (
                      <a href={ilan.maps} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="mapsBtn">
                        Konumu Gör
                      </a>
                    )}

                    {admin && (
                      <>
                        <button className="editBtn" onClick={(e) => { e.stopPropagation(); ilanDuzenle(ilan); }}>
                          Düzenle
                        </button>
                        <button className="deleteBtn" onClick={(e) => { e.stopPropagation(); ilanSil(ilan.id); }}>
                          Sil
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="moreBtnWrap">
          <a href="#contact" className="moreBtn">Tüm ilanlar için iletişime geç →</a>
        </div>
      </section>

      {seciliIlan && (
        <div className="modalBackdrop" onClick={kapatModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalGrid">
              <div className="modalGallery">
                <div
                  className="sliderFrame"
                  onTouchStart={dokunmaBasla}
                  onTouchEnd={dokunmaBitir}
                  style={{
                    "--slide-start": fotoYon === "right" ? "35px" : "-35px",
                  }}
                >
                  <img
                    key={aktifFoto}
                    className="modalImg"
                    src={seciliFotolar[aktifFoto] || ilkFoto(seciliIlan)}
                    alt={seciliIlan.title}
                  />

                  {seciliFotolar.length > 1 && (
                    <>
                      <button className="galleryArrow arrowLeft" onClick={oncekiFoto}>
                        ‹
                      </button>
                      <button className="galleryArrow arrowRight" onClick={sonrakiFoto}>
                        ›
                      </button>

                      <div className="photoDots">
                        {seciliFotolar.map((_, index) => (
                          <button
                            key={index}
                            className={`photoDot ${aktifFoto === index ? "active" : ""}`}
                            onClick={() => fotoDegistir(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {seciliFotolar.length > 1 && (
                  <div className="thumbs">
                    {seciliFotolar.map((foto, index) => (
                      <img
                        key={index}
                        src={foto}
                        alt={`Fotoğraf ${index + 1}`}
                        className={`thumb ${aktifFoto === index ? "active" : ""}`}
                        onClick={() => fotoDegistir(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="modalContent">
                <button className="closeBtn" onClick={kapatModal}>
                  Kapat
                </button>

                <h2 className="modalTitle">{seciliIlan.title}</h2>
                <p className="location">Konum: {seciliIlan.location}</p>
                <p className="modalPrice">{seciliIlan.price}</p>

                <div className="details">
                  {seciliIlan.rooms && <span>{seciliIlan.rooms}</span>}
                  {seciliIlan.area && <span>{seciliIlan.area} m²</span>}
                  {seciliIlan.status && <span>{seciliIlan.status}</span>}
                </div>

                <p className="modalDesc">
                  {seciliIlan.description ||
                    "Bu ilan hakkında detaylı bilgi almak için WhatsApp üzerinden bizimle iletişime geçebilirsiniz."}
                </p>

                <div className="buttonRow">
                  <a href={whatsappLink(seciliIlan)} target="_blank" rel="noreferrer" className="whatsapp">
                    <LogoIcon type="whatsapp" /> WhatsApp ile Bilgi Al
                  </a>

                  {seciliIlan.instagram && (
                    <a href={seciliIlan.instagram} target="_blank" rel="noreferrer" className="instagram">
                      <LogoIcon type="instagram" /> Instagram’da Gör
                    </a>
                  )}

                  {seciliIlan.maps && (
                    <a href={seciliIlan.maps} target="_blank" rel="noreferrer" className="mapsBtn">
                      Google Maps’te Aç
                    </a>
                  )}

                  {admin && (
                    <>
                      <button className="editBtn" onClick={() => ilanDuzenle(seciliIlan)}>
                        Düzenle
                      </button>
                      <button className="deleteBtn" onClick={() => ilanSil(seciliIlan.id)}>
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
            <a className="socialBtn" href={CONTACTS.instagram} target="_blank" rel="noreferrer">
              <LogoIcon type="instagram" /> Instagram
            </a>
            <a className="socialBtn" href={CONTACTS.tiktok} target="_blank" rel="noreferrer">
              <LogoIcon type="tiktok" /> TikTok
            </a>
            <a className="socialBtn" href={CONTACTS.facebook} target="_blank" rel="noreferrer">
              <LogoIcon type="facebook" /> Facebook
            </a>
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