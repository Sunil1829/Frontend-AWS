import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { Search, Sparkles, BookOpen, CheckCircle2, PlayCircle, ShieldCheck } from 'lucide-react';
import { getCourseVisual } from '../utils/courseVisuals';
import { AlertCircle } from "lucide-react";
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledMap, setEnrolledMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCoursesAndEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await courseService.getAllCourses();
      const courseList = Array.isArray(data) ? data : (data?.content || []);
      setCourses(courseList);

      if (user?.userId && courseList.length > 0) {
        const statusMap = {};
        await Promise.all(
          courseList.map(async (c) => {
            try {
              const enrolled = await enrollmentService.checkEnrollment(user.userId, c.id);
              statusMap[c.id] = enrolled;
            } catch (e) {
              statusMap[c.id] = false;
            }
          })
        );
        setEnrolledMap(statusMap);
      }
    } catch (err) {
      setError('Failed to load course catalog.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, [fetchCoursesAndEnrollments]);

  const enrolledCount = Object.values(enrolledMap).filter(Boolean).length;
  
  // Recent course
  const recentCourse = courses.find(c => enrolledMap[c.id]);
  const recentProgress = recentCourse ? parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${recentCourse.id}`) || '0') : 0;

  // Recommended courses (not enrolled)
  const recommendedCourses = courses.filter(c => !enrolledMap[c.id]).slice(0, 3);

  return (
    <div className="dashboard-container">
      {/* SECTION A — PERSONALIZED HERO */}
      <section className="premium-hero">
        <div className="hero-content">
          <div className="hero-greeting">WELCOME BACK, {user?.name?.toUpperCase() || 'STUDENT'}</div>
          <h1 className="hero-title">Learn smarter.<br />Access securely.</h1>
          <p className="hero-subtitle">Your learning space for secure, on-demand content.</p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => navigate('/courses')}>Explore Courses</button>
            {recentCourse && (
              <button className="btn-primary-glow" onClick={() => navigate(`/watch/${recentCourse.id}`)}>Continue Learning</button>
            )}
          </div>
        </div>
        <div className="abstract-core">
          <ShieldCheck size={80} className="text-cyan glowing-icon" style={{color: 'var(--cyan-primary)'}} />
          <div className="orbital-ring ring-1"></div>
          <div className="orbital-ring ring-2"></div>
        </div>
      </section>

      {/* SECTION B — LEARNING OVERVIEW */}
      <section className="stats-overview">
        <div className="stat-card">
          <BookOpen size={24} className="text-cyan" style={{color: 'var(--cyan-primary)'}} />
          <div className="stat-info">
            <span className="stat-value">{courses.length}</span>
            <span className="stat-label">Courses Available</span>
          </div>
        </div>
        <div className="stat-card">
          <Sparkles size={24} className="text-purple" style={{color: 'var(--violet-secondary)'}} />
          <div className="stat-info">
            <span className="stat-value">{enrolledCount}</span>
            <span className="stat-label">Courses Enrolled</span>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle2 size={24} className="text-success" style={{color: 'var(--success-emerald)'}} />
          <div className="stat-info">
            <span className="stat-value">
              {courses.filter(c => parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${c.id}`) || '0') > 90).length}
            </span>
            <span className="stat-label">Courses Completed</span>
          </div>
        </div>
      </section>

      {/* SECTION C — CONTINUE LEARNING */}
      {recentCourse && (
        <section className="continue-learning-section">
          <h2 className="section-title" style={{marginBottom: '1rem'}}>Continue Learning</h2>
          <div className="continue-card">
            <div className="continue-visual" style={{ background: getCourseVisual(recentCourse).gradient }}>
              <PlayCircle size={48} opacity={0.8} />
            </div>
            <div className="continue-info">
              <h3>{recentCourse.title}</h3>
              <div className="continue-progress">
                <div className="progress-info" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>In Progress</span>
                  <span>{Math.round(recentProgress)}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${recentProgress}%` }}></div>
                </div>
              </div>
            </div>
            <div style={{paddingRight: '1.5rem'}}>
              <button className="btn-primary" onClick={() => navigate(`/watch/${recentCourse.id}`)}>Resume Course</button>
            </div>
          </div>
        </section>
      )}

      {/* RECOMMENDED COURSES */}
      {recommendedCourses.length > 0 && (
        <section className="course-discovery" style={{marginTop: '2rem'}}>
          <div className="course-discovery-header">
            <h2 className="section-title">Recommended for you</h2>
            <button className="btn-ghost" onClick={() => navigate('/courses')}>View All</button>
          </div>
          
          <div className="premium-grid">
            {recommendedCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                enrollmentStatus={false} 
                progress={0}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
