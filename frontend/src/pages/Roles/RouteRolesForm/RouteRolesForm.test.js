import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RouteRolesForm from './RouteRolesForm';

describe('<RouteRolesForm />', () => {
  test('it should mount', () => {
    render(<RouteRolesForm />);
    
    const routeRolesForm = screen.getByTestId('RouteRolesForm');

    expect(routeRolesForm).toBeInTheDocument();
  });
});