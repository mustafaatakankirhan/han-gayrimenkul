import React from "react";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: "20px 7%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,.1)",
          background: "rgba(0,0,0,.8)",
          position: "sticky",
          top: 0,
          backdropFilter: "blur(12px)",
          zIndex: 100,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#ff8a00",
              fontSize: "34px",
              fontWeight: "900",
            }}
          >
            Han Gayrimenkul
          </h1>

          <p
            style={{
              margin: "4px 0 0",
              color: "#ddd",
              fontSize: "14px",
            }}
          >
            Doğru yatırım, güvenle değer katar
          </p>
        </div>

        <a
          href="https://wa.me/905308954919"
          target="_blank"
          rel="noreferrer"
          style={{
            background: "#25D366",
            color: "white",
            padding: "12px 20px",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          WhatsApp
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          padding: "120px 7%",
          background:
            "linear-gradient(to right, rgba(0,0,0,.9), rgba(0,0,0,.45)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: "999px",
            background: "rgba(255,138,0,.12)",
            border: "1px solid rgba(255,138,0,.4)",
            color: "#ff8a00",
            fontWeight: "bold",
          }}
        >
          Sakarya / Karasu
        </span>

        <h2
          style={{
            fontSize: "clamp(42px,7vw,78px)",
            lineHeight: "1.05",
            maxWidth: "900px",
            marginTop: "20px",
            marginBottom: "20px",
            fontWeight: "900",
          }}
        >
          Gayrimenkulde güven,
          <br />
          yatırımda değer.
        </h2>

        <p
          style={{
            maxWidth: "700px",
            color: "#ddd",
            lineHeight: "1.8",
            fontSize: "20px",
          }}
        >
          Han Gayrimenkul; satılık, kiralık ve yatırım odaklı
          portföyleri güvenilir, şeffaf ve profesyonel şekilde sunar.
        </p>

        <a
          href="https://wa.me/905308954919"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            marginTop: "30px",
            background: "#ff8a00",
            color: "#000",
            padding: "16px 28px",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: "900",
          }}
        >
          Hemen İletişime Geç
        </a>
      </section>

      {/* İLANLAR */}
      <section
        style={{
          padding: "70px 7%",
        }}
      >
        <p
          style={{
            color: "#ff8a00",
            letterSpacing: "4px",
            fontWeight: "900",
          }}
        >
          PORTFÖYLER
        </p>

        <h2
          style={{
            fontSize: "44px",
            marginTop: "10px",
          }}
        >
          Güncel İlanlar
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "28px",
            marginTop: "40px",
          }}
        >
          {/* KART */}
          <div
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,138,0,.35)",
              borderRadius: "30px",
              overflow: "hidden",
              transition: ".3s",
            }}
          >
            <div
              style={{
                height: "250px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200"
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <span
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  background: "#ff8a00",
                  color: "#000",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontWeight: "900",
                }}
              >
                Satılık
              </span>
            </div>

            <div
              style={{
                padding: "24px",
              }}
            >
              <p
                style={{
                  color: "#aaa",
                }}
              >
                Sakarya / Karasu
              </p>

              <h3
                style={{
                  fontSize: "26px",
                  margin: "10px 0",
                }}
              >
                Deniz Manzaralı 3+1 Lüks Villa
              </h3>

              <p
                style={{
                  color: "#ff8a00",
                  fontSize: "30px",
                  fontWeight: "900",
                }}
              >
                6.750.000 TL
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "14px",
                }}
              >
                <span
                  style={{
                    background: "rgba(255,255,255,.08)",
                    padding: "8px 12px",
                    borderRadius: "12px",
                  }}
                >
                  3+1
                </span>

                <span
                  style={{
                    background: "rgba(255,255,255,.08)",
                    padding: "8px 12px",
                    borderRadius: "12px",
                  }}
                >
                  240 m²
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "22px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="https://wa.me/905308954919"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#25D366",
                    color: "white",
                    padding: "12px 18px",
                    borderRadius: "999px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  WhatsApp
                </a>

                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#ff8a00",
                    color: "#000",
                    padding: "12px 18px",
                    borderRadius: "999px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Konumu Gör
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İLETİŞİM */}
      <section
        style={{
          margin: "40px 7%",
          padding: "40px",
          borderRadius: "28px",
          background:
            "linear-gradient(135deg, rgba(255,138,0,.12), rgba(255,255,255,.04))",
          border: "1px solid rgba(255,255,255,.1)",
        }}
      >
        <h2>İletişim</h2>

        <p>Telefon: 0530 895 4919</p>

        <p>E-posta: hangayrimenkulkarasu@gmail.com</p>

        <p>Konum: Sakarya / Karasu</p>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "35px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,.1)",
          color: "#777",
        }}
      >
        © 2026 Han Gayrimenkul — Doğru yatırım, güvenle değer katar
      </footer>
    </div>
  );
}

export default App;