import React from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { retryRequest } from "../helpers/utils";
import Spinner from './Spinner/Spinner';

const pageRoleURL = "http://localhost:3000/API/user/cookie";

const RequireLogout = (Component) => {

    return class extends React.Component {
        state = {
            isLogout: false,
            isLoading: true
        }

        componentDidMount() {

            this.checkIfLogout();
        }

        checkIfLogout = async () => {
            const axiosConfig = {
                withCredentials: true,
                timeout: 10000
            }

            try {
                const resp = await axios.get(
                    pageRoleURL,
                    axiosConfig
                );

                if (resp.data.status === true) {
                    this.setState({ isLogout: false, isLoading: false });
                } else {
                    this.setState({ isLogout: true, isLoading: false });
                }

            } catch (error) {
                retryRequest(this.checkIfLogout);
            }
        }

        render() {

            const { isLogout, isLoading } = this.state;

            if (isLoading) {
                return <Spinner />
            }
            if (!isLogout) {

                return <Redirect to="/home" />
            }
            return <Component />
        }
    }

}

export default RequireLogout;