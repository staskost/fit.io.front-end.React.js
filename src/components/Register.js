import React, { Component } from 'react';
import ButtonLink from './Utils/ButtonLink';
import Role from '../hoc/Role';
import withAuthorization from '../hoc/withAuthorization';

class Register extends Component {

    constructor(props) {
        super(props);
        this.email = React.createRef();
        this.username = React.createRef();
        this.password = React.createRef();
        this.firstName = React.createRef();
        this.lastName = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            roleId: ((this.props.match.params.rolename === 'trainer') ? 2 : 1),
            regError: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // We MUST make this check, otherwise the component will never stop updating (Infinite loop)
        if (prevState.roleId !== ((this.props.match.params.rolename === 'trainer') ? 2 : 1)) {
            this.setState({ roleId: ((prevState.roleId === 2) ? 1 : 2) });
        }
    }

    handleSubmit(event) {
        const url = 'http://localhost:8080/register/save';
        const formData = {
            "username": this.username.current.value,
            "password": this.password.current.value,
            "email": this.email.current.value,
            "firstName": this.firstName.current.value,
            "lastName": this.lastName.current.value,
            "role": {
                "id": this.state.roleId
            }
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(response => {
            if (response.status === 200) {
                this.props.history.push('/');
            } else if (response.status === 400) {
                response.json().then(data => {
                    this.setState({ regError: data.message });
                })
            } else {
                this.setState({ regError: 'Unknown Error...' });
            }
        }).catch(error => console.error('Error:', error));

        event.preventDefault();
    }

    render() {
        return (
            <div style={{ minHeight: '80vh' }}>
                <nav className="navbar navbar-light navbar-expand-md">
                    <div className="container col-sm pt-4 pb-2">
                        <ul className="navbar-nav mx-auto">
                            <li>
                                <ButtonLink label="Register as User" to="/register/user" location={this.props.location.pathname} />
                            </li>
                            <li>
                                <span className="col-1"> </span>
                            </li>
                            <li>
                                <ButtonLink label="Register as Trainer" to="/register/trainer" location={this.props.location.pathname} />
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="container col-8">
                    <div className="text-center">
                        <h1 className="mx-auto">Register as {this.props.match.params.rolename}</h1>
                        {this.state.regError && <h4 style={{ color: 'red' }}>{this.state.regError}</h4>}
                    </div>
                    <form onSubmit={this.handleSubmit} className="pt-3 pb-2">
                        <div className="form-group row justify-content-center">
                            <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                            <div className="col-sm-4">
                                <input type="email" className="form-control" id="email" name="email" placeholder="email@mail.com"
                                    required ref={this.email} />
                            </div>
                        </div>
                        <div className="form-group row justify-content-center">
                            <label htmlFor="email" className="col-sm-3 col-form-label">Username</label>
                            <div className="col-sm-4">
                                <input type="text" className="form-control" id="username" name="username" required ref={this.username} />
                            </div>
                        </div>
                        <div className="form-group row justify-content-center">
                            <label htmlFor="inputPassword" className="col-sm-3 col-form-label">Password</label>
                            <div className="col-sm-4 ">
                                <input type="password" className="form-control" id="inputPassword" name="password" minLength="8"
                                    aria-describedby="passwordHelpBlock" required ref={this.password} />
                                <small id="passwordHelpBlock" className="form-text text-muted">
                                    At least 8 characters long
                            </small>
                            </div>
                        </div>
                        <div className="form-group row justify-content-center">
                            <label htmlFor="firstName" className="col-sm-3 col-form-label">First Name</label>
                            <div className="col-sm-4">
                                <input type="text" className="form-control" id="firstName" name="firstName" required ref={this.firstName} />
                            </div>
                        </div>
                        <div className="form-group row justify-content-center">
                            <label htmlFor="lastName" className="col-sm-3 col-form-label">Last Name</label>
                            <div className="col-sm-4">
                                <input type="text" className="form-control" id="lastName" name="lastName" required ref={this.lastName} />
                            </div>
                        </div>
                        <div className="form-group row justify-content-center">
                            <div className="col-sm-3">
                                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        );
    }
}

// only guest can access registration page
export default withAuthorization(Register, [Role.Guest], true);