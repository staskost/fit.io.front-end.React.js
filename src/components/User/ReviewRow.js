import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarRating from '../TrainingSessions/StarRating';

/**
 * Renders a single review
 * Used by TrainerProfile component
 * 
 * @property {Object} props.review - review object carrying relative data
 */
class ReviewRow extends Component {

    render() {
        const review = this.props.review;
        return (
            <div className="container border-bottom pb-3 my-3 review">
                <div className="row review-header">
                    <div className="container col-1 py-2 profile-pic"><FontAwesomeIcon icon={["far", "user"]} size="2x" style={{opacity: 0.5}}/></div>
                    <div className="container col-3 review-name-date">
                        <div className="text-nowrap align-bottom">{review.session.client.firstName}</div>
                        <div><small className="text-muted text-nowrap align-top">{(new Date(review.date)).toDateString()}</small></div>
                    </div>
                    <div className="container col-3"></div>
                    <div className="container col-4 text-right py-2 header-rating">
                        <span className="font-weight-bold">{review.rating}&nbsp;</span>
                        <StarRating rating={review.rating} />
                    </div>
                </div>
                <div className="container text-justify review-text">{review.comment}</div>
            </div>
        );
    }
    
}

export default ReviewRow;