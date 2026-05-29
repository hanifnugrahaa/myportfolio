import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sendChatMessage, isAiChatConfigured, getAiProvider } from '../../lib/chatService';
import { CHAT_GREETING, type ChatMessage } from '../../lib/chatKnowledge';
import CatAvatar from './CatAvatar';
import './ChatBot.css';

const ChatBot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greeting = i18n.language === 'id' ? CHAT_GREETING.id : CHAT_GREETING.en;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [isOpen, messages.length, greeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    const userMessage: ChatMessage = { role: 'user', content: text };
    const historyWithUser = [...messages, userMessage];
    setMessages(historyWithUser);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(historyWithUser);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('chat.error') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageWithLinks = (text: string) => {
    // Regex for HTTP URLs and email addresses
    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(/^https?:\/\//)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="chat-link">
            {part}
          </a>
        );
      } else if (part.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/)) {
        return (
          <a key={i} href={`mailto:${part}`} className="chat-link">
            {part}
          </a>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            role="dialog"
            aria-label={t('chat.title')}
          >
            <CatAvatar isThinking={isLoading} />
            
            <div className="chat-panel-header">
              <div>
                <div className="chat-panel-title">{t('chat.title')}</div>
                <div className="chat-panel-subtitle">
                  {getAiProvider() === 'gemini'
                    ? t('chat.subtitleGemini')
                    : isAiChatConfigured()
                      ? t('chat.subtitleAi')
                      : t('chat.subtitleLocal')}
                </div>
              </div>
              <button
                type="button"
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label={t('chat.close')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-bubble chat-bubble--${msg.role}`}
                >
                  {renderMessageWithLinks(msg.content)}
                </div>
              ))}
              {isLoading && (
                <div className="chat-bubble chat-bubble--assistant chat-bubble--loading">
                  {t('chat.thinking')}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                disabled={isLoading}
                autoComplete="off"
                aria-label={t('chat.placeholder')}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={isLoading || !input.trim()}
                aria-label={t('chat.send')}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? t('chat.close') : t('chat.open')}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
};

export default ChatBot;
