import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Routes from './Routes';

describe('<Routes />', () => {
  test('it should mount', () => {
    render(<Routes />);
    
    const routes = screen.getByTestId('Routes');

    expect(routes).toBeInTheDocument();
  });
});