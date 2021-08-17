import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeesFormBulk from './EmployeesFormBulk';

describe('<EmployeesFormBulk />', () => {
  test('it should mount', () => {
    render(<EmployeesFormBulk />);
    
    const employeesFormBulk = screen.getByTestId('EmployeesFormBulk');

    expect(employeesFormBulk).toBeInTheDocument();
  });
});