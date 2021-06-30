import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SelectFormField from './SelectFormField';
import { act } from "react-dom/test-utils";

describe('<SelectFormField />', () => {
  test('it should mount', async () => {
    const data = [
      { id: 1, rname: "test1" },
      { id: 2, rname: "test2" },
      { id: 3, rname: "test3" },
      { id: 4, rname: "test4" }
    ]

    await act(async () => {
      render(<SelectFormField
        id="test"
        value="1"
        data={data}
        idKey="id"
        valueKey="rname"
        disabled={false}
        onChange={() => { }}
      />);
    });

    const select = screen.getByTestId('SelectFormField');

    expect(select).toBeInTheDocument();
    expect(select).toHaveLength(4);

  });
});