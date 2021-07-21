

import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

// TODO: use react bootstrap dialog for delete, etc
function useDialog() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return {
        handleShow,
        handleClose,
        show,
        DialogElements
    }
}


function DialogElements({
    show,
    handleClose,
    handleDelete,
    modalTitle,
    modalBody
}) {
    const themeState = useSelector((state) => state.themeReducer.theme);

    return (
        <>

            <Modal show={show} onHide={handleClose} dialogClassName={themeState}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{modalBody}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>

            </Modal>
        </>
    );
}

export default useDialog;