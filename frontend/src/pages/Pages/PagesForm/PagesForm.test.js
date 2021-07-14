import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PagesForm from './PagesForm';

describe('<PagesForm />', () => {
  test('it should mount', () => {
    render(<PagesForm />);
    
    const pagesForm = screen.getByTestId('PagesForm');

    expect(pagesForm).toBeInTheDocument();
  });
});