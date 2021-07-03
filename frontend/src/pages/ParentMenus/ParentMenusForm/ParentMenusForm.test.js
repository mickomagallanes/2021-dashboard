import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect';
import * as parentMenuModule from './ParentMenusForm';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";

const ParentMenusForm = parentMenuModule.default;

async function testMenu({ parentMenuData, matchParams }) {

  jest.spyOn(parentMenuModule, 'fetchParentMenuData').mockImplementation(() =>
    Promise.resolve({
      status: true,
      data: parentMenuData,
      msg: "Successful getting parent menu row"

    })
  );

  const handleSubmitForm = jest.fn();

  jest.spyOn(ParentMenusForm.prototype, 'handleSubmitForm').mockImplementation((values) =>
    handleSubmitForm(values)

  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<BrowserRouter><ParentMenusForm match={matchParams} priv="RW" /></BrowserRouter>);
  });

  const parentMenu = screen.getByTestId('ParentMenusForm');

  await waitFor(() => {
    expect(parentMenu).toBeInTheDocument();

  });
  const parentMenuName = parentMenu.querySelector('input[name="parentMenuName"]');

  userEvent.type(parentMenuName, 'blade');

  userEvent.click(screen.getByRole('button', 'Submit'))

  await waitFor(() => {
    expect(handleSubmitForm).toHaveBeenCalledWith({
      parentMenuName: 'dorcoblade'
    })
  });

  // remove the mock to ensure tests are completely isolated
  parentMenuModule.fetchParentMenuData.mockRestore();
  ParentMenusForm.prototype.handleSubmitForm.mockRestore();
}

describe('<ParentMenusForm />', () => {
  test('ParentMenusForm test 1', async () => {
    const parentMenuData = {
      ParentMenuName: "dorco"
    };

    const match = {
      params: {
        id: "1"
      }
    }

    return testMenu({ parentMenuData: parentMenuData, matchParams: match })

  });
});