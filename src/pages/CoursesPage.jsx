import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { Search, AlertCircle } from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const CoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledMap, setEnrolledMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

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

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === 'enrolled') return enrolledMap[course.id];
    if (filter === 'available') return !enrolledMap[course.id];

    return true; // 'all'
  });

  return (
    <div className="courses-page-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Course Explorer</h1>
        <p className="page-subtitle">Discover professional courses designed for security and scalability.</p>
        
        <div className="courses-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div className="premium-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group" style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn-secondary ${filter === 'all' ? 'active-filter' : ''}`} onClick={() => setFilter('all')} style={filter === 'all' ? {borderColor: 'var(--cyan-primary)', color: 'var(--cyan-primary)'} : {}}>All</button>
            <button className={`btn-secondary ${filter === 'available' ? 'active-filter' : ''}`} onClick={() => setFilter('available')} style={filter === 'available' ? {borderColor: 'var(--cyan-primary)', color: 'var(--cyan-primary)'} : {}}>Available</button>
            <button className={`btn-secondary ${filter === 'enrolled' ? 'active-filter' : ''}`} onClick={() => setFilter('enrolled')} style={filter === 'enrolled' ? {borderColor: 'var(--cyan-primary)', color: 'var(--cyan-primary)'} : {}}>Enrolled</button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} type="courseCard" />
      ) : error ? (
        <EmptyState icon={<AlertCircle />} title="Error Loading Courses" message={error} />
      ) : filteredCourses.length === 0 ? (
        <EmptyState icon={<Search />} title="No Courses Found" message="Try adjusting your search filters." />
      ) : (
        <div className="premium-grid">
          {filteredCourses.map((course) => {
            const progress = parseFloat(localStorage.getItem(`securelearn_progress_${user?.userId}_${course.id}`) || '0');
            return (
              <CourseCard 
                key={course.id} 
                course={course} 
                enrollmentStatus={enrolledMap[course.id]} 
                progress={progress}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
