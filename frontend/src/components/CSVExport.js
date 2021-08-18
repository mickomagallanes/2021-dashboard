import React, { useState, useEffect, useRef } from 'react';
import propsTypes from 'prop-types';
import { CSVLink } from 'react-csv';

//TODO: make a csv import
const CSVExport = ({ asyncExportMethod, children, disable }) => {

    const [csvData, setCsvData] = useState(false);
    const csvInstance = useRef();

    useEffect(() => {
        if (csvData && csvInstance.current && csvInstance.current.link) {
            setTimeout(() => {
                csvInstance.current.link.click();
                setCsvData(false);
            });
        }
    }, [csvData]);

    return (
        <>
            <div
                className="text-center"
                onClick={async () => {
                    if (disable) {
                        return;
                    }
                    const newCsvData = await asyncExportMethod();
                    setCsvData(newCsvData);
                }}
            >
                {children}
            </div>
            {csvData ?
                <CSVLink
                    data={csvData.data}
                    headers={csvData.headers}
                    filename={csvData.filename}
                    ref={csvInstance}
                />
                : undefined}
        </>

    );
};

export default CSVExport;

// TODO: apply prop-types to all components

CSVExport.defaultProps = {
    children: undefined,
    asyncExportMethod: () => null,
    disable: false,
};

CSVExport.propTypes = {
    children: propsTypes.node,
    asyncExportMethod: propsTypes.func,
    disable: propsTypes.bool,
};
