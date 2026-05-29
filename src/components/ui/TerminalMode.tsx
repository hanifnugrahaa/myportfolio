import React, { useState, useEffect, useRef } from 'react';
import './TerminalMode.css';
import { projects } from '../../data';
import { useCyberAudio } from '../../hooks/useCyberAudio';

interface TerminalModeProps {
  onClose: () => void;
}

const TerminalMode: React.FC<TerminalModeProps> = ({ onClose }) => {
  const [history, setHistory] = useState<{ command: string, output: string | JSX.Element }[]>([
    { command: '', output: 'HanifOS v1.0.0 (tty1)\nType "help" to see available commands.' }
  ]);
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

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    const cmdLower = cmd.toLowerCase();
    setInput('');

    if (!cmdLower) {
      setHistory(prev => [...prev, { command: '', output: '' }]);
      return;
    }

    let output: string | JSX.Element = '';

    switch (cmdLower) {
      case 'help':
        output = 'Available commands: help, whoami, ls, ls projects, cat <file>, clear, download resume, theme toggle, exit';
        break;
      case 'whoami':
        output = 'Hanif Nugraha - Software Engineer & IoT Enthusiast.\nBuilding scalable web applications, real-time dashboards, and smart connected systems.';
        break;
      case 'ls':
        output = 'about.txt   skills.md   projects/   contact.txt';
        break;
      case 'cat about.txt':
        output = 'An Electronics and Instrumentation student with dual expertise in hardware and software engineering. I translate user needs into tangible solutions through Web Development and the Internet of Things (IoT).';
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
        return;
      case 'exit':
        onClose();
        return;
      case 'sudo':
        output = 'hanif is not in the sudoers file. This incident will be reported.';
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

  return (
    <div className="terminal-overlay" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-crt-effect"></div>
      <div className="terminal-content">
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
          <span className="terminal-prompt-line">
            <span className="terminal-user">guest@hanif-os</span>:<span className="terminal-dir">~</span>$
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              playTyping();
            }}
            className="terminal-input"
            ref={inputRef}
            autoComplete="off"
            spellCheck="false"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalMode;
