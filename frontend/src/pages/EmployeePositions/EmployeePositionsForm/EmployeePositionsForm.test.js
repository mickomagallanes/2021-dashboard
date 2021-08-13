import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeePositionsForm from './EmployeePositionsForm';

describe('<EmployeePositionsForm />', () => {
  test('it should mount', () => {
    render(<EmployeePositionsForm />);
    
    const employeePositionsForm = screen.getByTestId('EmployeePositionsForm');

    expect(employeePositionsForm).toBeInTheDocument();
  });
});