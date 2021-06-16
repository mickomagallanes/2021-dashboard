import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from "react-dom/test-utils";
import * as usersModule from './Users';
import { BrowserRouter } from 'react-router-dom';

const Users = usersModule.default;

describe('<Users />', () => {
  test('it should mount', async () => {

    const data = [
      { id: 1, rname: "superadmin", uname: "dorco1" },
      { id: 2, rname: "superadmin", uname: "dorco2" },
      { id: 3, rname: "superadmin", uname: "dorco3" },
      { id: 4, rname: "superadmin", uname: "dorco4" },
      { id: 5, rname: "superadmin", uname: "dorco5" },
      { id: 6, rname: "superadmin", uname: "dorco6" },
      { id: 7, rname: "superadmin", uname: "dorco7" },
      { id: 8, rname: "superadmin", uname: "dorco8" },
      { id: 9, rname: "superadmin", uname: "dorco9" },
      { id: 10, rname: "superadmin", uname: "dorco10" }
    ];

    jest.spyOn(usersModule, 'fetchCount').mockImplementation(() =>
      Promise.resolve({
        status: true,
        data: { count: data.length }
      })
    );

    jest.spyOn(usersModule, 'fetchUsersData').mockImplementation((pageNumber, currentEntries) =>
      Promise.resolve({
        data: data.slice((pageNumber - 1) * currentEntries, pageNumber * currentEntries),
        msg: "Successful getting all rows",
        status: true
      })
    );


    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(<BrowserRouter><Users /></BrowserRouter>);
    });


    const users = screen.getByTestId('Users');
    const table = screen.getByTestId('Table');
    const tr = table.querySelectorAll('tr');

    expect(users).toBeInTheDocument();
    expect(table).toBeInTheDocument();
    expect(tr).toHaveLength(6);

    const inputEntry = users.querySelector("#inputEntry");

    const newEntry = 7;

    await act(async () => {
      fireEvent.change(inputEntry, { target: { value: newEntry } });
    });

    const tr2 = table.querySelectorAll('tr');

    expect(inputEntry.value).toBe(`${newEntry}`);
    expect(tr2).toHaveLength(newEntry + 1);

    // remove the mock to ensure tests are completely isolated
    usersModule.fetchUsersData.mockRestore();
    usersModule.fetchCount.mockRestore();
  });
});