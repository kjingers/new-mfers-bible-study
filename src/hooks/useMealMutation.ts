import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui';
import { weekKeys } from './useWeekQuery';
import type { Meal, WeekWithDetails } from '@/types';

/**
 * Query key factory for meals.
 */
export const mealKeys = {
  all: ['meals'] as const,
  week: (weekId: string) => [...mealKeys.all, weekId] as const,
};

interface MealRequest {
  weekId: string;
  description: string;
}

interface MealResponse {
  data: Meal;
  error?: string;
}

/**
 * Create or update a meal signup.
 */
async function submitMeal(request: MealRequest): Promise<MealResponse> {
  const response = await fetch('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign up for meal');
  }
  return response.json();
}

/**
 * Delete a meal signup.
 */
async function deleteMeal(mealId: string): Promise<void> {
  const response = await fetch(`/api/meals?id=${mealId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove meal signup');
  }
}

/**
 * Hook to submit (create/update) a meal signup.
 * Automatically updates the week cache on success.
 *
 * @example
 * const mutation = useSubmitMeal();
 * mutation.mutate({ weekId: 'week-123', description: 'Tacos!' });
 */
export function useSubmitMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitMeal,
    onSuccess: (response, variables) => {
      const newMeal = response.data;

      // Update the week detail cache
      queryClient.setQueryData(
        weekKeys.detail(variables.weekId),
        (old: { data: WeekWithDetails } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: { ...old.data, meal: newMeal },
          };
        }
      );

      // Also invalidate current week
      queryClient.invalidateQueries({ queryKey: weekKeys.current() });

      toast.success('Meal signup saved!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sign up for meal');
    },
  });
}

/**
 * Hook to delete a meal signup.
 * Automatically updates the week cache on success.
 *
 * @param weekId - The week ID for cache invalidation
 */
export function useDeleteMeal(weekId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      // Update the week detail cache
      queryClient.setQueryData(
        weekKeys.detail(weekId),
        (old: { data: WeekWithDetails } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: { ...old.data, meal: undefined },
          };
        }
      );

      // Also invalidate current week
      queryClient.invalidateQueries({ queryKey: weekKeys.current() });

      toast.success('Meal signup removed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove meal signup');
    },
  });
}
