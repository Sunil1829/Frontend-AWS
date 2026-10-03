import api from '../api/api';

export const contentService = {
  getCourseContentUrl: async (courseId) => {
    const response = await api.get(`/api/content/${courseId}`);
    // Backend can return string directly or { url: "https://..." } or { presignedUrl: "https://..." }
    if (typeof response.data === 'string') {
      return response.data;
    }
    return response.data?.url || response.data?.presignedUrl || response.data?.contentUrl || response.data;
  },
};

export default contentService;
