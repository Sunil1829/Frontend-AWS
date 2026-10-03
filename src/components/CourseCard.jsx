import { Link } from 'react-router-dom';
import { Play, Lock, CheckCircle2, BookOpen } from 'lucide-react';

const CourseCard = ({ course, isEnrolled = false }) => {
  const { id, title, description, category, duration, instructor } = course;

  return (
    <div className={`course-card ${isEnrolled ? 'enrolled-card' : ''}`}>
      <div className="card-banner">
        <div className="banner-overlay"></div>
        <div className="card-badge-container">
          {isEnrolled ? (
            <span className="badge badge-success">
              <CheckCircle2 size={13} />
              <span>Enrolled</span>
            </span>
          ) : (
            <span className="badge badge-protected">
              <Lock size={13} />
              <span>Protected Access</span>
            </span>
          )}
        </div>
        <div className="card-banner-icon">
          <BookOpen size={36} className="banner-icon-svg" />
        </div>
      </div>

      <div className="card-body">
        <div className="card-meta">
          {category && <span className="category-tag">{category}</span>}
          {duration && <span className="duration-tag">{duration}</span>}
        </div>

        <h3 className="card-title">{title}</h3>
        
        {description && <p className="card-description">{description}</p>}

        {instructor && (
          <div className="instructor-info">
            <span className="instructor-label">Instructor:</span>
            <span className="instructor-name">{instructor}</span>
          </div>
        )}

        <div className="card-footer">
          {isEnrolled ? (
            <Link to={`/watch/${id}`} className="btn-watch">
              <Play size={16} fill="currentColor" />
              <span>Watch Video</span>
            </Link>
          ) : (
            <Link to={`/courses/${id}`} className="btn-details">
              <span>View Details</span>
              <Lock size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
