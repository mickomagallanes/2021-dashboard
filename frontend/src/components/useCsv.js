

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import CSVExport from './CSVExport';
import useDidUpdateEffect from './useDidUpdateEffect';
import Papa from "papaparse";
import axios from 'axios';
import { axiosConfig } from '../helpers/utils';
import usePost from './usePost';

/**
 * Custom Hook to make CSV Import and Export button functionality
 * @param {String} exportURL url for export csv
 * @param {String} importURL url for import csv
 * @param {Array of Objects} csvHeader column header format of csv export
 * @param {String} csvFileName filename of csv export
 * @returns obj
 * @returns obj.exportCsvFunc function to be executed by ExportElem
 * @returns obj.importCsvFunc function to be executed by ImportElem
 * @returns obj.ImportElem Element of import which has button
 * @returns obj.ExportElem Element of export which has button
 * @returns obj.isLoadingExport boolean if export func is in loading
 * @returns obj.isLoadingImport boolean if import func is in loading
 * @returns obj.importCsvFuncResp response from import func, contains status
 */

function useCsv({
    exportURL,
    importURL,
    csvHeader,
    csvName
}) {

    const [uploadedCsv, setUploadedCsv] = useState();
    const [isLoadingExport, setLoadingExport] = useState(false);
    const [isLoadingImport, setLoadingImport] = useState(false);
    const [importCsvPost, importCsvResp] = usePost(importURL);

    const uploadCsv = async (e) => {
        setLoadingImport(true);

        Papa.parse(e.target.files[0], {
            complete: setUploadedCsv,
            header: true,
            skipEmptyLines: true
        });

        e.target.value = null;
    }

    const fetchCsvData = async () => {
        setLoadingExport(true);

        try {
            const respCsv = await axios.get(
                exportURL,
                axiosConfig
            );
            const { data } = respCsv;
            setLoadingExport(false);
            if (data.status) {

                return {
                    data: data.data,
                    headers: csvHeader,
                    filename: csvName
                };

            } else {
                return false;
            }

        } catch (error) {
            return false;
        }
    }

    useDidUpdateEffect(() => {
        importCsvPost({ data: uploadedCsv.data })

    }, [uploadedCsv])

    useDidUpdateEffect(() => {
        setLoadingImport(false);

    }, [importCsvResp])

    return {
        exportCsvFunc: fetchCsvData,
        importCsvFunc: uploadCsv,
        ImportElem,
        ExportElem,
        isLoadingExport,
        isLoadingImport,
        importCsvFuncResp: importCsvResp
    }
}


function ImportElem({ importCsvFunc, children }) {

    return (
        <>
            <Form.Label className="btn btn-info mt-2">{children ? children : "Add Import CSV"}<i className="mdi mdi-file-export"> </i>
                <Form.Control type="file" onChange={importCsvFunc} className="d-none" />
            </Form.Label>
        </>
    );
}

function ExportElem({ exportCsvFunc, children }) {

    return (
        <>
            <CSVExport asyncExportMethod={exportCsvFunc}>
                <Button variant="success"> {children ? children : "Export All To CSV"}<i className="mdi mdi-file-export"> </i> </Button>
            </CSVExport>

        </>
    );
}

export default useCsv;