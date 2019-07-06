import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserContext from '../../context/user-context';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

/**
 * Button/modal to delete a cancelled training session
 * 
 * @property {Object} trsData - The trainining session object passed with relative data
 * @property {Function} updateSessions - handle to update training sessions list if a session is deleted
 */
class DeleteCancelledTrainingSessionModalBody extends Component {

    static contextType = UserContext;

    handleDeleteCancelledSession = () => {
        const url = 'http://localhost:8080/session/deleteNotifiedCanceledSessions/' + this.props.trsData.id;
        console.log('Entered handleDeleteCancelledSession');

        // We send ajax call to backend
        fetch(url, {
            method: 'POST',
            headers: {
                'X-MSG-AUTH': this.context.token
            }
        }).then(response => {
            console.log('Delete Cancelled Session Response status:', response.status);
            if (response.status === 200) {
                console.log('Deleted Cancelled training session');
                this.props.updateSessions();
            }
        }).catch(error => console.error('Error on handleDeleteCancelledSession:', error));
    }

    render() {
        return (
            <React.Fragment>
                <button type="button" className="btn btn-danger btn-block" data-toggle="modal" data-target={'#cancel_' + this.props.trsData.id}>DELETE</button>
                <div className="modal fade" id={'cancel_' + this.props.trsData.id} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="cancelModalLabel">Delete Cancelled Session</h5>
                                <button className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="row text-center mb-2">
                                    <div className="col-md-8 mx-auto">Are you sure you want to delete your cancelled {this.props.trsData.trainingType.title} training session with {this.props.trsData.trainer.firstName} {this.props.trsData.trainer.lastName}?</div>
                                </div>
                                <hr />
                                <div className="col-8 col-sm-6 mx-auto">
                                    <FontAwesomeIcon icon={["far", "calendar-alt"]} /> &nbsp;{this.props.trsData.date}, {this.props.trsData.time}
                                </div>
                                <div className="col-8 col-sm-6 mx-auto">
                                    <FontAwesomeIcon icon="map-marked-alt" /> &nbsp;{this.props.trsData.area.city}
                                </div>
                                <div className="col-8 col-sm-6 mx-auto">
                                    <FontAwesomeIcon icon="wallet" /> &nbsp;{this.props.trsData.trainer.price}&euro;
                                </div>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button className="btn btn-danger btn-block col-sm-4" data-dismiss="modal" onClick={this.handleDeleteCancelledSession}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

// we only want the trainer to be able to delete the cancelled session in our app
export default withAuthorization(DeleteCancelledTrainingSessionModalBody, [Role.Trainer]);