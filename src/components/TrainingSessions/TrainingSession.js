import React, { Component } from 'react';
import AvailableActionsButtons from './AvailableActionsButtons';
import Role from '../../hoc/Role';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Used to display a single training session, by the TrainingSessions component
 * 
 * @property {Object} props.trs - the training session object, containing relative data
 * @property {String} props.userRole - role of loggedIn user
 * @property {String} props.timeStatus - passed to AvailableActionsButtons to render only relative buttons/modals
 * @property {Function} props.handle - passed to AvailableActionsButtons to re-render based on action
 */
class TrainingSession extends Component {
    render() {
        // We initialize the values for the 'other' member of the training session
        // e.g. if the logged in user is a trainer, we want the info of the client to appear on the training session info and vice versa
        let othersFullName, othersTitle;
        let othersPhotoLink = '';
        if (this.props.userRole === Role.User) {
            othersFullName = this.props.trs.trainer.firstName + ' ' + this.props.trs.trainer.lastName;
            othersTitle = 'Trainer:';
            othersPhotoLink = this.props.trs.trainer.photoLink;
        } else {
            othersFullName = this.props.trs.client.firstName + ' ' + this.props.trs.client.lastName;
            othersTitle = 'Client:';
            othersPhotoLink = this.props.trs.client.photoLink;
        }
        return (
            <div className="container my-2 shadow-sm">
                <div className="row bg-light border">
                    {/* We display fontawesome default icon if trainer hasn't uploaded a photo */}
                    {othersPhotoLink === '' || othersPhotoLink === null ?
                        (<div className="col-md-3 border-right text-center pt-5 pb-2">
                            <FontAwesomeIcon icon={["far", "user-circle"]} size="5x" />
                        </div>) :
                        (<div className="col-md-3 border-right text-center py-3">
                            <img className="img-fluid" src={othersPhotoLink} alt="Profile" style={{ height: "150px" }} />
                        </div>)}
                    <div className="col-md-3 pt-4 px-4 border-right text-center">
                        <h6>{othersTitle}</h6>
                        <h4 className="text-primary">{othersFullName}</h4>
                        <h6>Training type:</h6>
                        <h5 className="text-primary">{this.props.trs.trainingType.title}</h5>
                    </div>
                    <div className="col-md-3 pt-4 px-4 border-right">
                        <p className="card-text"><FontAwesomeIcon icon={["far", "calendar-alt"]} /> &nbsp;{this.props.trs.date}, {this.props.trs.time}</p>
                        <p className="card-text"><FontAwesomeIcon icon="map-marked-alt" /> &nbsp;{this.props.trs.area.city}</p>
                        <p className="card-text"><FontAwesomeIcon icon="wallet" /> &nbsp;{this.props.trs.trainer.price}&euro;</p>
                    </div>
                    <div className="col-md-3 p-5">
                        <AvailableActionsButtons timeStatus={this.props.timeStatus} trsData={this.props.trs} userRole={this.props.userRole} updateSessions={this.props.updateSessions} />
                    </div>
                </div>
            </div >
        );
    }
}

export default TrainingSession;