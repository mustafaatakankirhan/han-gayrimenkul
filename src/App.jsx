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

function App() {
  const [ilanlar, setIlanlar] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [sifre, setSifre] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [filtre, setFiltre] = useState("Tümü");

  const bosForm = {
    title: "",
    price: "",
    location: "Sakarya / Karasu / Aziziye Mah.",
    rooms: "",
    area: "",
    status: "Satılık",
    image: "",
    instagram: "",
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

  const ilanEkle = async () => {
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
    const onay = confirm("Bu ilan silinsin mi?");
    if (!onay) return;

    await deleteDoc(doc(db, "ilanlar", id));
    ilanlariGetir();
  };

  const ilanDuzenle = (ilan) => {
    setForm({
      title: ilan.title || "",
      price: ilan.price || "",
      location: ilan.location || "",
      rooms: ilan.rooms || "",
      area: ilan.area || "",
      status: ilan.status || "Satılık",
      image: ilan.image || "",
      instagram: ilan.instagram || "",
    });
    setDuzenlenenId(ilan.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const kartaTikla = (ilan) => {
    if (ilan.instagram) {
      window.open(ilan.instagram, "_blank");
    } else {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20${encodeURIComponent(
          ilan.title
        )}%20ilanı%20hakkında%20bilgi%20almak%20istiyorum.`,
        "_blank"
      );
    }
  };

  const gorunenIlanlar =
    filtre === "Tümü"
      ? ilanlar
      : ilanlar.filter((ilan) => ilan.status === filtre);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>Han Gayrimenkul</h1>
          <p style={styles.slogan}>Yatırımınıza güvenle değer</p>
        </div>

        <div style={styles.adminArea}>
          {!admin ? (
            <>
              <input
                type="password"
                placeholder="Admin şifre"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                style={styles.passwordInput}
              />
              <button onClick={girisYap} style={styles.adminBtn}>
                Admin Giriş
              </button>
            </>
          ) : (
            <button onClick={() => setAdmin(false)} style={styles.adminBtn}>
              Admin Çıkış
            </button>
          )}
        </div>
      </header>

      <section style={styles.hero}>
        <p style={styles.badge}>Sakarya / Karasu / Aziziye Mahallesi</p>
        <h2 style={styles.heroTitle}>Gayrimenkulde güven, yatırımda değer.</h2>
        <p style={styles.heroText}>
          Han Gayrimenkul; satılık, kiralık ve yatırım odaklı portföyleri
          güvenilir, şeffaf ve profesyonel şekilde sunar.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20gayrimenkul%20hakkında%20bilgi%20almak%20istiyorum.`}
          target="_blank"
          rel="noreferrer"
          style={styles.heroBtn}
        >
          WhatsApp ile İletişime Geç
        </a>
      </section>

      {admin && (
        <section style={styles.adminPanel}>
          <h2 style={styles.adminTitle}>
            {duzenlenenId ? "İlan Düzenle" : "İlan Ekle"}
          </h2>

          <div style={styles.formGrid}>
            <input
              placeholder="İlan başlığı"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Fiyat örn: 3.500.000 TL"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Konum"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Oda örn: 2+1"
              value={form.rooms}
              onChange={(e) => setForm({ ...form, rooms: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="m² örn: 120"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              style={styles.input}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={styles.input}
            >
              <option>Satılık</option>
              <option>Kiralık</option>
            </select>
            <input
              placeholder="Fotoğraf direkt linki"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Instagram ilan linki"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              style={styles.input}
            />
          </div>

          <button onClick={ilanEkle} style={styles.addBtn}>
            {duzenlenenId ? "İlanı Güncelle" : "İlan Ekle"}
          </button>

          {duzenlenenId && (
            <button
              onClick={() => {
                setDuzenlenenId(null);
                setForm(bosForm);
              }}
              style={styles.cancelBtn}
            >
              Vazgeç
            </button>
          )}
        </section>
      )}

      <section style={styles.listings}>
        <p style={styles.sectionLabel}>PORTFÖYLER</p>
        <h2 style={styles.sectionTitle}>Güncel İlanlar</h2>

        <div style={styles.filters}>
          {["Tümü", "Satılık", "Kiralık"].map((x) => (
            <button
              key={x}
              onClick={() => setFiltre(x)}
              style={{
                ...styles.filterBtn,
                background: filtre === x ? "#ff8a00" : "transparent",
                color: filtre === x ? "#000" : "#fff",
              }}
            >
              {x}
            </button>
          ))}
        </div>

        <div style={styles.cards}>
          {gorunenIlanlar.map((ilan) => (
            <div key={ilan.id} style={styles.card} onClick={() => kartaTikla(ilan)}>
              <div style={styles.imageWrap}>
                <img src={ilan.image} alt={ilan.title} style={styles.image} />
                <span style={styles.status}>{ilan.status || "Satılık"}</span>
              </div>

              <div style={styles.cardBody}>
                <p style={styles.location}>{ilan.location}</p>
                <h3 style={styles.cardTitle}>{ilan.title}</h3>
                <p style={styles.price}>{ilan.price}</p>

                <div style={styles.details}>
                  {ilan.rooms && <span>{ilan.rooms}</span>}
                  {ilan.area && <span>{ilan.area} m²</span>}
                </div>

                <div style={styles.buttonRow}>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20${encodeURIComponent(
                      ilan.title
                    )}%20ilanı%20hakkında%20bilgi%20almak%20istiyorum.`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={styles.whatsapp}
                  >
                    WhatsApp
                  </a>

                  {ilan.instagram && (
                    <a
                      href={ilan.instagram}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={styles.instagram}
                    >
                      Instagram
                    </a>
                  )}

                  {admin && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          ilanDuzenle(ilan);
                        }}
                        style={styles.editBtn}
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          ilanSil(ilan.id);
                        }}
                        style={styles.deleteBtn}
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

      <section style={styles.contact}>
        <h2>İletişim</h2>
        <p>Telefon: 0530 895 4919</p>
        <p>E-posta: Hangayrimenkul@gmail.com</p>
        <p>Adres: Sakarya / Karasu / Aziziye Mah.</p>
      </section>

      <footer style={styles.footer}>
        © 2026 Han Gayrimenkul — Yatırımınıza güvenle değer
      </footer>
    </div>
  );
}

const styles = {
  page: {
    background: "#050505",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    minHeight: "85px",
    padding: "18px 60px",
    background: "#000",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    position: "sticky",
    top: 0,
    zIndex: 10,
    flexWrap: "wrap",
  },
  logo: {
    margin: 0,
    color: "#ff8a00",
    fontSize: "34px",
    fontWeight: "900",
  },
  slogan: {
    margin: 0,
    color: "#ddd",
  },
  adminArea: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  passwordInput: {
    padding: "11px",
    borderRadius: "999px",
    border: "1px solid #333",
    background: "#111",
    color: "white",
  },
  adminBtn: {
    padding: "12px 20px",
    borderRadius: "999px",
    border: "1px solid #ff8a00",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  hero: {
    padding: "110px 60px",
    background:
      "linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  badge: {
    color: "#ff8a00",
    fontWeight: "bold",
  },
  heroTitle: {
    maxWidth: "850px",
    fontSize: "64px",
    lineHeight: "1.05",
    margin: "10px 0",
  },
  heroText: {
    maxWidth: "650px",
    color: "#ddd",
    fontSize: "20px",
    lineHeight: "1.7",
  },
  heroBtn: {
    display: "inline-block",
    marginTop: "25px",
    padding: "15px 26px",
    background: "#ff8a00",
    color: "#000",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: "900",
  },
  adminPanel: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "30px",
    border: "1px solid rgba(255,138,0,0.5)",
    borderRadius: "24px",
    background: "rgba(255,138,0,0.08)",
  },
  adminTitle: {
    color: "#ff8a00",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "12px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "#111",
    color: "white",
    fontSize: "15px",
  },
  addBtn: {
    marginTop: "18px",
    padding: "14px 28px",
    borderRadius: "999px",
    border: "none",
    background: "#ff8a00",
    color: "#000",
    fontWeight: "900",
    cursor: "pointer",
  },
  cancelBtn: {
    marginLeft: "10px",
    padding: "14px 28px",
    borderRadius: "999px",
    border: "1px solid #777",
    background: "transparent",
    color: "#fff",
    fontWeight: "900",
    cursor: "pointer",
  },
  listings: {
    padding: "70px 60px",
  },
  sectionLabel: {
    color: "#ff8a00",
    fontWeight: "900",
    letterSpacing: "3px",
  },
  sectionTitle: {
    fontSize: "44px",
    marginTop: "10px",
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "10px 18px",
    borderRadius: "999px",
    border: "1px solid #ff8a00",
    cursor: "pointer",
    fontWeight: "900",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
    gap: "28px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,138,0,0.45)",
    borderRadius: "26px",
    overflow: "hidden",
    cursor: "pointer",
  },
  imageWrap: {
    position: "relative",
    height: "250px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  status: {
    position: "absolute",
    top: "15px",
    left: "15px",
    background: "#ff8a00",
    color: "#000",
    padding: "8px 15px",
    borderRadius: "999px",
    fontWeight: "900",
  },
  cardBody: {
    padding: "22px",
  },
  location: {
    color: "#aaa",
  },
  cardTitle: {
    fontSize: "23px",
    lineHeight: "1.3",
    minHeight: "60px",
  },
  price: {
    color: "#ff8a00",
    fontSize: "28px",
    fontWeight: "900",
    margin: "12px 0",
  },
  details: {
    display: "flex",
    gap: "10px",
    color: "#eee",
    fontWeight: "bold",
  },
  buttonRow: {
    marginTop: "18px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  whatsapp: {
    padding: "11px 18px",
    background: "#25D366",
    color: "white",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: "900",
  },
  instagram: {
    padding: "11px 18px",
    background: "#E1306C",
    color: "white",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: "900",
  },
  editBtn: {
    padding: "11px 18px",
    background: "#1f6feb",
    color: "white",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "900",
  },
  deleteBtn: {
    padding: "11px 18px",
    background: "#b00020",
    color: "white",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "900",
  },
  contact: {
    margin: "40px 60px",
    padding: "40px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.06)",
  },
  footer: {
    padding: "35px",
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    color: "#777",
  },
};

export default App;