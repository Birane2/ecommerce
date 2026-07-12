import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaShareNodes,
  FaLink,
  FaWhatsapp,
  FaFacebook,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";
import { useToast } from "../../context/ToastContext";
import "./shareMenu.css";

// Bouton de partage : Web Share API native si disponible, sinon menu de repli
// avec copie du lien et partage vers les réseaux sociaux.
function ShareMenu({ title, text, url, disabled = false }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { showToast } = useToast();

  const shareUrl = url || window.location.href;

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function handleShareClick() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch (error) {
        if (error?.name !== "AbortError") {
          showToast(t("share.toastShareError"), "error");
        }
      }
      return;
    }

    setIsOpen((prev) => !prev);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(t("share.toastCopied"));
    } catch {
      showToast(t("share.toastCopyError"), "error");
    }
    setIsOpen(false);
  }

  function openShareWindow(shareLink) {
    window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=500");
    setIsOpen(false);
  }

  function shareOnWhatsApp() {
    openShareWindow(
      `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`
    );
  }

  function shareOnFacebook() {
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    );
  }

  function shareOnX() {
    openShareWindow(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(shareUrl)}`
    );
  }

  function shareByEmail() {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${text || ""}\n${shareUrl}`)}`;
    setIsOpen(false);
  }

  const options = [
    { label: t("share.copyLink"), icon: <FaLink />, action: copyLink },
    { label: t("share.whatsapp"), icon: <FaWhatsapp />, action: shareOnWhatsApp },
    { label: t("share.facebook"), icon: <FaFacebook />, action: shareOnFacebook },
    { label: t("share.x"), icon: <FaXTwitter />, action: shareOnX },
    { label: t("share.email"), icon: <FaEnvelope />, action: shareByEmail },
  ];

  return (
    <div className="share_menu" ref={containerRef}>
      <button
        type="button"
        className="icon_btn"
        onClick={handleShareClick}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <FaShareNodes /> {t("share.button")}
      </button>

      {isOpen && (
        <div className="share_dropdown" role="menu">
          {options.map((option) => (
            <button
              type="button"
              role="menuitem"
              key={option.label}
              className="share_option"
              onClick={option.action}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShareMenu;
