import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerDetail from './pages/CustomerDetail';
import AIBot from './components/AIBot';

function ProtectedRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router basename="/Matchmaker/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/customer/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
      </Routes>
      <AIBot />
    </Router>
  );
}

export default App;
