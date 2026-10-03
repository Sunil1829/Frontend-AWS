import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Play,
  ArrowLeft,
  Clock,
  Award,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams();
  const courseId = Number(id) || id;

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  const fetchCourseDetails = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await courseService.getCourseById(courseId);
      if (data) {
        setCourse(data);
      } else {
        throw new Error('Course object empty');
      }

      if (isAuthenticated && user?.userId) {
        const status = await enrollmentService.checkEnrollment(user.userId, courseId);
        setIsEnrolled(status);
      }
    } catch (err) {
      console.error('Failed to load course details from API:', err);
      let msg = 'Could not load course details from backend API.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.request) {
        msg = 'Unable to connect to Spring Boot server. Please ensure backend is running.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [courseId, isAuthenticated, user]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleEnroll = async () => {
    if (isEnrolled) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${courseId}` } } });
      return;
    }

    setEnrolling(true);
    setError('');

    try {
      await enrollmentService.enrollCourse({
        userId: user.userId,
        courseId: courseId,
      });
      setIsEnrolled(true);
    } catch (err) {
      console.error('Enrollment error:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Failed to complete enrollment. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading course details and enrollment authorization..." />;
  }

  if (error && !course) {
    return (
      <div className="detail-page-container">
        <div className="error-card empty-state-container">
          <AlertCircle size={40} className="text-danger mb-3" />
          <h2>Course Loading Error</h2>
          <p className="empty-description">{error}</p>
          <Link to="/dashboard" className="btn-secondary mt-3">
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="detail-page-container">
        <div className="error-card empty-state-container">
          <AlertCircle size={40} className="text-danger mb-3" />
          <h2>Course Not Found</h2>
          <p className="empty-description">The requested course does not exist in the backend database.</p>
          <Link to="/dashboard" className="btn-secondary mt-3">
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page-container">
      {/* Back Link */}
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to Course Catalog</span>
      </Link>

      <div className="detail-grid">
        {/* Main Info Column */}
        <div className="detail-main">
          <div className="course-header-badge">
            {course.category && <span className="category-pill">{course.category}</span>}
            {isEnrolled && (
              <span className="badge badge-success">
                <CheckCircle2 size={13} />
                <span>Enrolled</span>
              </span>
            )}
          </div>

          <h1 className="course-main-title">{course.title}</h1>

          {course.description && <p className="course-lead-desc">{course.description}</p>}

          {error && (
            <div className="auth-error-alert mb-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* S3 Presigned URL Security Explanation Card */}
          <div className="security-architecture-card">
            <div className="sec-card-header">
              <ShieldCheck size={22} className="sec-icon" />
              <h3>AWS S3 Presigned URL Security</h3>
            </div>
            <p className="sec-card-desc">
              Course media is stored in a <strong>Private AWS S3 Bucket</strong>. Upon authentication and enrollment verification, the Spring Boot backend generates a <strong>time-limited S3 Presigned URL</strong> to stream the video securely.
            </p>
            <ul className="sec-features-list">
              <li>
                <CheckCircle2 size={16} className="text-success" />
                <span>Strict JWT Authentication &amp; Verification</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-success" />
                <span>Backend S3Presigner Temporary Expiration</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-success" />
                <span>Direct Private S3 Object Streaming</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Sidebar Column */}
        <div className="detail-sidebar">
          <div className="enroll-action-card">
            <div className="action-card-header">
              <span className="price-tag">{isEnrolled ? 'Access Granted' : 'Course Access'}</span>
              {course.duration && (
                <span className="duration-info">
                  <Clock size={15} />
                  <span>{course.duration}</span>
                </span>
              )}
            </div>

            <div className="action-card-body">
              {isEnrolled ? (
                <div className="enrolled-status-box">
                  <div className="status-header">
                    <CheckCircle2 size={24} className="text-success" />
                    <div>
                      <h4>Enrolled</h4>
                      <p>You are authorized to stream this course content.</p>
                    </div>
                  </div>
                  <Link to={`/watch/${courseId}`} className="btn-primary btn-block btn-lg mt-4">
                    <Play size={18} fill="currentColor" />
                    <span>Watch Course</span>
                  </Link>
                </div>
              ) : (
                <div className="enroll-cta-box">
                  <p className="enroll-note">
                    Enroll now to authorize your account for S3 Presigned URL video streaming.
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn-primary btn-block btn-lg mt-4"
                  >
                    {enrolling ? (
                      <span>Enrolling...</span>
                    ) : isAuthenticated ? (
                      <>
                        <Sparkles size={18} />
                        <span>Enroll in Course</span>
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>Sign In to Enroll</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="action-card-footer">
              <Award size={16} />
              <span>Includes AWS S3 Presigned Video Streaming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
