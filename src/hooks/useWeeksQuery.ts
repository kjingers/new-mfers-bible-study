import { useQuery } from '@tanstack/react-query';
import type { WeekWithDetails, Study } from '@/types';

/**
 * Query key factory for weeks list.
 */
export const weeksKeys = {
  all: ['weeks', 'list'] as const,
};

interface WeeksResponse {
  data: WeekWithDetails[];
  study: Study | null;
  message?: string;
  error?: string;
}

/**
 * Fetch all weeks for the active study.
 */
async function fetchWeeks(): Promise<WeeksResponse> {
  const response = await fetch('/api/weeks');
  if (!response.ok) {
    throw new Error('Failed to fetch weeks');
  }
  return response.json();
}

/**
 * Hook to fetch all weeks for the active study with details.
 *
 * @example
 * const { data, isLoading, error } = useWeeks();
 * if (isLoading) return <Skeleton />;
 * if (data?.data) return data.data.map(week => <WeekCard key={week.id} week={week} />);
 */
export function useWeeks() {
  return useQuery({
    queryKey: weeksKeys.all,
    queryFn: fetchWeeks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
