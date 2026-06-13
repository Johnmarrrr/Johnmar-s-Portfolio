import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [accent, setAccent] = useState(localStorage.getItem('accent') || 'teal');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const accentThemes = {
    teal: {
      dark: {
        color: '#10b981',
        accent: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
        glow: '0 0 30px rgba(99, 102, 241, 0.15)'
      },
      light: {
        color: '#0d9488',
        accent: '#4f46e5',
        gradient: 'linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)',
        glow: '0 10px 30px rgba(99, 102, 241, 0.06)'
      }
    },
    violet: {
      dark: {
        color: '#a855f7',
        accent: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
        glow: '0 0 30px rgba(236, 72, 153, 0.15)'
      },
      light: {
        color: '#7c3aed',
        accent: '#db2777',
        gradient: 'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
        glow: '0 10px 30px rgba(219, 39, 119, 0.06)'
      }
    },
    rose: {
      dark: {
        color: '#f43f5e',
        accent: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
        glow: '0 0 30px rgba(244, 63, 94, 0.15)'
      },
      light: {
        color: '#e11d48',
        accent: '#d97706',
        gradient: 'linear-gradient(135deg, #e11d48 0%, #d97706 100%)',
        glow: '0 10px 30px rgba(225, 29, 72, 0.06)'
      }
    },
    blue: {
      dark: {
        color: '#3b82f6',
        accent: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        glow: '0 0 30px rgba(59, 130, 246, 0.15)'
      },
      light: {
        color: '#2563eb',
        accent: '#0891b2',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)',
        glow: '0 10px 30px rgba(37, 99, 235, 0.06)'
      }
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Apply accent variables
    const activeAccent = accentThemes[accent] ? accentThemes[accent][theme] : accentThemes['teal'][theme];
    const root = document.documentElement;
    root.style.setProperty('--primary-color', activeAccent.color);
    root.style.setProperty('--primary-accent', activeAccent.accent);
    root.style.setProperty('--primary-gradient', activeAccent.gradient);
    root.style.setProperty('--glow-shadow', activeAccent.glow);

    localStorage.setItem('accent', accent);
  }, [theme, accent]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          JOHNMAR<span className="gradient-text">.</span>
        </Link>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li>
            <button onClick={() => handleNavClick('hero')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Home
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('projects')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Projects
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('skills')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Skills
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('experience')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Experience
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('contact')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Contact
            </button>
          </li>
          {user && (
            <>
              <li>
                <Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={() => { logout(); setIsOpen(false); navigate('/'); }} className="nav-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: 'none', fontFamily: 'inherit' }}>
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          )}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Accent Color Customizer Dots */}
          <div className="accent-customizer" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {Object.keys(accentThemes).map((acc) => (
              <button
                key={acc}
                onClick={() => setAccent(acc)}
                aria-label={`Set ${acc} accent`}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: accent === acc ? '2px solid var(--text-primary)' : '1px solid var(--card-border)',
                  background: acc === 'teal' ? '#10b981' : acc === 'violet' ? '#a855f7' : acc === 'rose' ? '#f43f5e' : '#3b82f6',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'transform 0.2s'
                }}
                className="accent-dot"
              />
            ))}
          </div>

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
