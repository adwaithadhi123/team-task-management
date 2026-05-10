import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="glass" style={{ width: '280px', margin: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
          <CheckSquare color="white" size={24} />
        </div>
        <h2 style={{ fontSize: '1.25rem' }}>TaskFlow</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start', background: 'transparent', color: 'inherit' }}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start', background: 'transparent', color: 'inherit' }}>
          <FolderKanban size={20} /> Projects
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start', background: 'transparent', color: 'inherit' }}>
          <CheckSquare size={20} /> My Tasks
        </NavLink>
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--glass-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
