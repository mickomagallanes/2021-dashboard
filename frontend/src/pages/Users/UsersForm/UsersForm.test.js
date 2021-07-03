import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect';
import * as usersModule from './UsersForm';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";

const UsersForm = usersModule.default;

async function testUsers({ userData, roleData, matchParams }) {

  jest.spyOn(usersModule, 'fetchRoleData').mockImplementation(() =>
    Promise.resolve({
      status: true,
      data: roleData,
      msg: "Successful getting all rows"
    })
  );

  jest.spyOn(usersModule, 'fetchUserData').mockImplementation(() =>
    Promise.resolve({
      data: userData,
      msg: "Successful getting user row",
      status: true
    })
  );

  const handleSubmitForm = jest.fn();

  jest.spyOn(UsersForm.prototype, 'handleSubmitForm').mockImplementation((values) =>
    handleSubmitForm(values)

  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<BrowserRouter><UsersForm match={matchParams} priv="RW" /></BrowserRouter>);
  });

  const users = screen.getByTestId('UsersForm');

  await waitFor(() => {
    expect(users).toBeInTheDocument();
  });

  const username = users.querySelector('input[name="username"]');
  const password = users.querySelector('input[name="password"]');
  const confirmPassword = users.querySelector('input[name="confirmPassword"]');
  const selectedRole = users.querySelector('select[name="selectedRole"]');

  await act(async () => {
    fireEvent.change(selectedRole, { target: { value: 3 } });
  });

  userEvent.type(username, 'blade');

  userEvent.type(password, '123456789012345');
  userEvent.type(confirmPassword, '123456789012345');
  userEvent.click(screen.getByRole('button', 'Submit'))

  await waitFor(() => {
    expect(handleSubmitForm).toHaveBeenCalledWith({
      username: 'dorcoblade',
      password: '123456789012345',
      confirmPassword: '123456789012345',
      selectedRole: "3",
      userImg: ""
    })

    const selectedRole2 = users.querySelector('select[name="selectedRole"]');
    expect(selectedRole2.options[selectedRole2.selectedIndex].text).toBe("Customer");
  });



  // remove the mock to ensure tests are completely isolated
  usersModule.fetchUserData.mockRestore();
  usersModule.fetchRoleData.mockRestore();
  UsersForm.prototype.handleSubmitForm.mockRestore();
}

describe('<UsersForm />', () => {
  test('UsersForm test 1', async () => {
    const userData = {
      uname: "dorco",
      rid: "1",
      img: ""
    };

    const roleData = [{ id: 1, rname: "Super" }, { id: 2, rname: "Guest" }, { id: 3, rname: "Customer" }];

    const match = {
      params: {
        id: "1"
      }
    }

    return testUsers({ userData: userData, roleData: roleData, matchParams: match })

  });
});