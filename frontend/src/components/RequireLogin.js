import React from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { retryRequest, axiosConfig } from "../helpers/utils";
import Spinner from './Spinner/Spinner';

const pageRoleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/user/cookie`;

const RequireLogin = (Component) => {

    return class RequireLogin extends React.Component {
        state = {
            isLogin: false,
            isLoading: true
        }

        componentDidMount() {

            this.checkIfLogin();
        }

        checkIfLogin = async () => {

            try {
                const resp = await axios.get(
                    pageRoleURL,
                    axiosConfig
                );

                if (resp.data.status === true) {
                    this.setState({ isLogin: true, isLoading: false });
                } else {
                    this.setState({ isLogin: false, isLoading: false });
                }

            } catch (error) {
                retryRequest(this.checkIfLogin);
            }
        }

        render() {

            const { isLogin, isLoading } = this.state;

            if (isLoading) {
                return <Spinner />
            }
            if (!isLoading && !isLogin) {

                return <Redirect to="/login" />
            }
            return <Component {...this.props} isLogin={isLogin} />
        }
    }

}

export default RequireLogin;