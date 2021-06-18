import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RouteRoles from './RouteRoles';

describe('<RouteRoles />', () => {
  test('it should mount', () => {
    render(<RouteRoles />);
    
    const routeRoles = screen.getByTestId('RouteRoles');

    expect(routeRoles).toBeInTheDocument();
  });
});