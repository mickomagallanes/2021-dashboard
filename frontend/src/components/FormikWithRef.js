import React, { forwardRef } from "react";
import { Formik, Form } from "formik";

const FormWithRef = forwardRef(FormHelper);

const FormikWithRef = ({
    formRef,
    children,
    initialValues,
    validationSchema,
    onSubmit
}) => {
    return (
        <FormWithRef
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            ref={formRef}
        >
            {(props) => <Form onSubmit={props.handleSubmit}>{children}</Form>}
        </FormWithRef>
    );
};

function FormHelper(props, ref) {

    return (
        <Formik {...props} enableReinitialize innerRef={ref}>
            {(formikProps) => {

                if (typeof props.children === "function") {
                    return props.children(formikProps);
                }
                return props.children;
            }}
        </Formik>
    );
}

export default FormikWithRef;
