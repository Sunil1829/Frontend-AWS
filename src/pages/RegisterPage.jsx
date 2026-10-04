import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    return 3;
  };
  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register({ name, email, password });
      addToast('✓ Registration successful', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      addToast('✕ Registration failed', 'error');
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
          <h1>Start Your Journey.</h1>
          <p>Join the premium platform designed for professionals.</p>
          
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
          <h2>Create account</h2>
          <p className="text-muted">Fill in your details to get started.</p>
          
          {error && <div className="form-error"><AlertCircle size={16}/> {error}</div>}
          
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
            </div>

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
              <div className="password-strength">
                <div className={`strength-bar ${strength >= 1 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${strength >= 2 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${strength >= 3 ? 'active' : ''}`}></div>
              </div>
            </div>
            
            <button type="submit" className="btn-primary-glow full-width mt-4" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
