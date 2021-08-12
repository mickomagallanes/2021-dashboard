import React, { forwardRef, useImperativeHandle } from "react";
import { Formik, Form } from "formik";

const FormWithRef = forwardRef(FormHelper);

const FormikWithRef = ({
    formRef,
    children,
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize
}) => {
    return (
        <FormWithRef
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            ref={formRef}
            enableReinitialize={enableReinitialize}
        >
            {(props) =>
                <Form>
                    {typeof children === "function" ? children(props) : children}
                </Form>}
        </FormWithRef>
    );
};

function FormHelper(props, ref) {

    let _formikProps = {};

    useImperativeHandle(ref, () => _formikProps);

    return (
        <Formik {...props} innerRef={ref}>
            {(formikProps) => {
                _formikProps = formikProps;
                return props.children(formikProps);
            }}
        </Formik>
    );

}

export default FormikWithRef;
