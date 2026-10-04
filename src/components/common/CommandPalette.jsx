import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, LayoutDashboard, BookOpen, GraduationCap, LogOut, Activity, User } from 'lucide-react';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen || !isAuthenticated) return null;

  const actions = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'courses', label: 'Explore Courses', icon: BookOpen, path: '/courses' },
    { id: 'mylearning', label: 'My Learning', icon: GraduationCap, path: '/my-learning' },
    { id: 'activity', label: 'Learning Activity', icon: Activity, path: '/activity' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard' },
    { id: 'logout', label: 'Logout', icon: LogOut, action: () => { logout(); navigate('/login'); } }
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (action) => {
    if (action.path) navigate(action.path);
    else if (action.action) action.action();
    setIsOpen(false);
  };

  return (
    <div className="cmd-overlay" onClick={() => setIsOpen(false)}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-search-header">
          <Search size={20} className="text-muted" />
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Search actions or courses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="cmd-shortcut">ESC</div>
        </div>
        <div className="cmd-actions-list">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, i) => (
              <button key={action.id} className="cmd-action-item" onClick={() => handleSelect(action)}>
                <action.icon size={18} className="action-icon" />
                <span>{action.label}</span>
              </button>
            ))
          ) : (
            <div className="cmd-empty">No results found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
