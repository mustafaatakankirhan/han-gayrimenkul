import React, { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import logo from "./assets/logo.png";
import heroVideo from "./assets/villa.mp4";
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
const CLOUDINARY_CLOUD_NAME = "depa6zrzr";
const CLOUDINARY_UPLOAD_PRESET = "han_upload";

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

const SITE_URL = "https://www.hangayrimenkulkarasu.com";
const SITE_NAME = "Han Gayrimenkul";
const DEFAULT_SEO_IMAGE =
  "https://res.cloudinary.com/depa6zrzr/image/upload/q_auto/f_auto/v1778290369/WhatsApp_Image_2026-05-07_at_22.15.14_16_dyfcxk.jpg";


const PROPERTY_TYPES = [
  "Tümü",
  "Daire",
  "Villa",
  "Müstakil Ev",
  "Arsa",
  "Tarla",
  "Bahçe",
];

const BLOG_POSTS = [
  {
    slug: "karasuda-yatirim-yapilir-mi",
    title: "Karasu’da yatırım yapılır mı?",
    category: "Yatırım",
    excerpt:
      "Karasu’da gayrimenkul yatırımı yaparken konum, sahil mesafesi, imar durumu ve gelişim aksı neden önemlidir?",
    content:
      "Karasu, yazlık talebi, sahil hattı, ulaşım bağlantıları ve gelişen yerleşim alanlarıyla yatırım açısından dikkat çeken bölgelerden biridir. Doğru portföy seçiminde denize mesafe, bölgenin gelişim yönü, imar durumu, yapı kalitesi ve kira potansiyeli birlikte değerlendirilmelidir. Han Gayrimenkul olarak portföyleri sadece fiyatıyla değil, uzun vadeli değer potansiyeliyle ele alıyoruz.",
  },
  {
    slug: "karasu-satilik-arsa-rehberi",
    title: "Karasu satılık arsa rehberi",
    category: "Arsa",
    excerpt:
      "Arsa alırken yol cephesi, imar durumu, bölgesel gelişim ve tapu kontrolü en kritik başlıklardır.",
    content:
      "Karasu’da arsa yatırımı yaparken yalnızca fiyat karşılaştırması yapmak yeterli değildir. İmar durumu, yola cephe, altyapı, çevredeki yapılaşma, hisseli/tam tapu durumu ve bölgenin gelişim yönü dikkatle incelenmelidir. Doğru analiz yapılmadan alınan arsa uzun vadede beklenen getiriyi sağlamayabilir.",
  },
  {
    slug: "yazlik-alirken-dikkat-edilecekler",
    title: "Yazlık alırken nelere dikkat edilmeli?",
    category: "Konut",
    excerpt:
      "Yazlık alırken sadece manzara değil; bina kalitesi, ulaşım, aidat, kira potansiyeli ve konum da önemlidir.",
    content:
      "Yazlık alımında en sık yapılan hata sadece dış görünüşe veya denize yakınlığa bakmaktır. Oysa bina yaşı, deprem yönetmeliği, site düzeni, aidat, otopark, ulaşım kolaylığı ve sezon dışı kullanım imkânı da değerlendirilmelidir. Doğru yazlık hem yaşam konforu hem de yatırım getirisi sağlar.",
  },,
  {
    slug: "karasu-limandere-gayrimenkul-rehberi",
    title: "Karasu Limandere gayrimenkul rehberi",
    category: "Bölge",
    excerpt:
      "Limandere bölgesinde arsa, yazlık ve yatırım amaçlı gayrimenkul alırken dikkat edilmesi gereken başlıklar.",
    content:
      "Limandere, Karasu çevresinde yatırım ve yazlık kullanım amacıyla değerlendirilen bölgelerden biridir. Bölge seçiminde ulaşım, imar durumu, yol cephesi, çevre yapılaşması ve uzun vadeli gelişim potansiyeli birlikte incelenmelidir.",
  },
  {
    slug: "karasu-yali-mahallesi-emlak-rehberi",
    title: "Karasu Yalı Mahallesi emlak rehberi",
    category: "Bölge",
    excerpt:
      "Yalı Mahallesi’nde konut, yazlık ve yatırım amaçlı portföy arayanlar için kısa değerlendirme.",
    content:
      "Karasu Yalı Mahallesi, sahil hattına yakınlığı ve yazlık talebiyle dikkat çeken bölgelerden biridir. Konut alırken bina kalitesi, denize mesafe, sosyal imkanlar ve sezonluk kira potansiyeli birlikte değerlendirilmelidir.",
  },
  {
    slug: "karasu-aziziye-bolgesi-yatirim-notlari",
    title: "Karasu Aziziye bölgesi yatırım notları",
    category: "Bölge",
    excerpt:
      "Aziziye ve çevresinde gayrimenkul yatırımı yaparken konum, gelişim aksı ve portföy niteliği önemlidir.",
    content:
      "Aziziye bölgesi, Karasu’da farklı portföy tipleriyle değerlendirilebilecek alanlardan biridir. Yatırım sürecinde tapu durumu, ulaşım, altyapı, çevre yapılaşması ve bölgedeki talep dikkatle analiz edilmelidir.",
  }
];


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
    <div className="flagBox" aria-label="Türk Bayrağı">
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

function SEO({ title, description, image, url, type = "website" }) {
  React.useEffect(() => {
    const safeTitle = title || "Han Gayrimenkul | Sakarya Karasu Premium Gayrimenkul";
    const safeDescription =
      description ||
      "Han Gayrimenkul ile Sakarya Karasu bölgesindeki satılık ve kiralık premium gayrimenkul fırsatlarını keşfedin.";
    const safeImage = image || DEFAULT_SEO_IMAGE;
    const safeUrl = url || SITE_URL;

    document.title = safeTitle;

    const setMeta = (selector, attrName, attrValue, content) => {
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', "name", "description", safeDescription);
    setMeta('meta[name="robots"]', "name", "robots", "index, follow");

    setMeta('meta[property="og:title"]', "property", "og:title", safeTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", safeDescription);
    setMeta('meta[property="og:image"]', "property", "og:image", safeImage);
    setMeta('meta[property="og:url"]', "property", "og:url", safeUrl);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:locale"]', "property", "og:locale", "tr_TR");

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", safeTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", safeDescription);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", safeImage);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", safeUrl);
  }, [title, description, image, url, type]);

  return null;
}

function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function fotoListesi(ilan) {
  return (ilan?.image || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function ilkFoto(ilan) {
  const photos = fotoListesi(ilan);
  const index = Number(ilan?.coverIndex || 0);
  return photos[index] || photos[0] || "";
}

function ilanSlug(ilan) {
  return `${slugify(ilan.title)}-${ilan.id}`;
}

function whatsappLink(ilan) {
  return `https://wa.me/${CONTACTS.whatsapp}?text=Merhaba,%20${encodeURIComponent(
    ilan?.title || "gayrimenkul"
  )}%20ilanı%20hakkında%20bilgi%20almak%20istiyorum.`;
}

function buildFeatureList(ilan) {
  const items = [
    ilan.rooms && { icon: "🛏️", label: "Oda", value: ilan.rooms },
    ilan.area && { icon: "📐", label: "Alan", value: `${ilan.area} m²` },
    ilan.type && { icon: "🏠", label: "Tür", value: ilan.type },
    ilan.status && { icon: "🏷️", label: "Durum", value: ilan.status },
    ilan.location && { icon: "📍", label: "Konum", value: ilan.location },
    { icon: "🤝", label: "Danışmanlık", value: "Han Gayrimenkul" },
  ].filter(Boolean);

  return items;
}

function shortPropertyNote(ilan) {
  if (ilan.investmentNote) return ilan.investmentNote;

  const type = (ilan.type || "").toLowerCase();

  if (type.includes("arsa") || type.includes("tarla") || type.includes("bahçe")) {
    return "Arazi tipi portföylerde konum, imar durumu, yol cephesi ve bölgesel gelişim potansiyeli yatırım kararında belirleyici olur. Detaylı değerlendirme için bizimle iletişime geçebilirsiniz.";
  }

  if (type.includes("villa") || type.includes("müstakil")) {
    return "Müstakil yaşam talebi, geniş kullanım alanı ve bölgesel değer artışı potansiyeli nedeniyle bu portföy yatırım ve yaşam amacıyla değerlendirilebilir.";
  }

  return "Bu portföy; konumu, kullanım potansiyeli ve bölgesel talep açısından yatırım odaklı değerlendirilebilir. Detaylı analiz için bizimle iletişime geçebilirsiniz.";
}

function shareListing(ilan) {
  const url = window.location.href;
  const text = `${ilan.title} - ${ilan.price}`;
  if (navigator.share) {
    navigator.share({ title: ilan.title, text, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url);
    alert("İlan bağlantısı kopyalandı.");
  }
}

function optimizeCloudinaryUrl(url) {
  if (!url || !url.includes("/image/upload/")) return url;
  if (url.includes("/q_auto/f_auto/")) return url;
  return url.replace("/image/upload/", "/image/upload/q_auto/f_auto/");
}

function safeText(value) {
  return value && String(value).trim() ? String(value).trim() : "";
}

function generateListingDescription(form) {
  const title = safeText(form.title) || "bu portföy";
  const location = safeText(form.location) || "Sakarya / Karasu";
  const type = safeText(form.type) || "gayrimenkul";
  const status = safeText(form.status) || "Satılık";
  const rooms = safeText(form.rooms);
  const area = safeText(form.area);
  const price = safeText(form.price);

  const details = [
    rooms && `${rooms} oda planı`,
    area && `${area} m² kullanım alanı`,
    price && `${price} fiyat bilgisi`,
  ].filter(Boolean);

  const detailSentence = details.length
    ? ` ${details.join(", ")} ile öne çıkan bu portföy,`
    : " Bu portföy,";

  if (["Arsa", "Tarla", "Bahçe"].includes(type)) {
    return `${location} bölgesinde yer alan ${title}, ${status.toLowerCase()} ${type.toLowerCase()} arayanlar için dikkat çekici bir fırsattır. Konum avantajı, kullanım potansiyeli ve bölgesel gelişim beklentisiyle yatırım odaklı değerlendirilebilir. Tapu, konum ve detaylı bilgi için Han Gayrimenkul ile iletişime geçebilirsiniz.`;
  }

  return `${location} bölgesinde yer alan ${title}, ${status.toLowerCase()} ${type.toLowerCase()} arayanlar için öne çıkan bir seçenektir.${detailSentence} hem yaşam hem de yatırım amacıyla değerlendirilebilecek niteliktedir. Detaylı bilgi, yerinde sunum ve randevu için Han Gayrimenkul ile iletişime geçebilirsiniz.`;
}

function generateInvestmentNote(form) {
  const location = safeText(form.location) || "Sakarya / Karasu";
  const type = safeText(form.type) || "gayrimenkul";
  const status = safeText(form.status) || "Satılık";
  const area = safeText(form.area);
  const rooms = safeText(form.rooms);

  if (["Arsa", "Tarla", "Bahçe"].includes(type)) {
    return `${location} bölgesindeki bu ${type.toLowerCase()}, arazi yatırımı düşünenler için konum ve gelişim potansiyeli açısından değerlendirilebilir. Yol cephesi, imar durumu, çevre yapılaşması ve bölgesel talep detaylı incelendiğinde uzun vadeli yatırım fırsatı sunabilir.`;
  }

  if (type === "Villa" || type === "Müstakil Ev") {
    return `${location} bölgesinde müstakil yaşam talebi güçlüdür. ${rooms ? `${rooms} planı` : "Geniş kullanım imkânı"} ve ${area ? `${area} m² alanı` : "kullanım avantajı"} ile bu portföy hem yaşam hem de uzun vadeli değer artışı açısından öne çıkabilir.`;
  }

  return `${location} bölgesindeki bu ${status.toLowerCase()} ${type.toLowerCase()}, kira getirisi, konum avantajı ve bölgesel talep açısından yatırım odaklı değerlendirilebilir. Detaylı analiz için portföyün çevre, ulaşım ve kullanım potansiyeli birlikte incelenmelidir.`;
}

function generateInstagramCaption(form) {
  const title = safeText(form.title) || "Yeni portföyümüz";
  const location = safeText(form.location) || "Sakarya / Karasu";
  const type = safeText(form.type) || "gayrimenkul";
  const status = safeText(form.status) || "Satılık";
  const price = safeText(form.price);
  const rooms = safeText(form.rooms);
  const area = safeText(form.area);

  return `${title}

📍 ${location}
🏡 ${status} ${type}
${rooms ? `🛏️ ${rooms}` : ""}
${area ? `📐 ${area} m²` : ""}
${price ? `💰 ${price}` : ""}

Detaylı bilgi ve yerinde sunum için bizimle iletişime geçebilirsiniz.

#hangayrimenkul #karasuemlak #sakaryaemlak #karasusatılık #karasuarsa #karasuvilla #gayrimenkul #emlakdanışmanı`;
}

function generateReelsText(form) {
  const location = safeText(form.location) || "Karasu";
  const type = safeText(form.type) || "gayrimenkul";

  return `🎥 Reels Metni:

${location} bölgesinde ${type.toLowerCase()} arayanlar için yeni portföyümüz yayında.

Öne çıkan detaylar:
- Konum avantajı
- Yatırım potansiyeli
- Han Gayrimenkul güvencesi

Detaylı bilgi için bize WhatsApp üzerinden ulaşabilirsiniz.

Han Gayrimenkul — yatırımınıza güvenle değer.`;
}

function optimizeCloudinaryVideoUrl(url) {
  if (!url || !url.includes("/video/upload/")) return url;
  if (url.includes("/q_auto/")) return url;
  return url.replace("/video/upload/", "/video/upload/q_auto/");
}


function joinPhotos(photos) {
  return photos.filter(Boolean).join(", ");
}

function moveArrayItem(arr, fromIndex, toIndex) {
  const copy = [...arr];
  if (toIndex < 0 || toIndex >= copy.length) return copy;
  const [item] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, item);
  return copy;
}

function Header({ detail = false, admin, setAdmin, setAdminOpen }) {
  const navigate = useNavigate();

  const goListings = () => {
    navigate("/#ilanlar");
    setTimeout(() => {
      document.getElementById("ilanlar")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <header className="siteHeader">
      <Link to="/" className="brandBox">
        <img src={logo} alt="Han Gayrimenkul Logo" className="brandLogo" />
        <div>
          <h1 className="brandName">Han Gayrimenkul</h1>
          <p className="brandSlogan">Doğru yatırım, güvenle değer katar</p>
        </div>
      </Link>

      {!detail && (
        <nav className="desktopNav">
          <a href="#ilanlar">İlanlar</a>
          <a href="#yatirim">Yatırım Rehberi</a>
          <a href="#blog">Rehber</a>
          <a href="#contact">İletişim</a>
        </nav>
      )}

      <div className="headerRight">
        {detail ? (
          <>
            <button className="navPill backPill" onClick={goListings}>← Geri Git</button>
            <Link to="/" className="navPill homePill">Ana Sayfa</Link>
          </>
        ) : null}
        <TurkishFlag />
      </div>
    </header>
  );
}

function AdminLogin({ sifre, setSifre, girisYap }) {
  return (
    <div className="adminLogin">
      <p className="adminLoginTitle">Yönetim Girişi</p>
      <div className="adminLoginRow">
        <input
          type="password"
          placeholder="Admin şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && girisYap()}
          className="passwordInput"
        />
        <button onClick={girisYap} className="adminBtn">Gir</button>
      </div>
    </div>
  );
}


function SortablePhotoItem({
  url,
  index,
  coverIndex,
  setCover,
  removePhoto,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : "auto",
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`photoManageItem sortablePhoto ${coverIndex === index ? "cover" : ""}`}
      {...attributes}
      {...listeners}
    >
      <img src={url} alt={`İlan fotoğrafı ${index + 1}`} />

      <div className="dragHint">Sürükle</div>

      <div className="photoManageOverlay">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCover(index);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {coverIndex === index ? "Kapak ✓" : "Kapak Yap"}
        </button>

        <button
          type="button"
          className="removePhoto"
          onClick={(e) => {
            e.stopPropagation();
            removePhoto(index);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          Sil
        </button>
      </div>
    </div>
  );
}

function AdminPanel({
  form,
  setForm,
  duzenlenenId,
  ilanKaydet,
  setDuzenlenenId,
  bosForm,
}) {
  const [uploading, setUploading] = React.useState(false);
  const [videoUploading, setVideoUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 160, tolerance: 8 },
    })
  );

  const photos = React.useMemo(() => fotoListesi(form), [form.image]);
  const coverIndex = Math.min(Number(form.coverIndex || 0), Math.max(photos.length - 1, 0));

  const updatePhotos = (nextPhotos, nextCoverIndex = coverIndex) => {
    setForm((prev) => ({
      ...prev,
      image: joinPhotos(nextPhotos),
      coverIndex: Math.min(Math.max(nextCoverIndex, 0), Math.max(nextPhotos.length - 1, 0)),
    }));
  };

  const uploadFilesToCloudinary = async (files) => {
    const selectedFiles = Array.from(files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (selectedFiles.length === 0) {
      alert("Lütfen fotoğraf dosyası seç.");
      return;
    }

    setUploading(true);
    setUploadProgress(`0/${selectedFiles.length} fotoğraf yüklendi`);

    const uploadedUrls = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        data.append("folder", "han-gayrimenkul");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Cloudinary yükleme hatası");
        }

        const result = await response.json();
        uploadedUrls.push(optimizeCloudinaryUrl(result.secure_url));
        setUploadProgress(`${i + 1}/${selectedFiles.length} fotoğraf yüklendi`);
      }

      setForm((prev) => {
        const mevcut = fotoListesi(prev);
        const combined = [...mevcut, ...uploadedUrls];
        return {
          ...prev,
          image: joinPhotos(combined),
          coverIndex: Number(prev.coverIndex || 0),
        };
      });
    } catch (error) {
      console.error(error);
      alert("Fotoğraf yükleme sırasında hata oluştu. Upload preset ayarını kontrol et.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(""), 1800);
    }
  };

  const uploadVideoToCloudinary = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Lütfen video dosyası seç.");
      return;
    }

    setVideoUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      data.append("folder", "han-gayrimenkul-videolar");

   const response = await fetch(
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
  {
    method: "POST",
    body: data,
  }
);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Cloudinary video yükleme hatası");
      }

      const result = await response.json();
      setForm((prev) => ({
        ...prev,
        videoUrl: optimizeCloudinaryVideoUrl(result.secure_url),
      }));
    } catch (error) {
      console.error(error);
      alert("Video yükleme sırasında hata oluştu. Video boyutu veya Cloudinary preset ayarını kontrol et.");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    uploadFilesToCloudinary(e.dataTransfer.files);
  };

  const removePhoto = (index) => {
    const next = photos.filter((_, i) => i !== index);
    const nextCover = coverIndex === index ? 0 : coverIndex > index ? coverIndex - 1 : coverIndex;
    updatePhotos(next, nextCover);
  };

  const handlePhotoDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = photos.indexOf(active.id);
    const newIndex = photos.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(photos, oldIndex, newIndex);

    let nextCover = coverIndex;
    if (coverIndex === oldIndex) nextCover = newIndex;
    else if (oldIndex < coverIndex && newIndex >= coverIndex) nextCover = coverIndex - 1;
    else if (oldIndex > coverIndex && newIndex <= coverIndex) nextCover = coverIndex + 1;

    updatePhotos(next, nextCover);
  };

  return (
    <section className="adminPanel proAdminPanel">
      <div className="adminHead">
        <div>
          <p className="adminEyebrow">HAN GAYRİMENKUL YÖNETİM</p>
          <h2 className="adminTitle">{duzenlenenId ? "İlan Düzenle" : "Yeni İlan Ekle"}</h2>
        </div>

        <label className="featuredToggle">
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          <span>⭐ Öne Çıkan İlan</span>
        </label>
      </div>

      <div className="adminSection">
        <h3>Temel Bilgiler</h3>
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

          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {PROPERTY_TYPES.filter((x) => x !== "Tümü").map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="adminSection">
        <h3>Fotoğraf Galerisi</h3>
        <div
          className={`uploadBox ${dragActive ? "dragActive" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <div className="uploadIcon">📸</div>
          <h3>Fotoğrafları buraya sürükle veya seç</h3>
          <p>Birden fazla fotoğrafı aynı anda yükleyebilirsin. Linkler otomatik ilana eklenir.</p>

          <label className="uploadBtn">
            {uploading ? "Yükleniyor..." : "Fotoğraf Seç"}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => uploadFilesToCloudinary(e.target.files)}
            />
          </label>

          {uploadProgress && <span className="uploadProgress">{uploadProgress}</span>}
        </div>

        {photos.length > 0 && (
          <div className="photoManager">
            <div className="photoManagerHead">
              <strong>{photos.length} fotoğraf</strong>
              <span>Kapak fotoğrafı ve sıralamayı buradan düzenle.</span>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handlePhotoDragEnd}
            >
              <SortableContext items={photos} strategy={rectSortingStrategy}>
                <div className="photoManageGrid">
                  {photos.map((url, index) => (
                    <SortablePhotoItem
                      key={url}
                      url={url}
                      index={index}
                      coverIndex={coverIndex}
                      setCover={(photoIndex) => setForm({ ...form, coverIndex: photoIndex })}
                      removePhoto={removePhoto}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        <textarea
          className="textarea imageTextarea"
          placeholder="Fotoğraf linkleri otomatik buraya gelir. İstersen elle link de ekleyebilirsin."
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value, coverIndex: 0 })}
        />
        <p className="hint">İlk linkler otomatik Cloudinary’den gelir. Kapak seçimini yukarıdaki fotoğraf yöneticisinden yapabilirsin.</p>
      </div>

      <div className="adminSection">
        <h3>Video ve Sosyal İçerik</h3>

        <div className="videoUploadBox">
          <div>
            <strong>🎥 İlan Videosu</strong>
            <p>Tek video yükle. Villa, müstakil ev ve özel portföylerde premium etki sağlar.</p>
          </div>

          <label className="uploadBtn">
            {videoUploading ? "Video Yükleniyor..." : "Video Seç"}
            <input
              type="file"
              accept="video/*"
              disabled={videoUploading}
              onChange={(e) => uploadVideoToCloudinary(e.target.files?.[0])}
            />
          </label>
        </div>

        <input
          className="input full"
          placeholder="Video linki otomatik buraya gelir. İstersen elle video linki de ekleyebilirsin."
          value={form.videoUrl}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
        />

        {form.videoUrl && (
          <div className="adminVideoPreview">
            <video src={form.videoUrl} controls playsInline />
          </div>
        )}

        <div className="aiTools">
          <button
            type="button"
            onClick={() => setForm({ ...form, socialCaption: generateInstagramCaption(form) })}
          >
            📱 Instagram Açıklaması Oluştur
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, reelsText: generateReelsText(form) })}
          >
            🎬 Reels Metni Oluştur
          </button>
        </div>

        <textarea
          className="textarea"
          placeholder="Instagram açıklaması"
          value={form.socialCaption}
          onChange={(e) => setForm({ ...form, socialCaption: e.target.value })}
        />
        <textarea
          className="textarea"
          placeholder="Reels metni"
          value={form.reelsText}
          onChange={(e) => setForm({ ...form, reelsText: e.target.value })}
        />
      </div>

      <div className="adminSection">
        <h3>Bağlantılar ve Açıklama</h3>
        <div className="formGrid">
          <input className="input" placeholder="Instagram ilan linki" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          <input className="input" placeholder="Google Maps konum linki" value={form.maps} onChange={(e) => setForm({ ...form, maps: e.target.value })} />
          <div className="aiTools">
            <button
              type="button"
              onClick={() => setForm({ ...form, description: generateListingDescription(form) })}
            >
              ✨ Açıklama Oluştur
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, investmentNote: generateInvestmentNote(form) })}
            >
              💰 Yatırım Notu Oluştur
            </button>
          </div>

          <textarea className="textarea" placeholder="İlan açıklaması" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className="textarea" placeholder="Yatırım notu: Bu ilan neden değerli?" value={form.investmentNote} onChange={(e) => setForm({ ...form, investmentNote: e.target.value })} />
        </div>
      </div>

      <div className="adminActions">
        <button className="addBtn" onClick={ilanKaydet} disabled={uploading}>
          {duzenlenenId ? "İlanı Güncelle" : "İlan Ekle"}
        </button>

        {duzenlenenId && (
          <button className="cancelBtn" onClick={() => { setDuzenlenenId(null); setForm(bosForm); }}>
            Vazgeç
          </button>
        )}
      </div>
    </section>
  );
}

function FavoriteButton({ id, favorites, toggleFavorite, compact = false }) {
  const active = favorites.includes(id);

  return (
    <button
      className={`favoriteBtn ${active ? "active" : ""} ${compact ? "compact" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
      }}
      title={active ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      {active ? "♥" : "♡"} {compact ? "" : active ? "Favoride" : "Favori"}
    </button>
  );
}

function ListingCard({ ilan, admin, ilanDuzenle, ilanSil, favorites, toggleFavorite }) {
  const fotolar = fotoListesi(ilan);
  const slug = ilanSlug(ilan);

  return (
    <article className="card">
      <Link to={`/ilan/${slug}`} className="cardMainLink">
        <div className="imageWrap">
          <img className="image" src={ilkFoto(ilan)} alt={ilan.title} loading="lazy" />
          <span className="status">{ilan.status || "Satılık"}</span>
          {ilan.featured && <span className="featuredBadge">⭐ Öne Çıkan</span>}
          {ilan.videoUrl && <span className="videoBadge">▶ Video</span>}
          {ilan.type && <span className="typeBadge">{ilan.type}</span>}
          {fotolar.length > 1 && <span className="photoCount">{fotolar.length} fotoğraf</span>}
          <FavoriteButton id={ilan.id} favorites={favorites} toggleFavorite={toggleFavorite} compact />
        </div>

        <div className="cardBody">
          <p className="location">Konum: {ilan.location}</p>
          <h3 className="cardTitle">{ilan.title}</h3>
          <p className="price">{ilan.price}</p>

          <div className="details">
            {ilan.rooms && <span>{ilan.rooms}</span>}
            {ilan.area && <span>{ilan.area} m²</span>}
            {ilan.type && <span>{ilan.type}</span>}
          </div>
        </div>
      </Link>

      <div className="buttonRow">
        <a href={whatsappLink(ilan)} target="_blank" rel="noreferrer" className="whatsapp">
          <LogoIcon type="whatsapp" /> WhatsApp
        </a>

        {ilan.instagram ? (
          <a href={ilan.instagram} target="_blank" rel="noreferrer" className="instagram">
            <LogoIcon type="instagram" /> Instagram
          </a>
        ) : (
          <a href={CONTACTS.instagram} target="_blank" rel="noreferrer" className="instagram">
            <LogoIcon type="instagram" /> Instagram
          </a>
        )}

        {admin && (
          <>
            <button className="editBtn" onClick={() => ilanDuzenle(ilan)}>Düzenle</button>
            <button className="deleteBtn" onClick={() => ilanSil(ilan.id)}>Sil</button>
          </>
        )}
      </div>
    </article>
  );
}

function Home({
  ilanlar,
  admin,
  adminOpen,
  setAdminOpen,
  setAdmin,
  sifre,
  setSifre,
  girisYap,
  form,
  setForm,
  duzenlenenId,
  ilanKaydet,
  setDuzenlenenId,
  bosForm,
  ilanDuzenle,
  ilanSil,
  favorites,
  toggleFavorite,
}) {
  const [filtre, setFiltre] = useState("Tümü");
  const [tur, setTur] = useState("Tümü");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const gorunenIlanlar = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return ilanlar
      .filter((ilan) => {
        const statusOk = filtre === "Tümü" || ilan.status === filtre;
        const typeOk = tur === "Tümü" || ilan.type === tur;
        const favOk = !onlyFavorites || favorites.includes(ilan.id);

        const searchable = [
          ilan.title,
          ilan.price,
          ilan.location,
          ilan.rooms,
          ilan.area,
          ilan.status,
          ilan.type,
          ilan.description,
          ilan.investmentNote,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const searchOk = !q || searchable.includes(q);

        return statusOk && typeOk && favOk && searchOk;
      })
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [ilanlar, filtre, tur, onlyFavorites, favorites, searchTerm]);

  return (
    <div className="page">
      <SEO
        title="Han Gayrimenkul | Sakarya Karasu Satılık ve Kiralık Gayrimenkul"
        description="Sakarya Karasu’da satılık, kiralık, arsa, villa, daire ve yatırım odaklı gayrimenkul portföyleri. Han Gayrimenkul ile güvenilir emlak danışmanlığı."
        image={DEFAULT_SEO_IMAGE}
        url={SITE_URL}
      />
      <section className="hero">
        <video className="heroVideo" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="heroShade"></div>

        <Header admin={admin} setAdmin={setAdmin} setAdminOpen={setAdminOpen} />

        {adminOpen && !admin && (
          <AdminLogin sifre={sifre} setSifre={setSifre} girisYap={girisYap} />
        )}

        <div className="heroContent">
          <span className="badge">Sakarya / Karasu</span>
          <h2 className="heroTitle">Gayrimenkulde güven, yatırımda değer.</h2>
          <p className="heroText">
            Han Gayrimenkul; satılık, kiralık ve yatırım odaklı portföyleri güvenilir,
            şeffaf ve profesyonel şekilde sunar.
          </p>

          <div className="heroActions">
            <a href={`https://wa.me/${CONTACTS.whatsapp}`} target="_blank" rel="noreferrer" className="heroBtn">
              <LogoIcon type="whatsapp" /> WhatsApp ile İletişime Geç
            </a>
            <a href="#ilanlar" className="ghostBtn">İlanları İncele</a>
          </div>

          <div className="statsGrid">
            <div className="statBox"><strong>{ilanlar.length}+</strong><span>Aktif İlan</span></div>
            <div className="statBox"><strong>{favorites.length}</strong><span>Favori İlan</span></div>
            <div className="statBox"><strong>Karasu</strong><span>Bölge Uzmanlığı</span></div>
            <div className="statBox"><strong>Profesyonel</strong><span>Danışmanlık</span></div>
          </div>
        </div>
      </section>
<section id="ilanlar" className="listings">
        <p className="sectionLabel">PORTFÖYLERİMİZ</p>
        <h2 className="sectionTitle">Güncel İlanlar</h2>

        <div className="smartSearchBox">
          <span>🔎</span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Daire, villa, arsa, 2+1, denize yakın..."
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")}>Temizle</button>
          )}
        </div>

        <div className="filters">
          {["Tümü", "Satılık", "Kiralık"].map((x) => (
            <button
              key={x}
              className={`filterBtn ${filtre === x ? "active" : ""}`}
              onClick={() => setFiltre(x)}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="typeFilters">
          {PROPERTY_TYPES.map((x) => (
            <button
              key={x}
              className={`typeFilter ${tur === x ? "active" : ""}`}
              onClick={() => setTur(x)}
            >
              {tur === x ? "●" : "○"} {x}
            </button>
          ))}
        </div>

        <div className="favoriteFilterRow">
          <button
            className={`favoriteFilter ${onlyFavorites ? "active" : ""}`}
            onClick={() => setOnlyFavorites((v) => !v)}
          >
            {onlyFavorites ? "♥ Favoriler Gösteriliyor" : "♡ Favori İlanlarım"}
          </button>

          {onlyFavorites && (
            <button className="clearFavFilter" onClick={() => setOnlyFavorites(false)}>
              Tüm İlanlara Dön
            </button>
          )}
        </div>

        {gorunenIlanlar.length === 0 ? (
          <div className="emptyState">
            {onlyFavorites
              ? "Henüz favori ilanınız yok. Beğendiğiniz ilanlarda kalp ikonuna basabilirsiniz."
              : "Bu filtreye uygun ilan bulunamadı."}
          </div>
        ) : (
          <div className="cards">
            {gorunenIlanlar.map((ilan) => (
              <ListingCard
                key={ilan.id}
                ilan={ilan}
                admin={admin}
                ilanDuzenle={ilanDuzenle}
                ilanSil={ilanSil}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      <section id="yatirim" className="guide">
        <p className="sectionLabel">YATIRIM REHBERİ</p>
        <h2 className="sectionTitle">Karasu’da doğru yatırım için kısa notlar</h2>
        <div className="guideGrid">
          <div><h3>Konum Değeri</h3><p>Denize, merkeze ve ana yollara yakın portföyler daha güçlü talep görür.</p></div>
          <div><h3>Kira Potansiyeli</h3><p>Yazlık ve merkezi dairelerde dönemsel kira getirisi ayrıca değerlendirilmelidir.</p></div>
          <div><h3>Arsa ve Tarla</h3><p>İmar, yol cephesi ve gelişim aksı mutlaka detaylı kontrol edilmelidir.</p></div>
        </div>
      </section>

      <section className="whyUsSection">
        <p className="sectionLabel">NEDEN HAN GAYRİMENKUL?</p>
        <h2 className="sectionTitle">Güven veren dijital gayrimenkul deneyimi</h2>

        <div className="whyUsGrid">
          <div><span>🏠</span><h3>Bölge Uzmanlığı</h3><p>Karasu ve çevresindeki portföyleri konum, talep ve yatırım potansiyeliyle değerlendiriyoruz.</p></div>
          <div><span>🤝</span><h3>Şeffaf Danışmanlık</h3><p>Portföy bilgilerini açık, net ve güvenilir şekilde sunarak doğru karar almanıza yardımcı oluyoruz.</p></div>
          <div><span>📸</span><h3>Güçlü Dijital Sunum</h3><p>Fotoğraf, video, detay sayfası ve hızlı iletişimle portföyleri modern şekilde sergiliyoruz.</p></div>
          <div><span>💰</span><h3>Yatırım Odaklı Bakış</h3><p>Sadece bugünkü fiyatı değil, gelecekteki değer potansiyelini de dikkate alıyoruz.</p></div>
        </div>
      </section>

      <section className="testimonialsSection">
        <p className="sectionLabel">MÜŞTERİ DENEYİMİ</p>
        <h2 className="sectionTitle">Güven, hız ve doğru yönlendirme</h2>

        <div className="testimonialGrid">
          <div><strong>“İlgili ve hızlı dönüş aldık.”</strong><p>Portföy bilgileri netti, süreç boyunca hızlı iletişim kuruldu.</p><span>Han Gayrimenkul müşterisi</span></div>
          <div><strong>“Karasu bölgesi için doğru yönlendirme.”</strong><p>Yatırım açısından konum ve portföy değerlendirmesi çok yardımcı oldu.</p><span>Yatırım amaçlı alıcı</span></div>
          <div><strong>“Modern ve güven veren sunum.”</strong><p>İlan detayları, fotoğraflar ve iletişim süreci oldukça profesyoneldi.</p><span>Portföy inceleyen müşteri</span></div>
        </div>
      </section>

      <section id="blog" className="blogSection">
        <p className="sectionLabel">KARASU REHBERİ</p>
        <h2 className="sectionTitle">Yatırım ve Gayrimenkul Rehberi</h2>

        <div className="blogGrid">
          {BLOG_POSTS.map((post) => (
            <Link to={`/rehber/${post.slug}`} className="blogCard" key={post.slug}>
              <span>{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <strong>Devamını Oku →</strong>
            </Link>
          ))}
        </div>
      </section>

      <Contact />
    </div>
  );
}

function ListingDetail({ ilanlar, favorites, toggleFavorite }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [aktifFoto, setAktifFoto] = useState(0);
  const [fullGallery, setFullGallery] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = React.useRef(null);

  const ilan = useMemo(() => {
    const id = slug?.split("-").pop();
    return ilanlar.find((x) => x.id === id) || ilanlar.find((x) => slug?.startsWith(slugify(x.title)));
  }, [ilanlar, slug]);

  useEffect(() => {
    setAktifFoto(0);
    setZoomed(false);
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    setZoomed(false);
  }, [aktifFoto]);

  const goListings = () => {
    navigate("/#ilanlar");
    setTimeout(() => {
      document.getElementById("ilanlar")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  if (!ilan) {
    return (
      <div className="page detailPage">
        <Header detail />
        <div className="notFound">
          <h2>İlan bulunamadı</h2>
          <button className="heroBtn" onClick={goListings}>İlanlara Dön</button>
        </div>
      </div>
    );
  }

  const fotolar = fotoListesi(ilan);
  const current = fotolar[aktifFoto] || ilkFoto(ilan);

  const oncekiFoto = () => {
    if (fotolar.length < 2) return;
    setAktifFoto((prev) => (prev === 0 ? fotolar.length - 1 : prev - 1));
  };

  const sonrakiFoto = () => {
    if (fotolar.length < 2) return;
    setAktifFoto((prev) => (prev === fotolar.length - 1 ? 0 : prev + 1));
  };

  const dokunmaBasla = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const dokunmaBitir = (e) => {
    if (touchStartX.current === null) return;
    const fark = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(fark) > 45) fark > 0 ? sonrakiFoto() : oncekiFoto();
    touchStartX.current = null;
  };

  const detailUrl = `${SITE_URL}/ilan/${ilanSlug(ilan)}`;
  const seoTitle = `${ilan.title} | ${ilan.location || "Karasu"} | Han Gayrimenkul`;
  const seoDescription = `${ilan.price || ""} ${ilan.status || ""} ${ilan.type || "gayrimenkul"} - ${ilan.location || "Sakarya Karasu"}. Detaylı bilgi ve randevu için Han Gayrimenkul ile iletişime geçin.`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: ilan.title,
    description: ilan.description || seoDescription,
    url: detailUrl,
    image: fotolar,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Karasu",
      addressRegion: "Sakarya",
      addressCountry: "TR",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: String(ilan.price || "").replace(/[^0-9]/g, ""),
      availability: "https://schema.org/InStock",
    },
    seller: {
      "@type": "RealEstateAgent",
      name: "Han Gayrimenkul",
      telephone: CONTACTS.officePhone,
      email: CONTACTS.email,
      url: SITE_URL,
    },
  };

  return (
    <div className="page detailPage">
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={current || DEFAULT_SEO_IMAGE}
        url={detailUrl}
        type="article"
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <Header detail />

      <div className="mobileDetailBack">
        <button onClick={goListings}>← İlanlara Geri Dön</button>
      </div>

      <main className="detailWrap">
        <section className="detailGallery">
          <div className="detailImageFrame" onTouchStart={dokunmaBasla} onTouchEnd={dokunmaBitir}>
            <img
              src={current}
              alt={ilan.title}
              className="detailMainImage"
              onClick={() => setFullGallery(true)}
            />

            <button className="fullscreenBtn" onClick={() => setFullGallery(true)}>
              ⛶ Tam ekran
            </button>

            {fotolar.length > 1 && (
              <>
                <button className="galleryArrow arrowLeft" onClick={oncekiFoto}>‹</button>
                <button className="galleryArrow arrowRight" onClick={sonrakiFoto}>›</button>
              </>
            )}
          </div>

          {fotolar.length > 1 && (
            <div className="detailThumbs">
              {fotolar.map((foto, index) => (
                <button
                  key={index}
                  className={`detailThumb ${aktifFoto === index ? "active" : ""}`}
                  onClick={() => setAktifFoto(index)}
                >
                  <img src={foto} alt={`Fotoğraf ${index + 1}`} />
                </button>
              ))}
            </div>
          )}

          {ilan.videoUrl && (
            <div className="detailVideoBox">
              <div className="boxHeader">
                <span>▶</span>
                <h3>Video Tur</h3>
              </div>
              <video src={ilan.videoUrl} controls playsInline preload="metadata" />
            </div>
          )}
        </section>

        <section className="detailInfo proDetailInfo">
          <div className="detailTopActions">
            <button className="backToListingsBtn" onClick={goListings}>← İlanlara Geri Dön</button>
            <div className="detailTopRight">
              <button className="shareBtn" onClick={() => shareListing(ilan)}>↗ Paylaş</button>
              <FavoriteButton id={ilan.id} favorites={favorites} toggleFavorite={toggleFavorite} />
            </div>
          </div>

          <div className="detailBadges">
            <span>{ilan.status || "Satılık"}</span>
            {ilan.type && <span>{ilan.type}</span>}
            <span>Güncel Portföy</span>
          </div>

          <h2>{ilan.title}</h2>
          <p className="detailLocation">Konum: {ilan.location}</p>
          <p className="detailPrice">{ilan.price}</p>

          <div className="detailFeatureGrid">
            {buildFeatureList(ilan).map((item, index) => (
              <div className="detailFeature" key={index}>
                <b>{item.icon}</b>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="detailText proBox">
            <div className="boxHeader">
              <span>01</span>
              <h3>İlan Açıklaması</h3>
            </div>
            <p>{ilan.description || "Bu ilan hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz."}</p>
          </div>

          <div className="investmentBox proBox investmentHighlight">
            <div className="boxHeader">
              <span>02</span>
              <h3>Yatırım Notu</h3>
            </div>
            <p>{shortPropertyNote(ilan)}</p>
          </div>

          <div className="detailTwoCol">
            <div className="consultantBox proBox">
              <div className="boxHeader">
                <span>03</span>
                <h3>Danışmanlık</h3>
              </div>
              <p>Han Gayrimenkul ekibi, ilan detayları ve yatırım süreci hakkında size profesyonel destek sağlar.</p>
            </div>

            <div className="locationBox proBox">
              <div className="boxHeader">
                <span>04</span>
                <h3>Konum</h3>
              </div>
              <p>{ilan.location || "Sakarya / Karasu"}</p>
              {ilan.maps ? (
                <a href={ilan.maps} target="_blank" rel="noreferrer" className="miniMapBtn">Haritada Aç</a>
              ) : (
                <small>Konum bilgisi için bizimle iletişime geçebilirsiniz.</small>
              )}
            </div>
          </div>

          <div className="trustStrip">
            <div><strong>Şeffaf</strong><span>Bilgi paylaşımı</span></div>
            <div><strong>Hızlı</strong><span>WhatsApp dönüşü</span></div>
            <div><strong>Yerel</strong><span>Karasu uzmanlığı</span></div>
          </div>

          <div className="detailActions stickyContactActions">
            <a href={whatsappLink(ilan)} target="_blank" rel="noreferrer" className="whatsapp big">
              <LogoIcon type="whatsapp" /> WhatsApp ile Bilgi Al
            </a>

            <a href={ilan.instagram || CONTACTS.instagram} target="_blank" rel="noreferrer" className="instagram big">
              <LogoIcon type="instagram" /> Instagram’da Gör
            </a>

            {ilan.maps && (
              <a href={ilan.maps} target="_blank" rel="noreferrer" className="mapsBtn big">
                Google Maps’te Aç
              </a>
            )}
          </div>
        </section>
      </main>

      <Contact />
    </div>
  );
}

function BlogPage() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className="page detailPage">
        <Header detail />
        <div className="notFound">
          <h2>Rehber yazısı bulunamadı</h2>
          <Link className="heroBtn" to="/#blog">Rehbere Dön</Link>
        </div>
      </div>
    );
  }

  const blogUrl = `${SITE_URL}/rehber/${post.slug}`;
  const blogDescription = post.excerpt;

  return (
    <div className="page detailPage">
      <SEO
        title={`${post.title} | Han Gayrimenkul Karasu Rehberi`}
        description={blogDescription}
        image={DEFAULT_SEO_IMAGE}
        url={blogUrl}
        type="article"
      />

      <Header detail />

      <main className="blogDetail">
        <Link className="backToListingsBtn" to="/#blog">← Rehbere Dön</Link>
        <span className="blogDetailCategory">{post.category}</span>
        <h1>{post.title}</h1>
        <p className="blogLead">{post.excerpt}</p>

        <article>
          <p>{post.content}</p>
          <h2>Han Gayrimenkul ile doğru portföy seçimi</h2>
          <p>
            Gayrimenkul alımında doğru bilgi, doğru konum ve doğru fiyat analizi önemlidir.
            Karasu bölgesindeki portföyler hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.
          </p>
        </article>

        <div className="blogCta">
          <h3>Karasu’da portföy mü arıyorsunuz?</h3>
          <p>Satılık, kiralık ve yatırım odaklı ilanlarımızı inceleyin.</p>
          <Link to="/#ilanlar" className="heroBtn">İlanları İncele</Link>
        </div>
      </main>

      <Contact />
    </div>
  );
}


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

function AdminPage({
  admin,
  setAdmin,
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
                <h1>İlan Yönetimi</h1>
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
            />
          </>
        )}
      </main>
    </div>
  );
}

function Contact() {
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

      <p className="contactLocation">Konum: Sakarya / Karasu</p>

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

      <footer className="footer">
        © 2026 <strong>Han Gayrimenkul</strong> — Doğru yatırım, güvenle değer katar
      </footer>
    </section>
  );
}

function App() {
  const [ilanlar, setIlanlar] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [sifre, setSifre] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("han_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("han_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bosForm = {
    title: "",
    price: "",
    location: "Sakarya / Karasu",
    rooms: "",
    area: "",
    status: "Satılık",
    type: "Daire",
    image: "",
    instagram: "",
    maps: "",
    description: "",
    investmentNote: "",
    videoUrl: "",
    socialCaption: "",
    reelsText: "",
    featured: false,
    coverIndex: 0,
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

  const girisYap = () => {
    if (sifre === ADMIN_PASSWORD) {
      setAdmin(true);
      setAdminOpen(false);
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

    const payload = {
      ...form,
      type: form.type || "Daire",
      investmentNote: form.investmentNote || "",
      videoUrl: form.videoUrl || "",
      socialCaption: form.socialCaption || "",
      reelsText: form.reelsText || "",
      featured: !!form.featured,
      coverIndex: Number(form.coverIndex || 0),
    };

    if (duzenlenenId) {
      await updateDoc(doc(db, "ilanlar", duzenlenenId), payload);
      setDuzenlenenId(null);
    } else {
      await addDoc(collection(db, "ilanlar"), {
        ...payload,
        createdAt: new Date(),
      });
    }

    setForm(bosForm);
    ilanlariGetir();
  };

  const ilanSil = async (id) => {
    if (!confirm("Bu ilan silinsin mi?")) return;
    await deleteDoc(doc(db, "ilanlar", id));
    setFavorites((prev) => prev.filter((x) => x !== id));
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
      type: ilan.type || "Daire",
      image: ilan.image || "",
      instagram: ilan.instagram || "",
      maps: ilan.maps || "",
      description: ilan.description || "",
      investmentNote: ilan.investmentNote || "",
      videoUrl: ilan.videoUrl || "",
      socialCaption: ilan.socialCaption || "",
      reelsText: ilan.reelsText || "",
      featured: !!ilan.featured,
      coverIndex: Number(ilan.coverIndex || 0),
    });

    setDuzenlenenId(ilan.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Style />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              ilanlar={ilanlar}
              admin={admin}
              adminOpen={adminOpen}
              setAdminOpen={setAdminOpen}
              setAdmin={setAdmin}
              sifre={sifre}
              setSifre={setSifre}
              girisYap={girisYap}
              form={form}
              setForm={setForm}
              duzenlenenId={duzenlenenId}
              ilanKaydet={ilanKaydet}
              setDuzenlenenId={setDuzenlenenId}
              bosForm={bosForm}
              ilanDuzenle={ilanDuzenle}
              ilanSil={ilanSil}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          }
        />
        <Route
          path="/ilan/:slug"
          element={
            <ListingDetail
              ilanlar={ilanlar}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          }
        />
        <Route path="/rehber/:slug" element={<BlogPage />} />
        <Route
          path="/admin"
          element={
            <AdminPage
              admin={admin}
              setAdmin={setAdmin}
              sifre={sifre}
              setSifre={setSifre}
              girisYap={girisYap}
              form={form}
              setForm={setForm}
              duzenlenenId={duzenlenenId}
              ilanKaydet={ilanKaydet}
              setDuzenlenenId={setDuzenlenenId}
              bosForm={bosForm}
              ilanlar={ilanlar}
              ilanDuzenle={ilanDuzenle}
              ilanSil={ilanSil}
            />
          }
        />
      </Routes>
    </>
  );
}

function Style() {
  return (
    <style>{`
      :root {
        --orange: #ff8a00;
        --dark: #050505;
        --card: rgba(255,255,255,.045);
        --line: rgba(255,255,255,.13);
        --muted: #b7b7b7;
      }

      * { box-sizing: border-box; }
      body { overflow-x: hidden; }

      .page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(255,138,0,.12), transparent 32%),
          linear-gradient(180deg, #060606, #020202 55%, #050505);
        color: white;
      }

      .hero {
        min-height: 100vh;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid rgba(255,138,0,.28);
      }

      .heroVideo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
      }

      .heroShade {
        position: absolute;
        inset: 0;
        z-index: 1;
        background:
          linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,.88)),
          linear-gradient(to right, rgba(0,0,0,.60), rgba(0,0,0,.25));
      }

      .siteHeader {
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 14px 7%;
        min-height: 86px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        background: rgba(5,5,5,.68);
        border-bottom: 1px solid rgba(255,255,255,.08);
        backdrop-filter: blur(18px);
      }

      .brandBox {
        display: flex;
        align-items: center;
        gap: 14px;
        text-decoration: none;
        color: white;
        min-width: 0;
      }

      .brandLogo {
        width: 62px;
        height: 62px;
        object-fit: contain;
        flex: 0 0 auto;
        filter: drop-shadow(0 14px 30px rgba(0,0,0,.6));
      }

      .brandName {
        margin: 0;
        color: var(--orange);
        font-size: clamp(28px, 3vw, 42px);
        font-weight: 950;
        letter-spacing: -1.4px;
        line-height: .95;
      }

      .brandSlogan {
        margin: 6px 0 0;
        color: rgba(255,255,255,.92);
        font-weight: 700;
        font-size: 15px;
        line-height: 1.15;
      }

      .desktopNav {
        display: flex;
        align-items: center;
        gap: 28px;
      }

      .desktopNav a {
        color: rgba(255,255,255,.82);
        text-decoration: none;
        font-weight: 900;
        transition: .2s ease;
      }

      .desktopNav a:hover { color: var(--orange); }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 0 0 auto;
      }

      .navPill {
        min-height: 48px;
        padding: 0 24px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.55);
        background: rgba(0,0,0,.36);
        color: white;
        font-weight: 950;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .backPill {
        background: rgba(255,138,0,.16);
      }

      .flagBox {
        width: 58px;
        height: 39px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.25);
        box-shadow: 0 18px 38px rgba(0,0,0,.5);
      }

      .flagSvg { display: block; width: 100%; height: 100%; }

      .heroContent {
        position: relative;
        z-index: 3;
        max-width: 1120px;
        margin: 0 auto;
        padding: 140px 7% 80px;
        text-align: center;
      }

      .badge {
        display: inline-flex;
        padding: 12px 26px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.85);
        background: rgba(255,138,0,.10);
        color: var(--orange);
        font-weight: 950;
      }

      .heroTitle {
        max-width: 980px;
        margin: 30px auto 20px;
        font-size: clamp(46px, 7vw, 92px);
        line-height: .98;
        font-weight: 950;
        letter-spacing: -3px;
        text-shadow: 0 22px 60px rgba(0,0,0,.9);
      }

      .heroText {
        max-width: 780px;
        margin: 0 auto;
        color: rgba(255,255,255,.88);
        font-size: 21px;
        line-height: 1.65;
        font-weight: 650;
      }

      .heroActions {
        margin-top: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
      }

      .heroBtn, .ghostBtn {
        min-height: 56px;
        padding: 0 30px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 950;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: none;
        cursor: pointer;
      }

      .heroBtn {
        background: var(--orange);
        color: #050505;
        box-shadow: 0 20px 55px rgba(255,138,0,.22);
        border: 1px solid rgba(255,255,255,.75);
      }

      .ghostBtn {
        color: white;
        border: 1px solid rgba(255,255,255,.22);
        background: rgba(0,0,0,.25);
        backdrop-filter: blur(12px);
      }

      .statsGrid {
        margin: 48px auto 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
      }

      .statBox {
        padding: 18px 14px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        border-radius: 22px;
        backdrop-filter: blur(18px);
      }

      .statBox strong {
        display: block;
        color: var(--orange);
        font-size: 22px;
        font-weight: 950;
      }

      .statBox span {
        display: block;
        margin-top: 4px;
        color: rgba(255,255,255,.82);
        font-size: 14px;
        font-weight: 800;
      }

      .logoIcon { width: 22px; height: 22px; object-fit: contain; }

      .adminLogin {
        position: fixed;
        right: 22px;
        top: 100px;
        z-index: 1000;
        width: min(340px, calc(100vw - 44px));
        padding: 18px;
        border-radius: 22px;
        border: 1px solid rgba(255,138,0,.42);
        background: rgba(8,8,8,.94);
        backdrop-filter: blur(18px);
      }

      .adminLoginTitle { color: var(--orange); margin: 0 0 12px; font-weight: 950; }
      .adminLoginRow { display: flex; gap: 8px; }
      .passwordInput, .input, .textarea {
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        color: white;
        border-radius: 14px;
        padding: 14px;
        outline: none;
        width: 100%;
      }

      .passwordInput { border-radius: 999px; }
      .adminBtn, .addBtn, .cancelBtn {
        border-radius: 999px;
        border: 1px solid var(--orange);
        background: rgba(255,138,0,.16);
        color: white;
        padding: 12px 18px;
        font-weight: 950;
        cursor: pointer;
      }

      .adminPanel {
        max-width: 1180px;
        margin: 34px auto 0;
        padding: 28px;
        border-radius: 28px;
        border: 1px solid rgba(255,138,0,.34);
        background: linear-gradient(135deg, rgba(255,138,0,.10), rgba(255,255,255,.045));
      }

      .adminTitle { margin: 0 0 18px; color: var(--orange); }
      .formGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }

      .uploadBox {
        grid-column: 1 / -1;
        border: 1px dashed rgba(255,138,0,.48);
        background:
          radial-gradient(circle at top left, rgba(255,138,0,.14), transparent 42%),
          rgba(255,255,255,.045);
        border-radius: 24px;
        padding: 26px 18px;
        text-align: center;
        transition: .25s ease;
      }

      .uploadBox.dragActive {
        border-color: var(--orange);
        background: rgba(255,138,0,.12);
        transform: translateY(-2px);
      }

      .uploadIcon {
        font-size: 38px;
        margin-bottom: 6px;
      }

      .uploadBox h3 {
        margin: 0 0 8px;
        color: #fff;
        font-size: 22px;
      }

      .uploadBox p {
        margin: 0 auto 16px;
        max-width: 620px;
        color: #bdbdbd;
        line-height: 1.5;
      }

      .uploadBtn {
        min-height: 50px;
        padding: 0 24px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.75);
        background: var(--orange);
        color: #050505;
        font-weight: 950;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 18px 45px rgba(255,138,0,.16);
      }

      .uploadBtn input {
        display: none;
      }

      .uploadProgress {
        display: block;
        margin-top: 12px;
        color: var(--orange);
        font-weight: 900;
      }

      .imageTextarea {
        min-height: 86px;
        font-size: 13px;
      }

      .input.full, .textarea, .hint { grid-column: 1 / -1; }
      .textarea { min-height: 110px; resize: vertical; }
      .hint { color: #aaa; margin: 0; font-size: 13px; }
      .addBtn { margin-top: 18px; background: var(--orange); color: #050505; }
      .cancelBtn { margin-top: 18px; margin-left: 10px; background: transparent; }

      .listings {
        max-width: 1260px;
        margin: 0 auto;
        padding: 78px 7% 48px;
      }

      .sectionLabel {
        text-align: center;
        margin: 0;
        color: var(--orange);
        letter-spacing: 2px;
        font-weight: 950;
      }

      .sectionTitle {
        text-align: center;
        font-size: clamp(34px, 5vw, 50px);
        margin: 10px 0 26px;
        letter-spacing: -1px;
      }

      .filters {
        display: flex;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .filterBtn {
        min-width: 130px;
        padding: 15px 26px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.20);
        background: rgba(0,0,0,.18);
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .filterBtn.active {
        background: var(--orange);
        border-color: var(--orange);
        color: #050505;
      }

      .typeFilters {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        margin: 0 auto 22px;
        max-width: 980px;
      }

      .typeFilter {
        padding: 10px 15px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(255,255,255,.045);
        color: rgba(255,255,255,.82);
        font-weight: 850;
        cursor: pointer;
      }

      .typeFilter.active {
        border-color: rgba(255,138,0,.8);
        color: var(--orange);
        background: rgba(255,138,0,.10);
        box-shadow: 0 0 28px rgba(255,138,0,.10);
      }

      .typeFilter {
        position: relative;
        overflow: hidden;
      }

      .typeFilter:hover {
        border-color: rgba(255,138,0,.55);
        transform: translateY(-1px);
      }

      .featuredBadge {
        position: absolute;
        left: 16px;
        top: 64px;
        z-index: 3;
        padding: 8px 13px;
        border-radius: 999px;
        background: rgba(255,138,0,.16);
        border: 1px solid rgba(255,138,0,.55);
        color: #fff;
        font-weight: 950;
        backdrop-filter: blur(12px);
      }

      .proAdminPanel {
        background:
          radial-gradient(circle at top left, rgba(255,138,0,.16), transparent 36%),
          linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.026));
      }

      .adminHead {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 22px;
      }

      .adminEyebrow {
        margin: 0 0 6px;
        color: var(--orange);
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 950;
      }

      .featuredToggle {
        min-height: 52px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.42);
        background: rgba(255,138,0,.08);
        color: white;
        font-weight: 950;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        white-space: nowrap;
      }

      .featuredToggle input {
        width: 18px;
        height: 18px;
        accent-color: var(--orange);
      }

      .adminSection {
        margin-top: 18px;
        padding: 20px;
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(0,0,0,.18);
      }

      .adminSection h3 {
        margin: 0 0 14px;
        color: #fff;
        font-size: 20px;
      }

      .photoManager {
        margin-top: 18px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.035);
        padding: 16px;
      }

      .photoManagerHead {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }

      .photoManagerHead strong {
        color: var(--orange);
        font-size: 18px;
      }

      .photoManagerHead span {
        color: #bdbdbd;
        font-size: 13px;
      }

      .photoManageGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
      }

      .photoManageItem {
        position: relative;
        height: 120px;
        border-radius: 18px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,.10);
        background: #000;
      }

      .sortablePhoto {
        cursor: grab;
        touch-action: none;
        user-select: none;
      }

      .sortablePhoto:active {
        cursor: grabbing;
      }

      .dragHint {
        position: absolute;
        left: 8px;
        bottom: 8px;
        z-index: 4;
        padding: 6px 9px;
        border-radius: 999px;
        background: rgba(0,0,0,.58);
        color: rgba(255,255,255,.86);
        font-size: 11px;
        font-weight: 900;
        border: 1px solid rgba(255,255,255,.16);
        backdrop-filter: blur(8px);
        pointer-events: none;
      }

      .photoManageItem.cover {
        border-color: var(--orange);
        box-shadow: 0 0 25px rgba(255,138,0,.16);
      }

      .photoManageItem img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .photoManageOverlay {
        position: absolute;
        inset: 0;
        padding: 8px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        background: linear-gradient(to bottom, rgba(0,0,0,.28), rgba(0,0,0,.78));
        opacity: 0;
        transition: .2s ease;
        pointer-events: none;
      }

      .photoManageItem:hover .photoManageOverlay,
      .photoManageItem.cover .photoManageOverlay {
        opacity: 1;
      }

      .photoManageOverlay button {
        border: 1px solid rgba(255,255,255,.20);
        background: rgba(0,0,0,.56);
        color: white;
        border-radius: 999px;
        padding: 7px 9px;
        font-weight: 900;
        cursor: pointer;
        backdrop-filter: blur(10px);
        pointer-events: auto;
      }

      .photoMoveBtns {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .photoMoveBtns button {
        flex: 1;
        min-width: 34px;
      }

      .photoMoveBtns .removePhoto {
        background: rgba(176,0,32,.82);
      }

      .photoMoveBtns button:disabled {
        opacity: .35;
        cursor: not-allowed;
      }

      .adminActions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .favoriteFilterRow {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
        margin: 0 0 36px;
      }

      .favoriteFilter, .clearFavFilter {
        border-radius: 999px;
        padding: 12px 18px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(255,255,255,.045);
        color: white;
        font-weight: 900;
        cursor: pointer;
      }

      .favoriteFilter.active {
        border-color: rgba(255,138,0,.8);
        color: #050505;
        background: var(--orange);
      }

      .clearFavFilter {
        color: var(--orange);
        border-color: rgba(255,138,0,.42);
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        gap: 32px;
        align-items: stretch;
      }

      .card {
        border-radius: 26px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.13);
        background: linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.025));
        box-shadow: 0 26px 75px rgba(0,0,0,.42);
        transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
      }

      .card:hover {
        transform: translateY(-6px);
        border-color: rgba(255,138,0,.65);
        box-shadow: 0 34px 90px rgba(255,138,0,.10);
      }

      .cardMainLink { text-decoration: none; color: inherit; display: block; }

      .imageWrap {
        position: relative;
        height: 300px;
        overflow: hidden;
        background: #000;
      }

      .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .5s ease;
      }

      .card:hover .image { transform: scale(1.06); }

      .status, .photoCount, .typeBadge {
        position: absolute;
        border-radius: 999px;
        font-weight: 950;
        z-index: 2;
      }

      .status {
        left: 16px;
        top: 16px;
        padding: 10px 16px;
        background: var(--orange);
        color: #050505;
      }

      .typeBadge {
        left: 16px;
        bottom: 16px;
        padding: 8px 14px;
        background: rgba(0,0,0,.56);
        color: white;
        border: 1px solid rgba(255,255,255,.18);
        backdrop-filter: blur(12px);
      }

      .photoCount {
        right: 16px;
        top: 16px;
        padding: 9px 14px;
        background: rgba(0,0,0,.58);
        color: white;
        border: 1px solid rgba(255,255,255,.20);
        backdrop-filter: blur(12px);
      }

      .favoriteBtn {
        min-height: 48px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(0,0,0,.44);
        color: white;
        font-weight: 950;
        cursor: pointer;
        backdrop-filter: blur(12px);
      }

      .favoriteBtn.active {
        background: rgba(255,138,0,.92);
        color: #050505;
        border-color: var(--orange);
      }

      .favoriteBtn.compact {
        position: absolute;
        right: 16px;
        bottom: 16px;
        z-index: 5;
        width: 48px;
        height: 48px;
        padding: 0;
        font-size: 25px;
      }

      .cardBody { padding: 24px 24px 12px; text-align: center; }
      .location { margin: 0; color: var(--muted); font-size: 14px; }
      .cardTitle { min-height: 62px; margin: 12px 0; font-size: 22px; line-height: 1.25; }
      .price, .detailPrice { color: var(--orange); font-size: 31px; font-weight: 950; margin: 12px 0; letter-spacing: -1px; }
      .details, .detailSpecs {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 14px 0;
      }

      .details span, .detailSpecs span {
        padding: 9px 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.16);
        color: #eee;
        font-size: 13px;
        font-weight: 800;
      }

      .buttonRow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 18px 24px 24px;
      }

      .whatsapp, .instagram, .mapsBtn, .editBtn, .deleteBtn {
        min-height: 48px;
        padding: 11px 14px;
        border-radius: 15px;
        text-decoration: none;
        color: white;
        font-weight: 950;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .whatsapp { background: rgba(37,211,102,.18); border: 1px solid rgba(37,211,102,.46); }
      .instagram { background: rgba(225,48,108,.18); border: 1px solid rgba(225,48,108,.46); }
      .mapsBtn { background: rgba(255,138,0,.14); border: 1px solid rgba(255,138,0,.45); }
      .editBtn { background: #1f6feb; }
      .deleteBtn { background: #b00020; }

      .emptyState {
        padding: 34px;
        border-radius: 24px;
        text-align: center;
        border: 1px solid rgba(255,255,255,.12);
        color: #bbb;
      }

      .smartSearchBox {
        max-width: 760px;
        margin: 0 auto 18px;
        min-height: 62px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.32);
        background: rgba(255,255,255,.055);
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 18px;
        box-shadow: 0 22px 70px rgba(0,0,0,.28);
        backdrop-filter: blur(16px);
      }

      .smartSearchBox span {
        font-size: 22px;
      }

      .smartSearchBox input {
        flex: 1;
        border: 0;
        outline: 0;
        background: transparent;
        color: white;
        font-size: 17px;
        font-weight: 750;
      }

      .smartSearchBox input::placeholder {
        color: rgba(255,255,255,.48);
      }

      .smartSearchBox button {
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.34);
        color: var(--orange);
        border-radius: 999px;
        padding: 10px 13px;
        font-weight: 900;
        cursor: pointer;
      }

      .blogSection {
        max-width: 1180px;
        margin: 0 auto;
        padding: 42px 7% 74px;
      }

      .blogGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .blogCard {
        min-height: 260px;
        padding: 26px;
        border-radius: 28px;
        border: 1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(circle at top right, rgba(255,138,0,.12), transparent 42%),
          rgba(255,255,255,.045);
        text-decoration: none;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: .25s ease;
      }

      .blogCard:hover {
        transform: translateY(-6px);
        border-color: rgba(255,138,0,.5);
        box-shadow: 0 28px 75px rgba(255,138,0,.09);
      }

      .blogCard span {
        width: fit-content;
        padding: 8px 12px;
        border-radius: 999px;
        color: var(--orange);
        background: rgba(255,138,0,.10);
        border: 1px solid rgba(255,138,0,.32);
        font-weight: 950;
      }

      .blogCard h3 {
        margin: 18px 0 10px;
        font-size: 24px;
        line-height: 1.15;
      }

      .blogCard p {
        margin: 0;
        color: #cfcfcf;
        line-height: 1.55;
      }

      .blogCard strong {
        color: var(--orange);
        margin-top: 18px;
      }

      .blogDetail {
        width: min(900px, calc(100% - 36px));
        margin: 36px auto 70px;
        padding: 34px;
        border-radius: 30px;
        border: 1px solid rgba(255,255,255,.12);
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.025));
      }

      .blogDetailCategory {
        display: inline-flex;
        margin-top: 24px;
        color: var(--orange);
        font-weight: 950;
      }

      .blogDetail h1 {
        font-size: clamp(38px, 6vw, 62px);
        line-height: 1;
        letter-spacing: -2px;
        margin: 18px 0;
      }

      .blogLead {
        color: #d4d4d4;
        font-size: 21px;
        line-height: 1.6;
      }

      .blogDetail article {
        margin-top: 28px;
        color: #d0d0d0;
        font-size: 18px;
        line-height: 1.8;
      }

      .blogDetail article h2 {
        color: white;
        margin-top: 32px;
      }

      .blogCta {
        margin-top: 34px;
        padding: 26px;
        border-radius: 24px;
        background: rgba(255,138,0,.10);
        border: 1px solid rgba(255,138,0,.34);
      }

      .fullscreenBtn {
        position: absolute;
        right: 16px;
        bottom: 16px;
        z-index: 12;
        min-height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(0,0,0,.56);
        color: white;
        font-weight: 950;
        cursor: pointer;
        backdrop-filter: blur(12px);
      }

      .fullGalleryOverlay {
        position: fixed;
        inset: 0;
        z-index: 5000;
        background: rgba(0,0,0,.96);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .fullGalleryTop {
        position: absolute;
        top: 18px;
        left: 18px;
        right: 18px;
        z-index: 5010;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .fullGalleryTop button,
      .fullGalleryTop span {
        min-height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(15,15,15,.62);
        color: white;
        font-weight: 950;
        backdrop-filter: blur(12px);
      }

      .fullGalleryTop button {
        cursor: pointer;
      }

      .fullGalleryImage {
        max-width: 96vw;
        max-height: 82vh;
        object-fit: contain;
        transition: transform .25s ease;
        cursor: zoom-in;
      }

      .fullGalleryImage.zoomed {
        transform: scale(1.7);
        cursor: zoom-out;
      }

      .fullArrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 5010;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(15,15,15,.62);
        color: white;
        font-size: 42px;
        cursor: pointer;
        backdrop-filter: blur(12px);
      }

      .fullArrow.left { left: 24px; }
      .fullArrow.right { right: 24px; }

      .fullGalleryThumbs {
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 18px;
        z-index: 5010;
        display: flex;
        justify-content: center;
        gap: 8px;
        overflow-x: auto;
        padding: 8px;
      }

      .fullGalleryThumbs button {
        flex: 0 0 74px;
        width: 74px;
        height: 54px;
        border-radius: 12px;
        overflow: hidden;
        padding: 0;
        border: 2px solid transparent;
        opacity: .7;
        background: transparent;
        cursor: pointer;
      }

      .fullGalleryThumbs button.active {
        opacity: 1;
        border-color: var(--orange);
      }

      .fullGalleryThumbs img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .guide {
        max-width: 1120px;
        margin: 0 auto;
        padding: 30px 7% 70px;
      }

      .guideGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .guideGrid > div {
        padding: 24px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
      }

      .guideGrid h3 { color: var(--orange); margin: 0 0 10px; }
      .guideGrid p { color: #cfcfcf; margin: 0; line-height: 1.6; }

      .detailPage { overflow-x: hidden; }
      .mobileDetailBack { display: none; }

      .detailWrap {
        width: min(1280px, calc(100% - 42px));
        margin: 28px auto;
        display: grid;
        grid-template-columns: 1.18fr .82fr;
        gap: 28px;
        align-items: start;
      }

      .detailGallery, .detailInfo {
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 30px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.025));
        box-shadow: 0 30px 80px rgba(0,0,0,.42);
      }

      .detailGallery { padding: 18px; overflow: hidden; }

      .detailImageFrame {
        position: relative;
        width: 100%;
        height: 650px;
        border-radius: 24px;
        overflow: hidden;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .detailMainImage {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        background: #000;
        display: block;
      }

      .galleryArrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 54px;
        height: 54px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(10,10,10,.55);
        color: #fff;
        font-size: 34px;
        cursor: pointer;
        z-index: 20;
        backdrop-filter: blur(10px);
        transition: all .25s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .galleryArrow:hover {
        background: var(--orange);
        color: #050505;
        transform: translateY(-50%) scale(1.08);
      }

      .arrowLeft { left: 18px; }
      .arrowRight { right: 18px; }

      .detailThumbs {
        margin-top: 14px;
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 8px;
      }

      .detailThumb {
        flex: 0 0 86px;
        width: 86px;
        height: 66px;
        border-radius: 14px;
        overflow: hidden;
        border: 2px solid transparent;
        background: transparent;
        padding: 0;
        cursor: pointer;
        opacity: .72;
      }

      .detailThumb.active {
        border-color: var(--orange);
        opacity: 1;
      }

      .detailThumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .detailInfo { padding: 30px; }
      .detailTopActions {
        display: flex;
        gap: 12px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
      }

      .backToListingsBtn {
        min-height: 48px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.5);
        background: rgba(255,138,0,.12);
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .detailBadges { display: flex; gap: 10px; flex-wrap: wrap; }
      .detailBadges span {
        padding: 11px 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.55);
        background: rgba(255,138,0,.10);
        color: var(--orange);
        font-weight: 950;
      }

      .detailInfo h2 {
        margin: 24px 0 12px;
        font-size: clamp(32px, 4vw, 48px);
        line-height: 1.05;
      }

      .detailLocation { color: var(--muted); font-weight: 750; }
      .detailPrice { font-size: 44px; }
      .detailSpecs { justify-content: flex-start; }

      .detailTopRight {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .shareBtn {
        min-height: 48px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(255,255,255,.055);
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .detailFeatureGrid {
        margin-top: 22px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .detailFeature {
        padding: 16px;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 3px 10px;
        align-items: center;
      }

      .detailFeature b {
        grid-row: span 2;
        font-size: 25px;
      }

      .detailFeature span {
        color: #a9a9a9;
        font-size: 12px;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: .7px;
      }

      .detailFeature strong {
        font-size: 16px;
        color: #fff;
      }

      .proBox {
        position: relative;
        overflow: hidden;
      }

      .proBox::before {
        content: "";
        position: absolute;
        inset: 0 auto 0 0;
        width: 3px;
        background: linear-gradient(to bottom, transparent, var(--orange), transparent);
        opacity: .8;
      }

      .boxHeader {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
      }

      .boxHeader span {
        width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255,138,0,.14);
        color: var(--orange);
        border: 1px solid rgba(255,138,0,.35);
        font-size: 13px;
        font-weight: 950;
      }

      .boxHeader h3 {
        margin: 0;
      }

      .investmentHighlight {
        background:
          radial-gradient(circle at top right, rgba(255,138,0,.16), transparent 40%),
          rgba(255,255,255,.035);
      }

      .detailTwoCol {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      .miniMapBtn {
        display: inline-flex;
        margin-top: 14px;
        padding: 10px 15px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.45);
        color: var(--orange);
        text-decoration: none;
        font-weight: 950;
      }

      .locationBox small {
        display: block;
        color: #aaa;
        line-height: 1.5;
      }

      .trustStrip {
        margin-top: 22px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .trustStrip div {
        padding: 14px 10px;
        border-radius: 18px;
        text-align: center;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(0,0,0,.24);
      }

      .trustStrip strong {
        display: block;
        color: var(--orange);
        font-weight: 950;
      }

      .trustStrip span {
        display: block;
        margin-top: 3px;
        color: #bdbdbd;
        font-size: 12px;
        font-weight: 800;
      }

      .detailText, .investmentBox, .consultantBox {
        margin-top: 22px;
        padding: 22px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.035);
      }

      .detailText h3, .investmentBox h3, .consultantBox h3 {
        margin: 0 0 10px;
        color: var(--orange);
      }

      .detailText p, .investmentBox p, .consultantBox p {
        margin: 0;
        color: #d0d0d0;
        line-height: 1.7;
      }

      .detailActions {
        margin-top: 24px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .big { min-height: 56px; }

      .notFound {
        min-height: 55vh;
        display: grid;
        place-items: center;
        text-align: center;
      }

      .contact {
        max-width: 1120px;
        margin: 20px auto 0;
        padding: 58px 7% 32px;
        border-top: 1px solid rgba(255,255,255,.12);
        text-align: center;
      }

      .contactTitle { font-size: clamp(34px, 5vw, 44px); margin: 0 0 32px; }
      .contactGrid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
      }

      .contactItem {
        padding: 26px 18px;
        border: 1px solid rgba(255,255,255,.13);
        border-radius: 22px;
        background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.026));
      }

      .contactIcon { color: var(--orange); font-size: 28px; margin-bottom: 10px; }
      .contactName { margin: 0 0 8px; font-weight: 900; font-size: 18px; }
      .contactPhone { color: var(--orange); margin: 5px 0; font-weight: 950; font-size: 19px; }
      .emailText { color: white; word-break: break-word; line-height: 1.45; }
      .contactLocation { margin-top: 30px; font-size: 20px; }

      .follow {
        margin-top: 34px;
        padding-top: 28px;
        border-top: 1px solid rgba(255,255,255,.12);
      }

      .followTitle { display: inline-block; margin-bottom: 18px; font-weight: 950; color: #ddd; }
      .socials { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
      .socialBtn {
        min-width: 158px;
        padding: 13px 22px;
        border-radius: 999px;
        border: 1px solid var(--orange);
        color: white;
        text-decoration: none;
        font-weight: 950;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        background: rgba(255,138,0,.05);
      }

      .footer { padding: 30px; text-align: center; color: #aaa; }
      .footer strong { color: var(--orange); }

      
      .aiTools {
        grid-column: 1 / -1;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        padding: 14px;
        border-radius: 18px;
        border: 1px solid rgba(255,138,0,.22);
        background: rgba(255,138,0,.07);
      }

      .aiTools button {
        min-height: 46px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.45);
        background: rgba(0,0,0,.28);
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .aiTools button:hover {
        background: var(--orange);
        color: #050505;
      }

      .adminRouteWrap {
        width: min(1180px, calc(100% - 28px));
        margin: 30px auto 70px;
      }

      .adminRouteTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 22px;
        padding: 24px;
        border-radius: 26px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.045);
      }

      .adminRouteTop h1 {
        margin: 0;
        font-size: clamp(34px, 5vw, 52px);
        letter-spacing: -1.5px;
      }

      .adminGate {
        min-height: 70vh;
        display: grid;
        place-items: center;
      }

      .adminGateCard {
        width: min(480px, 100%);
        padding: 34px;
        border-radius: 32px;
        border: 1px solid rgba(255,138,0,.32);
        background:
          radial-gradient(circle at top left, rgba(255,138,0,.16), transparent 42%),
          linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.028));
        text-align: center;
        box-shadow: 0 34px 90px rgba(0,0,0,.45);
      }

      .adminGateCard img {
        width: 86px;
        height: 86px;
        object-fit: contain;
        margin-bottom: 16px;
      }

      .adminGateCard p {
        margin: 0;
        color: var(--orange);
        font-weight: 950;
        letter-spacing: 1.5px;
      }

      .adminGateCard h2 {
        margin: 10px 0;
        font-size: 34px;
      }

      .adminGateCard span {
        color: #bcbcbc;
        display: block;
        margin-bottom: 24px;
      }

      .adminGateLogin {
        display: flex;
        gap: 10px;
      }

      .adminGateLogin input {
        flex: 1;
        min-width: 0;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        color: white;
        border-radius: 999px;
        padding: 14px 16px;
        outline: none;
      }

      .adminGateLogin button {
        border-radius: 999px;
        border: 1px solid var(--orange);
        background: var(--orange);
        color: #050505;
        padding: 0 18px;
        font-weight: 950;
        cursor: pointer;
      }

      
      .adminListPanel {
        margin-top: 28px;
        padding: 24px;
        border-radius: 28px;
        border: 1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(circle at top right, rgba(255,138,0,.10), transparent 36%),
          rgba(255,255,255,.035);
      }

      .adminListHead {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 20px;
      }

      .adminListHead h2 {
        margin: 0;
        font-size: clamp(28px, 4vw, 42px);
        letter-spacing: -1px;
      }

      .adminSearchBox {
        min-width: min(360px, 100%);
        min-height: 50px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.22);
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .adminSearchBox input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: white;
        font-weight: 800;
      }

      .adminListingGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        gap: 16px;
      }

      .adminListingCard {
        overflow: hidden;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(0,0,0,.22);
        display: grid;
        grid-template-rows: 180px 1fr auto;
      }

      .adminListingImage {
        position: relative;
        background: #000;
        overflow: hidden;
      }

      .adminListingImage img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .adminListingImage span {
        position: absolute;
        left: 12px;
        top: 12px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255,138,0,.18);
        border: 1px solid rgba(255,138,0,.52);
        color: white;
        font-weight: 950;
        backdrop-filter: blur(10px);
      }

      .adminListingInfo {
        padding: 16px;
      }

      .adminListingBadges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .adminListingBadges b {
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(255,138,0,.10);
        border: 1px solid rgba(255,138,0,.28);
        color: var(--orange);
        font-size: 12px;
      }

      .adminListingInfo h3 {
        margin: 12px 0 6px;
        font-size: 20px;
        line-height: 1.2;
      }

      .adminListingInfo p {
        margin: 0 0 8px;
        color: #aaa;
      }

      .adminListingInfo strong {
        display: block;
        color: var(--orange);
        font-size: 22px;
        margin-bottom: 10px;
      }

      .adminListingMeta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .adminListingMeta span {
        padding: 7px 10px;
        border-radius: 10px;
        background: rgba(255,255,255,.06);
        color: #ddd;
        font-size: 12px;
        font-weight: 850;
      }

      .adminListingActions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 0 16px 16px;
      }

      .adminEditBtn,
      .adminDeleteBtn {
        min-height: 46px;
        border-radius: 14px;
        border: 0;
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .adminEditBtn {
        background: rgba(255,138,0,.88);
        color: #050505;
      }

      .adminDeleteBtn {
        background: rgba(176,0,32,.82);
      }

      
      .videoBadge {
        position: absolute;
        right: 16px;
        bottom: 16px;
        z-index: 4;
        padding: 8px 13px;
        border-radius: 999px;
        background: rgba(255,255,255,.12);
        border: 1px solid rgba(255,255,255,.28);
        color: white;
        font-weight: 950;
        backdrop-filter: blur(12px);
      }

      .videoUploadBox {
        grid-column: 1 / -1;
        padding: 18px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }

      .videoUploadBox strong {
        color: var(--orange);
        font-size: 20px;
      }

      .videoUploadBox p {
        margin: 6px 0 0;
        color: #bbb;
      }

      .adminVideoPreview {
        grid-column: 1 / -1;
        border-radius: 22px;
        overflow: hidden;
        background: #000;
        border: 1px solid rgba(255,255,255,.12);
      }

      .adminVideoPreview video {
        width: 100%;
        max-height: 420px;
        display: block;
      }

      .detailVideoBox {
        margin-top: 18px;
        padding: 18px;
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
      }

      .detailVideoBox video {
        width: 100%;
        border-radius: 18px;
        background: #000;
        display: block;
      }

      .whyUsSection,
      .testimonialsSection {
        max-width: 1180px;
        margin: 0 auto;
        padding: 42px 7% 54px;
      }

      .whyUsGrid,
      .testimonialGrid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
      }

      .testimonialGrid {
        grid-template-columns: repeat(3, 1fr);
      }

      .whyUsGrid > div,
      .testimonialGrid > div {
        padding: 24px;
        border-radius: 26px;
        border: 1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(circle at top right, rgba(255,138,0,.10), transparent 45%),
          rgba(255,255,255,.04);
      }

      .whyUsGrid span {
        display: inline-flex;
        font-size: 32px;
        margin-bottom: 12px;
      }

      .whyUsGrid h3,
      .testimonialGrid strong {
        color: white;
        font-size: 20px;
        line-height: 1.25;
      }

      .whyUsGrid p,
      .testimonialGrid p {
        color: #c9c9c9;
        line-height: 1.6;
      }

      .testimonialGrid span {
        color: var(--orange);
        font-weight: 950;
        font-size: 13px;
      }

      @media (max-width: 980px) {
        .desktopNav { display: none; }
        .statsGrid { grid-template-columns: repeat(2, 1fr); }
        .detailWrap { grid-template-columns: 1fr; }
        .contactGrid { grid-template-columns: repeat(2, 1fr); }
        .guideGrid { grid-template-columns: 1fr; }
      }

      @media (max-width: 768px) {

        .aiTools {
          flex-direction: column;
        }

        .aiTools button {
          width: 100%;
        }

        .adminRouteTop {
          align-items: stretch;
          flex-direction: column;
          padding: 20px;
        }

        .adminGateCard {
          padding: 26px 18px;
        }

        .adminGateLogin {
          flex-direction: column;
        }

        .adminGateLogin button {
          min-height: 48px;
        }


        .adminListPanel {
          padding: 16px;
        }

        .adminListHead {
          align-items: stretch;
          flex-direction: column;
        }

        .adminSearchBox {
          width: 100%;
        }

        .adminListingGrid {
          grid-template-columns: 1fr;
        }

        .adminListingCard {
          grid-template-rows: 210px 1fr auto;
        }


        .videoUploadBox {
          align-items: stretch;
          flex-direction: column;
        }

        .whyUsSection,
        .testimonialsSection {
          padding: 34px 14px 44px;
        }

        .whyUsGrid,
        .testimonialGrid {
          grid-template-columns: 1fr;
        }

        .detailVideoBox {
          margin: 14px 0 0;
          border-radius: 18px;
          padding: 12px;
        }

        .siteHeader {
          min-height: 74px;
          padding: 12px 14px;
          gap: 8px;
        }

        .brandLogo { width: 48px; height: 48px; }
        .brandBox { gap: 9px; }
        .brandName { font-size: 25px; letter-spacing: -1px; }
        .brandSlogan { font-size: 12px; max-width: 180px; }
        .navPill {
          min-height: 42px;
          padding: 0 14px;
          font-size: 13px;
        }
        .flagBox { width: 48px; height: 34px; }

        .hero { min-height: auto; }
        .heroContent { padding: 70px 18px 58px; }
        .heroTitle {
          font-size: clamp(40px, 11vw, 58px);
          letter-spacing: -2px;
          line-height: 1;
        }
        .heroText { font-size: 18px; line-height: 1.55; }
        .heroBtn, .ghostBtn { width: 100%; max-width: 420px; }

        .statsGrid {
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 34px;
        }

        .statBox { padding: 14px 10px; border-radius: 18px; }
        .statBox strong { font-size: 18px; }
        .statBox span { font-size: 12px; }

        .adminPanel {
          margin: 22px 14px 0;
          padding: 20px;
        }

        .listings {
          padding: 54px 14px 34px;
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .filterBtn {
          min-width: 0;
          padding: 13px 6px;
        }

        .typeFilters {
          justify-content: flex-start;
          overflow-x: auto;
          flex-wrap: nowrap;
          padding: 0 2px 8px;
        }

        .typeFilter {
          flex: 0 0 auto;
          white-space: nowrap;
        }

        .adminHead {
          align-items: stretch;
          flex-direction: column;
        }

        .featuredToggle {
          width: 100%;
          justify-content: center;
        }

        .adminSection {
          padding: 16px;
        }

        .photoManagerHead {
          align-items: flex-start;
          flex-direction: column;
        }

        .photoManageGrid {
          grid-template-columns: repeat(2, 1fr);
        }

        .photoManageItem {
          height: 118px;
        }

        .photoManageOverlay {
          opacity: 1;
        }

        .featuredBadge {
          top: 62px;
          left: 14px;
          font-size: 12px;
        }

        .cards {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .imageWrap {
          height: 250px;
        }

        .cardBody { padding: 22px 18px 10px; }
        .cardTitle { min-height: 0; font-size: 23px; }
        .price { font-size: 30px; }
        .buttonRow {
          grid-template-columns: 1fr 1fr;
          padding: 16px 18px 20px;
        }

        .detailWrap {
          width: 100%;
          margin: 0;
          gap: 0;
        }

        .mobileDetailBack {
          display: block;
          padding: 12px 12px 0;
        }

        .mobileDetailBack button {
          width: 100%;
          min-height: 48px;
          border-radius: 999px;
          border: 1px solid rgba(255,138,0,.45);
          background: rgba(255,138,0,.12);
          color: white;
          font-weight: 950;
        }

        .detailGallery {
          border-radius: 0;
          border-left: 0;
          border-right: 0;
          padding: 10px;
        }

        .detailImageFrame {
          width: 100%;
          height: 56vh;
          min-height: 330px;
          max-height: 520px;
          border-radius: 18px;
          background: #000;
        }

        .detailMainImage {
          width: 100%;
          height: 100%;
          object-fit: contain !important;
          object-position: center !important;
          background: #000;
          transform: none !important;
        }

        .galleryArrow {
          width: 44px;
          height: 44px;
          font-size: 28px;
        }

        .arrowLeft { left: 12px; }
        .arrowRight { right: 12px; }

        .detailThumbs {
          gap: 8px;
          padding-bottom: 4px;
        }

        .detailThumb {
          flex-basis: 72px;
          width: 72px;
          height: 56px;
          border-radius: 12px;
        }

        .detailInfo {
          border-radius: 0;
          border-left: 0;
          border-right: 0;
          padding: 24px 18px;
        }

        .detailTopActions {
          display: none;
        }

        .detailFeatureGrid {
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .detailFeature {
          padding: 14px 12px;
          border-radius: 16px;
        }

        .detailFeature b {
          font-size: 21px;
        }

        .detailFeature strong {
          font-size: 14px;
        }

        .detailTwoCol {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .trustStrip {
          grid-template-columns: 1fr;
        }

        .stickyContactActions {
          position: sticky;
          bottom: 10px;
          z-index: 20;
          padding: 10px;
          margin-left: -10px;
          margin-right: -10px;
          border-radius: 22px;
          background: rgba(5,5,5,.72);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
        }

        .shareBtn {
          min-height: 44px;
        }

        .detailInfo h2 {
          font-size: 32px;
        }

        .detailPrice {
          font-size: 38px;
        }

        .detailSpecs {
          justify-content: flex-start;
        }

        .smartSearchBox {
          min-height: 56px;
          border-radius: 22px;
          margin-bottom: 14px;
        }

        .smartSearchBox input {
          font-size: 15px;
        }

        .blogSection {
          padding: 34px 14px 54px;
        }

        .blogGrid {
          grid-template-columns: 1fr;
        }

        .blogDetail {
          width: calc(100% - 24px);
          padding: 24px 18px;
          border-radius: 24px;
        }

        .blogLead {
          font-size: 18px;
        }

        .fullscreenBtn {
          right: 12px;
          bottom: 12px;
          min-height: 40px;
          font-size: 13px;
        }

        .fullGalleryTop {
          top: 12px;
          left: 12px;
          right: 12px;
        }

        .fullGalleryTop button,
        .fullGalleryTop span {
          min-height: 40px;
          padding: 0 12px;
          font-size: 13px;
        }

        .fullArrow {
          width: 46px;
          height: 46px;
          font-size: 34px;
        }

        .fullArrow.left { left: 12px; }
        .fullArrow.right { right: 12px; }

        .fullGalleryImage {
          max-width: 100vw;
          max-height: 72vh;
        }

        .fullGalleryImage.zoomed {
          transform: scale(1.45);
        }

        .fullGalleryThumbs {
          justify-content: flex-start;
          bottom: 12px;
        }

        .contact {
          padding: 50px 18px 28px;
        }

        .contactGrid {
          grid-template-columns: 1fr;
        }

        .contactItem {
          padding: 26px 18px;
        }

        .socialBtn {
          width: 100%;
          max-width: 360px;
        }
      }

      @media (max-width: 420px) {
        .brandName { font-size: 23px; }
        .brandSlogan { font-size: 11px; max-width: 150px; }
        .navPill { font-size: 0; width: 42px; padding: 0; }
        .navPill::before { content: "⌂"; font-size: 18px; }
        .backPill::before { content: "←"; }
        .homePill { display: none; }
        .flagBox { width: 44px; height: 32px; }

        .heroTitle { font-size: 40px; }
        .heroText { font-size: 17px; }

        .imageWrap { height: 225px; }
        .buttonRow { grid-template-columns: 1fr; }
        .detailImageFrame {
          height: 50vh;
          min-height: 300px;
        }
      }
    `}</style>
  );
}

export default App;
