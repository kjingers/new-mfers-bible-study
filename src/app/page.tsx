import { Button } from '@/components/ui';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo/Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
          <svg
            className="h-10 w-10 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-3xl font-bold text-stone-900 dark:text-white">
          Tuesday Bible Study
        </h1>
        <p className="mb-8 text-stone-600 dark:text-stone-400">
          Welcome to our weekly gathering
        </p>

        {/* Action Button */}
        <Button size="lg" className="w-full">
          Enter with Family Code
        </Button>

        {/* Status */}
        <div className="mt-8 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              App is running
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-stone-400">
          Made with love for Tuesday nights
        </p>
      </div>
    </main>
  );
}
