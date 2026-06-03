import React from 'react';
import { cn } from '../../utils/cn';
import { Heading } from './Heading';
import { Text } from './Text';

interface FormWrapperProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  description,
  children,
  className,
  ...props
}) => {
  return (
    <form
      className={cn('w-full space-y-6', className)}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-border-primary pb-6 mb-6">
          {title && (
            <Heading
              variant="h3"
              className="text-2xl font-medium tracking-tight mb-2"
            >
              {title}
            </Heading>
          )}
          {description && (
            <Text
              variant="body"
              className="text-secondary-text"
            >
              {description}
            </Text>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </form>
  );
};
export default FormWrapper;
