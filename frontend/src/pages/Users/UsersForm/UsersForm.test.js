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


  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<BrowserRouter><UsersForm match={matchParams} priv="RW" /></BrowserRouter>);
  });

  const users = screen.getByTestId('UsersForm');

  expect(users).toBeInTheDocument();

  const username = users.querySelector('input[name="username"]');
  const password = users.querySelector('input[name="password"]');
  const confirmPassword = users.querySelector('input[name="confirmPassword"]');
  const selectedRole = screen.getByTestId('selectedRole');

  const handleFileChange = jest.fn();

  // TODO: child components not rendered
  await act(async () => {
    console.log(username);

    userEvent.type(username, 'blade');

    userEvent.type(password, '123456789012345');
    userEvent.type(confirmPassword, '123456789012345');
    fireEvent.change(selectedRole, { target: { value: 2 } });

    userEvent.click(screen.getByRole('submit'))

  });


  await waitFor(() => {
    expect(handleFileChange).toHaveBeenCalledWith({
      username: 'blade',
      password: '123456789012345',
      confirmPassword: '123456789012345',
      selectedRole: 2
    })

    const selectedRole2 = users.querySelector('select[name="selectedRole"]');
    expect(selectedRole2.options[selectedRole2.selectedIndex].text).toBe("Guest");
  });

  // remove the mock to ensure tests are completely isolated
  usersModule.fetchUsersData.mockRestore();
  usersModule.fetchRoleData.mockRestore();
}

describe('<UsersForm />', () => {
  test('UsersForm test 1', async () => {
    const userData = {
      uname: "dorco",
      rid: "1",
      img: ""
    };

    const roleData = [{ id: 1, rname: "Super" }, { id: 2, rname: "Guest" }];

    const match = {
      params: {
        id: "1"
      }
    }

    return testUsers({ userData: userData, roleData: roleData, matchParams: match })

  });
});