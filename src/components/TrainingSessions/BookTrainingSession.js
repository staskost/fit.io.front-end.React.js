import React, { Component } from "react";
import $ from "jquery";
import UserContext from "../../context/user-context";
import { Redirect } from 'react-router-dom'

class BookTrainingSession extends Component {

  static contextType = UserContext;

  state = {
    client: this.context.userInfo,
    trainer: {},
    trainingTypes: [],
    areas: []
  };

  componentDidMount() {
    if (this.props.location.state != null) {
      const { trainersId } = this.props.location.state;
      console.log("to id tou trainer apo to booking einai");
      console.log(trainersId);
      this.getUser(trainersId);
    }

  }

  getUser = trainersId => {
    $.ajax({
      type: "GET",
      url: `http://localhost:8080/find/getUser/${trainersId}`,
      dataType: "json",
      async: true,
      success: trainer => {
        console.log(trainer);
        this.setState({
          trainer,
          trainingTypes: trainer.trainerTypes,
          areas: trainer.trainerAreas
        });
      },
      error: error => {
        // this.props.history.push("/");
      }
    });
  };

  bookSession = (day, hour) => {
    let areaID = document.getElementById("area").value;
    let trainingTypeID = document.getElementById("trainingType").value;
    if (areaID == 0 || trainingTypeID == 0) {
      alert("Pleace choose Area and Training Type");
    } else {
      let trainerID = this.state.trainer.id;
      $.ajax({
        type: "POST",
        url: `http://localhost:8080/session/book/${trainerID}/${trainingTypeID}/${areaID}/${day}/${hour}`,
        headers: {
          "X-MSG-AUTH": this.context.token
        },
        async: true,
        success: () => {
          alert("Succesfully Booked");
          this.props.history.push("/training-sessions");
        },
        error: () => {
          alert("Something went Wrong");
        }
      });
    }
  };

  render() {
    const { client, trainer } = this.state;
    const { state } = this.props.location;
    if (state == null || this.context.isLoggedIn == false) {
      return (
        <Redirect to="/myCalendar"></Redirect>
      )
    } else {
      const { day, hour, trainersId } = this.props.location.state;
      return (
        <React.Fragment>
          <br />
          <div className="card mx-auto" style={{ width: "400px" }}>
            <div className="card-body">
              <h4 className="card-title">{day + " " + hour}</h4>
              <h6 className="card-text">BOOK BELOW</h6>
            </div>
            <select id="trainingType" className="browser-default custom-select">
              <option selected value={0}>
                Choose Training type
              </option>
              {this.state.trainingTypes.map(trainingType => {
                return (
                  <option value={trainingType.id}>{trainingType.title}</option>
                );
              })}
            </select>
            <select id="area" className="browser-default custom-select">
              <option selected value={0}>
                Choose Area
              </option>
              {this.state.areas.map(area => {
                return <option value={area.id}>{area.city}</option>;
              })}
            </select>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                {"Client: " + client.firstName + " " + client.lastName}
              </li>
              <li className="list-group-item">
                {"Trainer: " + trainer.firstName + " " + trainer.lastName}
              </li>
              <li className="list-group-item">{"Price: " + trainer.price}</li>
            </ul>
            <div className="card-body text-center">
              <button
                onClick={this.bookSession.bind(this, day, hour)}
                type="button"
                className="btn btn-warning"
              >
                BOOK TRAINING
              </button>
            </div>
          </div>
          <br />
        </React.Fragment>
      );
    }
  }
}

export default BookTrainingSession;
