import React, { Component } from 'react';
import TrainingSessions from './TrainingSessions';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

class PastTrainingSessions extends Component {
    render() {
        return (
            <TrainingSessions folderType='PAST' />
        );
    }
}

export default withAuthorization(PastTrainingSessions, [Role.User, Role.Trainer], true);