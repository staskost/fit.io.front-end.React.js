import React, { Component } from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserContext from '../../context/user-context';

/**
 * Our button/modal which allows a user to leave a review for a past training session
 * 
 * @property {Object} trsData - training session object with relative data
 */
class ReviewModalButton extends Component {

    constructor(props) {
        super(props);
        this.review = React.createRef();
        this.state = {
            rating: 0
        }
        this.handleSubmitReview = this.handleSubmitReview.bind(this);
        this.handleRatingChange = this.handleRatingChange.bind(this);
    }

    static contextType = UserContext;

    // setState could be called directly on onChange of Rating Component - will probably be ommitted later
    handleRatingChange(newValue) {
        console.log('Previous rating value:', this.state.rating);
        console.log('Rating value selected:', newValue);
        this.setState({rating: newValue});
    }

    handleSubmitReview() {
        console.log('Inside handleSubmitReview');
        console.log('ReviewRef:', this.review.current.value);
        console.log('Review Rating:', this.state.rating);
        const url = 'http://localhost:8080/session/add-comment/' + this.props.trsData.id + '/' + this.state.rating;
        console.log('url:', url);

        fetch(url, {
            method: 'POST',
            headers: {
                'X-MSG-AUTH': this.context.token
            },
            body: this.review.current.value
        }).then(response => {
            console.log('Response status:', response.status);
            console.log(response);
            if (response.status === 200) {
                console.log('Review Submitted');
                // After review submission user should no longer have option to review
                // We update the state of the parent element to properly rerender button/modal to 'ReviewedModalButton'
                this.props.handle();
            }
        }).catch(error => console.error('Error:', error));
    }

    render() {
        return (
            <React.Fragment>
                <button type="button" className="btn btn-info btn-block" data-toggle="modal" data-target={'#rm_' + this.props.trsData.id}>REVIEW <FontAwesomeIcon icon={["far", "star"]} /></button>
                <div className="modal fade" id={'rm_' + this.props.trsData.id} tabIndex="-1" role="dialog" aria-labelledby={'rmLabel_' + this.props.trsData.id} aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={'rmLabel_' + this.props.trsData.id}>Review {this.props.trsData.trainer.firstName} {this.props.trsData.trainer.lastName}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row text-center mb-2">
                                    <div className="col-md-8 mx-auto">For your {this.props.trsData.trainingType.title} training session</div>
                                </div>
                                <div className="col-8 col-sm-6 mx-auto">
                                    <FontAwesomeIcon icon={["far", "calendar-alt"]} /> &nbsp;{this.props.trsData.date}, {this.props.trsData.time}
                                </div>
                                <div className="col-8 col-sm-6 mx-auto">
                                    <FontAwesomeIcon icon="map-marked-alt" /> &nbsp;{this.props.trsData.area.city}
                                </div>
                                <div className="col-8 col-sm-6 mx-auto">
                                    <FontAwesomeIcon icon="wallet" /> &nbsp;{this.props.trsData.trainer.price}&euro;
                                </div>
                                <hr />
                                <form>
                                    <div className="form-group text-center">
                                        {/* <label htmlFor={'review-text_' + this.props.trsData.id} className="col-form-label"><h5>Review: </h5></label> */}
                                        <div><Rating emptySymbol={<FontAwesomeIcon icon={["far", "star"]} />} fullSymbol={<FontAwesomeIcon icon="star" />} style={{color: '#EEBD01'}} initialRating={this.state.rating} onClick={this.handleRatingChange}/></div>
                                        <textarea className="form-control mt-3" id={'review-text_' + this.props.trsData.id} ref={this.review} required placeholder={"Leave a rating and a comment for your experience with " + this.props.trsData.trainer.firstName}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-info" data-dismiss="modal" onClick={this.handleSubmitReview}>Submit Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ReviewModalButton;