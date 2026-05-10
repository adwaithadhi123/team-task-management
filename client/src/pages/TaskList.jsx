import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckCircle2, Clock, Play, User, Layers, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', projectId: '', assigneeId: '', dueDate: '' });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks'),
        axios.get('http://localhost:5000/api/projects'),
        axios.get('http://localhost:5000/api/users')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'Medium', projectId: '', assigneeId: '', dueDate: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>{user.role === 'Admin' ? 'Oversee all team progress' : 'Manage your assignments'}</p>
        </div>
        {user.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={20} /> New Task
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map((task, idx) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass" 
            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.125rem' }}>{task.title}</h3>
                <span className={`badge badge-${task.status.toLowerCase().replace(' ', '')}`}>{task.status}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Layers size={14} /> {task.project.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={14} /> {task.assignee?.name || 'Unassigned'}</span>
                {task.dueDate && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {task.status === 'Pending' && (
                <button onClick={() => updateStatus(task.id, 'InProgress')} className="btn" style={{ background: 'var(--glass-bg)', padding: '0.5rem' }} title="Start Task">
                  <Play size={18} color="#3b82f6" />
                </button>
              )}
              {task.status === 'InProgress' && (
                <button onClick={() => updateStatus(task.id, 'Completed')} className="btn" style={{ background: 'var(--glass-bg)', padding: '0.5rem' }} title="Complete Task">
                  <CheckCircle2 size={18} color="#10b981" />
                </button>
              )}
              {task.status === 'Completed' && (
                <button onClick={() => updateStatus(task.id, 'InProgress')} className="btn" style={{ background: 'var(--glass-bg)', padding: '0.5rem' }} title="Reopen Task">
                  <Clock size={18} color="#f59e0b" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {tasks.length === 0 && <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks available.</div>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: '2rem', width: '90%', maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Task Title</label>
                <input type="text" className="input" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                <textarea className="input" rows="3" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Project</label>
                <select className="input" value={newTask.projectId} onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })} required>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Assignee</label>
                <select className="input" value={newTask.assigneeId} onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Priority</label>
                <select className="input" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Due Date</label>
                <input type="date" className="input" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ flex: 1, background: 'var(--glass-bg)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
