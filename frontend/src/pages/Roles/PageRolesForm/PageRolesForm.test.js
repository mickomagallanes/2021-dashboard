import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageRolesForm from './PageRolesForm';

describe('<PageRolesForm />', () => {
  test('it should mount', () => {
    render(<PageRolesForm />);
    
    const pageRolesForm = screen.getByTestId('PageRolesForm');

    expect(pageRolesForm).toBeInTheDocument();
  });
});