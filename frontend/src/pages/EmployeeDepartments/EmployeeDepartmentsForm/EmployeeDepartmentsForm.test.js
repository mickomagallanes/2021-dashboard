import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeeDepartmentsForm from './EmployeeDepartmentsForm';

describe('<EmployeeDepartmentsForm />', () => {
  test('it should mount', () => {
    render(<EmployeeDepartmentsForm />);
    
    const employeeDepartmentsForm = screen.getByTestId('EmployeeDepartmentsForm');

    expect(employeeDepartmentsForm).toBeInTheDocument();
  });
});