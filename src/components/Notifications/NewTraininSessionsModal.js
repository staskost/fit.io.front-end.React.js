import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom";
import './modals.css';

class NewTraininSessionsModal extends Component {

    // removeFromNew = () => {
    //     window.$("#newSessionsModal").modal("hide");
    // }

    render() {
        return (
            <React.Fragment>

                {/* Modal */}
                <div
                    class="modal fade"
                    id="newSessionsModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">  Training sessions </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <h6>New Sessions</h6>
                                <hr />
                                <ul class="list-group">
                                    {this.props.newTrainingSessions.map(session => (
                                        <Link class="list-group-item" to={{
                                            pathname: "/trainingSession",
                                            state: { session: session }
                                        }} onClick={this.props.removeSessionFromNew.bind(this, session)} >
                                            {"Date: " + session.date + " " + session.time + " , Area: " + session.area.city + " ,Type: " + session.trainingType.title}
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

export default withRouter(NewTraininSessionsModal);
