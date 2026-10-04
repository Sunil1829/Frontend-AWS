// Real video progress tracking — stored in localStorage
// Key: securelearn_progress_{userId}_{courseId}

const buildKey = (userId, courseId) => `securelearn_progress_${userId}_${courseId}`;

/**
 * Save current video progress to localStorage.
 * Only saves if duration is known and > 0.
 */
export const saveProgress = (userId, courseId, currentTime, duration) => {
  if (!userId || !courseId || !duration || duration <= 0) return;
  const percentage = Math.round((currentTime / duration) * 100);
  const data = {
    currentTime: Math.floor(currentTime),
    duration: Math.floor(duration),
    percentage,
    completed: percentage >= 90,
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(buildKey(userId, courseId), JSON.stringify(data));
  } catch (e) { /* storage quota, ignore */ }
};

/**
 * Retrieve saved progress. Returns null if nothing saved.
 */
export const getProgress = (userId, courseId) => {
  if (!userId || !courseId) return null;
  try {
    const raw = localStorage.getItem(buildKey(userId, courseId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

/**
 * Delete saved progress for a course.
 */
export const resetProgress = (userId, courseId) => {
  if (!userId || !courseId) return;
  localStorage.removeItem(buildKey(userId, courseId));
};

/**
 * Mark a course as locally completed (override, e.g. watched full video).
 */
export const markCompleted = (userId, courseId, duration) => {
  const existing = getProgress(userId, courseId) || {};
  const data = {
    ...existing,
    currentTime: duration || existing.duration || 0,
    duration: duration || existing.duration || 0,
    percentage: 100,
    completed: true,
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(buildKey(userId, courseId), JSON.stringify(data));
  } catch (e) {}
};

/**
 * Format seconds to M:SS or H:MM:SS string.
 */
export const formatTime = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds < 0) return '0:00';
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${m}:${String(sec).padStart(2, '0')}`;
};

/**
 * Get all progress entries for a user across all courses.
 * Returns array of { courseId, ...progressData }
 */
export const getAllProgress = (userId) => {
  if (!userId) return [];
  const prefix = `securelearn_progress_${userId}_`;
  const results = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const courseId = key.replace(prefix, '');
        const data = getProgress(userId, courseId);
        if (data) results.push({ courseId, ...data });
      }
    }
  } catch (e) {}
  return results;
};
