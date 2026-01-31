'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        className: 'font-sans',
        style: {
          fontFamily: 'var(--font-geist-sans)',
        },
      }}
    />
  );
}

// Re-export toast function for convenience
export { toast } from 'sonner';
