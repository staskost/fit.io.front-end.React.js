import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import $ from 'jquery';

class UserRow extends Component {

    state = {
        user: this.props.user
    }

    banUser = () => {
        if (window.confirm("Are you sure you want to Ban " + this.state.user.username + " ?")) {
            $.ajax({
                type: "POST",
                url: `http://localhost:8080/find/bann-user/${this.state.user.id}`,
                headers: { "X-MSG-AUTH": localStorage.getItem("token") },
                async: true,
                success: () => {
                    let user = this.state.user;
                    user.bannedStatus = 1;
                    this.setState({
                        user: user
                    })
                    alert("User Banned");
                },
                error: () => { }
            });
        }
    }

    unbanUser = () => {
        if (window.confirm("Are you sure you want to Unban " + this.state.user.username + " ?")) {
            $.ajax({
                type: "POST",
                url: `http://localhost:8080/find/unbann-user/${this.state.user.id}`,
                headers: { "X-MSG-AUTH": localStorage.getItem("token") },
                async: true,
                success: () => {
                    let user = this.state.user;
                    user.bannedStatus = 0;
                    this.setState({
                        user: user
                    })
                    alert("User Unbanned");
                },
                error: () => { }
            });
        }
    }

    render() {
        const { user } = this.state;
        const { index } = this.props;
        return (
            <tr>
                <td>{index}</td>
                <td>{user.username}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                {/* <td><img src={user.photoLink} alt="profilePic" style={{width:"50px"}} ></img></td> */}
                <td>{user.role.name}</td>
                <td>{user.price}</td>
                {user.bannedStatus == 0 ?
                    (<td class="text-center">
                        <button type="button" class="btn btn-danger" onClick={this.banUser.bind(this)}> Ban</button>
                        <button type="button" class="btn btn-secondary btn-xs" onClick={this.props.openModal.bind(this, user)}> <FontAwesomeIcon icon="envelope" /></button>
                    </td>)
                    :
                    (<td class="text-center">
                        <button type="button" class="btn btn-primary" onClick={this.unbanUser.bind(this)}> Unban</button>
                        <button type="button" class="btn btn-secondary btn-xs" onClick={this.props.openModal.bind(this, user)}> <FontAwesomeIcon icon="envelope" /></button>
                    </td>)
                }

            </tr>
        )
    }
}

export default UserRow
