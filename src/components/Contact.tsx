import React from "react";
import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();
  return (
    <>
    <div className="contact-container">
        <div className="contact-info">
          <h2 className="section-title--left">{t('contact.title')}</h2>
          <p>
            {t('contact.description')}
          </p>
          <p>
            You can email me directly at:
          </p>
          <a href="mailto:hanifardiyanta11@gmail.com" className="contact-email">
            hanifardiyanta11@gmail.com
          </a>
        </div>

        <div className="contact-form-wrapper">
          <form className="contact-form" action="https://formspree.io/f/xrbkjkgk" method="POST">
            <input type="text" name="name" placeholder="Your Name" aria-label="Nama Anda" required />
            <input type="email" name="email" placeholder="Email" aria-label="Email Anda" required />
            <textarea name="message" placeholder="Message..." aria-label="Pesan Anda" rows="5" required></textarea>
            <button type="submit" className="btn">Send Message</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;