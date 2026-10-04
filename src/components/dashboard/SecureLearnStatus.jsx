import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, CheckCircle2, Lock, Key, HardDrive } from 'lucide-react';

const SecureLearnStatus = () => {
  const { isAuthenticated, user, token } = useAuth();

  return (
    <div className="status-widget-card">
      <div className="widget-header">
        <ShieldCheck size={18} className="text-cyan" />
        <span className="widget-title">SECURELEARN SYSTEM STATUS</span>
      </div>

      <div className="status-metrics-grid">
        <div className="status-metric-item">
          <div className="metric-dot dot-active"></div>
          <div className="metric-text">
            <span className="metric-label">Authentication</span>
            <span className="metric-value">{isAuthenticated ? 'JWT Verified' : 'Guest Mode'}</span>
          </div>
        </div>

        <div className="status-metric-item">
          <div className="metric-dot dot-active"></div>
          <div className="metric-text">
            <span className="metric-label">Session Rights</span>
            <span className="metric-value">{user ? `User #${user.userId}` : 'Unsigned'}</span>
          </div>
        </div>

        <div className="status-metric-item">
          <div className="metric-dot dot-active"></div>
          <div className="metric-text">
            <span className="metric-label">Content Delivery</span>
            <span className="metric-value">AWS S3 Presigner</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureLearnStatus;
