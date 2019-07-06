import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/user-context';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class UserNav extends Component {

    static contextType = UserContext;

    render() {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" id="navbarProfileDropdownMenuLink" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    {this.context.userInfo.username}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarProfileDropdownMenuLink">
                    <Link className="dropdown-item" to="/training-sessions">My Training Sessions</Link>
                    <Link className="dropdown-item" to="/messages">My Messages</Link>
                    {this.context.userInfo.role.name === Role.Trainer &&
                        <Link className="dropdown-item" to="/my-training-types">My Training Types</Link>
                    }
                    <Link className="dropdown-item" to="/myCalendar">My Calendar</Link>
                    <Link className="dropdown-item" to="/myaccount">My Account</Link>
                    <a className="dropdown-item" data-toggle="modal" data-target="#logoutModal"
                        href="#logoutModal">Logout</a>
                </div>
            </li>
        );
    }

}

export default withAuthorization(UserNav, [Role.User, Role.Trainer]);