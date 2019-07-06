import React, { Component } from 'react';
import LandingMain from "./LandingMain";
import ThreeSteps from "./ThreeSteps";
import ReadyToGetStarted from "./ReadyToGetStarted";
import './landing-page.css';

class Landing extends Component {
    render() {
        return (
            <React.Fragment>
                <LandingMain />
                <ThreeSteps />
                <ReadyToGetStarted />
            </React.Fragment>
        );
    }
}

export default Landing;