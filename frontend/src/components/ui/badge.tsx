import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'success';
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80',
    outline: 'border border-zinc-200 text-zinc-950 hover:bg-zinc-100',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
