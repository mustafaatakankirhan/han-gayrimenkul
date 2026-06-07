import { CONTACTS, SITE_URL } from "../constants";

export function slugify(text = "") {
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

export function fotoListesi(ilan) {
  return (ilan?.image || "").split(",").map((x) => x.trim()).filter(Boolean);
}

export function ilkFoto(ilan) {
  const photos = fotoListesi(ilan);
  const index = Number(ilan?.coverIndex || 0);
  return photos[index] || photos[0] || "";
}

export function ilanSlug(ilan) {
  return `${slugify(ilan.title)}-${ilan.id}`;
}

export function whatsappLink(ilan) {
  return `https://wa.me/${CONTACTS.whatsapp}?text=Merhaba,%20${encodeURIComponent(
    ilan?.title || "gayrimenkul"
  )}%20ilanı%20hakkında%20bilgi%20almak%20istiyorum.`;
}

export function buildFeatureList(ilan) {
  return [
    ilan.rooms && { icon: "🛏️", label: "Oda", value: ilan.rooms },
    ilan.area && { icon: "📐", label: "Alan", value: `${ilan.area} m²` },
    ilan.type && { icon: "🏠", label: "Tür", value: ilan.type },
    ilan.status && { icon: "🏷️", label: "Durum", value: ilan.status },
    ilan.location && { icon: "📍", label: "Konum", value: ilan.location },
    { icon: "🤝", label: "Danışmanlık", value: "Han Gayrimenkul" },
  ].filter(Boolean);
}

export function shortPropertyNote(ilan) {
  if (ilan.investmentNote) return ilan.investmentNote;
  const type = (ilan.type || "").toLowerCase();
  if (type.includes("arsa") || type.includes("tarla") || type.includes("bahçe")) {
    return "Arazi tipi portföylerde konum, imar durumu, yol cephesi ve bölgesel gelişim potansiyeli yatırım kararında belirleyici olur.";
  }
  if (type.includes("villa") || type.includes("müstakil")) {
    return "Müstakil yaşam talebi, geniş kullanım alanı ve bölgesel değer artışı potansiyeli nedeniyle bu portföy yatırım ve yaşam amacıyla değerlendirilebilir.";
  }
  return "Bu portföy; konumu, kullanım potansiyeli ve bölgesel talep açısından yatırım odaklı değerlendirilebilir.";
}

export function shareListing(ilan) {
  const url = window.location.href;
  const text = `${ilan.title} - ${ilan.price}`;
  if (navigator.share) {
    navigator.share({ title: ilan.title, text, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url);
    alert("İlan bağlantısı kopyalandı.");
  }
}

export function shareToWhatsApp(ilan) {
  const url = `${window.location.origin}/ilan/${slugify(ilan.title)}-${ilan.id}`;
  const text = `🏠 *${ilan.title}*\n💰 ${ilan.price}\n📍 ${ilan.location || ""}\n\nDetaylar için: ${url}\n\n_Han Gayrimenkul - Karasu_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

export function optimizeCloudinaryUrl(url) {
  if (!url || !url.includes("/image/upload/")) return url;
  if (url.includes("/q_auto/f_auto/")) return url;
  return url.replace("/image/upload/", "/image/upload/q_auto/f_auto/");
}

export function optimizeCloudinaryVideoUrl(url) {
  if (!url || !url.includes("/video/upload/")) return url;
  if (url.includes("/q_auto/")) return url;
  return url.replace("/video/upload/", "/video/upload/q_auto/");
}

export function safeText(value) {
  return value && String(value).trim() ? String(value).trim() : "";
}

export function joinPhotos(photos) {
  return photos.filter(Boolean).join(", ");
}

export function moveArrayItem(arr, fromIndex, toIndex) {
  const copy = [...arr];
  if (toIndex < 0 || toIndex >= copy.length) return copy;
  const [item] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, item);
  return copy;
}

export function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function generateListingDescription(form) {
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
  const detailSentence = details.length ? ` ${details.join(", ")} ile öne çıkan bu portföy,` : " Bu portföy,";
  if (["Arsa", "Tarla", "Bahçe"].includes(type)) {
    return `${location} bölgesinde yer alan ${title}, ${status.toLowerCase()} ${type.toLowerCase()} arayanlar için dikkat çekici bir fırsattır.`;
  }
  return `${location} bölgesinde yer alan ${title}, ${status.toLowerCase()} ${type.toLowerCase()} arayanlar için öne çıkan bir seçenektir.${detailSentence} hem yaşam hem de yatırım amacıyla değerlendirilebilecek niteliktedir.`;
}

export function generateInvestmentNote(form) {
  const location = safeText(form.location) || "Sakarya / Karasu";
  const type = safeText(form.type) || "gayrimenkul";
  const status = safeText(form.status) || "Satılık";
  const area = safeText(form.area);
  const rooms = safeText(form.rooms);
  if (["Arsa", "Tarla", "Bahçe"].includes(type)) {
    return `${location} bölgesindeki bu ${type.toLowerCase()}, arazi yatırımı düşünenler için konum ve gelişim potansiyeli açısından değerlendirilebilir.`;
  }
  if (type === "Villa" || type === "Müstakil Ev") {
    return `${location} bölgesinde müstakil yaşam talebi güçlüdür. ${rooms ? `${rooms} planı` : "Geniş kullanım imkânı"} ve ${area ? `${area} m² alanı` : "kullanım avantajı"} ile bu portföy öne çıkabilir.`;
  }
  return `${location} bölgesindeki bu ${status.toLowerCase()} ${type.toLowerCase()}, kira getirisi ve konum avantajı açısından yatırım odaklı değerlendirilebilir.`;
}

export function generateInstagramCaption(form) {
  const title = safeText(form.title) || "Yeni portföyümüz";
  const location = safeText(form.location) || "Sakarya / Karasu";
  const type = safeText(form.type) || "gayrimenkul";
  const status = safeText(form.status) || "Satılık";
  const price = safeText(form.price);
  const rooms = safeText(form.rooms);
  const area = safeText(form.area);
  return `${title}\n\n📍 ${location}\n🏡 ${status} ${type}\n${rooms ? `🛏️ ${rooms}\n` : ""}${area ? `📐 ${area} m²\n` : ""}${price ? `💰 ${price}\n` : ""}\nDetaylı bilgi için bizimle iletişime geçebilirsiniz.\n\n#hangayrimenkul #karasuemlak #sakaryaemlak`;
}

export function generateReelsText(form) {
  const location = safeText(form.location) || "Karasu";
  const type = safeText(form.type) || "gayrimenkul";
  return `${location} bölgesinde ${type.toLowerCase()} arayanlar için yeni portföyümüz yayında.\n\nHan Gayrimenkul — Doğru Yerde, Doğru Yatırım, Güvenle Değer Katar`;
}
