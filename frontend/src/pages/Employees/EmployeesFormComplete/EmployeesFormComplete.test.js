import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeesFormComplete from './EmployeesFormComplete';

describe('<EmployeesFormComplete />', () => {
  test('it should mount', () => {
    render(<EmployeesFormComplete />);

    const employeesFormComplete = screen.getByTestId('EmployeesFormComplete');

    expect(employeesFormComplete).toBeInTheDocument();
  });
});