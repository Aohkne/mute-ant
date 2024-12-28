// Update your ScrollArea component definition
import React from 'react';

export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
);

ScrollArea.displayName = 'ScrollArea';
