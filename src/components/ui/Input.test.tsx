import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Input label="First Name" />);
    const input = screen.getByLabelText('First Name');
    expect(input).toHaveAttribute('id', 'first-name');
  });

  it('uses provided id over generated id', () => {
    render(<Input label="Email" id="custom-email-id" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'custom-email-id');
  });

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error prop is provided', () => {
    render(<Input error="Error" placeholder="Error Input" />);
    const input = screen.getByPlaceholderText('Error Input');
    expect(input).toHaveClass('border-red-500');
  });

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} placeholder="Type here" />);
    await user.type(screen.getByPlaceholderText('Type here'), 'Hello');

    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled Input" />);
    expect(screen.getByPlaceholderText('Disabled Input')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" placeholder="Custom Input" />);
    expect(screen.getByPlaceholderText('Custom Input')).toHaveClass('custom-input');
  });

  it('supports different input types', () => {
    render(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} placeholder="Ref Input" />);
    expect(ref).toHaveBeenCalled();
  });

  it('has proper focus styling classes', () => {
    render(<Input placeholder="Focus Input" />);
    const input = screen.getByPlaceholderText('Focus Input');
    expect(input).toHaveClass('focus:border-amber-500', 'focus:ring-2');
  });

  it('has proper disabled styling classes', () => {
    render(<Input disabled placeholder="Disabled Styling" />);
    const input = screen.getByPlaceholderText('Disabled Styling');
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });
});
