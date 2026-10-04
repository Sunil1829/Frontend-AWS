import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import EmptyState from '../components/EmptyState';
import { Activity, BookOpen, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

const LearningActivityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const data = await courseService.getAllCourses();
      const courseList = Array.isArray(data) ? data : (data?.content || []);
      
      const activityList = [];
      await Promise.all(
        courseList.map(async (c) => {
          try {
            const enrolled = await enrollmentService.checkEnrollment(user.userId, c.id);
            if (enrolled) {
              const progress = parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${c.id}`) || '0');
              
              if (progress >= 90) {
                activityList.push({ id: `comp_${c.id}`, course: c, type: 'completed', desc: 'Completed course', time: 'Recently' });
              } else if (progress > 0) {
                activityList.push({ id: `prog_${c.id}`, course: c, type: 'progress', desc: `Progress updated to ${Math.round(progress)}%`, time: 'Recently' });
              } else {
                activityList.push({ id: `enr_${c.id}`, course: c, type: 'enrolled', desc: 'Enrolled in course', time: 'Recently' });
              }
            }
          } catch (e) {
            // ignore
          }
        })
      );
      setActivities(activityList.reverse()); // Just a simple mock sort for recent first
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return (
    <div className="courses-page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Learning Activity</h1>
        <p className="page-subtitle">Your personal learning history and milestones.</p>
      </div>

      {loading ? (
        <div className="page-loader">Loading...</div>
      ) : activities.length === 0 ? (
        <EmptyState 
          icon={<Activity />} 
          title="No Activity Yet" 
          message="Start learning to see your progress history here."
          action={{ label: 'Explore Courses', onClick: () => navigate('/courses') }}
        />
      ) : (
        <div className="activity-timeline">
          {activities.map((act) => (
            <div key={act.id} className="activity-item" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--dark-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <div className="activity-icon" style={{ marginTop: '0.25rem' }}>
                {act.type === 'completed' && <CheckCircle2 size={24} className="text-success" />}
                {act.type === 'progress' && <PlayCircle size={24} className="text-cyan" />}
                {act.type === 'enrolled' && <BookOpen size={24} className="text-purple" />}
              </div>
              <div className="activity-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{act.desc}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {act.time}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{act.course.title}</p>
                <button className="btn-secondary" onClick={() => navigate(act.type === 'completed' ? `/courses/${act.course.id}` : `/watch/${act.course.id}`)} style={{ height: '32px', fontSize: '0.8rem' }}>
                  {act.type === 'completed' ? 'Review Course' : 'Resume Course'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningActivityPage;
