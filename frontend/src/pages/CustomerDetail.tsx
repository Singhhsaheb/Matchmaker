import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  city: string;
  height: number;
  email: string;
  phoneNumber: string;
  undergraduateCollege: string;
  degree: string;
  income: number;
  currentCompany: string;
  designation: string;
  maritalStatus: string;
  languagesKnown: string[];
  siblings: number;
  caste: string;
  religion: string;
  wantKids: string;
  openToRelocate: string;
  openToPets: string;
  matchScore?: number;
  aiExplanation?: string;
}

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [sendingMatch, setSendingMatch] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const custRes = await axios.get(`http://localhost:5000/api/customers/${id}`);
        setCustomer(custRes.data);
        const matchRes = await axios.get(`http://localhost:5000/api/customers/${id}/matches`);
        setMatches(matchRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSendMatch = async (matchId: string) => {
    setSendingMatch(matchId);
    try {
      await axios.post(`http://localhost:5000/api/customers/${id}/matches/${matchId}/send`);
      alert('Match sent successfully via Email & SMS!');
    } catch (err) {
      alert('Failed to send match');
    }
    setSendingMatch(null);
  };

  if (!customer) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </div>
      </nav>

      <div className="container animate-fade-in" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Customer Details Panel */}
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem', background: 'linear-gradient(to right, #fbbf24, #e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {customer.firstName} {customer.lastName}
          </h2>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Full Biodata
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <div><strong style={{color:'white'}}>Gender:</strong> {customer.gender}</div>
              <div><strong style={{color:'white'}}>DOB:</strong> {customer.dateOfBirth}</div>
              <div><strong style={{color:'white'}}>Location:</strong> {customer.city}, {customer.country}</div>
              <div><strong style={{color:'white'}}>Height:</strong> {customer.height} cm</div>
              <div style={{ gridColumn: '1 / -1' }}><strong style={{color:'white'}}>Education:</strong> {customer.degree} from {customer.undergraduateCollege}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong style={{color:'white'}}>Profession:</strong> {customer.designation} at {customer.currentCompany}</div>
              <div><strong style={{color:'white'}}>Income:</strong> ₹{customer.income.toLocaleString()}</div>
              <div><strong style={{color:'white'}}>Marital Status:</strong> {customer.maritalStatus}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong style={{color:'white'}}>Languages:</strong> {customer.languagesKnown.join(', ')}</div>
              <div><strong style={{color:'white'}}>Religion/Caste:</strong> {customer.religion} - {customer.caste}</div>
              <div><strong style={{color:'white'}}>Want Kids:</strong> {customer.wantKids}</div>
              <div><strong style={{color:'white'}}>Open to Relocate:</strong> {customer.openToRelocate}</div>
            </div>
          </div>
        </div>

        {/* AI Matches Panel */}
        <div style={{ flex: '1 1 500px' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ AI Suggested Matches
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {matches.map(m => (
              <div key={m.id} className="card" style={{ borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{m.firstName} {m.lastName}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {m.designation} • {m.city} • ₹{m.income.toLocaleString()}
                    </p>
                    <div className="tag" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', marginBottom: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      Compatibility Score: {m.matchScore}%
                    </div>
                    <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1.25rem', color: '#fda4af' }}>
                      "{m.aiExplanation}"
                    </p>
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={() => handleSendMatch(m.id)}
                    disabled={sendingMatch === m.id}
                  >
                    {sendingMatch === m.id ? 'Sending...' : 'Send Match'}
                  </button>
                </div>
              </div>
            ))}
            {matches.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No suitable matches found in the pool.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
