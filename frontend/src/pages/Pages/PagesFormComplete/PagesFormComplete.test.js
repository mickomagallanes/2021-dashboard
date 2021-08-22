import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PagesFormComplete from './PagesFormComplete';

describe('<PagesFormComplete />', () => {
  test('it should mount', () => {
    render(<PagesFormComplete />);

    const pagesFormComplete = screen.getByTestId('PagesFormComplete');

    expect(pagesFormComplete).toBeInTheDocument();
  });
});