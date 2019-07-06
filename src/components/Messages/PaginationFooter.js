import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// The Button of our pagination bar that redirects to the previous page
function Previous(props) {
    if (props.activePage === 1) return (
        <li className="page-item active" aria-current="page">
            <span className="page-link">
                <span aria-hidden="true"><FontAwesomeIcon icon="angle-left" /></span>
                <span className="sr-only">(current)</span>
            </span>
        </li>);
    else return (
        <li className="page-item">
            <a className="page-link" href="#" aria-label="Previous" onClick={() => props.setActivePage(props.activePage - 1)}>
                <span aria-hidden="true"><FontAwesomeIcon icon="angle-left" /></span>
            </a>
        </li>
    );
}

// The Button of our pagination bar that redirects to the next page
function Next(props) {
    if (props.activePage === props.lastPage) return (
        <li className="page-item active" aria-current="page">
            <span className="page-link">
                <span aria-hidden="true"><FontAwesomeIcon icon="angle-right" /></span>
                <span className="sr-only">(current)</span>
            </span>
        </li>);
    else return (
        <li className="page-item">
            <a className="page-link" href="#" aria-label="Next" onClick={() => props.setActivePage(props.activePage + 1)}>
                <span aria-hidden="true"><FontAwesomeIcon icon="angle-right" /></span>
            </a>
        </li>
    );
}

/**
 * Will return either
 * - a "selected" icon number if it is the active page
 * - an icon number with the responding link to redirect to that page
 * - an inactive icon with 3 dots to indicate a group of pages, far from the active page (can be adjusted with numberofSideButtons below)
 * 
 * @property {Number} props.activePage - the value of the active page number
 * @property {Number} props.pageNumber - current page number to be evaluated
 * @property {Number} props.lastPage - the last page number
 * @property {Function} props.setActivePage - to set a new active page
 */
function PageNumberIcon(props) {
    const numberOfSideButtons = 2; // We can adjust this. Number of navigation buttons on both sides of active one, first and last page exclusive
    const leftBreakPoint = props.activePage - (numberOfSideButtons + 1);
    const rightBreakPoint = props.activePage + (numberOfSideButtons + 1);

    // We want to show as number buttons these cases
    if (props.pageNumber === 1 || props.pageNumber === props.lastPage || (props.pageNumber > leftBreakPoint && props.pageNumber < rightBreakPoint)) {
        // We distinguish if it will be a navigation button with the corresponding page link or the current page button
        if (props.activePage !== props.pageNumber)
            return (
                <li className="page-item" onClick={() => props.setActivePage(props.pageNumber)}><a className="page-link" href="#">{props.pageNumber}</a></li>
            ); else return (
                <li className="page-item active" aria-current="page">
                    <span className="page-link">
                        {props.pageNumber}
                        <span className="sr-only">(current)</span>
                    </span>
                </li>
            );
    } // otherwise we will render only one button with 3 dots where it is needed, left or right side
    else if (props.pageNumber === leftBreakPoint || props.pageNumber === rightBreakPoint) {
        return (
            <li className="page-item disabled" aria-current="page">
                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">...</a>
            </li>
        );
    }
    // we don't want to render anything for all the other pages
    return null;
}

/**
 * Returns a group of links and numbers to help navigate through the pages of our list
 * 
 * @property {Number} activePage - indicates the currently active page
 * @property {Number} totalPages
 * @property {Function} handle - passed to childlren, to be able set a new active page
 */
class PaginationFooter extends Component {
    render() {
        // we don't render anything if there is only one page
        if (this.props.totalPages <= 1) return null;
        return (
            <div className="container">
                <nav aria-label="Pagination">
                    <ul className="pagination">
                        <Previous activePage={this.props.activePage} setActivePage={this.props.handle} />
                        {Array.from({ length: this.props.totalPages }, (v, i) => {
                            return <PageNumberIcon key={i} activePage={this.props.activePage} pageNumber={i + 1} lastPage={this.props.totalPages} setActivePage={this.props.handle} />
                        })}
                        <Next activePage={this.props.activePage} setActivePage={this.props.handle} lastPage={this.props.totalPages} />
                    </ul>
                </nav>
            </div>
        );
    }
}

export default PaginationFooter;