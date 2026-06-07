import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { ICONS } from '../constants';
import { LogoIcon, TurkishFlag } from './ui';

function Header({ detail = false, admin, setAdmin, setAdminOpen }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const goListings = () => {
    navigate("/?scroll=ilanlar");
    setTimeout(() => {
      document.getElementById("ilanlar")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="siteHeader">
      <Link to="/" className="brandBox" onClick={closeMenu}>
        <img src={logo} alt="Han Gayrimenkul Logo" className="brandLogo" />
        <div>
          <h1 className="brandName">Han Gayrimenkul</h1>
          <p className="brandSlogan">Doğru Yerde, Doğru Yatırım, Güvenle Değer Katar</p>
        </div>
      </Link>

      {!detail && (
        <nav className="desktopNav">
          <Link to="/?scroll=ilanlar">İlanlar</Link>
          <Link to="/?scroll=yatirim">Yatırım Rehberi</Link>
          <Link to="/?scroll=blog">Rehber</Link>
          <Link to="/iletisim" className="navContactBtn">İletişim</Link>
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
        {!detail && (
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü">
            <span className={menuOpen ? "hbar open1" : "hbar"} />
            <span className={menuOpen ? "hbar open2" : "hbar"} />
            <span className={menuOpen ? "hbar open3" : "hbar"} />
          </button>
        )}
      </div>

      {menuOpen && !detail && (
        <div className="mobileMenu">
          <Link to="/?scroll=ilanlar" onClick={closeMenu}>İlanlar</Link>
          <Link to="/?scroll=yatirim" onClick={closeMenu}>Yatırım Rehberi</Link>
          <Link to="/?scroll=blog" onClick={closeMenu}>Rehber</Link>
          <Link to="/iletisim" onClick={closeMenu} className="mobileMenuContact">İletişim</Link>
        </div>
      )}
    </header>
  );
}


export default Header;
