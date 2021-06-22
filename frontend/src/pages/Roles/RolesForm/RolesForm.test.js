import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RolesForm from './RolesForm';

describe('<RolesForm />', () => {
  test('it should mount', () => {
    render(<RolesForm />);
    
    const rolesForm = screen.getByTestId('RolesForm');

    expect(rolesForm).toBeInTheDocument();
  });
});