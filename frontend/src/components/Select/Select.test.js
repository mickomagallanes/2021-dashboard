import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Select from './Select';

describe('<Select />', () => {
  test('it should mount', () => {
    render(<Select />);
    
    const select = screen.getByTestId('Select');

    expect(select).toBeInTheDocument();
  });
});