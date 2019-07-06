import React, { Component } from "react";

class PageOfPagination extends Component {
  render() {
    const { pageNum } = this.props;
    return (
      <li class="page-item">
        <p class="page-link" style={{ cursor: "pointer" }} onClick={this.props.changePage.bind(this, pageNum)} >
          {pageNum}
        </p>
      </li>
    );
  }
}

export default PageOfPagination;
