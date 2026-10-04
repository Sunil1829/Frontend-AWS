import { useState } from 'react';
import { Key, Lock, Database, Clock, Play, ArrowRight, ShieldCheck } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Identity Verification',
    icon: Key,
    short: 'JWT Authentication',
    detail: 'Spring Boot authenticates credentials using BCrypt and returns a signed JSON Web Token (JWT) attached automatically to Axios request headers.',
  },
  {
    num: '02',
    title: 'Enrollment Verification',
    icon: Lock,
    short: 'Access Control Check',
    detail: 'Before content endpoints release media keys, Spring Boot verifies active user course enrollment in MySQL.',
  },
  {
    num: '03',
    title: 'Private Storage',
    icon: Database,
    short: 'Private AWS S3 Bucket',
    detail: 'Video objects (e.g. "SOA video.mp4") remain in a private AWS S3 bucket with public access completely blocked.',
  },
  {
    num: '04',
    title: 'Temporary Access',
    icon: Clock,
    short: 'S3 Presigned URL',
    detail: 'AWS S3Presigner generates a time-limited GET URL (~10 minute expiration). Access automatically expires after the session window.',
  },
  {
    num: '05',
    title: 'Protected Playback',
    icon: Play,
    short: 'HTML5 Video Stream',
    detail: 'The browser HTML5 video player requests object bytes directly from AWS S3 using the authorized presigned URL.',
  },
];

const InteractiveSecurityFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="security-flow-container">
      <div className="flow-header">
        <ShieldCheck size={20} className="text-cyan" />
        <h3>Interactive AWS S3 Content Access Pipeline</h3>
      </div>

      <div className="flow-steps-grid">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(idx)}
              className={`flow-step-card ${isActive ? 'active' : ''}`}
            >
              <div className="step-number">{step.num}</div>
              <div className="step-icon-box">
                <IconComponent size={20} />
              </div>
              <div className="step-title">{step.title}</div>
              <span className="step-badge">{step.short}</span>
            </button>
          );
        })}
      </div>

      {/* Detail explanation panel for active step */}
      <div className="flow-detail-panel">
        <div className="detail-panel-header">
          <span className="panel-step-num">Step {steps[activeStep].num}</span>
          <h4 className="panel-step-title">{steps[activeStep].title}</h4>
        </div>
        <p className="panel-step-desc">{steps[activeStep].detail}</p>
      </div>
    </div>
  );
};

export default InteractiveSecurityFlow;
