import { HTMLAttributes } from 'react';

// Card Component
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Progress Component
interface ProgressProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Progress({ value, className = '', style }: ProgressProps) {
  return (
    <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-[#EECE84] transition-all duration-300 ease-in-out"
        style={{
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          ...style
        }}
      />
    </div>
  );
}

// UserButton Component
interface UserButtonProps {
  username: string;
  className?: string;
}

export function UserButton({ username, className = '' }: UserButtonProps) {
  const initials = username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-[#EECE84] flex items-center justify-center">
          <span className="text-[#1a1a2e] font-medium text-sm">{initials}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">ATPS User</span>
        <span className="text-xs">@{username}</span>
      </div>
    </div>
  );
}