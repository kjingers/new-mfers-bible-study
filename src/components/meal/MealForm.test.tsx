import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MealForm } from './MealForm';
import type { Meal } from '@/types';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('MealForm', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    weekId: 'week-1',
    isOwner: false,
    onSuccess: vi.fn(),
  };

  const mockMeal: Meal = {
    id: 'meal-1',
    weekId: 'week-1',
    familyId: 'family-1',
    familyName: 'Smith',
    description: 'Tacos and salad',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockMeal }),
    });
  });

  it('does not render when isOpen is false', () => {
    render(<MealForm {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders signup form when no existing meal', () => {
    render(<MealForm {...defaultProps} />);
    expect(screen.getByText('Sign Up to Bring Meal')).toBeInTheDocument();
    expect(screen.getByLabelText(/what are you bringing/i)).toBeInTheDocument();
  });

  it('renders update form when existing meal and user is owner', () => {
    render(<MealForm {...defaultProps} existingMeal={mockMeal} isOwner={true} />);
    expect(screen.getByText('Update Meal Signup')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tacos and salad')).toBeInTheDocument();
  });

  it('shows info message when meal exists but user is not owner', () => {
    render(<MealForm {...defaultProps} existingMeal={mockMeal} isOwner={false} />);
    expect(screen.getByText('Meal Already Assigned')).toBeInTheDocument();
    expect(screen.getByText('Smith is bringing the meal')).toBeInTheDocument();
    expect(screen.getByText('Tacos and salad')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked (non-owner view)', () => {
    const onClose = vi.fn();
    render(
      <MealForm {...defaultProps} existingMeal={mockMeal} isOwner={false} onClose={onClose} />
    );

    // Click the explicit "Close" button text (not the modal X button)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows error when submitting with only whitespace', async () => {
    render(<MealForm {...defaultProps} />);

    // Enter whitespace only
    const input = screen.getByLabelText(/what are you bringing/i);
    fireEvent.change(input, { target: { value: '   ' } });

    // Button should still be disabled because we trim and check
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    expect(submitButton).toBeDisabled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('submits meal signup successfully', async () => {
    const onSuccess = vi.fn();
    const onClose = vi.fn();

    render(<MealForm {...defaultProps} onSuccess={onSuccess} onClose={onClose} />);

    const input = screen.getByLabelText(/what are you bringing/i);
    fireEvent.change(input, { target: { value: 'Pizza and drinks' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekId: 'week-1',
          description: 'Pizza and drinks',
        }),
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockMeal);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('shows error message when API fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Another family has already signed up' }),
    });

    render(<MealForm {...defaultProps} />);

    const input = screen.getByLabelText(/what are you bringing/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Another family has already signed up');
    });
  });

  it('handles meal deletion', async () => {
    const onDelete = vi.fn();
    const onClose = vi.fn();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Deleted' }),
    });

    render(
      <MealForm
        {...defaultProps}
        existingMeal={mockMeal}
        isOwner={true}
        onDelete={onDelete}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel signup/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/meals?weekId=week-1', {
        method: 'DELETE',
      });
    });

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('shows cancel button only for owner with existing meal', () => {
    render(
      <MealForm {...defaultProps} existingMeal={mockMeal} isOwner={true} onDelete={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /cancel signup/i })).toBeInTheDocument();
  });

  it('does not show cancel button when not owner', () => {
    // For non-owner, it shows the info view instead
    render(<MealForm {...defaultProps} existingMeal={mockMeal} isOwner={false} />);
    expect(screen.queryByRole('button', { name: /cancel signup/i })).not.toBeInTheDocument();
  });

  it('disables submit button when description is empty', () => {
    render(<MealForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
  });

  it('enables submit button when description has content', () => {
    render(<MealForm {...defaultProps} />);

    const input = screen.getByLabelText(/what are you bringing/i);
    fireEvent.change(input, { target: { value: 'Something' } });

    expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
  });
});
