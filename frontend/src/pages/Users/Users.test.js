import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from "react-dom/test-utils";
import * as usersModule from './Users';
import { BrowserRouter } from 'react-router-dom';
const Users = usersModule.default;

async function testUsers({ data, newEntry }) {

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
    render(<BrowserRouter><Users location={{}} /></BrowserRouter>);
  });

  //  based on the hardcoded state on Users.js
  const currentEntriesHardCoded = 5;

  const users = screen.getByTestId('Users');
  const table = screen.getByTestId('Table');
  const pagination = screen.getByTestId('Pagination');

  // tr are table rows
  const tr = table.querySelectorAll('tr');

  // li are pagination lists
  const li = pagination.querySelectorAll('li');

  expect(users).toBeInTheDocument();
  expect(table).toBeInTheDocument();

  // if, then there's next and last page
  if (data.length > currentEntriesHardCoded) {
    const totalPages = Math.ceil(data.length / currentEntriesHardCoded);
    const pageNumberLength = totalPages > 5 ? 5 : totalPages;

    expect(li).toHaveLength(pageNumberLength + 2);
    expect(tr).toHaveLength(currentEntriesHardCoded + 1);
  } else {
    expect(li).toHaveLength(1);
    expect(tr).toHaveLength(data.length + 1);
  }

  // change entry input value and update data and table rows
  const inputEntry = users.querySelector("#inputEntry");

  await act(async () => {
    fireEvent.change(inputEntry, { target: { value: newEntry } });
  });

  expect(inputEntry.value).toBe(`${newEntry}`);

  const tr2 = table.querySelectorAll('tr');
  let li2;

  // if, then there's next and last page
  if (data.length > newEntry) {

    // expect table rows on new entry
    expect(tr2).toHaveLength(newEntry + 1);

    const nextPage = pagination.querySelector("#next");

    // trigger onclick to next page in pagination
    await act(async () => {
      fireEvent.click(nextPage);
    });
    li2 = pagination.querySelectorAll('li');

    const slicedFirstLength = data.length - newEntry;
    const secondTotalPages = Math.ceil(slicedFirstLength / newEntry);
    const secondNumberLength = secondTotalPages > 4 ? 4 : secondTotalPages;

    const tr3 = table.querySelectorAll('tr');


    if (slicedFirstLength > newEntry) {
      // expect pagination list on 2nd page, new entry
      expect(li2).toHaveLength(secondNumberLength + 5);

      // expect table rows on 2nd page, new entry
      expect(tr3).toHaveLength(newEntry + 1);
    } else {
      // expect pagination list on 2nd page, new entry
      expect(li2).toHaveLength(secondNumberLength + 3);

      // expect table rows on 2nd page, new entry
      expect(tr3).toHaveLength(slicedFirstLength + 1);
    }

  } else {
    // expect table rows on new entry
    expect(tr2).toHaveLength(data.length + 1);
    li2 = pagination.querySelectorAll('li');
    expect(li2).toHaveLength(1);
  }

  // remove the mock to ensure tests are completely isolated
  usersModule.fetchUsersData.mockRestore();
  usersModule.fetchCount.mockRestore();
}

async function testBlankUsers({ data }) {

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
    render(<BrowserRouter><Users location={{}} /></BrowserRouter>);
  });

  const users = screen.getByTestId('Users');
  const table = screen.getByTestId('Table');
  const pagination = screen.getByTestId('Pagination');

  // tr are table rows
  const tr = table.querySelectorAll('tr');

  // li are pagination lists
  const li = pagination.querySelectorAll('li');

  expect(users).toBeInTheDocument();
  expect(table).toBeInTheDocument();

  expect(li).toHaveLength(1);
  expect(tr).toHaveLength(2);

  // remove the mock to ensure tests are completely isolated
  usersModule.fetchUsersData.mockRestore();
  usersModule.fetchCount.mockRestore();
}

describe('<Users />', () => {
  test('Users test 1', async () => {
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

    return testUsers({ data: data, newEntry: 6 })

  });

  test('Users test 2', async () => {
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
      { id: 10, rname: "superadmin", uname: "dorco10" },
      { id: 11, rname: "superadmin", uname: "dorco11" },
      { id: 12, rname: "superadmin", uname: "dorco12" },
      { id: 13, rname: "superadmin", uname: "dorco13" },
      { id: 14, rname: "superadmin", uname: "dorco14" }
    ];

    return testUsers({ data: data, newEntry: 6 })

  });

  test('Users test 3', async () => {
    const data = [
      { id: 1, rname: "superadmin", uname: "dorco1" },
      { id: 2, rname: "superadmin", uname: "dorco2" }

    ];

    return testUsers({ data: data, newEntry: 6 })

  });

  test('Users test 4', async () => {
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
      { id: 10, rname: "superadmin", uname: "dorco10" },
      { id: 11, rname: "superadmin", uname: "dorco11" },
      { id: 12, rname: "superadmin", uname: "dorco12" },
      { id: 13, rname: "superadmin", uname: "dorco13" },
      { id: 14, rname: "superadmin", uname: "dorco14" }

    ];

    return testUsers({ data: data, newEntry: 8 })

  });

  test('Users test 5', async () => {
    const data = [
      { id: 1, rname: "superadmin", uname: "dorco1" }

    ];
    return testUsers({ data: data, newEntry: 8 })

  });

  test('Users test 6', async () => {
    const data = [
      { id: 1, rname: "superadmin", uname: "dorco1" },
      { id: 4, rname: "superadmin", uname: "4" },
      { id: 2, rname: "superadmin", uname: "dorco2" },
      { id: 3, rname: "superadmin", uname: "dorco3" }

    ];

    return testUsers({ data: data, newEntry: 2 })

  });

  test('Users test blank data 1', async () => {
    const data = [

    ];

    return testBlankUsers({ data: data, newEntry: 2 })

  });

  test('Users test blank data 2', async () => {
    const data = [

    ];

    return testBlankUsers({ data: data })

  });


});