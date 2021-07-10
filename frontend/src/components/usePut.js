import { useState } from 'react';
import axios from 'axios';
import { axiosConfig } from '../helpers/utils';

function usePut(apiUrl) {

    const [data, setData] = useState(null);

    const postData = async (params) => {
        try {
            const resp = await axios.put(
                apiUrl,
                params,
                axiosConfig
            );

            const { data } = resp;

            setData(data);

        } catch (error) {
            setData({ data: { status: false, msg: `${error}` } })
        }

    }

    return [
        postData,
        data
    ]
}

export default usePut;