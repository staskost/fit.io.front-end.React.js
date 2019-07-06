import React, { Component } from 'react';
import UserContext from '../../context/user-context';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class LoginModalBody extends Component {

    constructor(props) {
        super(props);
        this.username = React.createRef();
        this.password = React.createRef();
        this.handleLogin = this.handleLogin.bind(this);
    }

    static contextType = UserContext;

    handleLogin(event) {
        const url = 'http://localhost:8080/login/user';
        const loginData = {
            "username": this.username.current.value,
            "password": this.password.current.value
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    // Handle login response to localStorage
                    localStorage.setItem('token', data.alphanumeric);
                    localStorage.setItem('userInfo', JSON.stringify(data.user));
                    this.context.updateUserContext();
                })
            }
            else{
                response.json().then(data => {
                    alert(data.message);
                })
            }
        }).catch(error => console.error('Error:', error));

        event.preventDefault();
    }

    render() {
        return (
            <div className="modal fade" id="loginModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loginModalLabel">Login</h5>
                            <button className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <form action="" method="POST">
                            <div className="modal-body">
                                <div className="form-group col-sm-7 mx-auto text-center">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" className="form-control" name="username" ref={this.username} required />
                                </div>
                                <div className="form-group col-sm-7 mx-auto text-center">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" name="password" ref={this.password} required />
                                </div>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="submit" className="btn btn-primary btn-block col-sm-4" data-dismiss="modal" onClick={this.handleLogin}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuthorization(LoginModalBody, [Role.Guest]);