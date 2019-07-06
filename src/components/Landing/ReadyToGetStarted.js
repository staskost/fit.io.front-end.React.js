import React, { Component } from 'react'

class ReadyToGetStarted extends Component {
    render() {
        return (
            <React.Fragment>
                <section id="home-heading" className="p-5">
                    <div className="dark-overlay">
                        <div className="row">
                            <div className="col">
                                <div className="container pt-5">
                                    <h1>Are You Ready To Get Started?</h1>
                                    <p className="hidden-sm-down"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- BOXES WITH STATS --> */}
                <section id="boxes" className="py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card text-center card-outline-primary">
                                    <div className="card-block">
                                        <h3 className="text-primary pt-2">500</h3>
                                        <p>Personal Trainers</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="card text-center card-outline-primary">
                                    <div className="card-block">
                                        <h3 className="text-primary pt-2">37,000</h3>
                                        <p>Registered Users</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="card text-center card-outline-primary">
                                    <div className="card-block">
                                        <h3 className="text-primary pt-2">33</h3>
                                        <p>Workout Specialties</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="card text-center card-outline-primary">
                                    <div className="card-block">
                                        <h3 className="text-primary pt-2">1567</h3>
                                        <p>Perfect Booties</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </React.Fragment>
        );
    }
}

export default ReadyToGetStarted;
