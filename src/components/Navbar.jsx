
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { apiGet } from "../helpers/api";
import logo from "../assets/logo.png";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // تغيير اللغة وتخزينها
  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.setAttribute("lang", newLang);
  };

  // أول ما الصفحة تفتح، طبق اللغة المخزنة
  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, i18n]);

  // التشيك على صلاحية الأدمن
  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await apiGet("/auth/profile");
        setIsAdmin(res.data.role === "admin");
      } catch (err) {
        setError(t("error") || "Error");
        navigate("/");
      }
    };
    checkRole();
  }, [t, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <img src={logo} alt="RAN Clinic Logo" className="logo-img rounded-circle shadow glow-effect me-2" />
        <h2 className="navbar-brand me-2">RAN Clinic</h2>

        {error && <div className="alert alert-danger mb-0">{error}</div>}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/attendance">{t("attendance")}</Link>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">{t("adminDashboard")}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/adminbranches">{t("branches")}</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/profile/me">{t("profile")}</Link>
            </li>
          </ul>

          <div className="d-flex">
            <select
              className="form-select me-2"
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
