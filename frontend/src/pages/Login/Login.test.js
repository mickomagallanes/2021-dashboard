import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from "react-dom/test-utils";
import Login from './Login';
import { unmountComponentAtNode } from "react-dom";
import { BrowserRouter } from 'react-router-dom';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('<Login />', () => {
  test('it should show login page after fetching cookie status from API', async () => {
    const fakeResponse = { "status": false, "msg": "Cookie does not exist" };

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeResponse)
      })
    );

    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(<BrowserRouter><Login /></BrowserRouter>, container);
    });

    expect(
      screen.getByText(/Sign in to continue/i)
    ).toBeInTheDocument();

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });

  test('it should show login page after fetching cookie status from API', async () => {
    const fakeResponse = { "status": true, "msg": "Cookie exists" };

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeResponse)
      })
    );

    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(<BrowserRouter><Login /></BrowserRouter>, container);
    });

    expect(
      screen.getByText(/Sign in to continue/i)
    ).toBeInTheDocument();

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });
});