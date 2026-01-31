'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  rightContent?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Collapsible({
  title,
  icon,
  defaultOpen = true,
  rightContent,
  children,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn('border-b border-stone-200 dark:border-stone-700 last:border-b-0', className)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 min-h-[56px]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
              {icon}
            </span>
          )}
          <span className="font-semibold text-stone-900 dark:text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {rightContent}
          <svg
            className={cn(
              'h-5 w-5 text-stone-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
