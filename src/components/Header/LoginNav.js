import React, { Component } from 'react';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class LoginNav extends Component {
    render() {
        return (
            <li className="nav-item">
                <a className="nav-link" data-toggle="modal" data-target="#loginModal" href="#loginModal">Login</a>
            </li>
        );
    }
}

export default withAuthorization(LoginNav, [Role.Guest]);