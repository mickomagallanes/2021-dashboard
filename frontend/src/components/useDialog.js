

import React, { useState, useRef } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';

// TODO: use react bootstrap dialog for delete, etc
function useDialog() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return {
        timerSuccessAlert,
        timerErrorAlert,
        passErrorMsg,
        DialogElements,
        passSuccessMsg,
        clearErrorMsg,
        clearSuccessMsg,
        errorMsg,
        successMsg,
        errorTimerValue: _errorTimer.current,
        successTimerValue: _successTimer.current
    }
}


function DialogElements({
    show,
    handleClose
}) {

    return (
        <>
            <Modal.Dialog show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Modal body text goes here.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary">Delete</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </>
    );
}

export default useDialog;