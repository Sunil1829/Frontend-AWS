import { ShieldCheck, Key, Database, Lock, Cpu, Sparkles } from 'lucide-react';

const SecureLearningCore = ({ size = 'normal' }) => {
  return (
    <div className={`secure-core-container ${size}`}>
      <div className="core-glow-bg"></div>

      {/* Central Core */}
      <div className="core-center-node">
        <div className="center-pulse-ring"></div>
        <ShieldCheck className="core-main-icon" size={size === 'large' ? 44 : 32} />
        <span className="core-label">SECURE CORE</span>
      </div>

      {/* Satellite Nodes */}
      <div className="core-node node-top-left">
        <Key size={16} />
        <span>JWT Auth</span>
      </div>

      <div className="core-node node-top-right">
        <Database size={16} />
        <span>Private S3</span>
      </div>

      <div className="core-node node-bottom-left">
        <Lock size={16} />
        <span>Authorization</span>
      </div>

      <div className="core-node node-bottom-right">
        <Cpu size={16} />
        <span>Presigned URL</span>
      </div>

      {/* SVG Connecting Pulsing Lines */}
      <svg className="core-lines-svg" viewBox="0 0 300 300">
        <line x1="80" y1="80" x2="150" y2="150" className="core-line line-1" />
        <line x1="220" y1="80" x2="150" y2="150" className="core-line line-2" />
        <line x1="80" y1="220" x2="150" y2="150" className="core-line line-3" />
        <line x1="220" y1="220" x2="150" y2="150" className="core-line line-4" />
      </svg>
    </div>
  );
};

export default SecureLearningCore;
