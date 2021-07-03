import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from "react-dom/test-utils";
import * as parentMenuModule from './ParentMenus';
import { BrowserRouter } from 'react-router-dom';
const ParentMenus = parentMenuModule.default;

async function testMenus({ data, newEntry }) {

  jest.spyOn(parentMenuModule, 'fetchCount').mockImplementation(() =>
    Promise.resolve({
      status: true,
      data: { count: data.length }
    })
  );

  jest.spyOn(parentMenuModule, 'fetchParentMenusData').mockImplementation((pageNumber, currentEntries) =>
    Promise.resolve({
      data: data.slice((pageNumber - 1) * currentEntries, pageNumber * currentEntries),
      msg: "Successful getting all rows",
      status: true
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<BrowserRouter><ParentMenus location={{}} /></BrowserRouter>);
  });

  //  based on the hardcoded state on ParentMenus.js
  const currentEntriesHardCoded = 5;

  const parentMenus = screen.getByTestId('ParentMenus');
  const table = screen.getByTestId('Table');
  const pagination = screen.getByTestId('Pagination');

  // tr are table rows
  const tr = table.querySelectorAll('tr');

  // li are pagination lists
  const li = pagination.querySelectorAll('li');

  await waitFor(() => {
    expect(parentMenus).toBeInTheDocument();
    expect(table).toBeInTheDocument();
  });


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
  const inputEntry = parentMenus.querySelector("#inputEntry");

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
  parentMenuModule.fetchParentMenusData.mockRestore();
  parentMenuModule.fetchCount.mockRestore();
}

async function testBlankMenus({ data }) {

  jest.spyOn(parentMenuModule, 'fetchCount').mockImplementation(() =>
    Promise.resolve({
      status: true,
      data: { count: data.length }
    })
  );

  jest.spyOn(parentMenuModule, 'fetchParentMenusData').mockImplementation((pageNumber, currentEntries) =>
    Promise.resolve({
      data: data.slice((pageNumber - 1) * currentEntries, pageNumber * currentEntries),
      msg: "Successful getting all rows",
      status: true
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<BrowserRouter><ParentMenus location={{}} /></BrowserRouter>);
  });

  const parentMenus = screen.getByTestId('ParentMenus');
  const table = screen.getByTestId('Table');
  const pagination = screen.getByTestId('Pagination');

  // tr are table rows
  const tr = table.querySelectorAll('tr');

  // li are pagination lists
  const li = pagination.querySelectorAll('li');

  expect(parentMenus).toBeInTheDocument();
  expect(table).toBeInTheDocument();

  expect(li).toHaveLength(1);
  expect(tr).toHaveLength(2);

  // remove the mock to ensure tests are completely isolated
  parentMenuModule.fetchParentMenusData.mockRestore();
  parentMenuModule.fetchCount.mockRestore();
}

describe('<ParentMenus />', () => {
  test('ParentMenus test 1', async () => {
    const data = [
      { id: 1, name: "dorco1" },
      { id: 2, name: "dorco2" },
      { id: 3, name: "dorco3" },
      { id: 4, name: "dorco4" },
      { id: 5, name: "dorco5" },
      { id: 6, name: "dorco6" },
      { id: 7, name: "dorco7" },
      { id: 8, name: "dorco8" },
      { id: 9, name: "dorco9" },
      { id: 10, name: "dorco10" }
    ];

    return testMenus({ data: data, newEntry: 6 })

  });

  test('ParentMenus test 2', async () => {
    const data = [
      { id: 1, name: "dorco1" },
      { id: 2, name: "dorco2" },
      { id: 3, name: "dorco3" },
      { id: 4, name: "dorco4" },
      { id: 5, name: "dorco5" },
      { id: 6, name: "dorco6" },
      { id: 7, name: "dorco7" },
      { id: 8, name: "dorco8" },
      { id: 9, name: "dorco9" },
      { id: 10, name: "dorco10" },
      { id: 11, name: "dorco11" },
      { id: 12, name: "dorco12" },
      { id: 13, name: "dorco13" },
      { id: 14, name: "dorco14" }
    ];

    return testMenus({ data: data, newEntry: 6 })

  });

  test('ParentMenus test 3', async () => {
    const data = [
      { id: 1, name: "dorco1" },
      { id: 2, name: "dorco2" }

    ];

    return testMenus({ data: data, newEntry: 6 })

  });

  test('ParentMenus test 4', async () => {
    const data = [
      { id: 1, name: "dorco1" },
      { id: 2, name: "dorco2" },
      { id: 3, name: "dorco3" },
      { id: 4, name: "dorco4" },
      { id: 5, name: "dorco5" },
      { id: 6, name: "dorco6" },
      { id: 7, name: "dorco7" },
      { id: 8, name: "dorco8" },
      { id: 9, name: "dorco9" },
      { id: 10, name: "dorco10" },
      { id: 11, name: "dorco11" },
      { id: 12, name: "dorco12" },
      { id: 13, name: "dorco13" },
      { id: 14, name: "dorco14" }

    ];

    return testMenus({ data: data, newEntry: 8 })

  });

  test('ParentMenus test 5', async () => {
    const data = [
      { id: 1, name: "dorco1" }

    ];
    return testMenus({ data: data, newEntry: 8 })

  });

  test('ParentMenus test 6', async () => {
    const data = [
      { id: 1, name: "dorco1" },
      { id: 4, name: "4" },
      { id: 2, name: "dorco2" },
      { id: 3, name: "dorco3" }

    ];

    return testMenus({ data: data, newEntry: 2 })

  });

  test('ParentMenus test blank data 1', async () => {
    const data = [

    ];

    return testBlankMenus({ data: data, newEntry: 2 })

  });

  test('ParentMenus test blank data 2', async () => {
    const data = [

    ];

    return testBlankMenus({ data: data })

  });


});