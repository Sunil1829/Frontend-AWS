import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, LogOut, ShieldCheck, User as UserIcon, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`premium-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        {/* LEFT: Brand */}
        <div className="navbar-brand">
          <Link to="/" className="brand-logo-link">
            <div className="brand-icon">
              <ShieldCheck size={24} className="text-cyan" />
            </div>
            <div className="brand-text">
              <span className="brand-title">SecureLearn</span>
              <span className="brand-subtitle">AWS S3 PRESIGNED DELIVERY</span>
            </div>
          </Link>
        </div>

        {/* CENTER: Navigation */}
        {isAuthenticated && (
          <div className="navbar-links">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/courses" className={`nav-link ${isActive('/courses') ? 'active' : ''}`}>
              Courses
            </Link>
            <Link to="/my-learning" className={`nav-link ${isActive('/my-learning') ? 'active' : ''}`}>
              My Learning
            </Link>
            <Link to="/activity" className={`nav-link ${isActive('/activity') ? 'active' : ''}`}>
              Activity
            </Link>
          </div>
        )}

        {/* RIGHT: Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <button 
                className="cmd-palette-trigger" 
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                title="Search (Ctrl + K)"
              >
                <Search size={16} />
                <span>Ctrl + K</span>
              </button>

              <div className="user-menu-wrapper" ref={dropdownRef}>
                <button className="btn-ghost" style={{padding: '0 0.5rem'}} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="user-avatar" style={{marginRight: '0.5rem'}}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
                    <span className="auth-indicator"></span>
                  </div>
                  <span className="user-name">{user?.name || 'Student'}</span>
                </button>
                
                {dropdownOpen && (
                  <div className="user-menu-dropdown">
                    <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}>
                      <UserIcon size={16} />
                      Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/activity'); }}>
                      <Activity size={16} />
                      Learning Activity
                    </button>
                    <div style={{height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0'}}></div>
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-ghost">Log In</Link>
              <Link to="/register" className="btn-primary-glow">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
