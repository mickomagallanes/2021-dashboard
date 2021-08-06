import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeeSalaries from './EmployeeSalaries';

describe('<EmployeeSalaries />', () => {
  test('it should mount', () => {
    render(<EmployeeSalaries />);
    
    const employeeSalaries = screen.getByTestId('EmployeeSalaries');

    expect(employeeSalaries).toBeInTheDocument();
  });
});