export const Avatar: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`avatar ${className}`}>{children}</div>
);

export const AvatarImage: React.FC<{ src?: string; alt?: string }> = ({ src, alt }) => <img src={src || ''} alt={alt || 'Avatar'} className="avatar-image" />;

export const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="avatar-fallback">{children}</div>;