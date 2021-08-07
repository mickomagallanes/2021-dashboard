import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RoutesForm from './RoutesForm';

describe('<RoutesForm />', () => {
  test('it should mount', () => {
    render(<RoutesForm />);
    
    const routesForm = screen.getByTestId('RoutesForm');

    expect(routesForm).toBeInTheDocument();
  });
});