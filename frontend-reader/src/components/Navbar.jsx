import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    showSuccess('Successfully logged out');
    navigate('/');
    setMenuOpen(false);
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMenu}>Blog Reader</Link>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            
            {isAuthenticated ? (
              <>
                <span className="welcome-message">
                  Hello, {user?.name || 'Reader'}
                </span>
                <a href="#" onClick={handleLogout} className="nav-link logout-link">
                  Logout
                </a>
              </>
            ) : (
              <Link to="/login" className="nav-link login-link" onClick={closeMenu}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 