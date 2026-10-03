import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import contentService from '../services/contentService';
import courseService from '../services/courseService';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, ArrowLeft, AlertCircle, RefreshCw, Lock } from 'lucide-react';

const WatchCoursePage = () => {
  const { id } = useParams();
  const courseId = Number(id) || id;

  const [course, setCourse] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPresignedUrl = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch course metadata
      try {
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
      } catch (e) {
        setCourse({ id: courseId });
      }

      // 2. Request S3 Presigned URL from backend GET /api/content/{courseId}
      const url = await contentService.getCourseContentUrl(courseId);
      if (url) {
        setVideoUrl(url);
      } else {
        throw new Error('No presigned URL returned from backend');
      }
    } catch (err) {
      console.error('Error fetching presigned URL:', err);
      const status = err.response?.status;
      if (status === 403) {
        setError('You are not enrolled in this course.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Could not retrieve S3 Presigned URL. Please check your backend connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchPresignedUrl();
  }, [fetchPresignedUrl]);

  return (
    <div className="watch-page-container">
      {/* Header bar */}
      <div className="watch-header">
        <Link to={`/courses/${courseId}`} className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Course Details</span>
        </Link>
        <div className="watch-badge">
          <ShieldCheck size={16} className="text-accent" />
          <span>AWS S3 Presigned Video Session</span>
        </div>
      </div>

      <div className="watch-content-wrapper">
        <h1 className="watch-title">{course?.title || 'Watch Course Video'}</h1>

        {loading ? (
          <LoadingSpinner message="Authenticating session & generating AWS S3 Presigned URL..." />
        ) : error ? (
          <div className="watch-error-card empty-state-container">
            <AlertCircle size={48} className="text-danger mb-3" />
            <h3>{error.includes('enrolled') ? 'Enrollment Required' : 'Access Error'}</h3>
            <p className="empty-description">{error}</p>
            <div className="error-actions mt-4">
              <button onClick={fetchPresignedUrl} className="btn-secondary me-3">
                <RefreshCw size={16} />
                <span>Retry</span>
              </button>
              <Link to={`/courses/${courseId}`} className="btn-primary">
                <Lock size={16} />
                <span>View Course Details</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="watch-player-wrapper">
            <VideoPlayer
              videoUrl={videoUrl}
              title={course?.title}
              onRefreshUrl={fetchPresignedUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchCoursePage;
