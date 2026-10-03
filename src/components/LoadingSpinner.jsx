import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading content...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner-wrapper">
        <Loader2 className="spinner-icon" size={36} />
        <p className="spinner-text">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
