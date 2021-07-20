

import React, { useState, useRef } from 'react';
import { Alert } from 'react-bootstrap';

function useAlert() {

    const [errorMsg, setErrorMsg] = useState([]);
    const [successMsg, setSuccessMsg] = useState([]);

    const _errorTimer = useRef(null);
    const _successTimer = useRef(null);


    const timerSuccessAlert = (msgArr) => {
        setSuccessMsg(msgArr);

        clearSuccessTimer();

        _successTimer.current = setTimeout(() => {
            clearSuccessMsg();
            clearSuccessTimer();
        }, 6000)

    }

    const timerErrorAlert = (msgArr) => {
        setErrorMsg(msgArr);

        clearErrorTimer();

        // make timeout reset when error alert is continuous
        _errorTimer.current = setTimeout(() => {
            clearErrorMsg();
            clearErrorTimer();
        }, 6000)

    }

    const passErrorMsg = (msgValue) => {
        clearErrorTimer();
        setErrorMsg([msgValue]);
    }

    const passSuccessMsg = (msgValue) => {
        clearSuccessTimer();
        setSuccessMsg([msgValue]);
    }

    const clearErrorMsg = () => {
        setErrorMsg([]);
    };

    const clearSuccessMsg = () => {
        setSuccessMsg([]);
    }

    const clearErrorTimer = () => {
        if (_errorTimer.current !== null) {
            clearTimeout(_errorTimer.current);
            _errorTimer.current = null;
        }
    };

    const clearSuccessTimer = () => {
        if (_successTimer.current !== null) {
            clearTimeout(_successTimer.current);
            _successTimer.current = null;
        }
    }

    return {
        timerSuccessAlert,
        timerErrorAlert,
        passErrorMsg,
        AlertElements,
        passSuccessMsg,
        clearErrorMsg,
        clearSuccessMsg,
        errorMsg,
        successMsg,
        errorTimerValue: _errorTimer.current,
        successTimerValue: _successTimer.current
    }
}


function AlertElements({
    errorMsg,
    successMsg
}) {

    return (
        <>
            {errorMsg.map((err) =>
                <Alert
                    className="p-1"
                    variant="danger"
                    show={err}
                    transition={false}
                    key={err}
                >
                    {err}
                </Alert>
            )}
            {successMsg.map((succ) => {
                return <Alert
                    className="p-1"
                    variant="success"
                    show={succ}
                    transition={false}
                    key={succ}
                >
                    {succ}
                </Alert>
            }
            )}
        </>
    );
}

export default useAlert;