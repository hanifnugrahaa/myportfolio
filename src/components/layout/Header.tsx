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
      <div className="flex justify-between items-center w-full">
        <a href="#home" className="font-bold text-2xl bg-gradient-to-tr from-primary to-secondary bg-clip-text text-transparent">HN.</a>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#about" className="font-semibold hover:text-secondary transition-colors">{t('nav.about')}</a>
          <a href="#skills" className="font-semibold hover:text-secondary transition-colors">{t('nav.skills')}</a>
          <a href="#projects" className="font-semibold hover:text-secondary transition-colors">{t('nav.projects')}</a>
          <a href="#activities" className="font-semibold hover:text-secondary transition-colors">{t('nav.activities', 'Activities')}</a>
          <a href="#contact" className="font-semibold hover:text-secondary transition-colors">{t('nav.contact')}</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage} 
            aria-label="Toggle language"
            className="flex items-center gap-1.5 bg-transparent border-none text-primary cursor-pointer hover:opacity-80 transition-opacity"
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