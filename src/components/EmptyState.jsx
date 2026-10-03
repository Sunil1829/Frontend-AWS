import { FolderOpen, RefreshCw } from 'lucide-react';

const EmptyState = ({
  title = 'No Courses Found',
  description = 'There are currently no courses available in the system.',
  onRetry,
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-icon-wrapper">
        <FolderOpen size={48} className="empty-icon" />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          <RefreshCw size={16} />
          <span>Refresh Data</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
