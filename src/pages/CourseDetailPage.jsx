import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import { ShieldCheck, Lock, PlayCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { getCourseVisual } from '../utils/courseVisuals';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);
      
      if (user?.userId) {
        const enrolled = await enrollmentService.checkEnrollment(user.userId, id);
        setIsEnrolled(enrolled);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    setEnrolling(true);
    try {
      await enrollmentService.enrollCourse({ userId: Number(user.userId), courseId: Number(course.id) });
      setIsEnrolled(true);
      addToast('✓ Enrollment successful', 'success');
    } catch (err) {
      addToast('✕ Enrollment failed', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="page-loader"><LoadingSpinner /></div>;
  if (!course) return <div className="page-error">Course not found.</div>;

  const visual = getCourseVisual(course);
  const progress = parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${course.id}`) || '0');

  return (
    <div className="course-detail-container">
      {/* HERO */}
      <section className="course-hero premium-glass" style={{'--hero-grad': visual.gradient}}>
        <div className="course-hero-content">
          <div className="category-tag">{visual.category}</div>
          <h1 className="course-title-hero">{course.title}</h1>
          <p className="course-desc-hero">{course.description}</p>
          
          <div className="hero-enrollment-state">
            {isEnrolled ? (
              <div className="enrolled-actions">
                <div className="status-indicator">
                  <CheckCircle2 className="text-success" size={20} />
                  <span>Enrolled</span>
                </div>
                {progress > 0 && <div className="hero-progress">Progress: {Math.round(progress)}%</div>}
                <button className="btn-primary-glow mt-4" onClick={() => navigate(`/watch/${course.id}`)}>
                  <PlayCircle size={18} /> {progress > 0 ? (progress > 90 ? 'Review Course' : 'Continue Learning') : 'Start Learning'}
                </button>
              </div>
            ) : (
              <div className="enroll-actions">
                <div className="status-indicator text-muted">
                  <Lock size={20} />
                  <span>Unlock this course</span>
                </div>
                <button className="btn-primary-glow mt-4" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="course-hero-visual">
          <visual.Icon size={120} className="hero-icon" />
        </div>
      </section>


      {/* SECURITY DETAILS */}
      <section className="security-details-small">
        <div className="sec-tag"><ShieldCheck size={16}/> JWT Protected</div>
        <div className="sec-tag"><ShieldCheck size={16}/> Enrollment Verified</div>
        <div className="sec-tag"><ShieldCheck size={16}/> Private S3 Storage</div>
        <div className="sec-tag"><ShieldCheck size={16}/> Temporary Access</div>
      </section>
    </div>
  );
};

export default CourseDetailPage;
