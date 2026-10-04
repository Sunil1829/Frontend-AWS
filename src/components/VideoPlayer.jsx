import { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, PlayCircle } from 'lucide-react';

const VideoPlayer = ({ videoUrl, courseId, userId, onProgressUpdate, initialProgress = 0 }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const { addToast } = useToast();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const [showResumePrompt, setShowResumePrompt] = useState(initialProgress > 0 && initialProgress < 90);
  
  const controlsTimeoutRef = useRef(null);

  // Restore saved time on load if not showing prompt
  useEffect(() => {
    if (!showResumePrompt && videoRef.current) {
      const savedTime = parseFloat(localStorage.getItem(`securelearn_time_${userId}_${courseId}`) || '0');
      if (savedTime > 0) {
        videoRef.current.currentTime = savedTime;
      }
    }
  }, [showResumePrompt, userId, courseId]);

  // Keyboard Shortcuts (Ensure they don't fire when typing in inputs)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (!videoRef.current) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBackward();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const seekForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
    }
  };

  const seekBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime: cTime, duration: dTime } = videoRef.current;
    
    setCurrentTime(cTime);
    if (!isNaN(dTime)) setDuration(dTime);
    
    if (dTime > 0) {
      const p = (cTime / dTime) * 100;
      onProgressUpdate(p);
      localStorage.setItem(`securelearn_progress_${userId}_${courseId}`, p.toString());
      localStorage.setItem(`securelearn_time_${userId}_${courseId}`, cTime.toString());
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onProgressUpdate(100);
    localStorage.setItem(`securelearn_progress_${userId}_${courseId}`, '100');
    addToast('✓ Course completed', 'success');
  };

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (!newMuted && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mouse activity tracking for controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const resumeVideo = () => {
    if (videoRef.current) {
      const savedTime = parseFloat(localStorage.getItem(`securelearn_time_${userId}_${courseId}`) || '0');
      videoRef.current.currentTime = savedTime;
      videoRef.current.play();
      setIsPlaying(true);
    }
    setShowResumePrompt(false);
  };

  const startOver = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
    setShowResumePrompt(false);
  };

  const savedTimeFormatted = () => {
    const s = parseFloat(localStorage.getItem(`securelearn_time_${userId}_${courseId}`) || '0');
    return formatTime(s);
  };

  return (
    <div 
      className="custom-video-player" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="premium-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        controls={false}
      />
      
      {!isPlaying && !showResumePrompt && (
        <div className="center-play-button" onClick={togglePlay}>
          <PlayCircle size={64} className="text-white opacity-80" />
        </div>
      )}

      {showResumePrompt && (
        <div className="resume-prompt-overlay">
          <div className="resume-box">
            <h4>Continue from {savedTimeFormatted()}?</h4>
            <div className="resume-actions">
              <button className="btn-primary" onClick={resumeVideo}>Resume</button>
              <button className="btn-ghost" onClick={startOver}>Start Over</button>
            </div>
          </div>
        </div>
      )}

      <div className={`video-controls-bar ${showControls || !isPlaying ? 'visible' : 'hidden'}`}>
        <input 
          type="range" 
          className="progress-seek-bar" 
          min={0} 
          max={duration || 100} 
          value={currentTime}
          onChange={handleSeekChange}
        />
        <div className="controls-row">
          <div className="controls-left">
            <button className="ctrl-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="ctrl-btn" onClick={seekBackward} title="Back 10s">
              <RotateCcw size={18} />
            </button>
            <button className="ctrl-btn" onClick={seekForward} title="Forward 10s">
              <RotateCw size={18} />
            </button>
            
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="controls-right">
            <div className="volume-container">
              <button className="ctrl-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range" 
                className="volume-slider" 
                min={0} 
                max={1} 
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </div>
            <button className="ctrl-btn" onClick={toggleFullscreen} title="Fullscreen">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
