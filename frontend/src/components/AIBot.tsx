import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export default function AIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi! I'm your AI Matchmaker assistant. Describe what you're looking for (e.g. 'Find a male from Delhi who is tall').", isBot: true }
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/bot/chat', { message: userMessage.text });
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: res.data.reply, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Sorry, I encountered an error connecting to the AI brain.', isBot: true }]);
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Chat Bubble Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="glass-panel"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '60px', height: '60px', borderRadius: '50%',
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 1000,
          background: 'linear-gradient(135deg, var(--accent-rose), var(--accent-violet))',
          boxShadow: '0 8px 32px rgba(225, 29, 72, 0.4)'
        }}
      >
        <MessageCircle size={30} color="white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            width: '350px', height: '500px', display: 'flex', flexDirection: 'column',
            zIndex: 1000, overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--glass-border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--accent-gold)', borderRadius: '50%' }}></div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>AI Matchmaker</h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                background: msg.isBot ? 'rgba(255,255,255,0.1)' : 'var(--accent-violet)',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                borderBottomLeftRadius: msg.isBot ? '0' : '12px',
                borderBottomRightRadius: !msg.isBot ? '0' : '12px',
                fontSize: '0.9rem'
              }}>
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => <a {...props} style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '12px', borderBottomLeftRadius: 0, fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{
            padding: '1rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--glass-border)',
            display: 'flex', gap: '0.5rem'
          }}>
            <input 
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
              }}
            />
            <button type="submit" style={{
              background: 'var(--accent-rose)', border: 'none', borderRadius: '8px', padding: '0 1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white'
            }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
