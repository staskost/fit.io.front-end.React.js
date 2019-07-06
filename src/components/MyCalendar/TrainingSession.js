import React, { Component } from "react";
import RatingModal from "./RatingModal";
import UserContext from "../../context/user-context";
import { Link, Redirect, withRouter } from 'react-router-dom';
import $ from "jquery";

class TrainingSession extends Component {

  static contextType = UserContext;

  state = {
    session: {},
    pastSession: false
  };

  componentWillMount() {
    if (this.props.location.state != null) {
      this.setState({
        session: this.props.location.state.session
      }, function () {
        this.checkIfPastOrFutureSession();
      })
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    let newSession = nextProps.location.state.session;
    this.setState({
      session: newSession
    }, function () {
      this.checkIfPastOrFutureSession();
    })
  }

  checkIfPastOrFutureSession = () => {
    if (this.state.session != null) {
      const { session } = this.state;
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;

      let year = date.getFullYear();
      let hour = date.getHours();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      let currentDate = year + "-" + month + "-" + day;

      if (session.date < currentDate) {
        this.setState({
          pastSession: true
        });
      }
      if (session.date > currentDate) {
        this.setState({
          pastSession: false
        })
      }
      if (session.date == currentDate) {
        let sessionTime = session.time.slice(0, 2);
        if (sessionTime < hour) {
          this.setState({
            pastSession: true
          });
        } else {
          this.setState({
            pastSession: false
          })
        }
      }


    }
  }

  cancelSession = session => {
    if (window.confirm("Are you sure?")) {
      $.ajax({
        type: "POST",
        url: `http://localhost:8080/session/cancel-session/${session.id}`,
        headers: { "X-MSG-AUTH": localStorage.getItem("token") },
        async: true,
        success: () => {
          alert("Succesfuly Canceled");
          this.props.history.push("/myaccount");
        },
        error: () => { }
      });
    }

  };

  addReview = rating => {
    // let rating = document.getElementById("ratingVathmos").innerText;
    let review = document.getElementById("typedReview").value;
    console.log(review);
    console.log(rating);
    $.ajax({
      type: "POST",
      contentType: "text/plain",
      url: `http://localhost:8080/session/add-comment/${this.state.session.id}/${rating}`,
      headers: { "X-MSG-AUTH": localStorage.getItem("token") },
      data: review,
      async: true,
      success: () => {
        alert("Succesfuly Reviewed");
        $("#exampleModal").modal("hide");
        this.props.history.push("/myaccount");
      },
      error: () => { }
    });
  };


  deleteSession = session => {
    if (window.confirm("Are you sure?")) {
      $.ajax({
        type: "POST",
        url: `http://localhost:8080/session/deleteNotifiedCanceledSessions/${this.state.session.id}`,
        headers: { "X-MSG-AUTH": localStorage.getItem("token") },
        async: true,
        success: () => {
          alert("Succesfuly Deleted");
          this.props.history.push("/myaccount");
        },
        error: () => { }
      });

    }

  }

  generateButton = () => {

    if (this.state.session.cancelationStatus == 1 && this.context.userInfo.role.id == 2) {
      return (<button onClick={this.deleteSession.bind(this, this.props.location.state.session)} class="btn btn-danger" > Delete Training </button>)
    }
    if (this.state.session.cancelationStatus == 1 && this.context.userInfo.role.id == 1) {
      return (<Link class="btn btn-info" to="/myaccount">My Profile</Link>)
    }

    if (this.state.pastSession && this.context.userInfo.role.id == 1) {
      return (<button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModal"> Review Training </button>)
    }

    if (this.state.pastSession && this.context.userInfo.role.id == 2) {
      return (<Link class="btn btn-info" to="/myaccount">My Profile</Link>)
    }

    if (!this.state.pastSession) {
      return (<button onClick={this.cancelSession.bind(this, this.props.location.state.session)} class="btn btn-danger" > Cancel Training </button>)
    }

  }

  render() {
    const { state } = this.props.location;
    if (state == null || this.context.isLoggedIn == false) {
      return (
        <Redirect to="/"></Redirect>
      )
    } else {
      const { area, client, date, time, trainer, trainingType, cancelationStatus } = this.state.session;
      const { pastSession } = this.state;
      return (
        <React.Fragment>
          <br />
          <div class="card  mx-auto" style={{ width: "400px" }}>
            <div class="card-body">
              <h4 class="card-title">{date + " " + time}</h4>
              <h6 class="card-text">
                {"Training Type: " + trainingType.title}
              </h6>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                {"Area: " + area.city + " , Adress: " + area.address}
              </li>
              <li class="list-group-item">
                {"Client: " + client.firstName + " " + client.lastName}
              </li>
              <li class="list-group-item">
                {"Trainer: " + trainer.firstName + " " + trainer.lastName}
              </li>
              <li class="list-group-item">{"Price: " + trainer.price}</li>
              {cancelationStatus == 1 ? (<li class="list-group-item list-group-item-warning">This Session is Cancelled</li>) : null}
            </ul>
            <div class="card-body">
              {this.generateButton()}
              {/* {pastSession ?
                (<button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModal"> Review Session </button>) :
                (<button onClick={this.cancelSession.bind(this, this.props.location.state.session)} class="btn btn-danger" > Cancel Training </button>)} */}
            </div>
          </div>
          <br />
          <RatingModal addReview={this.addReview} />
        </React.Fragment>
      );
    }
  }
}

export default withRouter(TrainingSession);
