import React from 'react';
import './Select.css';
import { getIn } from "formik";

const TextFormField = ({
  field,
  form,
  label,
  ...props
}) => {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <Form.Group controlId="confirmPassword">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        onBlur={props.handleBlur}
        isInvalid={!!errorText}
        {...field}
        {...props}
      />
      <Form.Control.Feedback type="invalid">
        {errorText}
      </Form.Control.Feedback>
    </Form.Group>

  );
};

export default TextFormField;
