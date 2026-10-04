import { Shield, Code, Server, Database, Cpu, Cloud, Lock } from 'lucide-react';

/**
 * Derives dynamic visual metadata for a course card based on backend title/description
 */
export const getCourseVisual = (course) => {
  const title = (course?.title || '').toLowerCase();
  const desc = (course?.description || '').toLowerCase();

  if (title.includes('aws') || title.includes('s3') || title.includes('cloud') || title.includes('soa')) {
    return {
      category: 'Cloud & Security',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%)',
      glowColor: 'rgba(56, 189, 248, 0.25)',
      Icon: Cloud,
      badgeText: 'AWS S3 Secured',
    };
  }

  if (title.includes('java') || title.includes('spring') || title.includes('code') || title.includes('dev')) {
    return {
      category: 'Software Development',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      Icon: Code,
      badgeText: 'Backend Engineering',
    };
  }

  if (title.includes('data') || title.includes('sql') || title.includes('db')) {
    return {
      category: 'Data Infrastructure',
      gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      Icon: Database,
      badgeText: 'Encrypted Data',
    };
  }

  return {
    category: 'Technical Course',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    Icon: Server,
    badgeText: 'Protected Content',
  };
};
