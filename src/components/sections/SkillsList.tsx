import React, { useState } from 'react';
import { skillCategories } from '../../data';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function SkillsList() {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

  return (
    <div className="skills-section-container">
      <h2 className="section-title">{t('skills.title')}</h2>
      
      <div className="skills-tabs">
        {skillCategories.map((category, index) => (
          <button 
            key={index}
            className={`skill-tab-btn ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {category.title}
          </button>
        ))}
      </div>
      
      <div className="skills-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="skills-grid"
          >
            {skillCategories[activeTab].skills.map((skill, index) => (
              <div key={index} className="skill-item">
                {skill}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SkillsList;