import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Table from './Table';
import { act } from "react-dom/test-utils";
import { BrowserRouter } from 'react-router-dom';

describe('<Table />', () => {
  test('it should mount', async () => {
    const data = [
      { id: 1, rname: "test1", uname: "uname1" },
      { id: 2, rname: "test2", uname: "uname2" },
      { id: 3, rname: "test3", uname: "uname3" },
      { id: 4, rname: "test4", uname: "uname4" }
    ]

    const colData = [
      { "id": "id", "name": "User ID" },
      { "id": "uname", "name": "Username" },
      { "id": "rname", "name": "Role Name" }
    ];
    // * @param {String} urlRedirect the ink of form edit/read
    // * @param {Boolean} isWriteable is read or write privilege. True for RW. False for R
    // * @param {Array} data array data to be processed
    // * @param {String} tblClass class css of table
    // * @param {Array} colData column label matched to the data
    // * @param {Boolean} [actionDisabled] is action disabled? Default: false

    await act(async () => {

      render(
        <BrowserRouter>
          <Table
            urlRedirect="/home"
            isWriteable={true}
            data={data}
            colData={colData}
          />
        </BrowserRouter>);
    });


    const table = screen.getByTestId('Table');
    const tr = table.querySelectorAll('tr');

    expect(table).toBeInTheDocument();
    expect(tr).toHaveLength(5);
  });
});