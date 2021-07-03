import React from 'react';
import './SelectFormField.css';
import { getIn } from "formik";

/**
  * creates a text field
  * @param {Formik Prop} field
  * @param {Formik Prop} form
  * @param {String} placeholder placeholder of input text
  * @param {String} type type of input
  * @param {String} [label] laber for input
  */
const SelectFormField = ({
  field,
  form,
  label,
  options,
  idKey,
  valueKey,
  ...props
}) => {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);
  return (
    <>
      {label && <label htmlFor={field.name}>{label}</label>}
      <select
        data-testid="SelectFormField"
        className="form-control btn"
        disabled={errorText}
        id={field.name}
        {...field}
        {...props}
      >
        {options.map(x =>
          <option key={x[idKey]} value={x[idKey]}>{x[valueKey]}</option>
        )}

      </select>
    </>
  );
};

export default SelectFormField;
