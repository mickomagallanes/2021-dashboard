import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Select from './Select';
import { act } from "react-dom/test-utils";

describe('<Select />', () => {
  test('it should mount', async () => {
    const data = [
      { id: 1, rname: "test1" },
      { id: 2, rname: "test2" },
      { id: 3, rname: "test3" },
      { id: 4, rname: "test4" }
    ]

    await act(async () => {
      render(<Select
        id="test"
        value="1"
        data={data}
        idKey="id"
        valueKey="rname"
        disabled={false}
        onChange={() => { }}
      />);
    });

    const select = screen.getByTestId('Select');

    expect(select).toBeInTheDocument();
    expect(select).toHaveLength(4);

    // remove the mock to ensure tests are completely isolated
    // global.fetch.mockRestore();
  });
});