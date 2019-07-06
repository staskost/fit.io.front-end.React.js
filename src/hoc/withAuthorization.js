import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../context/user-context';
import Role from './Role';

/**
 * This HOC is responsible for implementing authorization throughout our app, where we see fit
 * Values of the 'Role' "enum-like" should be used for passing values to roles, to avoid mistakes (better handling)
 * If the user's role is not included in the given roles array, redirect to "/"
 * 
 * @param {Component} WrappedComponent - the component we want to control 
 * @param {Array} roles - contains only roles that should have access to the WrappedComponent
 * @param {Boolean} [redirect] - indicates whether to return redirect to "/" or return null 
 *                               if the role of loggedIn user is not included in the given roles array
 */
function withAuthorization(WrappedComponent, roles, redirect) {
    return class extends Component {

        static contextType = UserContext;

        render() {

            // User not logged in
            if (!this.context.isLoggedIn) {
                // component explicitly allowing access to logged out users only (e.g. Login/Register)
                if (roles && roles.includes(Role.Guest)) return <WrappedComponent {...this.props} />;
                // otherwise user is not authorized
                else {
                    if (redirect === true) {
                        return <Redirect to="/" />;
                    } else return null;
                }
            }

            // User not authorized for this component
            if (!(roles && roles.includes(this.context.userInfo.role.name))) {
                if (redirect === true) {
                    return <Redirect to="/" />
                }
                else return null;
            }

            // user authorized
            return <WrappedComponent {...this.props} />
        }
    }
}

export default withAuthorization;