import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { axiosConfig } from '../helpers/utils';
import ReactDOM from "react-dom";

function useFetch(apiUrl, { customDeps = [], initialData = null } = {}) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const isCancelled = useRef(false);
    const extractedData = useRef(initialData);

    useEffect(() => {
        // reset value if deps is changed
        isCancelled.current = false;
        (async function () {

            try {
                const respCount = await axios.get(
                    apiUrl,
                    axiosConfig
                );
                const { data } = respCount;

                if (!isCancelled.current) {
                    ReactDOM.unstable_batchedUpdates(() => {
                        setData(data);
                        setLoading(false);
                        extractedData.current = data.data;
                    });
                }


            } catch (error) {
                if (!isCancelled.current) {
                    ReactDOM.unstable_batchedUpdates(() => {
                        setData({ status: false, msg: error });
                        setLoading(false);
                    });
                }
            }
        })();

        return () => {
            ReactDOM.unstable_batchedUpdates(() => {
                setData(null);
                setLoading(true);
                isCancelled.current = true;
                extractedData.current = initialData;
            });
        }

    }, [apiUrl, initialData, ...customDeps]);

    return [
        data,
        loading,
        extractedData.current
    ]
}

export default useFetch;