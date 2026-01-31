import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MealForm } from './MealForm';
import type { Meal } from '@/types';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

// Wrapper component for tests
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('MealForm', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    weekId: 'week-1',
    isOwner: false,
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
    render(
      <TestWrapper>
        <MealForm {...defaultProps} isOpen={false} />
      </TestWrapper>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders signup form when no existing meal', () => {
    render(
      <TestWrapper>
        <MealForm {...defaultProps} />
      </TestWrapper>
    );
    expect(screen.getByText('Sign Up to Bring Meal')).toBeInTheDocument();
    expect(screen.getByLabelText(/what are you bringing/i)).toBeInTheDocument();
  });

  it('renders update form when existing meal and user is owner', () => {
    render(
      <TestWrapper>
        <MealForm {...defaultProps} existingMeal={mockMeal} isOwner={true} />
      </TestWrapper>
    );
    expect(screen.getByText('Update Meal Signup')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tacos and salad')).toBeInTheDocument();
  });

  it('shows info message when meal exists but user is not owner', () => {
    render(
      <TestWrapper>
        <MealForm {...defaultProps} existingMeal={mockMeal} isOwner={false} />
      </TestWrapper>
    );
    expect(screen.getByText('Meal Already Assigned')).toBeInTheDocument();
    expect(screen.getByText('Smith is bringing the meal')).toBeInTheDocument();
    expect(screen.getByText('Tacos and salad')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked (non-owner view)', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <MealForm {...defaultProps} existingMeal={mockMeal} isOwner={false} onClose={onClose} />
      </TestWrapper>
    );

    // Click the explicit "Close" button text (not the modal X button)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows disabled button when submitting with only whitespace', () => {
    render(
      <TestWrapper>
        <MealForm {...defaultProps} />
      </TestWrapper>
    );

    // Enter whitespace only
    const input = screen.getByLabelText(/what are you bringing/i);
    fireEvent.change(input, { target: { value: '   ' } });

    // Button should still be disabled because we trim and check
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    expect(submitButton).toBeDisabled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('submits meal signup successfully', async () => {
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <MealForm {...defaultProps} onClose={onClose} />
      </TestWrapper>
    );

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
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('shows cancel button only for owner with existing meal', () => {
    render(
      <TestWrapper>
        <MealForm {...defaultProps} existingMeal={mockMeal} isOwner={true} />
      </TestWrapper>
    );
    expect(screen.getByRole('button', { name: /cancel signup/i })).toBeInTheDocument();
  });

  it('does not show cancel button when not owner', () => {
    // For non-owner, it shows the info view instead
    render(
      <TestWrapper>
        <MealForm {...defaultProps} existingMeal={mockMeal} isOwner={false} />
      </TestWrapper>
    );
    expect(screen.queryByRole('button', { name: /cancel signup/i })).not.toBeInTheDocument();
  });

  it('disables submit button when description is empty', () => {
    render(
      <TestWrapper>
        <MealForm {...defaultProps} />
      </TestWrapper>
    );
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
  });

  it('enables submit button when description has content', () => {
    render(
      <TestWrapper>
        <MealForm {...defaultProps} />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/what are you bringing/i);
    fireEvent.change(input, { target: { value: 'Something' } });

    expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
  });
});
