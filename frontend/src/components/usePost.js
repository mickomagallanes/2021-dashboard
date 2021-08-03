import { useState } from 'react';
import axios from 'axios';
import { axiosConfig, axiosConfigFormData } from '../helpers/utils';

export default function usePost(apiUrl) {

    const [data, setData] = useState(null);

    const postData = async (params) => {
        try {
            const resp = await axios.post(
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

export function usePostFormData(apiUrl) {

    const [data, setData] = useState(null);

    const postData = async (params) => {
        try {
            const resp = await axios.post(
                apiUrl,
                params,
                axiosConfigFormData
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
