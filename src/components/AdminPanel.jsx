import React, { useState, useRef } from 'react';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, PROPERTY_TYPES } from '../constants';
import { optimizeCloudinaryUrl, optimizeCloudinaryVideoUrl, joinPhotos, moveArrayItem, fotoListesi, generateListingDescription, generateInvestmentNote, generateInstagramCaption, generateReelsText, safeText, slugify } from '../utils';

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


export { SortablePhotoItem };
export default AdminPanel;
