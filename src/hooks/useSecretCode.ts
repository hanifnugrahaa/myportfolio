import { useState, useEffect, useRef } from 'react';

export const useSecretCode = (secretCode: string) => {
  const [success, setSuccess] = useState(false);
  const bufferRef = useRef('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan jika menekan tombol modifier
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      // Abaikan jika sedang mengetik di form input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();
      // Abaikan tombol yang bukan karakter tunggal (seperti Shift, Enter)
      if (key.length > 1) return;
      
      const newBuffer = (bufferRef.current + key).slice(-secretCode.length);
      bufferRef.current = newBuffer;

      if (newBuffer === secretCode) {
        e.preventDefault();
        setSuccess(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [secretCode]);

  return { success, setSuccess };
};
