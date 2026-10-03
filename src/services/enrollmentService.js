import api from '../api/api';

export const enrollmentService = {
  enrollCourse: async ({ userId, courseId }) => {
    // Send enrollment payload
    const response = await api.post('/api/enrollments', { userId, courseId });
    return response.data;
  },

  checkEnrollment: async (userId, courseId) => {
    if (!userId || !courseId) return false;
    try {
      const response = await api.get(`/api/enrollments/check`, {
        params: { userId, courseId },
      });
      // Expected response could be boolean or object { enrolled: true/false }
      if (typeof response.data === 'boolean') {
        return response.data;
      }
      return response.data?.enrolled ?? response.data?.isEnrolled ?? Boolean(response.data);
    } catch (error) {
      console.warn('Enrollment check error:', error);
      return false;
    }
  },
};

export default enrollmentService;
