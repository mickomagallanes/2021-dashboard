import React from 'react';
import './DateFormField.css';
import { getIn } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
  * creates a date picker
  * @param {Formik Prop} field
  * @param {Formik Prop} form
  * @param {Function} setStartDate for onchange, sets the value of field
  * @param {String} [label] laber for input
  */
export default function DateFormField({
  field,
  form,
  label,
  setStartDate,
  ...props
}) {
  // const errorText =
  //   getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <>
      {label && <label htmlFor={field.name}>{label}</label>}
      <div>
        <DatePicker
          {...field}
          {...props}
          className="form-control"
          dateFormat="yyyy-MM-dd"
          id={field.name}
          selected={(field.value && new Date(field.value)) || null}
          onChange={(date) => setStartDate(date)}

        />
      </div>

    </>
  );
}
