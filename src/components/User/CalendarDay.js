import React, { Component } from "react";

class CalendarDay extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          className="day"
          onClick={this.props.showModal.bind(this, this.props.day)}
        >
          <span className="date" style={{ backgroundColor: "lightblue" }}>
            {this.props.day}
          </span>
          <p>Click for Available Hours</p>
        </div>
      </React.Fragment>
    );
  }
}

export default CalendarDay;
