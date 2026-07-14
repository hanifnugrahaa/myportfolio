import React, { useState, useEffect, useRef } from 'react';
import './TerminalMode.css';
import { projects } from '../../data';
import { useCyberAudio } from '../../hooks/useCyberAudio';

interface TerminalModeProps {
  onClose: () => void;
}

function pickRupiahWit(rate: number): string {
  const severe = [
    'Rupiah lagi push-up terbalik: angkanya naik, semangat dompet turun.',
    'Trend resmi: melemah. Trend tidak resmi: kopi susu naik duluan.',
    'Satu dollar sekarang terasa seperti DLC—wajib bayar, jarang happy ending.',
    'BI lagi jaga stabilitas. Kita jaga ekspektasi… dan sisa tabungan.',
  ];
  const mid = [
    'Rupiah ikut drama Korea: episodenya panjang, plot-nya makin berat.',
    'Kurs naik, wishlist Shopee global turun—ekonomi personal version 2.0.',
    'Dollar jalan, rupiah ngos-ngosan. Marathon tanpa finish line.',
    'Melemah? Iya. Lucu? Suram. Akurat? Sayangnya, juga iya.',
  ];
  const mild = [
    'Masih bisa napas—tapi jangan lupa cek harga sebelum klik checkout.',
    'Belum kritis, tapi dompet mulai waspada mode hemat.',
    'Rupiah lagi diet: yang menipis bukan berat badan, tapi daya beli.',
  ];

  const pool = rate >= 16_500 ? severe : rate >= 15_800 ? mid : mild;
  return pool[Math.floor(Math.random() * pool.length)];
}

function formatUsdIdrResponse(rate: number, sourceNote: string): string {
  const idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate);

  return ['1 USD = ' + idr, pickRupiahWit(rate), sourceNote].join('\n');
}

async function fetchUsdToIdrRate(): Promise<string> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=IDR');
    if (!res.ok) throw new Error('Frankfurter unavailable');
    const data = (await res.json()) as { rates?: { IDR?: number } };
    const rate = data.rates?.IDR;
    if (rate == null) throw new Error('IDR rate missing');
    return formatUsdIdrResponse(
      rate,
      'Sumber: frankfurter.app — kurs referensi ECB, diambil live saat command dijalankan.',
    );
  } catch {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('ER-API unavailable');
      const data = (await res.json()) as { rates?: { IDR?: number } };
      const rate = data.rates?.IDR;
      if (rate == null) throw new Error('IDR rate missing');
      return formatUsdIdrResponse(
        rate,
        'Sumber: Exchange Rate API — layanan kurs valuta internasional, diambil live saat command dijalankan.',
      );
    } catch {
      return 'Error: Could not fetch USD/IDR rate. Check your connection and try again.';
    }
  }
}

const USD_IDR_COMMANDS = new Set(['usd idr', 'usd-idr', 'usd']);

const TerminalMode: React.FC<TerminalModeProps> = ({ onClose }) => {
  const [history, setHistory] = useState<{ command: string, output: string | React.ReactNode }[]>([
    { command: '', output: 'HanifOS v1.0.0 (tty1)\nType "help" to see available commands.' }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [matrixMode, setMatrixMode] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { playTyping } = useCyberAudio();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    const cmdLower = cmd.toLowerCase();
    setInput('');

    if (!cmdLower) {
      setHistory(prev => [...prev, { command: '', output: '' }]);
      return;
    }

    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    if (USD_IDR_COMMANDS.has(cmdLower)) {
      setHistory(prev => [
        ...prev,
        { command: cmd, output: 'Fetching USD/IDR exchange rate...' },
      ]);
      const output = await fetchUsdToIdrRate();
      setHistory(prev => {
        const next = [...prev];
        next[next.length - 1] = { command: cmd, output };
        return next;
      });
      return;
    }

    let output: string | React.ReactNode = '';

    switch (cmdLower) {
      case 'help':
        output =
          'Available commands: help, whoami, ls, ls projects, cat <file>, usd idr, clear, download resume, theme toggle, exit, neofetch, weather, matrix, ping, play perunggu';
        break;
      case 'whoami':
        output = 'Hanif Nugraha - Software Engineer & IoT Enthusiast.\nBuilding scalable web applications, real-time dashboards, and smart connected systems.';
        break;
      case 'ls':
        output = 'about.txt   skills.md   projects/   contact.txt';
        break;
      case 'cat about.txt':
        output = 'A Software Engineer with dual expertise in hardware and software engineering. I translate user needs into tangible solutions through Web Development and the Internet of Things (IoT).';
        break;
      case 'cat skills.md':
        output = '# SKILLS\n- Web Development (React, Next.js, TS)\n- Backend (Node.js, Python, APIs)\n- IoT (ESP32, Arduino, MQTT)';
        break;
      case 'cat contact.txt':
        output = 'Email: hanifardiyantanugraha@gmail.com\nLinkedIn: hanifardiyantanugraha\nGitHub: hanifnugrahaa';
        break;
      case 'cd projects':
        output = 'bash: cd: projects: Permission denied. Access requires level 4 clearance.';
        break;
      case 'ls projects':
        output = projects.map(p => `- ${p.name} [${p.techStack?.join(', ')}]`).join('\n');
        break;
      case 'download resume':
        window.open('https://linkedin.com/in/hanifardiyantanugraha', '_blank');
        output = 'Initializing secure connection... Redirecting to LinkedIn profile.';
        break;
      case 'theme toggle':
        const themeBtn = document.getElementById('toggle-theme');
        if (themeBtn) {
          themeBtn.click();
          output = 'System theme protocol toggled successfully.';
        } else {
          output = 'Error: Theme protocol unavailable.';
        }
        break;
      case 'clear':
        setHistory([]);
        setMatrixMode(false);
        return;
      case 'exit':
        onClose();
        return;
      case 'admin':
      case 'login':
        window.location.href = '/admin';
        output = 'Initiating secure connection to Admin Panel...';
        break;
      case 'sudo':
        output = 'hanif is not in the sudoers file. This incident will be reported.';
        break;
      case 'neofetch':
        output = (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', whiteSpace: 'pre-wrap' }}>
            <pre style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{`   /\\_/\\
  ( o.o )
   > ^ <`}</pre>
            <div>
              <span style={{ color: 'var(--accent-color)' }}>hanif</span>@<span style={{ color: 'var(--accent-color)' }}>hanifos</span><br/>
              -------------------<br/>
              <b>OS</b>: HanifOS v1.0.0<br/>
              <b>Host</b>: Legion 5<br/>
              <b>Uptime</b>: 24/7 (Powered by Coffee)<br/>
              <b>Packages</b>: 999 (npm)<br/>
              <b>Shell</b>: bash 5.1.16<br/>
              <b>CPU</b>: Human Brain 2.0 (Overclocked)
            </div>
          </div>
        );
        break;
      case 'weather':
      case 'cuaca':
        output = 'Fetching latest atmospheric data for Jakarta... \nStatus: Probably Hot ☀️ (32°C). Stay hydrated!';
        break;
      case 'matrix':
        setMatrixMode(true);
        output = 'Wake up, Neo...\nThe Matrix has you... \n(Type "clear" to exit matrix mode)';
        break;
      case 'ping':
        output = 'Pinging 127.0.0.1 with 32 bytes of data:\nReply from 127.0.0.1: bytes=32 time<1ms TTL=128\nReply from 127.0.0.1: bytes=32 time<1ms TTL=128\n\nPing statistics for 127.0.0.1:\n    Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)';
        break;
      case 'play perunggu':
      case 'play perunggu - gemilang':
      case 'play gemilang':
        output = (
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/artist/050h7Z8Fh4uVpU40U6a7xR?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowFullScreen={false} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        );
        break;
      default:
        if (cmdLower.startsWith('cat ')) {
          output = `cat: ${cmd.split(' ')[1]}: No such file or directory`;
        } else if (cmdLower.startsWith('cd ')) {
          output = `bash: cd: ${cmd.split(' ')[1]}: No such file or directory`;
        } else {
          output = `bash: ${cmd}: command not found`;
        }
    }

    setHistory(prev => [...prev, { command: cmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const availableCommands = ['help', 'whoami', 'ls', 'ls projects', 'cat about.txt', 'cat skills.md', 'cat contact.txt', 'usd idr', 'clear', 'download resume', 'theme toggle', 'exit', 'neofetch', 'weather', 'matrix', 'ping', 'play perunggu'];
      const matches = availableCommands.filter(c => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  return (
    <div className={`terminal-overlay ${matrixMode ? 'matrix-mode' : ''}`} onClick={() => inputRef.current?.focus()} data-lenis-prevent>
      <div className="terminal-crt-effect" aria-hidden="true" />
      <div className="terminal-content">
        <div className="terminal-mobile-bar">
          <span className="terminal-mobile-title">HanifOS tty1</span>
          <button
            type="button"
            className="terminal-mobile-close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close terminal"
          >
            exit
          </button>
        </div>

        {history.map((entry, i) => (
          <div key={i} className="terminal-entry">
            {entry.command && (
              <div className="terminal-prompt-line">
                <span className="terminal-user">guest@hanif-os</span>:<span className="terminal-dir">~</span>$ {entry.command}
              </div>
            )}
            {entry.output && <div className="terminal-output">{entry.output}</div>}
          </div>
        ))}

        <form onSubmit={handleCommand} className="terminal-input-form">
          <div className="terminal-input-line">
            <span className="terminal-prompt-prefix" aria-hidden="true">
              <span className="terminal-user">guest@hanif-os</span>:<span className="terminal-dir">~</span>$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                playTyping();
              }}
              className="terminal-input"
              autoComplete="off"
              spellCheck="false"
              onKeyDown={handleKeyDown}
              aria-label="Terminal command input"
            />
          </div>
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalMode;
