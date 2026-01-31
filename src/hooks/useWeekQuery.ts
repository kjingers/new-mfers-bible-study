import { useQuery } from '@tanstack/react-query';
import type { WeekWithDetails } from '@/types';

/**
 * Query key factory for weeks - enables cache management and invalidation.
 */
export const weekKeys = {
  all: ['weeks'] as const,
  current: () => [...weekKeys.all, 'current'] as const,
  details: () => [...weekKeys.all, 'detail'] as const,
  detail: (weekId: string) => [...weekKeys.details(), weekId] as const,
};

interface CurrentWeekResponse {
  data: WeekWithDetails | null;
  isCurrentWeek?: boolean;
  study?: { title: string };
  message?: string;
  error?: string;
}

interface WeekResponse {
  data: WeekWithDetails | null;
  prevWeek: { id: string; weekNumber: number } | null;
  nextWeek: { id: string; weekNumber: number } | null;
  error?: string;
}

/**
 * Fetch the current/upcoming week.
 */
async function fetchCurrentWeek(): Promise<CurrentWeekResponse> {
  const response = await fetch('/api/weeks/current');
  if (!response.ok) {
    throw new Error('Failed to fetch current week');
  }
  return response.json();
}

/**
 * Fetch a specific week by ID.
 */
async function fetchWeek(weekId: string): Promise<WeekResponse> {
  const response = await fetch(`/api/weeks/${weekId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch week');
  }
  return response.json();
}

/**
 * Hook to fetch the current/upcoming week.
 *
 * @example
 * const { data, isLoading, error } = useCurrentWeek();
 * if (isLoading) return <Skeleton />;
 * if (data?.data) return <WeekCard week={data.data} />;
 */
export function useCurrentWeek() {
  return useQuery({
    queryKey: weekKeys.current(),
    queryFn: fetchCurrentWeek,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a specific week by ID.
 *
 * @param weekId - The week ID to fetch
 * @example
 * const { data, isLoading, error } = useWeek('week-123');
 */
export function useWeek(weekId: string | undefined) {
  return useQuery({
    queryKey: weekKeys.detail(weekId ?? ''),
    queryFn: () => fetchWeek(weekId!),
    enabled: !!weekId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
