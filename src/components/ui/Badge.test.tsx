import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-stone-100');
  });

  it('applies success variant styles', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('applies warning variant styles', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-amber-100');
  });

  it('applies danger variant styles', () => {
    render(<Badge variant="danger">Danger</Badge>);
    const badge = screen.getByText('Danger');
    expect(badge).toHaveClass('bg-red-100');
  });

  it('applies info variant styles', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText('Info');
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('applies small size styles', () => {
    render(<Badge size="sm">Small</Badge>);
    const badge = screen.getByText('Small');
    expect(badge).toHaveClass('text-xs');
  });

  it('applies medium size styles by default', () => {
    render(<Badge>Medium</Badge>);
    const badge = screen.getByText('Medium');
    expect(badge).toHaveClass('text-sm');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('renders as a span element', () => {
    render(<Badge>Span Badge</Badge>);
    const badge = screen.getByText('Span Badge');
    expect(badge.tagName).toBe('SPAN');
  });

  it('has rounded-full class for pill shape', () => {
    render(<Badge>Pill</Badge>);
    const badge = screen.getByText('Pill');
    expect(badge).toHaveClass('rounded-full');
  });
});
