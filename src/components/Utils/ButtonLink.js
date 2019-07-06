import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * General use ButtonLink that has style adjusted dynamically as active or not depending on current location
 * currently used as sub-options buttons for inbox/sentbox messages, future/past training sessions
 * Maybe will be adjusted in the future to also set style/color dynamically through props
 * 
 * @property {String} props.label - text that will be rendered inside button body
 * @property {String} props.to - router location it will redirect to
 * @property {String} props.location - current location
 */
class ButtonLink extends Component {
    render() {
        if (this.props.to === this.props.location) {
            return <Link className="btn btn-outline-primary active" role="button" to={this.props.to}>{this.props.label}</Link>
        }
        else {
            return <Link className="btn btn-outline-primary" role="button" to={this.props.to}>{this.props.label}</Link>
        }
    }
}

export default ButtonLink;