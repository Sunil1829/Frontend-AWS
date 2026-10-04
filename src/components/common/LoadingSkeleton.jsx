const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="courses-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-banner"></div>
          <div className="skeleton-body">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line title"></div>
            <div className="skeleton-line desc"></div>
            <div className="skeleton-line desc-short"></div>
            <div className="skeleton-btn"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
