import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.login({ email, password });
      login(data);
      addToast('✓ Login successful', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
      addToast('✕ Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      <div className="auth-visual-side">
        <div className="auth-brand">
          <ShieldCheck size={32} className="text-cyan" />
          <span>SecureLearn</span>
        </div>
        <div className="auth-visual-content">
          <h1>Master the Cloud.<br/>Securely.</h1>
          <p>The premium platform for AWS S3 protected content delivery and modern development.</p>
          
          <div className="auth-features">
            <div className="feature-item"><ShieldCheck size={16} className="text-cyan"/> Secure access</div>
            <div className="feature-item"><ShieldCheck size={16} className="text-cyan"/> Private S3 content</div>
            <div className="feature-item"><ShieldCheck size={16} className="text-cyan"/> Temporary protected delivery</div>
          </div>

          <div className="abstract-visual">
            <div className="orbital-ring ring-1"></div>
            <div className="orbital-ring ring-2"></div>
            <ShieldCheck size={64} className="glowing-icon text-cyan" />
          </div>
        </div>
      </div>
      
      <div className="auth-form-side">
        <div className="auth-form-container">
          <h2>Welcome back</h2>
          <p className="text-muted">Enter your details to access your learning space.</p>
          
          {error && <div className="form-error"><AlertCircle size={16}/> {error}</div>}
          
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn-primary-glow full-width mt-4" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
