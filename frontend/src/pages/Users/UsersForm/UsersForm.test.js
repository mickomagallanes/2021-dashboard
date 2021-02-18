import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UsersForm from './UsersForm';

describe('<UsersForm />', () => {
  test('it should mount', () => {
    render(<UsersForm />);
    
    const usersForm = screen.getByTestId('UsersForm');

    expect(usersForm).toBeInTheDocument();
  });
});