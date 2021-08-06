import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeePositions from './EmployeePositions';

describe('<EmployeePositions />', () => {
  test('it should mount', () => {
    render(<EmployeePositions />);
    
    const employeePositions = screen.getByTestId('EmployeePositions');

    expect(employeePositions).toBeInTheDocument();
  });
});