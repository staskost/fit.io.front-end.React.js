import React, { Component } from "react";

class DayWithSession extends Component {
  render() {
    return (
      <React.Fragment>
        <div class="day" onClick={this.props.showModal.bind(this, this.props.day)}>
          <span class="date" style={{ backgroundColor: "orange" }}>
            {this.props.day}
          </span>
          <p>Click to see Sessions</p>
        </div>
      </React.Fragment>
    );
  }
}

export default DayWithSession;
