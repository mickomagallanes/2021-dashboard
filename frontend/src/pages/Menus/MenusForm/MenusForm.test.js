import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenusForm from './MenusForm';

describe('<MenusForm />', () => {
  test('it should mount', () => {
    render(<MenusForm />);
    
    const menusForm = screen.getByTestId('MenusForm');

    expect(menusForm).toBeInTheDocument();
  });
});