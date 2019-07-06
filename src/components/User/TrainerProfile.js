import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserContext from '../../context/user-context';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';
import ReviewRow from './ReviewRow';

/**
 * The trainer profile page, giving relative info, reviews and ability to book an appointment (for logged in users only)
 * optional props are either passed via redirect from another component or fetched via ajax calls if missing
 * 
 * @param {Number} props.trainerId - the trainer id matched from route uri
 * @property {Object} [props.trainer] - the trainer object
 * @property {Array} [props.trainerAreas] - the areas the trainer has chosen for availability
 * @property {Array} [props.trainerTypes] - the training types the trainer specializes in
 */
class TrainerProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            trainer: {},
            trainerAreas: [],
            trainerTypes: [],
            trainerReviews: [],
            redirectToProfile: false
        }
        this.trainerId = props.match.params.trainerId;
        this.setRedirectToProfile = this.setRedirectToProfile.bind(this);
    }

    static contextType = UserContext;

    componentDidMount() {
        // we check if the component was reached through redirect that carried relative data (it passes neccessary props)
        if (this.props.location.state !== undefined) {
            this.setState({
                trainer: this.props.location.state.trainer,
                trainerAreas: this.props.location.state.trainerAreas,
                trainerTypes: this.props.location.state.trainerTypes
            });
        } else { // else we make necessary ajax calls to get them
            this.fetchTrainer();
            this.fetchTrainerAreas();
            this.fetchTrainerTypes();
        }
        // we fetch trainer reviews too
        this.fetchTrainerReviews();
    }

    fetchTrainer() {
        const url = 'http://localhost:8080/find/getUser/' + this.trainerId;

        fetch(url, {
            method: 'GET',
        }).then(response => {
            response.json().then(trainer => {
                if (response.status === 200) {
                    this.setState({
                        trainer: trainer
                    });
                }
            })
        }).catch(error => console.error('Error:', error));
    }

    fetchTrainerTypes() {
        const url = 'http://localhost:8080/types/trainer-types/' + this.trainerId;

        fetch(url, {
            method: 'GET',
        }).then(response => {
            if (response.status === 200) {
                response.json().then(trainerTypes => {
                    this.setState({
                        trainerTypes: trainerTypes
                    });
                })
            }
        }).catch(error => console.error('Error:', error));
    }

    fetchTrainerAreas() {
        const url = 'http://localhost:8080/areas/trainer-areas/' + this.trainerId;

        fetch(url, {
            method: 'GET',
        }).then(response => {
            if (response.status === 200) {
                response.json().then(trainerAreas => {
                    this.setState({
                        trainerAreas: trainerAreas
                    });
                })
            }
        }).catch(error => console.error('Error:', error));
    }

    fetchTrainerReviews() {
        const url = 'http://localhost:8080/session/reviews-trainer/' + this.trainerId + '?start=0&end=9';

        fetch(url, {
            method: 'GET',
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    this.setState({
                        trainerReviews: data.results
                    });
                })
            }
        }).catch(error => console.error('Error:', error));
    }

    setRedirectToProfile() {
        this.setState({
            redirectToProfile: true
        });
    }

    renderRedirectToProfile() {
        if (this.state.redirectToProfile) {
            return <Redirect to={'/trainersCalendar/' + this.trainerId} />
        }
    }

    render() {
        const trainerTypes = this.state.trainerTypes;
        const trainerAreas = this.state.trainerAreas;
        return (
            <div className="container complete-profile" style={{ minHeight: '80vh' }}>
                {this.renderRedirectToProfile()}
                <div className="container mb-4 p-4 col-9 bg-light shadow profile">
                    <div className="row mx-auto profile-header-info">
                        <div className="container col-md-3 photo">
                            {this.state.trainer.photoLink ?
                                <img src={this.state.trainer.photoLink} alt="trainer" className="img-thumbnail" /> :
                                <FontAwesomeIcon icon={["far", "user-circle"]} size="10x" style={{ opacity: 0.4 }} />
                            }
                        </div>
                        <div className="container col-md-4 text-center trainer-info">
                            <h3 className="text-primary">{this.state.trainer.firstName + ' ' + this.state.trainer.lastName}</h3>
                            <h5 className="mt-3">Specializes in:</h5>
                            <h6 className="text-primary">{trainerTypes.map((trainerType, index) => {
                                return (index < (trainerTypes.length - 1)) ? (trainerType.title + ' - ') : trainerType.title;
                            })}</h6>
                            <h5 className="mt-3">Available in areas:</h5>
                            <h6 className="text-primary">{trainerAreas.map((trainerArea, index) => {
                                return (index < (trainerAreas.length - 1)) ? (trainerArea.city + ' - ') : trainerArea.city;
                            })}</h6>
                        </div>
                        <div className="container col-md-3 py-5 book-info">
                        {/* Unregistered users can view profile but not book appointment */}
                            {this.context.isLoggedIn ? (
                                <React.Fragment>
                                    <button className="btn btn-danger btn-block mt-auto" onClick={this.setRedirectToProfile}>Book appointment</button>
                                    <p className="text-middle text-center p-2 rounded mb-auto">Cost: <span className="text-danger">{this.state.trainer.price}&euro;</span></p>
                                </React.Fragment>
                            ) : (
                                    <p className="text-middle text-center p-2 rounded mb-auto bg-danger text-white">Register or Login to Book your Session!!</p>
                                )}
                        </div>
                    </div>

                    <div className="mt-3 profile-description">
                        <h5>Description</h5>
                        <p className="lead">{this.state.trainer.description}</p>
                    </div>
                </div>

                {/* Only if the trainer has reviews will this section be rendered */}
                {(this.state.trainerReviews.length > 0) && (
                    <div className="container mx-auto pt-2 col-md-8 bg-light shadow reviews">
                        <h3 className="text-danger text-center">Latest Reviews</h3>
                        {this.state.trainerReviews.map((review, index) => {
                            return <ReviewRow key={index} review={review} ></ReviewRow>
                        })}
                    </div>
                )}
            </div>
        );
    }

}

export default withAuthorization(TrainerProfile, [Role.Guest, Role.User]);