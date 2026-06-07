import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CONTACTS, ICONS, SITE_URL, DEFAULT_SEO_IMAGE, PROPERTY_TYPES, BLOG_POSTS, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '../constants';
import { slugify, fotoListesi, ilkFoto, ilanSlug, whatsappLink, buildFeatureList, shortPropertyNote, shareListing, shareToWhatsApp, optimizeCloudinaryUrl, toTitleCase } from '../utils';
import { LogoIcon, SEO, AnimatedCounter } from '../components/ui';
import Header from '../components/Header';
import AdminLogin from '../components/AdminLogin';
import FavoriteButton from '../components/FavoriteButton';
import ListingCard from '../components/ListingCard';
import logo from '../assets/logo.png';
import heroVideo from '../assets/villa.mp4';

import AdminPanel from '../components/AdminPanel';
import { db } from '../firebase';
import { safeText, generateListingDescription, generateInvestmentNote, generateInstagramCaption, generateReelsText } from '../utils';
import { addDoc, updateDoc, deleteDoc, doc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

function AdminListingManager({ ilanlar, ilanDuzenle, ilanSil }) {
  const [adminSearch, setAdminSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = adminSearch.trim().toLowerCase();

    return [...ilanlar]
      .filter((ilan) => {
        if (!q) return true;
        return [
          ilan.title,
          ilan.price,
          ilan.location,
          ilan.status,
          ilan.type,
          ilan.rooms,
          ilan.area,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [ilanlar, adminSearch]);

  return (
    <section className="adminListPanel">
      <div className="adminListHead">
        <div>
          <p className="adminEyebrow">PORTFÖY YÖNETİMİ</p>
          <h2>Mevcut İlanlar</h2>
        </div>

        <div className="adminSearchBox">
          <span>🔎</span>
          <input
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            placeholder="İlan ara..."
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="emptyState">Admin panelde gösterilecek ilan bulunamadı.</div>
      ) : (
        <div className="adminListingGrid">
          {filtered.map((ilan) => (
            <article className="adminListingCard" key={ilan.id}>
              <div className="adminListingImage">
                <img src={ilkFoto(ilan)} alt={ilan.title} />
                {ilan.featured && <span>⭐ Öne Çıkan</span>}
              </div>

              <div className="adminListingInfo">
                <div className="adminListingBadges">
                  <b>{ilan.status || "Satılık"}</b>
                  {ilan.type && <b>{ilan.type}</b>}
                </div>

                <h3>{ilan.title}</h3>
                <p>{ilan.location}</p>
                <strong>{ilan.price}</strong>

                <div className="adminListingMeta">
                  {ilan.rooms && <span>{ilan.rooms}</span>}
                  {ilan.area && <span>{ilan.area} m²</span>}
                </div>
              </div>

              <div className="adminListingActions">
                <button
                  className="adminEditBtn"
                  onClick={() => ilanDuzenle(ilan)}
                >
                  Düzenle
                </button>
                <button
                  className="adminDeleteBtn"
                  onClick={() => ilanSil(ilan.id)}
                >
                  Sil
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function BlogAdminPanel({
  blogForm,
  setBlogForm,
  blogDuzenlenenId,
  blogKaydet,
  setBlogDuzenlenenId,
  bosBlogForm,
}) {
  const [uploading, setUploading] = React.useState(false);

  const uploadBlogCover = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Lütfen görsel dosyası seç.");
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      data.append("folder", "han-gayrimenkul-blog");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Blog kapak görseli yükleme hatası");
      }

      const result = await response.json();
      setBlogForm((prev) => ({
        ...prev,
        coverImage: optimizeCloudinaryUrl(result.secure_url),
      }));
    } catch (error) {
      console.error(error);
      alert("Kapak görseli yüklenemedi. Cloudinary ayarını kontrol et.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="adminPanel proAdminPanel blogAdminPanel">
      <div className="adminHead">
        <div>
          <p className="adminEyebrow">BLOG YÖNETİMİ</p>
          <h2 className="adminTitle">{blogDuzenlenenId ? "Blog Yazısı Düzenle" : "Yeni Blog Yazısı Ekle"}</h2>
        </div>

        <label className="featuredToggle">
          <input
            type="checkbox"
            checked={!!blogForm.isPublished}
            onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
          />
          <span>Yayında</span>
        </label>
      </div>

      <div className="adminSection">
        <h3>Blog Bilgileri</h3>
        <div className="formGrid">
          <input
            className="input"
            placeholder="Blog başlığı örn: Karasu’da Yatırım Yapılır mı?"
            value={blogForm.title}
            onChange={(e) => {
              const title = e.target.value;
              setBlogForm({ ...blogForm, title, slug: blogForm.slugTouched ? blogForm.slug : slugify(title) });
            }}
          />
          <input
            className="input"
            placeholder="URL adı / slug"
            value={blogForm.slug}
            onChange={(e) => setBlogForm({ ...blogForm, slug: slugify(e.target.value), slugTouched: true })}
          />
          <input
            className="input"
            placeholder="Kategori örn: Yatırım Rehberi"
            value={blogForm.category}
            onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
          />
          <input
            className="input"
            placeholder="Kapak görseli linki"
            value={blogForm.coverImage}
            onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
          />
        </div>

        <div className="videoUploadBox blogCoverUpload">
          <div>
            <strong>🖼️ Blog Kapak Görseli</strong>
            <p>Kapak görseli Google ve sosyal paylaşımda daha profesyonel görünür.</p>
          </div>
          <label className="uploadBtn">
            {uploading ? "Yükleniyor..." : "Kapak Seç"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => uploadBlogCover(e.target.files?.[0])}
            />
          </label>
        </div>

        {blogForm.coverImage && (
          <div className="blogCoverPreview">
            <img src={blogForm.coverImage} alt="Blog kapak önizleme" />
          </div>
        )}

        <textarea
          className="textarea"
          placeholder="Kısa açıklama / Google açıklaması"
          value={blogForm.excerpt}
          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
        />

        <textarea
          className="textarea blogContentTextarea"
          placeholder="Blog içeriği. Paragrafları alt alta yaz; sitede otomatik paragraf olarak görünür."
          value={blogForm.content}
          onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
        />
      </div>

      <div className="adminActions">
        <button className="addBtn" onClick={blogKaydet} disabled={uploading}>
          {blogDuzenlenenId ? "Blogu Güncelle" : "Blogu Ekle"}
        </button>

        {blogDuzenlenenId && (
          <button
            className="cancelBtn"
            onClick={() => {
              setBlogDuzenlenenId(null);
              setBlogForm(bosBlogForm);
            }}
          >
            Vazgeç
          </button>
        )}
      </div>
    </section>
  );
}

function BlogAdminManager({ blogs, blogDuzenle, blogSil }) {
  const [blogSearch, setBlogSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = blogSearch.trim().toLowerCase();
    return [...(blogs || [])].filter((post) => {
      if (!q) return true;
      return [post.title, post.category, post.excerpt, post.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [blogs, blogSearch]);

  return (
    <section className="adminListPanel">
      <div className="adminListHead">
        <div>
          <p className="adminEyebrow">BLOG YÖNETİMİ</p>
          <h2>Mevcut Blog Yazıları</h2>
        </div>

        <div className="adminSearchBox">
          <span>🔎</span>
          <input
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
            placeholder="Blog ara..."
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="emptyState">Admin panelde gösterilecek blog yazısı bulunamadı.</div>
      ) : (
        <div className="adminListingGrid blogAdminGrid">
          {filtered.map((post) => (
            <article className="adminListingCard" key={post.id}>
              <div className="adminListingImage">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} />
                ) : (
                  <div className="blogNoImage">Blog</div>
                )}
                <span>{post.isPublished !== false ? "Yayında" : "Pasif"}</span>
              </div>

              <div className="adminListingInfo">
                <div className="adminListingBadges">
                  <b>{post.category || "Rehber"}</b>
                  <b>/blog/{post.slug}</b>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>

              <div className="adminListingActions">
                <Link className="adminEditBtn" to={`/blog/${post.slug}`} target="_blank">
                  Gör
                </Link>
                <button className="adminEditBtn" onClick={() => blogDuzenle(post)}>
                  Düzenle
                </button>
                <button className="adminDeleteBtn" onClick={() => blogSil(post.id)}>
                  Sil
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function AdminPage({
  admin,
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
  ilanlar,
  ilanDuzenle,
  ilanSil,
  blogs,
  blogForm,
  setBlogForm,
  blogDuzenlenenId,
  blogKaydet,
  setBlogDuzenlenenId,
  bosBlogForm,
  blogDuzenle,
  blogSil,
}) {
  return (
    <div className="page adminRoutePage">
      <Header detail />

      <main className="adminRouteWrap">
        {!admin ? (
          <section className="adminGate">
            <div className="adminGateCard">
              <img src={logo} alt="Han Gayrimenkul" />
              <p>Gizli Yönetim Paneli</p>
              <h2>Han Gayrimenkul Yönetim</h2>
              <span>Bu alan yalnızca yetkili kullanım içindir.</span>

              <div className="adminGateLogin">
                <input
                  type="email"
                  placeholder="Admin e-posta"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && girisYap()}
                />
                <input
                  type="password"
                  placeholder="Admin şifre"
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && girisYap()}
                />
                <button onClick={girisYap}>Giriş Yap</button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <div className="adminRouteTop">
              <div>
                <p className="adminEyebrow">GİZLİ PANEL</p>
                <h1>İlan ve Blog Yönetimi</h1>
              </div>
              <button className="navPill" onClick={() => setAdmin(false)}>
                Çıkış Yap
              </button>
            </div>

            <AdminPanel
              form={form}
              setForm={setForm}
              duzenlenenId={duzenlenenId}
              ilanKaydet={ilanKaydet}
              setDuzenlenenId={setDuzenlenenId}
              bosForm={bosForm}
            />

            <AdminListingManager
              ilanlar={ilanlar}
              ilanDuzenle={ilanDuzenle}
              ilanSil={ilanSil}
              blogs={blogs}
              blogForm={blogForm}
              setBlogForm={setBlogForm}
              blogDuzenlenenId={blogDuzenlenenId}
              blogKaydet={blogKaydet}
              setBlogDuzenlenenId={setBlogDuzenlenenId}
              bosBlogForm={bosBlogForm}
              blogDuzenle={blogDuzenle}
              blogSil={blogSil}
            />

            <BlogAdminPanel
              blogForm={blogForm}
              setBlogForm={setBlogForm}
              blogDuzenlenenId={blogDuzenlenenId}
              blogKaydet={blogKaydet}
              setBlogDuzenlenenId={setBlogDuzenlenenId}
              bosBlogForm={bosBlogForm}
            />

            <BlogAdminManager
              blogs={blogs}
              blogDuzenle={blogDuzenle}
              blogSil={blogSil}
            />
          </>
        )}
      </main>
    </div>
  );
}

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


export { AdminListingManager, BlogAdminPanel, BlogAdminManager, AdminPage };