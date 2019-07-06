import React, { Component } from "react";
import "./rating.css";
import $ from "jquery";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class RatingModal extends Component {
  state = {
    rating: 0
  };

  generateStars = () => {
    let stars = [];
    for (let i = 0; i < this.state.rating; i++) {
      stars.push(
        <button
          type="button"
          class="btnrating btn btn-warning btn-lg"
          data-attr={i + 1}
          id="rating-star-5"
          onClick={this.changeRating.bind(this, i + 1)}
        >
          <i class="fa fa-star" ariaHidden="true" />
          <FontAwesomeIcon icon="star" ariaHidden="true" />
        </button>
      );
    }
    // let difference = 5 - this.state.rating;
    for (let i = this.state.rating; i < 5; i++) {
      stars.push(
        <button
          type="button"
          class="btnrating btn btn-default btn-lg"
          data-attr={i + 1}
          id="rating-star-5"
          onClick={this.changeRating.bind(this, i + 1)}
        >
          <i class="fa fa-star" aria-hidden="true" />
          <FontAwesomeIcon icon="star" aria-hidden="true" />
        </button>
      );
    }
    return stars;
  };

  changeRating = i => {
    console.log(i);

    if (i <= 5) {
      let ratingVathmos = document.getElementById("ratingVathmos");
      ratingVathmos.innerText = i;
      this.setState({
        rating: i
      });
    }
  };
  render() {
    return (
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group" id="rating-ability-wrapper">
                <label class="control-label" for="rating">
                  <span class="field-label-header">
                    How would you rate this session
                  </span>
                  <br />
                  <span class="field-label-info" />
                  <input type="hidden" id="selected_rating" name="selected_rating" value="" required="required" />
                </label>
                <h2 class="bold rating-header">
                  <span id="ratingVathmos" class="selected-rating">
                    0
                  </span>
                  <small> / 5</small>
                </h2>
                {this.generateStars()}
              </div>

              <textarea id="typedReview" rows="4" cols="50" width="100px" placeholder="Write Your Review" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
              <button type="button" class="btn btn-primary" onClick={this.props.addReview.bind(this, this.state.rating)} >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RatingModal;
