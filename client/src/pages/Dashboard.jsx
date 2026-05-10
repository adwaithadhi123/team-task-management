import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle2, Layout, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: <Layout size={24} />, color: '#6366f1' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'InProgress').length, icon: <Clock size={24} />, color: '#3b82f6' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, icon: <CheckCircle2 size={24} />, color: '#10b981' },
    { label: 'Overdue', value: tasks.filter(t => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < new Date()).length, icon: <AlertCircle size={24} />, color: '#ef4444' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Here's what's happening with your projects today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass" 
            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <section className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{ padding: '1rem', background: 'var(--glass-bg)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{task.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.project.name}</p>
                </div>
                <span className={`badge badge-${task.status.toLowerCase().replace(' ', '')}`}>
                  {task.status}
                </span>
              </div>
            ))}
            {tasks.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No tasks found.</p>}
          </div>
        </section>

        <section className="glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Team Activity</h2>
          <p style={{ color: 'var(--text-muted)' }}>Track your team's progress and upcoming deadlines.</p>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
             {/* Simple visualization placeholder */}
             <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '1rem' }}>
                {[60, 80, 45, 90, 70].map((h, i) => (
                  <div key={i} style={{ width: '20px', height: `${h}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: 0.5 + (i * 0.1) }}></div>
                ))}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
