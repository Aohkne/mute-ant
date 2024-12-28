export const Alert: React.FC<{ children: React.ReactNode; variant?: string; className?: string }> = ({ children, className }) => (
  <div className={`alert ${className}`}>{children}</div>
);

export const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="alert-title">{children}</h4>
);