import React, { Component } from 'react';
import UserContext from '../../context/user-context';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class LogoutModalBody extends Component {

    static contextType = UserContext;  

    handleLogout = () => {
        const url = 'http://localhost:8080/login/logout';

        fetch(url, {
            method: 'POST',
            headers: {
                'X-MSG-AUTH': this.context.token
            }
        }).then(response => {
            // Handle logout action to localStorage
            if (response.status === 200) {
                localStorage.clear();
                this.context.updateUserContext();
            }
        }).catch(error => console.error('Error on handleLogout():', error));
    }
    
    render() {
        return (
            <div className="modal fade" id="logoutModal">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="logoutModalLabel">Logout</h5>
                            <button className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center">
                                Are you sure you want to logout?
                        </div>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button className="btn btn-danger btn-block col-sm-4" data-dismiss="modal" onClick={this.handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuthorization(LogoutModalBody, [Role.User, Role.Trainer, Role.Admin]);