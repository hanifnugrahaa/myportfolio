import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  toggleTheme: () => void;
  theme?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <a href="#home" className="header__logo">HN.</a>
        
        <nav className="main-nav">
          <a href="#about">{t('nav.about')}</a>
          <a href="#skills">{t('nav.skills')}</a>
          <a className="projects" href="#projects">{t('nav.projects')}</a>
          <a href="#activities">{t('nav.activities', 'Activities')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </nav>
        
        <div className="header__actions" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={toggleLanguage} 
            aria-label="Toggle language"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
          >
            <Globe size={18} aria-hidden="true" />
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{i18n.language.toUpperCase()}</span>
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