import React from 'react';

function AdminLogin({ email, setEmail, sifre, setSifre, girisYap }) {
  return (
    <div className="adminLogin">
      <p className="adminLoginTitle">Yönetim Girişi</p>
      <div className="adminLoginRow">
        <input
          type="email"
          placeholder="Admin e-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && girisYap()}
          className="passwordInput"
        />
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



export default AdminLogin;
