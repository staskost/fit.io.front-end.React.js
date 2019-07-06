import React, { Component } from "react";
import "./calendar.css";
import CalendarDay from "./CalendarDay";
import { withRouter, Link } from "react-router-dom";
import $ from "jquery";
import UserContext from "../../context/user-context";
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

export class TrainersCalendar extends Component {
  state = {
    user: {},
    sessions: [],
    month: 0,
    modalSessions: [],
    dateOfModal: ""
  };

  static contextType = UserContext;

  componentDidMount() {
    const { id } = this.props.match.params;
    var date = new Date();
    var month = date.getMonth();

    this.setState({
      month: month + 1
    });

    $.ajax({
      type: "GET",
      url: `http://localhost:8080/session/trainer-sessions/${id}`,
      headers: { "X-MSG-AUTH": this.context.token },
      dataType: "json",
      async: true,
      success: sessions => {
        this.setState({
          sessions: sessions
        });
      },
      error: () => { }
    });
    this.getUser(id);
  }

  getUser = id => {
    $.ajax({
      type: "GET",
      url: `http://localhost:8080/find/getUser/${id}`,
      dataType: "json",
      async: true,
      success: user => {
        this.setState({
          user
        });
      },
      error: error => {
        console.error('Error on getUser():', error)
        this.props.history.push("/");
      }
    });
  };

  hideModal = () => {
    $("#sessionModal").modal("hide");
  };

  showModal = day => {
    const { id } = this.props.match.params;
    let dayToString = day.toString();

    if (day < 10) {
      dayToString = "0" + dayToString;
    }
    let monthToString = this.state.month.toString();

    if (this.state.month < 10) {
      monthToString = "0" + monthToString;
    }

    let date = "2019-" + monthToString + "-" + dayToString;
    $.ajax({
      type: "GET",
      url: `http://localhost:8080/session/trainer-sessions-date/${date}/${id}`,
      headers: { "X-MSG-AUTH": this.context.token },
      dataType: "json",
      async: true,
      success: modalSessions => {
        console.log("ta modal esessions einai");
        console.log(modalSessions);
        this.setState({
          modalSessions: modalSessions,
          dateOfModal: date
        });
      },
      error: () => { }
    });
    $("#sessionModal").modal("show");
  };

  generateModalAvailableHours = dayOfModal => {
    const { id } = this.props.match.params;
    let availableHours = [
      "10:00:00",
      "11:00:00",
      "12:00:00",
      "13:00:00",
      "14:00:00",
      "15:00:00",
      "16:00:00",
      "17:00:00",
      "18:00:00",
      "19:00:00",
      "20:00:00"
    ];

    let closedHours = this.state.modalSessions.map(session => {
      return session.time;
    });

    availableHours = availableHours.filter(hour => {
      return !(closedHours.indexOf(hour) > -1);
    });

    let timeSlots = [];
    availableHours.forEach(hour => {
      timeSlots.push(
        <Link
          className="list-group-item"
          to={{
            pathname: "/bookTrainingSession",
            state: { day: dayOfModal, hour: hour, trainersId: id }
          }}
          onClick={this.hideModal}
        >
          {"Hour: " + hour + " , Click to Book"}
        </Link>
      );
    });
    return timeSlots;
  };

  generateDays = () => {
    let days = [];
    let stateMonth = this.state.month;
    // let monthToString;
    // if (stateMonth < 10) {
    //   monthToString = "0" + stateMonth.toString();
    // } else {
    //   monthToString = stateMonth.toString();
    // }

    let date = new Date();
    let currentDayOfMonth = date.getDate();
    let currentMonth = date.getMonth() + 1;

    if (currentMonth <= stateMonth) {
      for (var i = 1; i <= currentDayOfMonth; i++) {
        days.push(
          <div className="day">
            <span className="date"> {i} </span>
          </div>
        );
      }
      for (var i = currentDayOfMonth + 1; i <= 31; i++) {
        days.push(
          <CalendarDay month={this.state.month} day={i} showModal={this.showModal} />
        );
      }
    } else {
      for (var i = 1; i <= 31; i++) {
        days.push(
          <div className="day">
            <span className="date"> {i} </span>
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
    const { user } = this.state;
    return (
      <React.Fragment>
        <div className="bodyDivCalendar">

          <div className="h1Calendar">
            <h2>Available dates of {user.firstName + " " + user.lastName}</h2>
            <button className="btn btn-warning" onClick={this.previousMonth}>
              Previous Month
            </button>
            <button className="btn btn-warning" onClick={this.nextMonth}>
              Next Month
            </button>
            <h3>{this.state.month + "/ 2019 "}</h3>
          </div>

          <section id="calendar" className="collectonme">
            <div id="day-labels">
              <div className="label">DAY</div>
              <div className="label">DAY</div>
              <div className="label">DAY</div>
              <div className="label">DAY</div>
              <div className="label">DAY</div>
              <div className="label">DAY</div>
              <div className="label">DAY</div>
            </div>
            <div id="one" className="week">
              <div className="day noDate" />
              <div className="day noDate" />
              <div className="day noDate" />
              <div className="day noDate" />
              {this.generateDays()}
            </div>
          </section>

          {/* Modal */}
          <div
            className="modal fade"
            id="sessionModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Training sessions
                  </h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <h6>Available hours for {this.state.dateOfModal}</h6>
                  <hr />
                  <ul className="list-group">
                    {this.generateModalAvailableHours(this.state.dateOfModal)}
                  </ul>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">
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

export default withAuthorization(withRouter(TrainersCalendar), [Role.User], true);