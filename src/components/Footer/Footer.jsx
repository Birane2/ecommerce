import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa6";
import { useToast } from "../../context/ToastContext";
import "./footer.css";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: <FaFacebook /> },
  { label: "Instagram", href: "#", icon: <FaInstagram /> },
  { label: "X (Twitter)", href: "#", icon: <FaXTwitter /> },
  { label: "YouTube", href: "#", icon: <FaYoutube /> },
];

function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const quickLinks = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.cart"), to: "/cart" },
    { label: t("nav.favorites"), to: "/favoris" },
  ];

  function handleSubscribe(event) {
    event.preventDefault();
    if (!email.trim()) return;
    showToast(t("footer.subscribeSuccess"));
    setEmail("");
  }

  return (
    <footer className="site_footer">
      <div className="container footer_grid">
        <div className="footer_col footer_brand">
          <span className="footer_logo">
            Reda <span>Online Store</span>
          </span>
          <p>{t("footer.brandBlurb")}</p>
          <div className="footer_socials">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer_col">
          <h3>{t("footer.quickLinks")}</h3>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer_col footer_contact_col">
          <h3>{t("footer.contact")}</h3>
          <ul className="footer_contact_info">
            <li>
              <FaLocationDot /> {t("footer.address")}
            </li>
            <li>
              <FaPhone /> +222 45 25 25 25
            </li>
            <li>
              <FaEnvelope /> contact@reda-store.mr
            </li>
          </ul>

          <form className="footer_newsletter" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder={t("footer.newsletterPlaceholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label={t("footer.newsletterAria")}
              required
            />
            <button type="submit" aria-label={t("footer.subscribeAria")}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>

      <div className="footer_bottom">
        <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}

export default Footer;
