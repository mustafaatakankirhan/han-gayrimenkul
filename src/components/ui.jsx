import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { ICONS, SITE_NAME } from '../constants';

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

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const scrollTarget = params.get("scroll");

    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        window.history.replaceState({}, "", pathname);
      }, 120);

      return;
    }

    if (hash && pathname !== "/") {
      setTimeout(() => {
        const el = document.querySelector(hash);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 120);

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, hash]);

  return null;
}

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="splashScreen">
      <div className="splashInner">
        <img src={logo} alt="Han Gayrimenkul" className="splashLogo" />
        <p className="splashName">Han Gayrimenkul</p>
        <p className="splashSlogan">Doğru Yerde, Doğru Yatırım, Güvenle Değer Katar</p>
        <div className="splashBar"><div className="splashFill" /></div>
      </div>
    </div>
  );
}

function AnimatedCounter({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const started = React.useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}


export { LogoIcon, TurkishFlag, SEO, ScrollToTop, SplashScreen, AnimatedCounter };
