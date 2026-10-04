import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CommandPalette from './components/common/CommandPalette';
import AmbientBackground from './components/layout/AmbientBackground';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import WatchCoursePage from './pages/WatchCoursePage';
import MyLearningPage from './pages/MyLearningPage';
import LearningActivityPage from './pages/LearningActivityPage';

import './App.css';
import './premium.css';

function App() {
  return (
    <div className="app-container">
      <AmbientBackground />
      <Navbar />
      <CommandPalette />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/my-learning" element={<MyLearningPage />} />
          <Route path="/activity" element={<LearningActivityPage />} />
          <Route path="/watch/:id" element={<ProtectedRoute><WatchCoursePage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
