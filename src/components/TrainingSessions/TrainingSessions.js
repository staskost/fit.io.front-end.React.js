import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import UserContext from '../../context/user-context';
import TrainingSession from '../TrainingSessions/TrainingSession';
import ButtonLink from '../../components/Utils/ButtonLink';
import Role from '../../hoc/Role';
import withAuthorization from '../../hoc/withAuthorization';

class TrainingSessions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            trainingSessions: [],
        };
        this.fetchTrainingSessionsUrl = '';
        this.fetchTrainingSessions = this.fetchTrainingSessions.bind(this);

        // Depending on props will get respective training sessions
        if (this.props.folderType === 'FUTURE') {
            this.trainingSessionsTitle = 'Future';
        } else if (this.props.folderType === 'PAST') {
            this.trainingSessionsTitle = 'Past';
        } else if (this.props.folderType === 'CANCELLED') {
            this.trainingSessionsTitle = 'Cancelled';
        } else {
            console.error('Unknown training sessions type');
        }

    }

    static contextType = UserContext;

    componentDidMount() {
        console.log('TrainingSessions component did mount');
        console.log('User Role: ', this.context.userInfo.role.name);
        if (this.context.userInfo.role.name === Role.User) {
            this.fetchTrainingSessionsUrl = 'http://localhost:8080/session/client-sessions';
        } else if (this.props.folderType === 'CANCELLED') {
                this.fetchTrainingSessionsUrl = 'http://localhost:8080/session/canceled-sessions';
        } else if (this.context.userInfo.role.name === Role.Trainer) {
            this.fetchTrainingSessionsUrl = 'http://localhost:8080/session/trainer-sessions';
        } else console.error('Invalid role for training session:', this.context.userInfo.role.name);

        this.fetchTrainingSessions();
    }

    fetchTrainingSessions() {
        fetch(this.fetchTrainingSessionsUrl, {
            method: 'GET',
            headers: {
                'X-MSG-AUTH': this.context.token,
                'Accept': 'application/json',
            }
        }).then(response => {
            console.log('Response status:', response.status);
            if (response.status === 200) {
                response.json().then(data => {
                    console.log(data);
                    console.log('Saving fetched training sessions to state');
                    this.setState({
                        trainingSessions: data
                    });
                    console.log('Training Sessions in state:', this.state.trainingSessions);
                })
            }
        }).catch(error => console.error('Error:', error));

        console.log('End of fetchTrainingSessions');
    }

    render() {

        return (
            <React.Fragment>
                <nav className="navbar navbar-light navbar-expand-md">
                    <div className="container col-sm pt-4 pb-0">
                        <ul className="navbar-nav mx-auto">
                            <li>
                                <ButtonLink label="FUTURE" to="/training-sessions" location={this.props.location.pathname} />
                            </li>
                            <li>
                                <span className="col-1"> </span>
                            </li>
                            <li>
                                <ButtonLink label="PAST" to="/training-sessions/past" location={this.props.location.pathname} />
                            </li>
                            <li>
                                <span className="col-1"> </span>
                            </li>
                            {this.context.userInfo.role.name === Role.Trainer && (
                                <li>
                                    <ButtonLink label="CANCELLED" to="/training-sessions/cancelled" location={this.props.location.pathname} />
                                </li>)
                            }
                        </ul>
                    </div>
                </nav>

                <div className="container py-3 text-center">
                    <h2>{this.trainingSessionsTitle} Training Sessions</h2>
                    {console.log(this.state.trainingSessions)}
                </div>

                <div style={{ minHeight: '60vh' }}>
                    {this.state.trainingSessions.map((t, index) => {
                        if (this.props.folderType === 'CANCELLED') {
                            return <TrainingSession key={t.id} trs={t} timeStatus="CANCELLED" userRole={this.context.userInfo.role.name} updateSessions={this.fetchTrainingSessions} />
                        }

                        console.log('Updating li for training session ' + index);
                        let trsDate = new Date(t.date + ' ' + t.time);
                        console.log('Training session date:', trsDate);
                        let now = new Date();
                        console.log('Now value:', now.valueOf());
                        console.log('Training Session date value:', trsDate.valueOf());

                        // Adds only corresponding training sessions to array returned
                        // Future and past sessions are calculated here in the front-end
                        if (now.valueOf() > trsDate.valueOf() && this.props.folderType === 'PAST') {
                            return <TrainingSession key={t.id} trs={t} timeStatus="PAST" userRole={this.context.userInfo.role.name} />
                        } else if (now.valueOf() < trsDate.valueOf() && this.props.folderType === 'FUTURE') {
                            return <TrainingSession key={t.id} trs={t} timeStatus="FUTURE" userRole={this.context.userInfo.role.name} updateSessions={this.fetchTrainingSessions} />
                        }
                    })}
                </div>
            </React.Fragment>
        );

    }

}

export default withAuthorization(withRouter(TrainingSessions), [Role.User, Role.Trainer], true);