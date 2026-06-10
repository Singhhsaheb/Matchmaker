import { User, Key, Mail, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const [showKey, setShowKey] = useState(false);
  
  const [profileName, setProfileName] = useState('Matchmaker Sonu');
  const [apiKey, setApiKey] = useState('');
  const [emailServiceId, setEmailServiceId] = useState('');
  const [emailTemplateId, setEmailTemplateId] = useState('');
  const [emailPublicKey, setEmailPublicKey] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('matchmakerName');
    if (savedName) setProfileName(savedName);
    
    setApiKey(localStorage.getItem('openaiKey') || '');
    setEmailServiceId(localStorage.getItem('emailServiceId') || '');
    setEmailTemplateId(localStorage.getItem('emailTemplateId') || '');
    setEmailPublicKey(localStorage.getItem('emailPublicKey') || '');
  }, []);

  const saveToStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      
      <div className={`settings-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="settings-header">
          <div className="settings-title">
            <User size={20} color="var(--accent-purple)" />
            <h2>Matchmaker Settings</h2>
          </div>
          <button className="settings-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-group">
            <label>Matchmaker Profile Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value);
                  saveToStorage('matchmakerName', e.target.value);
                }}
              />
            </div>
            <p className="help-text">Used as the email signature when sending proposal recommendations to clients.</p>
          </div>

          <div className="settings-group">
            <label>OpenAI API Key (Optional)</label>
            <div className="input-with-icon">
              <Key size={18} className="input-icon" />
              <input 
                type={showKey ? "text" : "password"} 
                placeholder="sk-..." 
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  saveToStorage('openaiKey', e.target.value);
                }}
              />
              <button 
                type="button" 
                className="input-action-btn"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="help-text">If provided, the system uses GPT-4o-mini to write custom intros and compatibilities. If left empty, it runs our smart client-side logic.</p>
          </div>

          <div className="settings-group">
            <label>EmailJS Service ID</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="e.g. service_xxxxxxx" 
                value={emailServiceId}
                onChange={(e) => {
                  setEmailServiceId(e.target.value);
                  saveToStorage('emailServiceId', e.target.value);
                }}
              />
            </div>
          </div>

          <div className="settings-group">
            <label>EmailJS Template ID</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="e.g. template_xxxxxxx" 
                value={emailTemplateId}
                onChange={(e) => {
                  setEmailTemplateId(e.target.value);
                  saveToStorage('emailTemplateId', e.target.value);
                }}
              />
            </div>
          </div>

          <div className="settings-group">
            <label>EmailJS Public Key</label>
            <div className="input-with-icon">
              <Key size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="e.g. user_xxxxxxx" 
                value={emailPublicKey}
                onChange={(e) => {
                  setEmailPublicKey(e.target.value);
                  saveToStorage('emailPublicKey', e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
