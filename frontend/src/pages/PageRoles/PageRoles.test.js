import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageRoles from './PageRoles';

describe('<PageRoles />', () => {
  test('it should mount', () => {
    render(<PageRoles />);
    
    const pageRoles = screen.getByTestId('PageRoles');

    expect(pageRoles).toBeInTheDocument();
  });
});