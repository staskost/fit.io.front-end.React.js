import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class TrainersSearchNav extends Component {
    render() {
        return (
            <li className="nav-item">
                <Link className="nav-link" to="/trainers2">Trainers</Link>
            </li>
        );
    }
}

export default withAuthorization(TrainersSearchNav, [Role.Guest, Role.User]);