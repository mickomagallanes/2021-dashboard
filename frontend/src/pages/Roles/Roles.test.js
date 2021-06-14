import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from "react-dom/test-utils";
import Roles from './Roles';

describe('<Roles />', () => {
  test('it should mount', async () => {
    const rolesClass = new Roles();

    const data = [
      { id: 1, rname: "test1" },
      { id: 2, rname: "test2" },
      { id: 3, rname: "test3" },
      { id: 4, rname: "test4" }
    ];

    // TODO: expect Roles class state data
    jest.spyOn(rolesClass, "fetchData").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(data)
      })
    );

    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(<Roles />);
    });

    const roles = screen.getByTestId('Roles');

    expect(roles.state('data')).toEqual(data);
    expect(roles).toBeInTheDocument();

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });
});