import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

function App() {
  const [ilanlar, setIlanlar] = useState([]);
  const [baslik, setBaslik] = useState("");

  useEffect(() => {
    const getir = async () => {
      const snapshot = await getDocs(collection(db, "ilanlar"));
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setIlanlar(data);
    };
    getir();
  }, []);

  const ekle = async () => {
    if (!baslik) return;

    await addDoc(collection(db, "ilanlar"), {
      title: baslik,
      price: "3.500.000",
      location: "Sakarya / Karasu",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
    });

    setBaslik("");
    window.location.reload();
  };

  const sil = async (id) => {
    await deleteDoc(doc(db, "ilanlar", id));
    window.location.reload();
  };

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "white", padding: "20px" }}>
      
      <h1 style={{ textAlign: "center", color: "#ff8a00", marginBottom: "30px" }}>
        Han Gayrimenkul
      </h1>

      {/* EKLE */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="İlan başlığı gir"
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button onClick={ekle} style={{ padding: "10px 15px" }}>
          İlan Ekle
        </button>
      </div>

      {/* LİSTE */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {ilanlar.map((ilan) => (
          <div
            key={ilan.id}
            style={{
              border: "1px solid orange",
              padding: "10px",
              borderRadius: "15px",
              width: "260px",
              position: "relative",
              background: "#0d0d0d"
            }}
          >
            {/* SATILIK */}
            <span style={{
              position: "absolute",
              background: "orange",
              padding: "5px 10px",
              borderRadius: "5px",
              top: "10px",
              left: "10px",
              fontSize: "12px"
            }}>
              Satılık
            </span>

            <img src={ilan.image} style={{ width: "100%", borderRadius: "10px" }} />

            <p style={{ marginTop: "10px", color: "#aaa" }}>
              {ilan.location}
            </p>

            <h3>{ilan.title}</h3>

            <h2 style={{ color: "orange" }}>
              {ilan.price} ₺
            </h2>

            {/* BUTONLAR */}
            <div style={{ marginTop: "10px" }}>
              <a
                href="https://wa.me/905555555555"
                target="_blank"
                style={{
                  padding: "8px 10px",
                  background: "#25D366",
                  color: "white",
                  borderRadius: "5px",
                  textDecoration: "none",
                  marginRight: "5px"
                }}
              >
                WhatsApp
              </a>

              <a
                href="https://instagram.com/kullaniciadın"
                target="_blank"
                style={{
                  padding: "8px 10px",
                  background: "#E1306C",
                  color: "white",
                  borderRadius: "5px",
                  textDecoration: "none"
                }}
              >
                Instagram
              </a>
            </div>

            <button
              onClick={() => sil(ilan.id)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px"
              }}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;