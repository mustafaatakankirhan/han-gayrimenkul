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
import { Contact } from './ContactPages';
import heroVideo from '../assets/villa.mp4';

function BlogListPage({ blogs }) {
  const publishedBlogs = useMemo(
    () => (blogs || []).filter((x) => x.isPublished !== false),
    [blogs]
  );

  return (
    <div className="page detailPage">
      <SEO
        title="Karasu Gayrimenkul Blog | Han Gayrimenkul"
        description="Karasu, Kocaali, Ferizli, Söğütlü ve Sakarya çevresinde gayrimenkul, arsa, yazlık ve yatırım rehberleri."
        image={DEFAULT_SEO_IMAGE}
        url={`${SITE_URL}/blog`}
        type="website"
      />
      <Header detail />

      <main className="blogListPage">
        <p className="sectionLabel">HAN GAYRİMENKUL BLOG</p>
        <h1>Karasu Gayrimenkul ve Yatırım Rehberi</h1>
        <p className="blogListLead">
          Karasu, Kocaali, Ferizli, Söğütlü ve çevresinde gayrimenkul yatırımı yapmak isteyenler için bölge analizleri, arsa notları ve alım rehberleri.
        </p>

        {publishedBlogs.length === 0 ? (
          <div className="emptyState">Henüz yayında blog yazısı yok.</div>
        ) : (
          <div className="blogGrid blogGridWide">
            {publishedBlogs.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blogCard" key={post.id || post.slug}>
                {post.coverImage && <img src={post.coverImage} alt={post.title} className="blogCardImage" />}
                <span>{post.category || "Rehber"}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <strong>Devamını Oku →</strong>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Contact />
    </div>
  );
}

function BlogPage({ blogs }) {
  const { slug } = useParams();
  const post = (blogs || []).find((item) => item.slug === slug && item.isPublished !== false);

  if (!post) {
    return (
      <div className="page detailPage">
        <Header detail />
        <div className="notFound">
          <h2>Blog yazısı bulunamadı</h2>
          <Link className="heroBtn" to="/blog">Bloga Dön</Link>
        </div>
      </div>
    );
  }

  const blogUrl = `${SITE_URL}/blog/${post.slug}`;
  const blogDescription = post.excerpt || `${post.title} hakkında Han Gayrimenkul blog yazısı.`;
  const paragraphs = String(post.content || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: blogDescription,
    image: post.coverImage || DEFAULT_SEO_IMAGE,
    url: blogUrl,
    author: {
      "@type": "Organization",
      name: "Han Gayrimenkul",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Han Gayrimenkul",
      url: SITE_URL,
    },
  };

  return (
    <div className="page detailPage">
      <SEO
        title={`${post.title} | Han Gayrimenkul Blog`}
        description={blogDescription}
        image={post.coverImage || DEFAULT_SEO_IMAGE}
        url={blogUrl}
        type="article"
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <Header detail />

      <main className="blogDetail">
        <Link className="backToListingsBtn" to="/blog">← Bloga Dön</Link>
        {post.coverImage && <img src={post.coverImage} alt={post.title} className="blogHeroImage" />}
        <span className="blogDetailCategory">{post.category || "Rehber"}</span>
        <h1>{post.title}</h1>
        <p className="blogLead">{post.excerpt}</p>

        <article>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>Bu blog yazısı yakında güncellenecektir.</p>
          )}

          <h2>Han Gayrimenkul ile doğru portföy seçimi</h2>
          <p>
            Gayrimenkul alımında doğru bilgi, doğru konum ve doğru fiyat analizi önemlidir.
            Karasu bölgesindeki portföyler hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.
          </p>
        </article>

        <div className="blogCta">
          <h3>Karasu’da portföy mü arıyorsunuz?</h3>
          <p>Satılık, kiralık ve yatırım odaklı ilanlarımızı inceleyin.</p>
          <Link to="/?scroll=ilanlar" className="heroBtn">İlanları İncele</Link>
        </div>
      </main>

      <Contact />
    </div>
  );
}



export { BlogListPage, BlogPage };
