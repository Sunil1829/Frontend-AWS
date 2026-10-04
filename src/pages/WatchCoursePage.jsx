import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import contentService from '../services/contentService';
import courseService from '../services/courseService';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const WatchCoursePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const courseId = Number(id) || id;

  const [course, setCourse] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Real progress state
  const savedProgress = parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${courseId}`) || '0');
  const [currentProgress, setCurrentProgress] = useState(savedProgress);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(1800); // 30 minutes

  const fetchPresignedUrl = useCallback(async () => {
    setLoading(true);
    try {
      const courseData = await courseService.getCourseById(courseId).catch(() => ({ id: courseId, title: `Course ${courseId}` }));
      setCourse(courseData);

      const url = await contentService.getCourseContentUrl(courseId);
      if (url) {
        setVideoUrl(url);
        setSessionTimeLeft(1800); // Reset timer to 30 minutes
      } else {
        throw new Error('No presigned URL returned from backend');
      }
    } catch (err) {
      setError(err.response?.status === 403 ? 'You are not enrolled.' : 'Access Error');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchPresignedUrl();
  }, [fetchPresignedUrl]);

  // Session countdown effect
  useEffect(() => {
    if (loading || error) return;
    const interval = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          addToast('⚠ Session expired', 'error');
          return 0;
        }
        if (prev === 300) addToast('⚠ Session expiring soon', 'warning');
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, error, addToast]);

  const handleRenewSession = async () => {
    await fetchPresignedUrl();
    addToast('✓ Session renewed', 'success');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="watch-page-premium">
      <div className="watch-header-premium">
        <Link to={`/courses/${courseId}`} className="back-link">
          <ArrowLeft size={16} /> Back to course
        </Link>
        <div className="course-title-header">{course?.title}</div>
        <div className="learning-state-header">Progress: {Math.round(currentProgress)}%</div>
      </div>

      <div className="video-cinema-container">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-card"><AlertCircle/> {error}</div>
        ) : sessionTimeLeft === 0 ? (
          <div className="session-expired-overlay">
            <h3>Secure session expired.</h3>
            <p>Your temporary viewing URL has expired.</p>
            <button className="btn-primary" onClick={handleRenewSession}>Renew Secure Session</button>
          </div>
        ) : (
          <VideoPlayer
            videoUrl={videoUrl}
            courseId={courseId}
            userId={user?.userId}
            onProgressUpdate={setCurrentProgress}
            initialProgress={savedProgress}
          />
        )}
      </div>

      {!loading && !error && (
        <div className="learning-info-panel">
          <div className="course-meta">
            <h2>{course?.title}</h2>
            <p>{course?.description}</p>
            {currentProgress > 90 && <div className="completed-badge">✓ Completed</div>}
          </div>
          <div className="secure-session-panel">
            <h4>SECURE VIDEO SESSION</h4>
            <div className="sec-checks">
              <div>✓ Authenticated</div>
              <div>✓ Enrollment verified</div>
              <div>✓ Private S3 source</div>
            </div>
            <div className="temporary-access">
              <span className="text-muted">Temporary access</span>
              <span className="countdown">{formatTime(sessionTimeLeft)} remaining</span>
            </div>
            <button className="btn-ghost-small mt-3" onClick={handleRenewSession}><RefreshCw size={14}/> Renew Now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchCoursePage;
