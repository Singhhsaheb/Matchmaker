import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  maritalStatus: string;
  dateOfBirth: string;
}

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/customers');
        setCustomers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomers();
  }, []);

  const calculateAge = (dob: string) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Matchmaker Dashboard</div>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Logout</button>
      </nav>
      
      <div className="container animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fbbf24, #e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome Back, Matchmaker
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Here are your top-priority clients waiting for their perfect match.</p>
        </div>
        <div className="grid">
          {customers.map(c => (
            <div key={c.id} className="card" onClick={() => navigate(`/customer/${c.id}`)} style={{ cursor: 'pointer' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>{c.firstName} {c.lastName}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span className="tag">{calculateAge(c.dateOfBirth)} yrs</span>
                <span className="tag">{c.city}</span>
                <span className="tag tag-highlight">{c.maritalStatus}</span>
              </div>
              <p style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View Matching Profile →
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
