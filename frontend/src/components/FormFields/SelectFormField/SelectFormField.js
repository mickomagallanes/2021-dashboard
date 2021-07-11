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
  * @param {Boolean} allowDefaultNull specify whether to put a default option with Blank value
  */
export default function SelectFormField({
  field,
  form,
  label,
  options,
  idKey,
  valueKey,
  allowDefaultNull,
  ...props
}) {
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
        {allowDefaultNull && <option value={null}> SELECT OPTIONAL OPTIONS </option>}
        {options.map(x =>
          <option key={x[idKey]} value={x[idKey]}>{x[valueKey]}</option>
        )}

      </select>
    </>
  );
};
