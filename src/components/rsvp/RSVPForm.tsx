'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import type { RSVP } from '@/types';

interface RSVPFormProps {
  isOpen: boolean;
  onClose: () => void;
  weekId: string;
  existingRsvp?: RSVP;
  onSuccess: (rsvp: RSVP) => void;
  onDelete?: () => void;
}

export function RSVPForm({
  isOpen,
  onClose,
  weekId,
  existingRsvp,
  onSuccess,
  onDelete,
}: RSVPFormProps) {
  const [adultCount, setAdultCount] = useState(existingRsvp?.adultCount ?? 2);
  const [childCount, setChildCount] = useState(existingRsvp?.childCount ?? 0);
  const [notes, setNotes] = useState(existingRsvp?.notes ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekId,
          adultCount,
          childCount,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save RSVP');
      }

      onSuccess(data.data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingRsvp || !onDelete) return;

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/rsvps?weekId=${weekId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete RSVP');
      }

      onDelete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCountChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number,
    currentValue: number
  ) => {
    const newValue = Math.max(0, currentValue + delta);
    setter(newValue);
  };

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

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {existingRsvp && onDelete && (
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
