import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeeDepartments from './EmployeeDepartments';

describe('<EmployeeDepartments />', () => {
  test('it should mount', () => {
    render(<EmployeeDepartments />);
    
    const employeeDepartments = screen.getByTestId('EmployeeDepartments');

    expect(employeeDepartments).toBeInTheDocument();
  });
});