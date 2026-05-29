import React from "react";
import { socials } from "../../data";
import { useTranslation } from "react-i18next";
import { Linkedin, Github, Instagram } from "lucide-react";

const IconMap: Record<string, React.ElementType> = {
  Linkedin,
  Github,
  Instagram,
};

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="text-center border-t border-border-color py-12 px-10 md:px-16">
      <ul className="flex justify-center gap-6 mb-4" id="social-list">
        {socials.map((social, index) => {
          const IconComponent = IconMap[social.iconName];
          return (
            <li key={index}>
              <a
                href={social.url}
                className="text-secondary hover:text-accent-color transition-colors [&>svg]:w-6 [&>svg]:h-6 flex items-center justify-center"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
              >
                {IconComponent && <IconComponent />}
              </a>
            </li>
          );
        })}
      </ul>
      <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.3, letterSpacing: '2px' }}>
        {t('footer.hint', '// type "hacker"')}
      </p>
    </footer>
  );
}

export default Footer;