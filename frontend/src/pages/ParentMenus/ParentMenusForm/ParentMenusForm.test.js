import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ParentMenusForm from './ParentMenusForm';

describe('<ParentMenusForm />', () => {
  test('it should mount', () => {
    render(<ParentMenusForm />);
    
    const parentMenusForm = screen.getByTestId('ParentMenusForm');

    expect(parentMenusForm).toBeInTheDocument();
  });
});