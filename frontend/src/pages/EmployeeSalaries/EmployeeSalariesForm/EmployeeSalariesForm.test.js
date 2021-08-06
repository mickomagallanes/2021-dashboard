import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeeSalariesForm from './EmployeeSalariesForm';

describe('<EmployeeSalariesForm />', () => {
  test('it should mount', () => {
    render(<EmployeeSalariesForm />);
    
    const employeeSalariesForm = screen.getByTestId('EmployeeSalariesForm');

    expect(employeeSalariesForm).toBeInTheDocument();
  });
});