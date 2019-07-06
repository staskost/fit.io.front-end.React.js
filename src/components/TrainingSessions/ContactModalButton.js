import React, { Component } from 'react';
import Role from '../../hoc/Role';
import UserContext from '../../context/user-context';

/**
 * To contact user or trainer respectively
 * Checks are made to determine the user sending and the user receiving the message
 * 
 * @property {Object} props.trsData - The training session object passed with relative data
 */
class ContactModalButton extends Component {

    constructor(props) {
        super(props);
        this.message = React.createRef();
        this.handleSendMessage = this.handleSendMessage.bind(this);
        console.log('Current user Role: ', props.userRole);
        if (props.userRole === Role.User) {
            this.othersInfo = this.props.trsData.trainer;
            console.log('Others info:', this.props.trsData.trainer);
        } else if (props.userRole === Role.Trainer) {
            this.othersInfo = this.props.trsData.client;
            console.log('Others info:', this.props.trsData.client);
        } else console.error('Unknown role for training session contact modal:', props.userRole);
    }

    static contextType = UserContext;

    handleSendMessage() {
        console.log('Inside handleSendMessage');
        console.log('MessageRef:', this.message.current.value);
        const url = 'http://localhost:8080/messages/save/' + this.othersInfo.username;

        fetch(url, {
            method: 'POST',
            headers: {
                'X-MSG-AUTH': this.context.token
            },
            body: this.message.current.value
        }).then(response => {
            console.log('Response status:', response.status);
            console.log('token:', this.context.token);
            if (response.status === 200) {
                console.log('Message sent.');
            }
        }).catch(error => console.error('Error:', error));
    }

    render() {
        return (
            <React.Fragment>
                <button type="button" className="btn btn-primary btn-block" data-toggle="modal" data-target={'#cm_' + this.props.trsData.id}>CONTACT</button>
                <div className="modal fade" id={'cm_' + this.props.trsData.id} tabIndex="-1" role="dialog" aria-labelledby={'cmLabel_' + this.props.trsData.id} aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={'cmLabel_' + this.props.trsData.id}>New message to {this.othersInfo.firstName} {this.othersInfo.lastName}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor={'message-text_' + this.props.trsData.id} className="col-form-label">Message:</label>
                                        <textarea className="form-control" id={'message-text_' + this.props.trsData.id} ref={this.message} required ></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSendMessage}>Send message</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ContactModalButton;