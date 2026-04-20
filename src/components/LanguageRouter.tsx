import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDomainScope } from "@/hooks/useDomainScope";

/**
 * Synchronous language resolver.
 * Enforces strict bidirectional isolation.
 */
export default function LanguageRouter() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const scope = getDomainScope();

  useEffect(() => {
    if (scope === "tr") {
      // HARD LOCK: TR domain = Turkish only
      document.documentElement.lang = "tr";
      if (i18n.language !== "tr") i18n.changeLanguage("tr");
    } else {
      // HARD LOCK: Global domain = EN (allows HI via switcher)
      document.documentElement.lang = i18n.language === "hi" ? "hi" : "en";
      if (i18n.language === "tr") i18n.changeLanguage("en");
    }
  }, [scope, location.pathname, i18n, navigate]);

  return null;
}
