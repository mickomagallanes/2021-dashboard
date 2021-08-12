import React from 'react';
import './DateFormField.css';
import { getIn } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from 'react-bootstrap';

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
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <>

      <Form.Group>
        {label && <Form.Label htmlFor={field.name}>{label}</Form.Label>}

        <div>
          <Form.Control as={DatePicker}
            {...field}
            {...props}
            isInvalid={!!errorText}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            id={field.name}
            selected={(field.value && new Date(field.value)) || null}
            onChange={(date) => setStartDate(date)}
            wrapperClassName="is-invalid"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />

          <Form.Control.Feedback type="invalid">
            {errorText}
          </Form.Control.Feedback>
        </div>
      </Form.Group>

    </>
  );
}
