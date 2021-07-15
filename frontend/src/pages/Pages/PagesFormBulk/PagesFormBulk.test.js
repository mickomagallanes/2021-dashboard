import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PagesFormBulk from './PagesFormBulk';

describe('<PagesFormBulk />', () => {
  test('it should mount', () => {
    render(<PagesFormBulk />);
    
    const pagesFormBulk = screen.getByTestId('PagesFormBulk');

    expect(pagesFormBulk).toBeInTheDocument();
  });
});