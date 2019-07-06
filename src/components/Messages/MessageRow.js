import React, { Component } from 'react';
import ReplyModalButton from './ReplyModalButton';

/**
 * Used by MessagesPaginated component
 * 
 * @property {Number} props.i - used as the index of the message shown on the messages table
 * @property {Object} props.msg - the message object with relative data
 * @property {String} props.folderType - indicates if this is inbox or sentbox - passed to child ReplyModalButtonComponent
 */
class MessageRow extends Component {
    render() {
        const msgDate = new Date(this.props.msg.date);
        return (
            <tr>
                <th scope="row">{this.props.i}</th>
                <td>{this.props.folderType === 'INBOX' ? this.props.msg.sender.firstName +' '+ this.props.msg.sender.lastName : this.props.msg.receiver.firstName +' '+ this.props.msg.receiver.lastName}</td>
                <td>{this.props.msg.text}</td>
                <td>{msgDate.toDateString()} {msgDate.toLocaleTimeString()}</td>
                <td><ReplyModalButton msg={this.props.msg} folderType={this.props.folderType} /></td>
            </tr>
        );
    }
}

export default MessageRow;