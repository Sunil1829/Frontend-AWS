import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Clock, RefreshCw, AlertCircle, Play, Info } from 'lucide-react';

const VideoPlayer = ({ videoUrl, title, onRefreshUrl }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default countdown (600 seconds)

  useEffect(() => {
    setError(false);
    setTimeLeft(600); // Reset timer when URL changes

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [videoUrl]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleVideoError = () => {
    console.error('Video playback failed for URL:', videoUrl);
    setError(true);
  };

  return (
    <div className="video-player-container">
      <div className="video-frame-wrapper">
        {error ? (
          <div className="video-error-overlay">
            <AlertCircle size={48} className="error-icon" />
            <h4>Playback Failed or Link Expired</h4>
            <p>The temporary AWS S3 presigned URL may have expired or is invalid.</p>
            {onRefreshUrl && (
              <button onClick={onRefreshUrl} className="btn-primary mt-4">
                <RefreshCw size={16} />
                <span>Request Fresh S3 URL</span>
              </button>
            )}
          </div>
        ) : (
          <video
            ref={videoRef}
            className="html5-video-player"
            controls
            controlsList="nodownload"
            autoPlay
            onError={handleVideoError}
            src={videoUrl}
          >
            Your browser does not support HTML5 video playback.
          </video>
        )}
      </div>

      {/* Security & Access Information Banner */}
      <div className="video-security-banner">
        <div className="security-info-group">
          <div className="security-badge">
            <ShieldCheck size={18} className="text-accent" />
            <span>Protected Content</span>
          </div>
          <div className="expiry-badge">
            <Clock size={16} />
            <span>S3 URL Expiry: {formatTime(timeLeft)}</span>
          </div>
        </div>

        <p className="security-notice">
          <Info size={15} className="inline-icon" />
          Course access is authorized by the application and delivered through a temporary AWS S3 Presigned URL.
        </p>

        {onRefreshUrl && timeLeft < 120 && (
          <button onClick={onRefreshUrl} className="btn-secondary btn-sm">
            <RefreshCw size={14} />
            <span>Refresh Presigned URL</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
