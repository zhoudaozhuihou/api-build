import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(React.createElement(Button, { text: 'Click Me' }));
  expect(screen.getByText(/click me/i)).toBeInTheDocument();
});

test('uses correct variant and color', () => {
  render(React.createElement(Button, { 
    text: 'Test Button', 
    variant: 'outlined', 
    color: 'secondary' 
  }));
  
  const button = screen.getByText(/test button/i);
  expect(button).toHaveClass('MuiButton-outlined');
  expect(button).toHaveClass('MuiButton-outlinedSecondary');
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  
  render(React.createElement(Button, { 
    text: 'Click Button', 
    onClick: handleClick 
  }));
  
  fireEvent.click(screen.getByText(/click button/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
}); 