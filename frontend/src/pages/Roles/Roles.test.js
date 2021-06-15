import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from "react-dom/test-utils";
import * as rolesModule from './Roles';

const Roles = rolesModule.default;

describe('<Roles />', () => {
  test('it should mount', async () => {

    const data = [
      { id: 1, rname: "test1" },
      { id: 2, rname: "test2" },
      { id: 3, rname: "test3" },
      { id: 4, rname: "test4" }
    ];

    jest.spyOn(rolesModule, 'fetchData').mockImplementation(() =>
      Promise.resolve({
        status: true,
        data: data
      })
    );

    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(<Roles />);
    });

    const roles = screen.getByTestId('Roles');
    const table = screen.getByTestId('Table');
    const tr = table.querySelectorAll('tr');

    expect(roles).toBeInTheDocument();
    expect(table).toBeInTheDocument();
    expect(tr).toHaveLength(5);

    // remove the mock to ensure tests are completely isolated
    rolesModule.fetchData.mockRestore();

  });
});