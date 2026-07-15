import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLenis } from 'lenis/react';

interface HeaderProps {
  toggleTheme: () => void;
  theme?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
  const { t, i18n } = useTranslation();
  const lenis = useLenis();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(href);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="main-header">
      <div className="flex justify-between items-center w-full">
        <a href="#home" onClick={handleNavClick} className="font-bold text-2xl bg-gradient-to-tr from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">HN.</a>
        
        <nav className="hidden lg:flex items-center gap-6">
          <a href="#about" onClick={handleNavClick} className="font-semibold hover:text-[var(--text-secondary)] transition-colors">{t('nav.about')}</a>
          <a href="#skills" onClick={handleNavClick} className="font-semibold hover:text-[var(--text-secondary)] transition-colors">{t('nav.skills')}</a>
          <a href="#projects" onClick={handleNavClick} className="font-semibold hover:text-[var(--text-secondary)] transition-colors">{t('nav.projects')}</a>
          <a href="#activities" onClick={handleNavClick} className="font-semibold hover:text-[var(--text-secondary)] transition-colors">{t('nav.activities', 'Activities')}</a>
          <a href="#contact" onClick={handleNavClick} className="font-semibold hover:text-[var(--text-secondary)] transition-colors">{t('nav.contact')}</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage} 
            aria-label="Toggle language"
            className="flex items-center gap-1.5 bg-transparent border-none text-[var(--text-primary)] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Globe size={18} aria-hidden="true" />
            <span className="text-xs font-bold">{i18n.language.toUpperCase()}</span>
          </button>
          
          <button 
            id="toggle-theme" 
            aria-label="Toggle dark/light mode" 
            onClick={toggleTheme} 
          >
            <span className="toggle-thumb"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;