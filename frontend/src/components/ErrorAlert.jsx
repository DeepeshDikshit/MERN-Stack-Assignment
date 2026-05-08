import './ErrorAlert.css';

export const ErrorAlert = ({ message }) => {
  return (
    <div className="error-alert">
      <span className="error-icon">⚠️</span>
      <div className="error-content">
        <p className="error-title">Error</p>
        <p className="error-message">{message}</p>
      </div>
    </div>
  );
};
