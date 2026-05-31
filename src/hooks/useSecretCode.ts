import { useState, useEffect } from 'react';

export const useSecretCode = (secretCode: string) => {
  const [success, setSuccess] = useState(false);
  const [, setInputBuffer] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan jika menekan tombol modifier
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      // Abaikan jika sedang mengetik di form input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();
      // Abaikan tombol yang bukan karakter tunggal (seperti Shift, Enter)
      if (key.length > 1) return;
      
      setInputBuffer((prev) => {
        const newBuffer = (prev + key).slice(-secretCode.length);
        if (newBuffer === secretCode) {
          setSuccess(true);
        }
        return newBuffer;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [secretCode]);

  return { success, setSuccess };
};
