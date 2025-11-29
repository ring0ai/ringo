import React from 'react';

export enum PillVariant {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
}

export enum PillSize {
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
}

const variantStyles: Record<PillVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border border-gray-300',
  primary: 'bg-blue-100 text-blue-800 border border-blue-300',
  secondary: 'bg-purple-100 text-purple-800 border border-purple-300',
  success: 'bg-green-100 text-green-800 border border-green-300',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  error: 'bg-red-100 text-red-800 border border-red-300',
  info: 'bg-cyan-100 text-cyan-800 border border-cyan-300',
};

const sizeStyles: Record<PillSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

interface PillProps {
  variant?: PillVariant;
  size?: PillSize;
  children: React.ReactNode;
  className?: string;
}

const Pill: React.FC<PillProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-colors';

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant as PillVariant]} ${
        sizeStyles[size as PillSize]
      } ${className} capitalize`}
    >
      {children}
    </span>
  );
};

export default Pill;
