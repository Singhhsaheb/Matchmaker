import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Settings, Sun, Search, Filter, Users, LogOut, ArrowRight, MapPin } from 'lucide-react';
import SettingsSidebar from '../components/SettingsSidebar';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/customers');
        setCustomers(res.data);
      } catch (err) {
        console.error('Failed to fetch from backend, using mock data:', err);
        setCustomers([
          { id: '1', firstName: 'John', lastName: 'Doe', age: 32, city: 'New York', maritalStatus: 'Single', dateOfBirth: '1991-05-12' },
          { id: '2', firstName: 'Jane', lastName: 'Smith', age: 28, city: 'Los Angeles', maritalStatus: 'Divorced', dateOfBirth: '1995-10-22' },
          { id: '3', firstName: 'Michael', lastName: 'Johnson', age: 35, city: 'Chicago', maritalStatus: 'Single', dateOfBirth: '1988-02-15' },
          { id: '4', firstName: 'Emily', lastName: 'Davis', age: 29, city: 'Houston', maritalStatus: 'Single', dateOfBirth: '1994-07-08' },
          { id: '5', firstName: 'David', lastName: 'Wilson', age: 41, city: 'Miami', maritalStatus: 'Widowed', dateOfBirth: '1982-11-30' },
          { id: '6', firstName: 'Sarah', lastName: 'Brown', age: 31, city: 'Seattle', maritalStatus: 'Single', dateOfBirth: '1992-04-18' },
        ]);
      }
    };
    fetchCustomers();
  }, []);

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const getInitials = (first: string, last: string) => {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = ['pink', 'purple', 'blue', 'coral', 'teal'];
    return colors[index % colors.length];
  };

  const getMockProfession = (index: number) => {
    const professions = ['Software Engineer III', 'Vice President - Investment Banking', 'Senior Design Engineer', 'Marketing Director', 'Product Manager'];
    return professions[index % professions.length];
  };

  const getMockStatus = (index: number) => {
    const statuses = [
      { label: 'Searching Matches', class: 'searching' },
      { label: 'First Date', class: 'first-date' },
      { label: 'Onboarding', class: 'onboarding' },
      { label: 'Verified', class: 'verified' }
    ];
    return statuses[index % statuses.length];
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Heart fill="currentColor" size={24} />
          <span>TDC Matchmaker</span>
        </div>
        
        <nav className="sidebar-menu">
          <a href="#" className="sidebar-item active" onClick={(e) => e.preventDefault()}>
            <Users size={18} />
            <span>Client Roster</span>
          </a>
          <a href="#" className="sidebar-item" onClick={(e) => { e.preventDefault(); setIsSettingsOpen(true); }}>
            <Settings size={18} />
            <span>Configuration</span>
          </a>
        </nav>

        <div className="sidebar-profile">
          <div className="sidebar-profile-info">
            <h4>Matchmaker Sonu</h4>
            <p>Matchmaker Advisor</p>
          </div>
          <button className="sidebar-logout" onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>Matchmaker Dashboard</h1>
            <p>Welcome back, Matchmaker Sonu. You are managing {customers.length || 10} primary client accounts.</p>
          </div>
          <div className="header-actions">
            <button className="btn-icon">
              <Sun size={18} />
              Light Mode
            </button>
            <button className="btn-icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings size={18} />
              Settings
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="label">Onboarding</span>
            <span className="value blue">1</span>
          </div>
          <div className="stat-card">
            <span className="label">Verified</span>
            <span className="value yellow">1</span>
          </div>
          <div className="stat-card">
            <span className="label">Searching</span>
            <span className="value purple">4</span>
          </div>
          <div className="stat-card">
            <span className="label">Intros Sent</span>
            <span className="value pink">1</span>
          </div>
          <div className="stat-card">
            <span className="label">On Dates</span>
            <span className="value orange">2</span>
          </div>
          <div className="stat-card">
            <span className="label">Engaged</span>
            <span className="value green">1</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input type="text" className="search-input" placeholder="Search assigned clients by name, location, profession..." />
          </div>
          
          <div className="dropdown-wrapper">
            <Filter size={18} />
            <select className="dropdown-select" defaultValue="All Journey Stages">
              <option value="All Journey Stages">All Journey Stages</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Searching">Searching</option>
            </select>
          </div>

          <div className="dropdown-wrapper">
            <Users size={18} />
            <select className="dropdown-select" defaultValue="All Genders">
              <option value="All Genders">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button className="refresh-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>

        {/* Client Cards */}
        <div className="clients-grid">
          {customers.map((c, i) => {
            const status = getMockStatus(i);
            return (
              <div key={c.id} className="client-card" onClick={() => navigate(`/customer/${c.id}`)}>
                <div className="client-header">
                  <div className={`avatar ${getAvatarColor(i)}`}>
                    {getInitials(c.firstName, c.lastName)}
                  </div>
                  <div className="client-info">
                    <h3>{c.firstName} {c.lastName} <span className="gender-badge">M</span></h3>
                    <p>{getMockProfession(i)}</p>
                  </div>
                </div>
                
                <div className="client-meta">
                  <span>{calculateAge(c.dateOfBirth)} yrs</span>
                  <span>•</span>
                  <span>{c.maritalStatus}</span>
                  <span className="client-meta-item" style={{marginLeft: 'auto'}}>
                    <MapPin /> {c.city}
                  </span>
                </div>

                <div className="client-footer">
                  <span className={`status-tag ${status.class}`}>{status.label}</span>
                  <ArrowRight />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <SettingsSidebar 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
