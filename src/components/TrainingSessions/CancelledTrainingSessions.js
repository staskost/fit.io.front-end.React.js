import React, { Component } from 'react';
import TrainingSessions from './TrainingSessions';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class CancelledTrainingSessions extends Component {
    render() {
        return (
            <TrainingSessions folderType='CANCELLED' />
        );
    }
}

export default withAuthorization(CancelledTrainingSessions, [Role.User, Role.Trainer], true);