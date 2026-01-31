'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { useSubmitRSVP, useDeleteRSVP } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import type { RSVP } from '@/types';

interface RSVPFormProps {
  isOpen: boolean;
  onClose: () => void;
  weekId: string;
  existingRsvp?: RSVP;
}

export function RSVPForm({ isOpen, onClose, weekId, existingRsvp }: RSVPFormProps) {
  const { family } = useAuth();
  // Initialize state from props - modal closes between edits so component remounts
  const [adultCount, setAdultCount] = useState(existingRsvp?.adultCount ?? 2);
  const [childCount, setChildCount] = useState(existingRsvp?.childCount ?? 0);
  const [notes, setNotes] = useState(existingRsvp?.notes ?? '');

  const submitMutation = useSubmitRSVP();
  const deleteMutation = useDeleteRSVP(weekId, family?.id ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    submitMutation.mutate(
      {
        weekId,
        adultCount,
        childCount,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!existingRsvp) return;

    deleteMutation.mutate(existingRsvp.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleCountChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number,
    currentValue: number
  ) => {
    const newValue = Math.max(0, currentValue + delta);
    setter(newValue);
  };

  const isSubmitting = submitMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingRsvp ? 'Update RSVP' : 'RSVP for This Week'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Adult Count */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
            Adults
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleCountChange(setAdultCount, -1, adultCount)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-xl font-bold text-stone-700 transition-colors hover:bg-stone-200 active:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
              aria-label="Decrease adult count"
            >
              -
            </button>
            <span className="w-12 text-center text-2xl font-bold text-stone-900 dark:text-white">
              {adultCount}
            </span>
            <button
              type="button"
              onClick={() => handleCountChange(setAdultCount, 1, adultCount)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-xl font-bold text-stone-700 transition-colors hover:bg-stone-200 active:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
              aria-label="Increase adult count"
            >
              +
            </button>
          </div>
        </div>

        {/* Child Count */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
            Children
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleCountChange(setChildCount, -1, childCount)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-xl font-bold text-stone-700 transition-colors hover:bg-stone-200 active:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
              aria-label="Decrease child count"
            >
              -
            </button>
            <span className="w-12 text-center text-2xl font-bold text-stone-900 dark:text-white">
              {childCount}
            </span>
            <button
              type="button"
              onClick={() => handleCountChange(setChildCount, 1, childCount)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-xl font-bold text-stone-700 transition-colors hover:bg-stone-200 active:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
              aria-label="Increase child count"
            >
              +
            </button>
          </div>
        </div>

        {/* Notes */}
        <Input
          label="Notes (optional)"
          placeholder="e.g., Arriving late, bringing a guest..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Actions */}
        <div className="flex gap-3">
          {existingRsvp && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel RSVP
            </Button>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isDeleting || (adultCount === 0 && childCount === 0)}
            className="flex-1"
          >
            {existingRsvp ? 'Update' : 'RSVP'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
