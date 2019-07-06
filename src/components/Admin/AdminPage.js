import React, { Component } from 'react';
import Role from '../../hoc/Role';
import { Link } from "react-router-dom";
import withAuthorization from '../../hoc/withAuthorization';

class AdminPage extends Component {

    render() {
        return (
                <div class="wrapper" style={{ textAlign: "center" }}>
                    <Link class="btn btn-warning" to="/allUsers" style={{ marginTop: "50px" }}>ALL USERS</Link>
                </div>
        );
    }
}

export default withAuthorization(AdminPage, [Role.Admin], true);