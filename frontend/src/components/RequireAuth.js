import React from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { retryRequest } from "../helpers/utils";
import Spinner from '../components/Spinner/Spinner';

const pageRoleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/pagerole/authorize`;

const RequireAuth = (Component, apiURL = false) => {

    return class extends React.Component {
        state = {
            isAuthenticated: false,
            isLoading: true,
            priv: 0
        }

        componentDidMount() {

            this.authorizeRole();
        }

        componentWillUnmount() {

            this.setState = () => {
                return;
            }
        }

        authorizeRole = async () => {
            const axiosConfig = {
                withCredentials: true,
                timeout: 10000
            }

            const { location } = this.props;
            const param = { "pagepath": !!apiURL ? apiURL : location.pathname };

            try {
                const resp = await axios.post(
                    pageRoleURL,
                    param,
                    axiosConfig
                );

                if (resp.data.status === true) {
                    this.setState({ isAuthenticated: true, isLoading: false, priv: resp.data.priv });
                } else {
                    this.setState({ isAuthenticated: false, isLoading: false });
                }

            } catch (error) {
                retryRequest(this.authorizeRole);
            }
        }

        render() {

            const { isAuthenticated, isLoading } = this.state;

            if (isLoading || isAuthenticated) {
                return <Component priv={this.state.priv} {...this.props} />
            }
            if (!isAuthenticated) {

                return <Redirect to="/login" />
            }

        }
    }

}

export default RequireAuth;