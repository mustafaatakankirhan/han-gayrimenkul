import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { db, auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { slugify, safeText } from "./utils";
import { ScrollToTop, SplashScreen } from "./components/ui";
import Style from "./styles/GlobalStyle";

import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import { BlogListPage, BlogPage } from "./pages/BlogPages";
import { AdminPage } from "./pages/AdminPages";
import { ContactPage } from "./pages/ContactPages";

function App() {
  const [splash, setSplash] = useState(true);
  const [ilanlar, setIlanlar] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [blogDuzenlenenId, setBlogDuzenlenenId] = useState(null);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });

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

  const bosBlogForm = {
    title: "",
    slug: "",
    slugTouched: false,
    excerpt: "",
    category: "Yatırım Rehberi",
    coverImage: "",
    content: "",
    isPublished: true,
  };

  const [blogForm, setBlogForm] = useState(bosBlogForm);

  const [form, setForm] = useState(bosForm);

  const ilanlariGetir = async () => {
    const snapshot = await getDocs(collection(db, "ilanlar"));
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setIlanlar(data);
  };

  const bloglariGetir = async () => {
    const snapshot = await getDocs(collection(db, "blogs"));
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => {
      const ad = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const bd = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return bd - ad;
    });
    setBlogs(data);
  };

  useEffect(() => {
    ilanlariGetir();
    bloglariGetir();
  }, []);

   const girisYap = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, sifre);
      setAdmin(true);
      setAdminOpen(false);
      setSifre("");
      setEmail("");
    } catch (error) {
      alert("Giriş başarısız! E-posta veya şifre hatalı.");
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


  const blogKaydet = async () => {
    const title = safeText(blogForm.title);
    const slug = slugify(blogForm.slug || blogForm.title);

    if (!title || !slug || !safeText(blogForm.excerpt) || !safeText(blogForm.content)) {
      alert("Blog için başlık, slug, kısa açıklama ve içerik zorunlu.");
      return;
    }

    const payload = {
      title,
      slug,
      excerpt: safeText(blogForm.excerpt),
      category: safeText(blogForm.category) || "Rehber",
      coverImage: safeText(blogForm.coverImage),
      content: String(blogForm.content || "").trim(),
      isPublished: blogForm.isPublished !== false,
      updatedAt: serverTimestamp(),
    };

    if (blogDuzenlenenId) {
      await updateDoc(doc(db, "blogs", blogDuzenlenenId), payload);
      setBlogDuzenlenenId(null);
    } else {
      await addDoc(collection(db, "blogs"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }

    setBlogForm(bosBlogForm);
    bloglariGetir();
  };

  const blogSil = async (id) => {
    if (!confirm("Bu blog yazısı silinsin mi?")) return;
    await deleteDoc(doc(db, "blogs", id));
    bloglariGetir();
  };

  const blogDuzenle = (post) => {
    setBlogForm({
      title: post.title || "",
      slug: post.slug || "",
      slugTouched: true,
      excerpt: post.excerpt || "",
      category: post.category || "Yatırım Rehberi",
      coverImage: post.coverImage || "",
      content: post.content || "",
      isPublished: post.isPublished !== false,
    });
    setBlogDuzenlenenId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      <Style />
      <ScrollToTop />
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
              email={email}
              setEmail={setEmail}
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
              blogs={blogs}
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
        <Route path="/blog" element={<BlogListPage blogs={blogs} />} />
        <Route path="/blog/:slug" element={<BlogPage blogs={blogs} />} />
        <Route path="/rehber/:slug" element={<BlogPage blogs={blogs} />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route
          path="/admin"
          element={
            <AdminPage
              admin={admin}
              setAdmin={setAdmin}
              email={email}
              setEmail={setEmail}
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
          }
        />
      </Routes>
    </>
  );
}


export default App;
