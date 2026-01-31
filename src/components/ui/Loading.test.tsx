import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner, Loading } from './Loading';

describe('Spinner', () => {
  it('renders correctly', () => {
    render(<Spinner />);
    const spinner = document.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('has animate-spin class for animation', () => {
    render(<Spinner />);
    const spinner = document.querySelector('svg');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('applies small size styles', () => {
    render(<Spinner size="sm" />);
    const spinner = document.querySelector('svg');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('applies medium size styles by default', () => {
    render(<Spinner />);
    const spinner = document.querySelector('svg');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('applies large size styles', () => {
    render(<Spinner size="lg" />);
    const spinner = document.querySelector('svg');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('applies custom className', () => {
    render(<Spinner className="custom-spinner" />);
    const spinner = document.querySelector('svg');
    expect(spinner).toHaveClass('custom-spinner');
  });

  it('has amber color by default', () => {
    render(<Spinner />);
    const spinner = document.querySelector('svg');
    expect(spinner).toHaveClass('text-amber-600');
  });
});

describe('Loading', () => {
  it('renders with default message', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<Loading message="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('contains a Spinner component', () => {
    render(<Loading />);
    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Loading className="custom-loading" />);
    const container = screen.getByText('Loading...').parentElement;
    expect(container).toHaveClass('custom-loading');
  });

  it('has centered flex layout', () => {
    render(<Loading />);
    const container = screen.getByText('Loading...').parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });

  it('uses large spinner', () => {
    render(<Loading />);
    const spinner = document.querySelector('svg');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });
});
