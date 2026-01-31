import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui';
import { weekKeys } from './useWeekQuery';
import type { RSVP, WeekWithDetails } from '@/types';

/**
 * Query key factory for RSVPs.
 */
export const rsvpKeys = {
  all: ['rsvps'] as const,
  week: (weekId: string) => [...rsvpKeys.all, weekId] as const,
};

interface RSVPRequest {
  weekId: string;
  adultCount: number;
  childCount: number;
  notes?: string;
}

interface RSVPResponse {
  data: RSVP;
  error?: string;
}

/**
 * Create or update an RSVP.
 */
async function submitRSVP(request: RSVPRequest): Promise<RSVPResponse> {
  const response = await fetch('/api/rsvps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit RSVP');
  }
  return response.json();
}

/**
 * Delete an RSVP.
 */
async function deleteRSVP(rsvpId: string): Promise<void> {
  const response = await fetch(`/api/rsvps?id=${rsvpId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete RSVP');
  }
}

/**
 * Hook to submit (create/update) an RSVP.
 * Automatically updates the week cache on success.
 *
 * @example
 * const mutation = useSubmitRSVP();
 * mutation.mutate({ weekId: 'week-123', adultCount: 2, childCount: 1 });
 */
export function useSubmitRSVP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitRSVP,
    onSuccess: (response, variables) => {
      const newRsvp = response.data;

      // Optimistically update the week detail cache
      queryClient.setQueryData(
        weekKeys.detail(variables.weekId),
        (old: { data: WeekWithDetails } | undefined) => {
          if (!old?.data) return old;

          const existingIndex = old.data.rsvps.findIndex((r) => r.id === newRsvp.id);
          const newRsvps =
            existingIndex >= 0
              ? old.data.rsvps.map((r, i) => (i === existingIndex ? newRsvp : r))
              : [...old.data.rsvps, newRsvp];

          const totalAdults = newRsvps.reduce((sum, r) => sum + r.adultCount, 0);
          const totalChildren = newRsvps.reduce((sum, r) => sum + r.childCount, 0);

          return {
            ...old,
            data: { ...old.data, rsvps: newRsvps, totalAdults, totalChildren },
          };
        }
      );

      // Also invalidate current week in case it's the same
      queryClient.invalidateQueries({ queryKey: weekKeys.current() });

      toast.success('RSVP saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save RSVP');
    },
  });
}

/**
 * Hook to delete an RSVP.
 * Automatically updates the week cache on success.
 *
 * @param weekId - The week ID for cache invalidation
 * @param familyId - The family ID to remove from cache
 */
export function useDeleteRSVP(weekId: string, familyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRSVP,
    onSuccess: () => {
      // Update the week detail cache
      queryClient.setQueryData(
        weekKeys.detail(weekId),
        (old: { data: WeekWithDetails } | undefined) => {
          if (!old?.data) return old;

          const newRsvps = old.data.rsvps.filter((r) => r.familyId !== familyId);
          const totalAdults = newRsvps.reduce((sum, r) => sum + r.adultCount, 0);
          const totalChildren = newRsvps.reduce((sum, r) => sum + r.childCount, 0);

          return {
            ...old,
            data: { ...old.data, rsvps: newRsvps, totalAdults, totalChildren },
          };
        }
      );

      // Also invalidate current week
      queryClient.invalidateQueries({ queryKey: weekKeys.current() });

      toast.success('RSVP removed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove RSVP');
    },
  });
}
