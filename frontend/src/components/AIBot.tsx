import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  options?: string[];
}

export default function AIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi there! I am your TDC Advisor. I can provide tailored matchmaking advice based on your profile.", isBot: true },
    { id: '2', text: "To start, please select your gender:", isBot: true, options: ["Male", "Female", "Other"] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendToServer = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/bot/chat', { message: text });
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: res.data.reply, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Sorry, I encountered an error connecting to the AI brain.', isBot: true }]);
    }
    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userText, isBot: false }]);
    setInput('');
    await sendToServer(userText);
  };

  const handleOptionClick = async (option: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text: option, isBot: false }]);
    await sendToServer(option);
  };

  return (
    <>
      {/* Chat Bubble Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fab"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageCircle />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="glass-panel animate-fade-in chat-window"
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            width: '380px', height: '550px', display: 'flex', flexDirection: 'column',
            zIndex: 1000, overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bot size={24} color="var(--accent-pink)" />
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>TDC Advisor</h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'white', border: 'none', color: 'black', cursor: 'pointer', borderRadius: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: '1rem', flexDirection: msg.isBot ? 'row' : 'row-reverse' }}>
                {msg.isBot && (
                  <div style={{ flexShrink: 0, paddingTop: '0.2rem' }}>
                    <Bot size={18} color="var(--accent-pink)" />
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '1rem',
                  maxWidth: '85%'
                }}>
                  <div style={{
                    fontSize: '1.05rem',
                    lineHeight: '1.5',
                    color: msg.isBot ? 'white' : 'var(--text-main)',
                    background: msg.isBot ? 'transparent' : 'var(--accent-purple)',
                    padding: msg.isBot ? '0' : '0.75rem 1rem',
                    borderRadius: msg.isBot ? '0' : '12px',
                    borderBottomRightRadius: msg.isBot ? '0' : '2px',
                  }}>
                    {msg.text}
                  </div>
                  
                  {msg.options && (
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {msg.options.map(opt => (
                        <button 
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flexShrink: 0, paddingTop: '0.2rem' }}>
                  <Bot size={18} color="var(--accent-pink)" />
                </div>
                <div style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area (Hidden when expecting option selection, but kept for normal chat) */}
          <form onSubmit={handleSend} style={{
            padding: '1rem', background: 'rgba(0,0,0,0.2)',
            display: 'flex', gap: '0.5rem', margin: '1rem', borderRadius: '12px'
          }}>
            <input 
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1, padding: '0.5rem', background: 'transparent', border: 'none',
                color: 'white', outline: 'none', fontSize: '1rem'
              }}
            />
          </form>
        </div>
      )}
    </>
  );
}
