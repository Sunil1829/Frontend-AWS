import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { getCourseVisual } from "../utils/courseVisuals";

const CourseCard = ({ course, enrollmentStatus, progress = 0 }) => {
  const navigate = useNavigate();
  const visual = getCourseVisual(course);

  const isEnrolled = enrollmentStatus;
  const isCompleted = progress > 90;

  const handleAction = (e) => {
    e.preventDefault();
    if (isEnrolled) {
      navigate(`/watch/${course.id}`);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <div className={`premium-course-card ${isEnrolled ? 'enrolled' : ''}`}>
      <div className="card-visual-area" style={{ background: visual.gradient }}>
        <div className="card-visual-overlay"></div>
        <div className="card-visual-content">
          <visual.Icon size={48} className="course-icon-large" />
          <div className="card-category-badge">{visual.category}</div>
        </div>
      </div>

      <div className="card-content-area">
        <h3 className="course-title" title={course.title}>{course.title}</h3>
        <p className="course-desc-trunc">{course.description}</p>

        <div className="card-learning-state">
          {isEnrolled ? (
            isCompleted ? (
              <div className="state-badge completed">
                <CheckCircle2 size={14} />
                <span>Completed</span>
              </div>
            ) : progress > 0 ? (
              <div className="progress-container">
                <div className="progress-info">
                  <span>In Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="state-badge ready">
                <PlayCircle size={14} />
                <span>Ready to learn</span>
              </div>
            )
          ) : (
            <div className="state-badge available">
              <ShieldCheck size={14} />
              <span>Available</span>
            </div>
          )}
        </div>

        <button className={`card-primary-action ${isEnrolled ? 'action-enrolled' : ''}`} onClick={handleAction}>
          {isEnrolled ? (progress > 0 ? (isCompleted ? 'Review Course' : 'Continue') : 'Start Learning') : 'View Course'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
