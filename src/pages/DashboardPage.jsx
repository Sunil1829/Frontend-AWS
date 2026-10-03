import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Shield, BookOpen, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledMap, setEnrolledMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'enrolled'

  const fetchCoursesAndEnrollments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch live courses from Spring Boot backend GET /api/courses
      const data = await courseService.getAllCourses();
      const courseList = Array.isArray(data) ? data : (data?.content || []);
      setCourses(courseList);

      // 2. Check enrollment status for each course if user is logged in
      if (user?.userId && courseList.length > 0) {
        const enrollmentStatusObj = {};
        await Promise.all(
          courseList.map(async (course) => {
            try {
              const isEnrolled = await enrollmentService.checkEnrollment(user.userId, course.id);
              enrollmentStatusObj[course.id] = isEnrolled;
            } catch (e) {
              enrollmentStatusObj[course.id] = false;
            }
          })
        );
        setEnrolledMap(enrollmentStatusObj);
      }
    } catch (err) {
      console.error('Error fetching course data from backend:', err);
      let message = 'Failed to load courses from backend server.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (typeof err.response?.data === 'string') {
        message = err.response.data;
      } else if (err.request) {
        message = 'Unable to connect to Spring Boot server (http://localhost:8080). Please ensure your backend is running.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, [fetchCoursesAndEnrollments]);

  const displayedCourses = courses.filter((course) => {
    if (filter === 'enrolled') {
      return Boolean(enrolledMap[course.id]);
    }
    return true;
  });

  return (
    <div className="dashboard-container">
      {/* Hero Header Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-pill">
            <Shield size={15} />
            <span>AWS S3 Presigned URL Content Platform</span>
          </div>
          <h1 className="hero-title">
            Secure Digital Learning <br />
            <span className="text-gradient">Powered by AWS</span>
          </h1>
          <p className="hero-subtitle">
            Explore available technical courses. Enrolled users gain authorized access to stream video content directly from private S3 buckets using temporary presigned URLs.
          </p>
        </div>
      </section>

      {/* Course Catalog Controls */}
      <section className="catalog-section">
        <div className="catalog-header">
          <div className="catalog-title-group">
            <h2>Course Catalog</h2>
            <p>Select a course to view details, enroll, or watch protected video streams.</p>
          </div>

          <div className="tab-filters">
            <button
              onClick={() => setFilter('all')}
              className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>All Courses ({courses.length})</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setFilter('enrolled')}
                className={`tab-btn ${filter === 'enrolled' ? 'active' : ''}`}
              >
                <CheckCircle2 size={16} />
                <span>My Enrolled ({Object.values(enrolledMap).filter(Boolean).length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Display */}
        {loading ? (
          <LoadingSpinner message="Fetching live course catalog from Spring Boot API..." />
        ) : error ? (
          <div className="empty-state-container">
            <div className="empty-icon-wrapper text-danger" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertCircle size={40} className="text-danger" />
            </div>
            <h3 className="empty-title">Backend Connection Error</h3>
            <p className="empty-description">{error}</p>
            <button onClick={fetchCoursesAndEnrollments} className="btn-primary">
              <RefreshCw size={16} />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : displayedCourses.length === 0 ? (
          <EmptyState
            title={filter === 'enrolled' ? 'No Enrolled Courses' : 'No Courses Available'}
            description={
              filter === 'enrolled'
                ? 'You have not enrolled in any courses yet. Browse the catalog and click Enroll!'
                : 'No course items returned by the backend API.'
            }
            onRetry={fetchCoursesAndEnrollments}
          />
        ) : (
          <div className="courses-grid">
            {displayedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={Boolean(enrolledMap[course.id])}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
