import { useState, useEffect } from 'react';
import axios from 'axios';

const axiosConfig = {
    withCredentials: true,
    timeout: 10000
}

function useFetch(apiUrl) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState([]);

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

    }, []);

    return [
        data,
        loading
    ]
}

export default useFetch;