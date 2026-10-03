import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, BookOpen, LogOut, Lock, User, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/dashboard" className="brand-logo">
          <div className="logo-icon-wrapper">
            <ShieldCheck className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Secure<span className="brand-highlight">Learn</span></span>
            <span className="brand-sub">Powered by AWS S3</span>
          </div>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-item">
                <BookOpen className="nav-icon" />
                <span>Dashboard</span>
              </Link>
              
              <div className="user-profile-badge">
                <div className="user-avatar">
                  <User size={16} />
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name || 'Learner'}</span>
                  <span className="user-role">Enrolled Student</span>
                </div>
              </div>

              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary">
                <Lock size={15} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn-primary">
                <Sparkles size={15} />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
