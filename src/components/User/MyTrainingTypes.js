import React, { Component } from 'react';
import UserContext from '../../context/user-context';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';

function TrainingTypeRow(props) {
    return (
        <tr>
            <th scope="row">{props.i}</th>
            <td>{props.trType.title}</td>
            <td><button type="button" className="btn btn-danger btn-sm" onClick={() => props.handle(props.trType.id)}>Remove</button></td>
        </tr>
    );
}

function TrainersAreaRow(props) {
    return (
        <tr>
            <th scope="row">{props.i}</th>
            <td>{props.trArea.city}</td>
            <td><button type="button" className="btn btn-danger btn-sm" onClick={() => props.handle(props.trArea.id)}>Remove</button></td>
        </tr>
    );
}

/**
 * The trainer component which gives him the ability to select/adjust:
 * - his training specialization
 * - areas where he trains
 * - price he charges
 */
class MyTrainingTypes extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.inputPrice = React.createRef();
        this.inputTrainingTypeId = React.createRef();
        this.inputTrainingAreaId = React.createRef();
        this.state = {
            price: '',
            allTrainingTypes: [],
            trainersTrainingTypes: [],
            allAreas: [],
            trainersAreas: []
        };
        this.fetchAllTrainingTypes = this.fetchAllTrainingTypes.bind(this);
        this.handleAddTrainingType = this.handleAddTrainingType.bind(this);
        this.handleRemoveTrainingType = this.handleRemoveTrainingType.bind(this);
        this.fetchAllAreas = this.fetchAllAreas.bind(this);
        this.fetchTrainersAreas = this.fetchTrainersAreas.bind(this);
        this.handleAddTrainersArea = this.handleAddTrainersArea.bind(this);
        this.handleRemoveTrainersArea = this.handleRemoveTrainersArea.bind(this);
        this.handleUpdateCost = this.handleUpdateCost.bind(this);
    }

    componentDidMount() {
        this.fetchAllTrainingTypes();
        this.fetchTrainersTrainingTypes();
        this.fetchAllAreas();
        this.fetchTrainersAreas();
    }

    // fetches all areas from db to populate our datalist
    fetchAllAreas() {
        const url = 'http://localhost:8080/areas/all';

        fetch(url, {
            method: 'GET',
        }).then(response => {
            response.json().then(data => {
                if (response.status === 200) {
                    // Saving fetched areas to state'
                    this.setState({
                        allAreas: data
                    });
                }
            })
        }).catch(error => console.error('Error:', error));
    }

    fetchTrainersAreas() {
        const url = 'http://localhost:8080/areas/trainer-areas/' + this.context.userInfo.id;

        fetch(url, {
            method: 'GET',
        }).then(response => {
            if (response.status === 200) {
                response.json().then(trainersAreas => {
                    this.setState({
                        trainersAreas: trainersAreas
                    });
                })
            }
        }).catch(error => console.error('Error:', error));
    }

    handleAddTrainersArea() {
        const areaId = this.inputTrainingAreaId.current.value;
        const trainersAreasIdsOnlyList = this.state.trainersAreas.map((area, i) => { return area.id });

        // Check that input training area isn't already among trainer's areas
        // Only then we make ajax call, else no action is needed
        if ((areaId !== "") && !trainersAreasIdsOnlyList.includes(areaId)) {
            const url = 'http://localhost:8080/trainers/trainer-choose-area/' + areaId;

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-MSG-AUTH': this.context.token
                }
            }).then(response => {
                if (response.status === 200) {
                    this.fetchTrainersAreas();
                }
            }).catch(error => console.error('Error:', error));
        }
    }

    handleRemoveTrainersArea(areaId) {
        const url = 'http://localhost:8080/trainers/trainer-remove-area/' + areaId;

        fetch(url, {
            method: 'POST',
            headers: {
                'X-MSG-AUTH': this.context.token
            }
        }).then(response => {
            if (response.status === 200) {
                this.fetchTrainersAreas();
            }
        }).catch(error => console.error('Error:', error));
    }

    // fetches all training types from db
    fetchAllTrainingTypes() {
        const url = 'http://localhost:8080/types/all';

        fetch(url, {
            method: 'GET',
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    this.setState({
                        allTrainingTypes: data
                    });
                })
            }
        }).catch(error => console.error('Error:', error));
    }

    // fetches current trainer's training types
    fetchTrainersTrainingTypes() {
        const url = 'http://localhost:8080/types/trainer-types/' + this.context.userInfo.id;

        fetch(url, {
            method: 'GET',
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    this.setState({
                        trainersTrainingTypes: data
                    });
                })
            }
        }).catch(error => console.error('Error:', error));
    }

    handleUpdateCost() {
        const newCost = this.inputPrice.current.value;
        if ((newCost !== "") && (newCost !== this.context.userInfo.price)) {
            const url = 'http://localhost:8080/trainers/set-price/' + this.inputPrice.current.value;

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-MSG-AUTH': this.context.token
                }
            }).then(response => {
                if (response.status === 200) {
                    // We update user context with new info
                    let updatedUser = this.context.userInfo;
                    updatedUser.price = newCost;
                    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
                    this.context.updateUserContext();
                    this.setState({ price: newCost });
                }
            }).catch(error => console.error('Error:', error));
        }
    }

    handleAddTrainingType() {
        const trId = this.inputTrainingTypeId.current.value;
        const trainersTypesIdsOnlyList = this.state.trainersTrainingTypes.map((tr, i) => { return tr.id });

        if ((trId !== "") && !trainersTypesIdsOnlyList.includes(trId)) {
            const url = 'http://localhost:8080/trainers/trainer-choose-type/' + trId;

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-MSG-AUTH': this.context.token
                }
            }).then(response => {
                if (response.status === 200) {
                    this.fetchTrainersTrainingTypes();
                }
            }).catch(error => console.error('Error:', error));
        }
    }

    handleRemoveTrainingType(trainingTypeId) {
        const url = 'http://localhost:8080/trainers/trainer-remove-type/' + trainingTypeId;

        fetch(url, {
            method: 'POST',
            headers: {
                'X-MSG-AUTH': this.context.token
            }
        }).then(response => {
            if (response.status === 200) {
                this.fetchTrainersTrainingTypes();
            }
        }).catch(error => console.error('Error:', error));
    }

    render() {
        return (
            <div className="container py-3 mt-3 text-center" style={{ minHeight: '75vh' }}>
                <div className="col-12 mx-auto">
                    <div className="form-group col-md-4 mx-auto">
                        <label htmlFor="inputEmail"><h5>Cost (&euro;/hour)</h5></label>
                        <div className="input-group">
                            <input type="email" className="form-control" id="inputEmail" placeholder={this.context.userInfo.price} ref={this.inputPrice} />
                            <button type="button" className="btn btn-primary" onClick={this.handleUpdateCost}>Update</button>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-5">
                            <label htmlFor="inputUsername"><h5></h5></label>
                            <div className="input-group">
                                <select className="custom-select" ref={this.inputTrainingTypeId}>
                                    <option value="">Choose Your Training Type</option>
                                    {this.state.allTrainingTypes.map((trainingType, index) => {
                                        return <option key={index} value={trainingType.id}>{trainingType.title}</option>
                                    })}
                                </select>
                                <button type="button" className="btn btn-primary" onClick={this.handleAddTrainingType}>Add</button>
                            </div>
                        </div>
                        <div className="col-2"></div>
                        <div className="form-group col-md-5">
                            <label htmlFor="inputUsername"><h5></h5></label>
                            <div className="input-group">
                                <select className="custom-select" ref={this.inputTrainingAreaId}>
                                    <option value="">Choose Your Area</option>
                                    {this.state.allAreas.map((area, index) => {
                                        return <option key={index} value={area.id}>{area.city}</option>
                                    })}
                                </select>
                                <button type="button" className="btn btn-primary" onClick={this.handleAddTrainersArea}>Add</button>
                            </div>
                        </div>
                    </div>
                    <div className="row col-12 mt-3 mx-auto">
                        <table className="table table-sm table-hover col-5">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Your Training Types</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.trainersTrainingTypes.map((trainingType, index) => {
                                    return <TrainingTypeRow key={index} trType={trainingType} i={index + 1} trainerId={this.context.userInfo.id} handle={this.handleRemoveTrainingType} />
                                })}
                            </tbody>
                        </table>
                        <div className="col-2"></div>
                        <table className="table table-sm table-hover col-5">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Your Training Areas</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.trainersAreas.map((trainersArea, index) => {
                                    return <TrainersAreaRow key={index} trArea={trainersArea} i={index + 1} trainerId={this.context.userInfo.id} handle={this.handleRemoveTrainersArea} />
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        );
    }

}

export default withAuthorization(MyTrainingTypes, [Role.Trainer], true);