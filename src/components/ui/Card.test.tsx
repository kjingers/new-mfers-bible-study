import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    render(<Card>Div Card</Card>);
    const card = screen.getByText('Div Card').parentElement || screen.getByText('Div Card');
    // The text node's container should be the card div
    expect(card.tagName).toBe('DIV');
  });

  it('renders as a button when onClick is provided', () => {
    render(<Card onClick={() => {}}>Button Card</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Card onClick={handleClick}>Clickable Card</Card>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies interactive styles when interactive prop is true', () => {
    render(<Card interactive>Interactive Card</Card>);
    const card = screen.getByText('Interactive Card').closest('div');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom Card</Card>);
    const card = screen.getByText('Custom Card').closest('div');
    expect(card).toHaveClass('custom-class');
  });

  it('has base styling classes', () => {
    render(<Card>Styled Card</Card>);
    const card = screen.getByText('Styled Card').closest('div');
    expect(card).toHaveClass('rounded-xl', 'bg-white', 'shadow-sm');
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = screen.getByText('Header');
    expect(header).toHaveClass('custom-header');
  });

  it('has default margin class', () => {
    render(<CardHeader>Margin Header</CardHeader>);
    const header = screen.getByText('Margin Header');
    expect(header).toHaveClass('mb-3');
  });
});

describe('CardTitle', () => {
  it('renders children correctly', () => {
    render(<CardTitle>Title Content</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title Content');
  });

  it('renders as h3 element', () => {
    render(<CardTitle>Heading Title</CardTitle>);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardTitle className="custom-title">Custom Title</CardTitle>);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveClass('custom-title');
  });
});

describe('CardDescription', () => {
  it('renders children correctly', () => {
    render(<CardDescription>Description Content</CardDescription>);
    expect(screen.getByText('Description Content')).toBeInTheDocument();
  });

  it('applies text styling classes', () => {
    render(<CardDescription>Styled Description</CardDescription>);
    const description = screen.getByText('Styled Description');
    expect(description).toHaveClass('text-sm', 'text-stone-500');
  });

  it('applies custom className', () => {
    render(<CardDescription className="custom-desc">Custom Description</CardDescription>);
    const description = screen.getByText('Custom Description');
    expect(description).toHaveClass('custom-desc');
  });
});

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(<CardContent>Content Area</CardContent>);
    expect(screen.getByText('Content Area')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardContent className="custom-content">Custom Content</CardContent>);
    const content = screen.getByText('Custom Content');
    expect(content).toHaveClass('custom-content');
  });
});

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies flexbox layout classes', () => {
    render(<CardFooter>Flex Footer</CardFooter>);
    const footer = screen.getByText('Flex Footer');
    expect(footer).toHaveClass('flex', 'items-center', 'justify-end');
  });

  it('applies custom className', () => {
    render(<CardFooter className="custom-footer">Custom Footer</CardFooter>);
    const footer = screen.getByText('Custom Footer');
    expect(footer).toHaveClass('custom-footer');
  });
});
