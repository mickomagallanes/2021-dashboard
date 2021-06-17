import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from "react-dom/test-utils";
import Pagination from './Pagination';

async function testPagination({ currentPage, maxPage, expectLength }) {
  const logged = jest.fn((e) => e);

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<Pagination currentPage={currentPage} maxPage={maxPage} onClick={logged} />);
  });

  const pagination = screen.getByTestId('Pagination');
  const li = pagination.querySelectorAll('li');
  const currentLi = pagination.querySelector(`#page${currentPage}`);

  await act(async () => {
    fireEvent.click(currentLi);
  });

  expect(logged).toReturnWith(currentPage);
  expect(pagination).toBeInTheDocument();
  expect(li).toHaveLength(expectLength);

}

describe('<Pagination />', () => {
  test('pagination test 1', async () => {
    return testPagination({ currentPage: 1, maxPage: 6, expectLength: 7 });
  });

  test('pagination test 2', async () => {
    return testPagination({ currentPage: 3, maxPage: 6, expectLength: 9 });
  });

  test('pagination test 3', async () => {
    return testPagination({ currentPage: 2, maxPage: 6, expectLength: 9 });
  });

  test('pagination test 4', async () => {
    return testPagination({ currentPage: 6, maxPage: 6, expectLength: 7 });
  });

  test('pagination test 5', async () => {
    return testPagination({ currentPage: 5, maxPage: 6, expectLength: 9 });
  });

  test('pagination test 6', async () => {
    return testPagination({ currentPage: 4, maxPage: 6, expectLength: 9 });
  });

  test('pagination test 7', async () => {
    return testPagination({ currentPage: 6, maxPage: 7, expectLength: 9 });
  });
});