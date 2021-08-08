import React from 'react';
import './SelectFormField.css';
import { getIn } from "formik";
import { Form } from 'react-bootstrap';

/**
  * creates a select field
  * @param {Formik Prop} field
  * @param {Formik Prop} form
  * @param {String} [label] label of select
  * @param {String} options array data converted to options
  * @param {String} idKey ID column name
  * @param {String|Array} valueKey text shown in option, can be array
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
      <Form.Group>
        {label && <Form.Label htmlFor={field.name}>{label}</Form.Label>}

        <Form.Control as="select"
          isInvalid={!!errorText}
          data-testid="SelectFormField"
          className="form-control btn"
          id={field.name}
          {...field}
          {...props}
        >
          {allowDefaultNull && <option value={""}> SELECT OPTIONAL OPTIONS </option>}
          {options.map(x => {
            let optionValue = x[idKey];
            let optionText = "";
            if (typeof valueKey !== "string") {

              valueKey.forEach(o => optionText += ` ${x[o]} `);
            } else {
              optionText = x[valueKey];
            }
            return <option key={optionValue} value={optionValue}>{optionText}</option>
          }
          )}
        </Form.Control>

        <Form.Control.Feedback type="invalid">
          {errorText}
        </Form.Control.Feedback>
      </Form.Group>


    </>
  );
}
