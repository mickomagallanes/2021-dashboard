import { useState, useEffect } from 'react';
import axios from 'axios';

const axiosConfig = {
    withCredentials: true,
    timeout: 10000
}

function useFetch(apiUrl, customDeps = []) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function () {
            try {
                const respCount = await axios.get(
                    apiUrl,
                    axiosConfig
                );
                const { data } = respCount;

                setData(data);
                setLoading(false);
            } catch (error) {
                setData({ status: false, msg: error });
                setLoading(false);
            }
        })();

        return () => {
            setLoading(true);
            setData(null);
        }
    }, [apiUrl, ...customDeps]);

    return [
        data,
        loading
    ]
}

export default useFetch;