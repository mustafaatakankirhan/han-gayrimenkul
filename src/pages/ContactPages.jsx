import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CONTACTS, ICONS, SITE_URL, DEFAULT_SEO_IMAGE, PROPERTY_TYPES, BLOG_POSTS } from '../constants';
import { slugify, fotoListesi, ilkFoto, ilanSlug, whatsappLink, buildFeatureList, shortPropertyNote, shareListing, shareToWhatsApp, optimizeCloudinaryUrl, toTitleCase } from '../utils';
import { LogoIcon, SEO, AnimatedCounter } from '../components/ui';
import Header from '../components/Header';
import AdminLogin from '../components/AdminLogin';
import FavoriteButton from '../components/FavoriteButton';
import ListingCard from '../components/ListingCard';
import logo from '../assets/logo.png';
import heroVideo from '../assets/villa.mp4';

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!formData.name || !formData.message) {
      setError("Ad ve mesaj alanları zorunludur.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_9lg7uae",
          template_id: "template_3wop6vo",
          user_id: "10ybZkGsrLFzRUrVz",
          template_params: {
            name: formData.name,
            email: formData.email || "Belirtilmedi",
            phone: formData.phone || "Belirtilmedi",
            message: formData.message,
            title: "Han Gayrimenkul İletişim Formu",
          },
        }),
      });
      if (res.ok) {
        setSent(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Gönderim hatası");
      }
    } catch {
      setError("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  };

  return (
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
          <p className="contactName">{CONTACTS.muzafferName}</p>
          <p className="contactPhone">{CONTACTS.muzafferPhone}</p>
        </div>

        <div className="contactItem">
          <div className="contactIcon">👤</div>
          <p className="contactName">{CONTACTS.mustafaName}</p>
          <p className="contactPhone">{CONTACTS.mustafaPhone}</p>
        </div>

        <div className="contactItem">
          <div className="contactIcon">✉</div>
          <p className="contactName">E-posta</p>
          <p className="emailText">{CONTACTS.email}</p>
        </div>
      </div>

      <p className="contactLocation">Konum: Yalı Mahallesi, Barbaros Caddesi, No: 115 / 4, Sakarya / Karasu</p>

      <div className="contactFormWrap">
        <p className="sectionLabel">MESAJ GÖNDER</p>
        <h3 className="contactFormTitle">Bize Yazın</h3>
        <p className="contactFormDesc">Portföy hakkında bilgi almak, randevu oluşturmak veya soru sormak için formu doldurun.</p>

        {sent ? (
          <div className="contactSuccess">
            ✅ Mesajınız alındı! En kısa sürede size dönüş yapacağız.
          </div>
        ) : (
          <div className="contactForm">
            <div className="contactFormRow">
              <input
                className="contactInput"
                placeholder="Adınız Soyadınız *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                className="contactInput"
                placeholder="E-posta adresiniz"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <input
              className="contactInput"
              placeholder="Telefon numaranız"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <textarea
              className="contactTextarea"
              placeholder="Mesajınız * (Hangi portföyü soruyorsunuz, ne tür bir gayrimenkul arıyorsunuz...)"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            {error && <p className="contactError">{error}</p>}
            <button
              className="contactSubmit"
              onClick={handleSubmit}
              disabled={sending}
            >
              {sending ? "Gönderiliyor..." : "Mesaj Gönder →"}
            </button>
          </div>
        )}
      </div>

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

      <div className="officeMap">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d751.5681747789749!2d30.692206415445263!3d41.106735057736046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409ddb94e81d7b95%3A0x6516a1ce56d93445!2sHan%20Gayrimenkul!5e0!3m2!1str!2str!4v1778361090974!5m2!1str!2str"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <footer className="footer">
        © 2026 <strong>Han Gayrimenkul</strong> — Doğru Yerde, Doğru Yatırım, Güvenle Değer Katar
      </footer>
    </section>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!formData.name || !formData.message) {
      setError("Ad ve mesaj alanları zorunludur.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_9lg7uae",
          template_id: "template_3wop6vo",
          user_id: "10ybZkGsrLFzRUrVz",
          template_params: {
            name: formData.name,
            email: formData.email || "Belirtilmedi",
            phone: formData.phone || "Belirtilmedi",
            message: formData.message,
            title: "Han Gayrimenkul İletişim Formu",
          },
        }),
      });
      if (res.ok) {
        setSent(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Gönderim hatası");
      }
    } catch {
      setError("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px" }}>
      <Header detail={false} />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
        <p className="sectionLabel">İLETİŞİM</p>
        <h2 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 950, margin: "8px 0 12px", color: "white" }}>
          Bize Ulaşın
        </h2>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: "16px", marginBottom: "48px", lineHeight: 1.6 }}>
          Portföy hakkında bilgi almak, randevu oluşturmak veya soru sormak için aşağıdaki formu doldurun veya direkt arayın.
        </p>

        <div className="contactPageGrid">
          <div className="contactPageInfo">
            <div className="contactPageCard">
              <span className="contactPageIcon">☎</span>
              <div>
                <p className="contactPageLabel">Ofis Telefonu</p>
                <p className="contactPageValue">{CONTACTS.officePhone}</p>
                <p className="contactPageValue">{CONTACTS.secondOfficePhone}</p>
              </div>
            </div>
            <div className="contactPageCard">
              <span className="contactPageIcon">👤</span>
              <div>
                <p className="contactPageLabel">{CONTACTS.muzafferName}</p>
                <p className="contactPageValue">{CONTACTS.muzafferPhone}</p>
              </div>
            </div>
            <div className="contactPageCard">
              <span className="contactPageIcon">👤</span>
              <div>
                <p className="contactPageLabel">{CONTACTS.mustafaName}</p>
                <p className="contactPageValue">{CONTACTS.mustafaPhone}</p>
              </div>
            </div>
            <div className="contactPageCard">
              <span className="contactPageIcon">✉</span>
              <div>
                <p className="contactPageLabel">E-posta</p>
                <p className="contactPageValue">{CONTACTS.email}</p>
              </div>
            </div>
            <div className="contactPageCard">
              <span className="contactPageIcon">📍</span>
              <div>
                <p className="contactPageLabel">Adres</p>
                <p className="contactPageValue">Yalı Mah. Barbaros Cad. No:115/4 Karasu / Sakarya</p>
              </div>
            </div>
            <a href={`https://wa.me/${CONTACTS.whatsapp}`} target="_blank" rel="noreferrer" className="contactPageWa">
              <img src={ICONS.whatsapp} alt="WhatsApp" style={{ width: 22, height: 22 }} />
              WhatsApp ile Yaz
            </a>
          </div>

          <div className="contactPageForm">
            {sent ? (
              <div className="contactSuccess">
                ✅ Mesajınız alındı! En kısa sürede size dönüş yapacağız.
              </div>
            ) : (
              <>
                <div className="contactFormRow">
                  <input className="contactInput" placeholder="Adınız Soyadınız *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <input className="contactInput" placeholder="E-posta adresiniz" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <input className="contactInput" placeholder="Telefon numaranız" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <textarea className="contactTextarea" placeholder="Mesajınız * (Hangi portföyü soruyorsunuz, ne tür bir gayrimenkul arıyorsunuz...)" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                {error && <p className="contactError">{error}</p>}
                <button className="contactSubmit" onClick={handleSubmit} disabled={sending}>
                  {sending ? "Gönderiliyor..." : "Mesaj Gönder →"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="officeMap" style={{ marginTop: 48 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d751.5681747789749!2d30.692206415445263!3d41.106735057736046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409ddb94e81d7b95%3A0x6516a1ce56d93445!2sHan%20Gayrimenkul!5e0!3m2!1str!2str!4v1778361090974!5m2!1str!2str"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}


export { Contact, ContactPage };
