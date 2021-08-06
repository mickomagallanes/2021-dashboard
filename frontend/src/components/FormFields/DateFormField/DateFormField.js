import React from 'react';
import './DateFormField.css';
import { getIn } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
  * creates a text field
  * @param {Formik Prop} field
  * @param {Formik Prop} form
  * @param {String} placeholder placeholder of input text
  * @param {String} type type of input
  * @param {String} [label] laber for input
  * @param {Boolean} allowDefaultNull specify whether to put a default option with Blank value
  */
export default function DateFormField({
  field,
  form,
  label,
  setStartDate,
  valueKey,
  allowDefaultNull,
  ...props
}) {
  // const errorText =
  //   getIn(form.touched, field.name) && getIn(form.errors, field.name);
  return (
    <>
      {label && <label htmlFor={field.name}>{label}</label>}
      <DatePicker
        {...field}
        {...props}
        id={field.name}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(date) => setStartDate(date)} />
    </>
  );
}
