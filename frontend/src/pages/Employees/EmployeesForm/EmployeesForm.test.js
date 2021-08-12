import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeesForm from './EmployeesForm';

describe('<EmployeesForm />', () => {
  test('it should mount', () => {
    render(<EmployeesForm />);
    
    const employeesForm = screen.getByTestId('EmployeesForm');

    expect(employeesForm).toBeInTheDocument();
  });
});