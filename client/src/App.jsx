import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import TaskList from './pages/TaskList';
import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {user && <Sidebar />}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/projects" element={
            <PrivateRoute>
              <Layout>
                <ProjectList />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/tasks" element={
            <PrivateRoute>
              <Layout>
                <TaskList />
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
