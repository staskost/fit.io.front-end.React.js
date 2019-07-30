import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ReviewModalButton from './ReviewModalButton';
import ReviewedModalButton from './ReviewedModalButton';
import ContactModalButton from './ContactModalButton';
import Role from '../../hoc/Role';
import CancelTrainingSessionModalBody from './CancelTrainingSessionModalButton';
import DeleteCancelledTrainingSessionModalBody from './DeleteCancelledTrainingSessionModalButton';

/**
 * Different Actions available for each training session
 * Depending on time status (future/past) and user Role (user/trainer)
 * 
 * @property {String} timeStatus - 'PAST' or 'FUTURE' only accepted input - indicates if it's a past or future training session
 * @property {Object} trsData - The trainining session object passed with relative data
 * @property {Function} updateSessions - pass to children
 */
class AvailableActionsButtons extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reviewed: false,
            review: {},
            redirectToTrainersCalendar: false,
            redirectToTrainersProfile: false
        }
        this.fetchSessionReview = this.fetchSessionReview.bind(this);
        this.setRedirectToTrainersCalendar = this.setRedirectToTrainersCalendar.bind(this);
        this.setTrainersProfileRedirect = this.setTrainersProfileRedirect.bind(this);
    }

    componentDidMount() {
        console.log('AvailableActionsButtons didMount');
        console.log('TRS is:', this.props.trsData.id);
        console.log('TRS timeStatus:', this.props.timeStatus);

        if (this.props.timeStatus === 'PAST') {
            this.fetchSessionReview();
        }
    }

    // check if current training session has already been reviewed
    // if yes, we set state accordingly and pass it as props to relative child button/modal
    fetchSessionReview() {
        const url = 'http://localhost:8080/session/review/' + this.props.trsData.id;
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then(response => {
            console.log('sessionIsReviewed Response status:', response.status);
            console.log('Response', response);
            try {
                ((response)=>response.json()).then((data) => {
                    console.log('Training session has already been reviewed');
                    console.log('Review Data returned:', data);
                    this.setState({ reviewed: true, review: data });
                })
            } catch (e) {
                console.log('No review exists for this training session');
            }
        }).catch(error => console.error('Error:', error));
    }

    setRedirectToTrainersCalendar() {
        this.setState({ redirectToTrainersCalendar: true });
    }

    setTrainersProfileRedirect() {
        this.setState({ redirectToTrainersProfile: true });
    }

    renderRedirect() {
        if (this.state.redirectToTrainersCalendar) return <Redirect to={'/trainersCalendar/' + this.props.trsData.trainer.id} />
        if (this.state.redirectToTrainersProfile) return <Redirect to={'/trainer-profile/' + this.props.trsData.trainer.id} />
    }

    render() {
        // We return different options, depending on user role (user/trainer) and time status of training session (upcoming, past)
        if (this.props.userRole === Role.User) {
            if (this.props.timeStatus === 'PAST') {
                return (
                    <React.Fragment>
                        {this.renderRedirect()}
                        {this.state.reviewed ? <ReviewedModalButton trsData={this.props.trsData} review={this.state.review} userRole={this.props.userRole} /> : <ReviewModalButton trsData={this.props.trsData} handle={this.fetchSessionReview} />}
                        <button type="button" className="btn btn-danger btn-block" onClick={this.setRedirectToTrainersCalendar} >NEW APPOINTMENT</button>
                    </React.Fragment>
                );
            } else if (this.props.timeStatus === 'FUTURE') {
                return (
                    <React.Fragment>
                        {this.renderRedirect()}
                        <ContactModalButton trsData={this.props.trsData} userRole={this.props.userRole} />
                        <button type="button" className="btn btn-outline-info btn-block" onClick={this.setTrainersProfileRedirect}>PROFILE</button>
                        <CancelTrainingSessionModalBody trsData={this.props.trsData} updateSessions={this.props.updateSessions} />
                    </React.Fragment>
                );
            } else if ((this.props.timeStatus === 'CANCELLED')) {
                return <button type="button" className="btn btn-danger btn-block" disabled>CANCELLED</button>;
            } else {
                console.error('Unknown timeStatus for Training Session:', this.props.timeStatus);
            }
        } else if (this.props.userRole === Role.Trainer) {
            if (this.props.timeStatus === 'PAST') {
                return (
                    <React.Fragment>
                        {this.state.reviewed && <ReviewedModalButton trsData={this.props.trsData} review={this.state.review} userRole={this.props.userRole} />}
                        <ContactModalButton trsData={this.props.trsData} userRole={this.props.userRole} />
                    </React.Fragment>
                );
            } else if (this.props.timeStatus === 'FUTURE') {
                return (
                    <React.Fragment>
                        <ContactModalButton trsData={this.props.trsData} userRole={this.props.userRole} />
                        <CancelTrainingSessionModalBody trsData={this.props.trsData} updateSessions={this.props.updateSessions} />
                    </React.Fragment>
                );
            } else if ((this.props.timeStatus === 'CANCELLED')) {
                return (
                    <DeleteCancelledTrainingSessionModalBody trsData={this.props.trsData} updateSessions={this.props.updateSessions} />
                );
            } else {
                console.error('Unknown timeStatus for Training Session:', this.props.timeStatus);
            }
        } else {
            console.error('Unknown userRole for Training Session:', this.props.userRole);
        }
    }

}

export default AvailableActionsButtons;