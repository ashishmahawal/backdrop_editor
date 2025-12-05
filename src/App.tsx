import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './components/ThemeToggle';
import { Home } from './pages/Home';
import { Editor } from './pages/Editor';
import './App.css';

const AppContent: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <h1>Backdrop Editor</h1>
          </Link>
          <div className="header-controls">
            {location.pathname === '/' && (
              <Link to="/editor" className="nav-link">Editor</Link>
            )}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router basename="/backdrop_editor">
      <AppContent />
    </Router>
  );
}

export default App;
