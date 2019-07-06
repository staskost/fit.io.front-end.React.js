import React, { Component } from "react";
import "./calendar.css";
import DayWithSession from "./DayWithSession";
import UserContext from "../../context/user-context";
import { Link, Redirect, withRouter } from 'react-router-dom';
import $ from "jquery";

export class Calendar extends Component {

  static contextType = UserContext;

  state = {
    user:
      localStorage.getItem("userInfo") != ""
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    sessions: [],
    month: 0,
    modalSessions: [],
    dateOfModal: ""
  };

  componentDidMount() {

    if (this.context.isLoggedIn) {
      var date = new Date();
      var month = date.getMonth();
      let user = this.state.user;
      this.setState({
        month: month + 1
      });
      let token = localStorage.getItem("token");

      let url;
      if (user.role.id == 2) {
        url = "http://localhost:8080/session/trainer-sessions";
      } else {
        url = "http://localhost:8080/session/client-sessions";
      }
      $.ajax({
        type: "GET",
        url: url,
        headers: { "X-MSG-AUTH": token },
        dataType: "json",
        async: true,
        success: sessions => {
          console.log(sessions);
          this.setState({
            sessions: sessions
          });
        },
        error: () => { }
      });
    }
  }

  hideModal = () => {
    $("#sessionModal").modal("hide");
  };

  showModal = day => {
    let dayToString = day.toString();

    if (day < 10) {
      dayToString = "0" + dayToString;
    }
    let date = "2019-" + this.state.month + "-" + dayToString;
    let user = this.state.user;
    let url;
    if (user.role.id == 2) {
      url = `http://localhost:8080/session/trainer-sessions-date/${date}`;
    } else {
      url = `http://localhost:8080/session/client-sessions-date/${date}`;
    }

    $.ajax({
      type: "GET",
      url: url,
      headers: { "X-MSG-AUTH": localStorage.getItem("token") },
      dataType: "json",
      async: true,
      success: modalSessions => {
        this.setState({
          modalSessions: modalSessions,
          dateOfModal: date
        });
      },
      error: () => { }
    });
    $("#sessionModal").modal("show");
  };

  generateDays = () => {
    let days = [];
    let month = this.state.month;
    let monthToString;
    if (month < 10) {
      monthToString = "0" + month.toString();
    } else {
      monthToString = month.toString();
    }
    let daysWithSession = this.state.sessions.map(session => {
      if (session.date.slice(5, 7) == monthToString) {
        return parseInt(session.date.slice(8, 10));
      }
    });

    for (var i = 1; i <= 31; i++) {
      if (daysWithSession.includes(i)) {
        days.push(
          <DayWithSession key={i} month={this.state.month} day={i} showModal={this.showModal} />
        );
      } else {
        days.push(
          <div class="day">
            <span class="date">{i}</span>
          </div>
        );
      }
    }
    return days;
  };

  nextMonth = () => {
    let thisMonth = this.state.month;
    if (thisMonth == 12) {
      this.setState({
        month: 1
      });
    } else {
      this.setState({
        month: thisMonth + 1
      });
    }
  };

  previousMonth = () => {
    let thisMonth = this.state.month;
    if (thisMonth == 1) {
      this.setState({
        month: 12
      });
    } else {
      this.setState({
        month: thisMonth - 1
      });
    }
  };

  render() {
    if (this.context.isLoggedIn == false) {
      return (
        <Redirect to="/"></Redirect>
      )
    } else {
      return (
        <React.Fragment>
          <div class="bodyDivCalendar">
            <div class="h1Calendar">
              <button class="btn btn-warning" onClick={this.previousMonth}>
                Previous Month
                </button>
              <button class="btn btn-warning" onClick={this.nextMonth}>
                Next Month
                </button>
              <h3>
                {this.state.month + "/ 2019  Your Calendar "}
                {this.state.user.role.id == 2 ? " (Trainer)" : null}
              </h3>
            </div>

            <section id="calendar" class="collectonme">
              <div id="day-labels">
                <div class="label">DAY</div>
                <div class="label">DAY</div>
                <div class="label">DAY</div>
                <div class="label">DAY</div>
                <div class="label">DAY</div>
                <div class="label">DAY</div>
                <div class="label">DAY</div>
              </div>
              <div id="one" class="week">
                <div class="day noDate" />
                <div class="day noDate" />
                <div class="day noDate" />
                <div class="day noDate" />
                {this.generateDays()}
              </div>
            </section>

            {/* Modal */}
            <div
              class="modal fade"
              id="sessionModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      Training sessions
                      </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <h6>Your sessions for {this.state.dateOfModal}</h6>
                    <hr />
                    <ul class="list-group">
                      {this.state.modalSessions.map(session => (
                        <Link class="list-group-item" to={{
                          pathname: "/trainingSession",
                          state: { session: session }
                        }} onClick={this.hideModal}  >
                          {"Time: " + session.time + " , Area: " + session.area.city + " ,Type: " + session.trainingType.title}
                        </Link>
                      ))}
                    </ul>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" >
                      Close
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );

    }

  }
}

export default withRouter(Calendar);
