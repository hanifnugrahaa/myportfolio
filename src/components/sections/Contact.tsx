import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="text-center md:text-left">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none mb-4">{t('contact.title')}</h2>
          <p className="text-secondary mb-4 text-center md:text-left">
            {t('contact.description')}
          </p>
          <p className="text-secondary mb-4 text-center md:text-left">
            You can email me directly at:
          </p>
          <a href="mailto:hanifardiyanta11@gmail.com" className="contact-email">
            hanifardiyanta11@gmail.com
          </a>
        </div>

        <div className="w-full">
          <form className="contact-form" action="https://formspree.io/f/xrbkjkgk" method="POST">
            <input type="text" name="name" placeholder="Your Name" aria-label="Nama Anda" required />
            <input type="email" name="email" placeholder="Example@gmail.com" aria-label="Email Anda" required />
            <textarea name="message" placeholder="Message..." aria-label="Pesan Anda" rows={5} required></textarea>
            <button type="submit" className="btn">Send Message</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;