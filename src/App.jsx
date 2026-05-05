import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

function App() {
  const [ilanlar, setIlanlar] = useState([]);
  const [baslik, setBaslik] = useState("");

  // 🔄 Verileri çek
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

  // ➕ İlan ekle
  const ekle = async () => {
    if (!baslik) return;

    await addDoc(collection(db, "ilanlar"), {
      title: baslik,
      price: "Fiyat girilmedi",
      location: "Sakarya / Karasu",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
    });

    setBaslik("");
    window.location.reload();
  };

  // ❌ İlan sil
  const sil = async (id) => {
    await deleteDoc(doc(db, "ilanlar", id));
    window.location.reload();
  };

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "white", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#ff8a00" }}>
        Han Gayrimenkul
      </h1>

      {/* EKLE */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="İlan başlığı gir"
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button onClick={ekle}>Ekle</button>
      </div>

      {/* LİSTE */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {ilanlar.map((ilan) => (
          <div
            key={ilan.id}
            style={{
              border: "1px solid orange",
              padding: "10px",
              borderRadius: "10px",
              width: "250px",
            }}
          >
            <img src={ilan.image} style={{ width: "100%" }} />
            <h3>{ilan.title}</h3>
            <p>{ilan.price}</p>
            <p>{ilan.location}</p>
            <button onClick={() => sil(ilan.id)}>Sil</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;