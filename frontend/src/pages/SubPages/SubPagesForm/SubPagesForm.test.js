import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SubPagesForm from './SubPagesForm';

describe('<SubPagesForm />', () => {
  test('it should mount', () => {
    render(<SubPagesForm />);
    
    const subPagesForm = screen.getByTestId('SubPagesForm');

    expect(subPagesForm).toBeInTheDocument();
  });
});