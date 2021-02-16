import React from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { retryRequest } from "../helpers/utils";
import Spinner from '../components/Spinner/Spinner';

const pageRoleURL = "http://localhost:3000/API/pagerole/authorize";

const RequireAuth = (Component) => {

    return class extends React.Component {
        state = {
            isAuthenticated: false,
            isLoading: true
        }

        componentDidMount() {

            this.authorizeRole();
        }

        authorizeRole = async () => {
            const axiosConfig = {
                withCredentials: true,
                timeout: 10000
            }

            const { location } = this.props;
            const param = { "pagepath": location.pathname };

            try {
                const resp = await axios.post(
                    pageRoleURL,
                    param,
                    axiosConfig
                );

                if (resp.data.status === true) {
                    this.setState({ isAuthenticated: true, isLoading: false });
                } else {
                    this.setState({ isAuthenticated: false, isLoading: false });
                }

            } catch (error) {
                retryRequest(this.authorizeRole);
            }
        }

        render() {

            const { isAuthenticated, isLoading } = this.state;

            if (isLoading) {
                return <Spinner />
            }
            if (!isAuthenticated) {

                return <Redirect to="/login" />
            }
            return <Component />
        }
    }

}

export default RequireAuth;