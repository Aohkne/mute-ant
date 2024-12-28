// Update your Textarea component definition
import React from 'react';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ children, ...props }, ref) => (
    <textarea ref={ref} {...props}>
      {children}
    </textarea>
  )
);

Textarea.displayName = 'Textarea';
