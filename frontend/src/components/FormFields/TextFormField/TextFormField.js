import React from 'react';
import './TextFormField.css';
import { getIn } from "formik";
import { Form } from 'react-bootstrap';

/**
  * creates a text field
  * @param {Formik Prop} field
  * @param {Formik Prop} form
  * @param {String} placeholder placeholder of input text
  * @param {String} type type of input
  * @param {Boolean} [disabled] is text field disabled
  * @param {String} [label] laber for input
  */
export default function TextFormField({
  field,
  form,
  label,
  type,
  placeholder,
  disabled,
  ...props
}) {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <Form.Group>
      {label && <Form.Label htmlFor={field.name}>{label}</Form.Label>}
      <Form.Control
        size="lg"
        id={field.name}
        placeholder={placeholder}
        type={type}
        className="h-auto"
        isInvalid={!!errorText}
        disabled={disabled}
        {...field}
        {...props}
      />
      <Form.Control.Feedback type="invalid">
        {errorText}
      </Form.Control.Feedback>
    </Form.Group>

  );
}
