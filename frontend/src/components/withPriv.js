import React from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { retryRequest } from "../helpers/utils";
import Spinner from './Spinner/Spinner';

const pageRoleURL = `${process.env.REACT_APP_BACKEND_HOST}/API/pagerole/authorize`;

/**
 * get count of all role for pagination
 * @param {Component} Component rendered component
 * @param {String} [apiURL] parent page path, specified if Component is only a subpage
 */
const withPriv = (Component, apiURL = false) => {

    return class withPriv extends React.Component {
        state = {
            isLoading: true,
            priv: null
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
            const param = { "pagepath": apiURL ? apiURL : location.pathname };

            try {
                const resp = await axios.post(
                    pageRoleURL,
                    param,
                    axiosConfig
                );

                if (resp.data.status === true) {
                    this.setState({ isLoading: false, priv: resp.data.data });
                } else {
                    // TODO: find a way to not reload the page, but reload sidebar data
                    window.location.reload();
                }

            } catch (error) {
                retryRequest(this.authorizeRole);
            }
        }

        render() {

            const { priv, isLoading } = this.state;

            if (isLoading) {
                return <Spinner />
            } else if (!isLoading && priv !== null) {
                return <Component priv={priv} {...this.props} />
            } else {
                // when privilege data is not found, that means the data is deleted
                // so the sidebar data in the frontend must load again
                return <Redirect to="/login" />
            }

        }
    }

}

export default withPriv;