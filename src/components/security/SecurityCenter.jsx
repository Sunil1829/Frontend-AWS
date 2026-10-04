import InteractiveSecurityFlow from './InteractiveSecurityFlow';
import { ShieldCheck, Key, Lock, Database, Clock, Server, CheckCircle2 } from 'lucide-react';

const SecurityCenter = () => {
  return (
    <div className="security-center-wrapper">
      <div className="sec-hero-banner">
        <div className="sec-hero-content">
          <div className="hero-badge">
            <ShieldCheck size={16} />
            <span>Architecture Breakdown</span>
          </div>
          <h2>SecureLearn Security Architecture</h2>
          <p>
            Understand how user identity, Spring Security, MySQL enrollments, and AWS S3Presigner interact to protect digital learning media.
          </p>
        </div>
      </div>

      <InteractiveSecurityFlow />

      <div className="sec-cards-grid mt-6">
        <div className="sec-feature-card">
          <div className="sec-card-icon">
            <Key size={24} />
          </div>
          <h4>JWT Identity Verification</h4>
          <p>
            User authentication requests `POST /api/users/login` return a signed JWT stored in local application state and attached to protected headers.
          </p>
        </div>

        <div className="sec-feature-card">
          <div className="sec-card-icon">
            <Lock size={24} />
          </div>
          <h4>Enrollment Enforcement</h4>
          <p>
            Spring Boot checks the database prior to issuing content keys, returning `403 Forbidden` if enrollment is missing.
          </p>
        </div>

        <div className="sec-feature-card">
          <div className="sec-card-icon">
            <Database size={24} />
          </div>
          <h4>Private AWS S3 Storage</h4>
          <p>
            Course video files reside inside private S3 buckets. Direct public URL access is completely disabled.
          </p>
        </div>

        <div className="sec-feature-card">
          <div className="sec-card-icon">
            <Clock size={24} />
          </div>
          <h4>S3 Presigned URL Expiration</h4>
          <p>
            Backend S3Presigner generates temporary URLs valid for ~10 minutes. Video sessions auto-expire once the signature window closes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
