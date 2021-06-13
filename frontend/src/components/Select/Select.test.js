import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Select from './Select';

describe('<Select />', () => {
  test('it should mount', () => {

    // TODO: pass fake prop to Select component
    const fakeUser = {
      name: "Joni Baez",
      age: "32",
      address: "123, Charming Avenue"
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeUser)
      })
    );

    await act(async () => {
      render(<Select />);
    });

    const select = screen.getByTestId('Select');

    expect(select).toBeInTheDocument();

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });
});