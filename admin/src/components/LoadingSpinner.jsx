const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  return (
    <div className="loading-spinner">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className={`spinner ${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600`}></div>
          <div className={`spinner absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-purple-600 animate-spin`} 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="text-gray-600 font-medium animate-pulse">
          {text}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
