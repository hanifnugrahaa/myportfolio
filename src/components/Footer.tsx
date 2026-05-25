import React from "react";
import { socials } from "../data";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="main-footer">
      <ul className="social-list" id="social-list">
        {socials.map((social, index) => (
          <li key={index}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              dangerouslySetInnerHTML={{ __html: social.icon }}
            >
            </a>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.3, letterSpacing: '2px' }}>
        {t('footer.hint', '// type "hacker"')}
      </p>
    </footer>
  );
}

export default Footer;