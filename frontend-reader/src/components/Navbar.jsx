import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Blog Reader</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        
        {isAuthenticated ? (
          <>
            <span className="welcome-message">
              Hello, {user?.name || 'Reader'}
            </span>
            <a href="#" onClick={handleLogout} className="nav-link">
              Logout
            </a>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 