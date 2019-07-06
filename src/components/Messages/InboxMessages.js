import React, { Component } from 'react';
import MessagesPaginated from './MessagesPaginated';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class InboxMessages extends Component {
    render() {
        return (
            <MessagesPaginated folderType='INBOX' />
        );
    }
}

export default withAuthorization(InboxMessages, [Role.User, Role.Trainer, Role.Admin], true);