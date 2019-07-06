import React, { Component } from 'react';
import UserContext from '../../context/user-context';

/**
 * @property {Object} props.msg - message object with relative info
 * @property {String} props.folderType - INBOX or SENTBOX
 */
class ReplyModalButton extends Component {

    constructor(props) {
        super(props);
        this.message = React.createRef();
        this.receiver = (this.props.folderType === 'INBOX') ? this.props.msg.sender.username : this.props.msg.receiver.username;
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    static contextType = UserContext;

    handleSendMessage() {
        const url = 'http://localhost:8080/messages/save/' + this.receiver;
        
        fetch(url, {
            method: 'POST',
            headers: {
                'X-MSG-AUTH': this.context.token
            },
            body: this.message.current.value
        }).then(response => {
            if (response.status === 200) {
                console.log('Message sent.');
            }
        }).catch(error => console.error('Error:', error));
    }

    render() {
        const receiverFullName = (this.props.folderType === 'INBOX') ? this.props.msg.sender.firstName + ' ' + this.props.msg.sender.lastName
                                : this.props.msg.receiver.firstName + ' ' + this.props.msg.receiver.lastName;
        return (
            <React.Fragment>
                <button type="button" className="btn btn-outline-primary btn-block" data-toggle="modal" data-target={'#rm_' + this.props.msg.id}>Contact</button>
                <div className="modal fade" id={'rm_' + this.props.msg.id} tabIndex="-1" role="dialog" aria-labelledby={'rmLabel_' + this.props.msg.id} aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={'rmLabel_' + this.props.msg.id}>New message to {receiverFullName}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor={'message-text_' + this.props.msg.id} className="col-form-label">Message:</label>
                                        <textarea className="form-control" id={'message-text_' + this.props.msg.id} ref={this.message} required ></textarea>
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

export default ReplyModalButton;