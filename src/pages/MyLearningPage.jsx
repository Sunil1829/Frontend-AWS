import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { GraduationCap, AlertCircle, PlayCircle, CheckCircle2 } from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const MyLearningPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyLearning = useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const data = await courseService.getAllCourses();
      const courseList = Array.isArray(data) ? data : (data?.content || []);
      
      const enrolledList = [];
      await Promise.all(
        courseList.map(async (c) => {
          try {
            const enrolled = await enrollmentService.checkEnrollment(user.userId, c.id);
            if (enrolled) {
              enrolledList.push(c);
            }
          } catch (e) {
            // ignore
          }
        })
      );
      setEnrolledCourses(enrolledList);
    } catch (err) {
      setError('Failed to load your learning workspace.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyLearning();
  }, [fetchMyLearning]);

  const inProgress = enrolledCourses.filter(c => {
    const p = parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${c.id}`) || '0');
    return p < 90;
  });

  const completed = enrolledCourses.filter(c => {
    const p = parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${c.id}`) || '0');
    return p >= 90;
  });

  return (
    <div className="courses-page-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">My Learning Workspace</h1>
        <p className="page-subtitle">Manage your enrolled courses and pick up right where you left off.</p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} type="courseCard" />
      ) : error ? (
        <EmptyState icon={<AlertCircle />} title="Error" message={error} />
      ) : enrolledCourses.length === 0 ? (
        <EmptyState 
          icon={<GraduationCap />} 
          title="No Courses Yet" 
          message="You haven't enrolled in any courses. Explore the catalog to get started." 
          action={{ label: 'Explore Courses', onClick: () => navigate('/courses') }}
        />
      ) : (
        <>
          {inProgress.length > 0 && (
            <section style={{ marginBottom: '3rem' }}>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <PlayCircle className="text-cyan" /> In Progress
              </h2>
              <div className="premium-grid">
                {inProgress.map((course) => {
                  const progress = parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${course.id}`) || '0');
                  return <CourseCard key={course.id} course={course} enrollmentStatus={true} progress={progress} />;
                })}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <CheckCircle2 className="text-success" /> Completed
              </h2>
              <div className="premium-grid">
                {completed.map((course) => {
                  const progress = parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${course.id}`) || '0');
                  return <CourseCard key={course.id} course={course} enrollmentStatus={true} progress={progress} />;
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default MyLearningPage;
