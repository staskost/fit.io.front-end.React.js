import React, { Component } from 'react';
import MessagesPaginated from './MessagesPaginated';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class OutboxMessages extends Component {
    render() {
        return (
            <MessagesPaginated folderType='OUTBOX' />
        );
    }
}

export default withAuthorization(OutboxMessages, [Role.User, Role.Trainer, Role.Admin], true);