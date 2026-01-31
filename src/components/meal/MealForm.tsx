'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { useSubmitMeal, useDeleteMeal } from '@/hooks';
import type { Meal } from '@/types';

interface MealFormProps {
  isOpen: boolean;
  onClose: () => void;
  weekId: string;
  existingMeal?: Meal;
  isOwner: boolean; // Whether the current user owns this meal signup
}

export function MealForm({ isOpen, onClose, weekId, existingMeal, isOwner }: MealFormProps) {
  // Initialize state from props - modal closes between edits so component remounts
  const [description, setDescription] = useState(existingMeal?.description ?? '');

  const submitMutation = useSubmitMeal();
  const deleteMutation = useDeleteMeal(weekId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      return;
    }

    submitMutation.mutate(
      {
        weekId,
        description: description.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!existingMeal) return;

    deleteMutation.mutate(existingMeal.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isSubmitting = submitMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  // If there's an existing meal and current user is not the owner, don't show form
  if (existingMeal && !isOwner) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Meal Already Assigned">
        <div className="space-y-4">
          <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
            <p className="font-medium text-stone-900 dark:text-white">
              {existingMeal.familyName} is bringing the meal
            </p>
            <p className="mt-1 text-stone-600 dark:text-stone-400">{existingMeal.description}</p>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Only one family can sign up per week. Contact {existingMeal.familyName} if you&apos;d
            like to swap.
          </p>
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingMeal ? 'Update Meal Signup' : 'Sign Up to Bring Meal'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meal Description */}
        <div>
          <Input
            label="What are you bringing?"
            placeholder="e.g., Tacos, salad, and drinks"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Let everyone know what to expect for dinner!
          </p>
        </div>

        {/* Meal suggestions */}
        <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            💡 Tips for a great meal:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
            <li>• Plan for the expected attendees based on RSVPs</li>
            <li>• Kid-friendly options are always appreciated</li>
            <li>• Check for dietary restrictions with the group</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {existingMeal && isOwner && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel Signup
            </Button>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isDeleting || !description.trim()}
            className="flex-1"
          >
            {existingMeal ? 'Update' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
