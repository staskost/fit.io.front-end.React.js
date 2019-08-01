import React, { Component } from 'react';
import withAuthorization from '../../hoc/withAuthorization';
import Role from '../../hoc/Role';
import TrainerRow from './TrainerRow';
import PaginationHeader from '../Messages/PaginationHeader';
import PaginationFooter from '../Messages/PaginationFooter';

function SearchResults(props) {
    if (props.results) {
        return (
            props.results.map((trainer, index) => {
                return <TrainerRow key={index} trainer={trainer} />;
            })
        );
    }
}


class TrainersSearch extends Component {

    constructor(props) {
        super(props);
        this.inputArea = React.createRef();
        this.inputTrainingType = React.createRef();
        this.inputPrice = React.createRef();
        this.itemsPerPageOptions = [5, 10, 20];
        this.state = {
            areas: [],
            trainingTypes: [],
            searchResults: [],
            currentPage: 0,
            resultsPerPage: this.itemsPerPageOptions[0],
            numberOfTotalPages: 0,
            numberOfTotalResults: 0,
            noResults: false   
        };
        this.fetchAreas = this.fetchAreas.bind(this);
        this.fetchTrainingTypes = this.fetchTrainingTypes.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.validateInputArea = this.validateInputArea.bind(this);
        this.setActivePage = this.setActivePage.bind(this);
        this.setResultsPerPage = this.setResultsPerPage.bind(this);
        this.fetchPageResults = this.fetchPageResults.bind(this);
        this.fetchUrl = '';
    }


    componentDidMount() {
        this.fetchAreas();
        this.fetchTrainingTypes();
    }

    setActivePage(newActivePage) {
        this.setState({
            currentPage: newActivePage - 1,     
        }, () => this.fetchPageResults());

    }


    setResultsPerPage(option) {
        this.setState({
            currentPage: 0,
            resultsPerPage: option
        }, () => this.fetchPageResults());
    }

    fetchAreas() {
        const url = 'http://localhost:8080/areas/all';

        fetch(url, {
            method: 'GET',
        }).then(response => {
            response.json().then(data => {
                if (response.status === 200) {
                    this.setState({
                        areas: data
                    });
                }
            })
        }).catch(error => console.error('Error:', error));
    }

    fetchTrainingTypes() {
        const url = 'http://localhost:8080/types/all';

        fetch(url, {
            method: 'GET',
        }).then(response => {
            response.json().then(data => {
                if (response.status === 200) {
                    this.setState({
                        trainingTypes: data
                    });
                }
            })
        }).catch(error => console.error('Error:', error));
    }

    handleSearch(event) {
        if (this.inputTrainingType.current.value === "") {
            if (this.inputArea.current.value !== "") {
                let inputAreaId = this.validateInputArea();
                if (inputAreaId !== -1) {
                    this.fetchUrl = "http://localhost:8080/users/trainers-area/" + inputAreaId;
                }
            } else this.fetchUrl = "http://localhost:8080/users/all-trainers/2"; 
        } else if (this.inputArea.current.value === "") {
            this.fetchUrl = "http://localhost:8080/users/trainer-type/" + this.inputTrainingType.current.value;
        } else {
            let inputAreaId = this.validateInputArea();
            if (inputAreaId !== -1) {
                this.fetchUrl = "http://localhost:8080/users/trainer/" + this.inputTrainingType.current.value + "/" + inputAreaId;
            }
        }

    //not working for now
    // handleSearch(event) {
    //     console.log(this.inputPrice.current.value);
    //     if (this.inputTrainingType.current.value === "" ) {
    //         if (this.inputArea.current.value !== "" ) {
    //             if( this.inputPrice.current.value === ""){
    //                 let inputAreaId = this.validateInputArea();
    //                 this.fetchUrl = "http://localhost:8080/users/trainers-area/" + inputAreaId;
    //             }
    //         } else if (this.inputArea.current.value === ""){
    //             if( this.inputPrice.current.value !== ""){
    //             this.fetchUrl = this.fetchUrl = "http://localhost:8080/users/byPrice/" + this.inputPrice.current.value;
    //             }
    //         } else this.fetchUrl = "http://localhost:8080/users/all-trainers/2"; // get all trainers url - both type and area are empty
    //     } else if (this.inputArea.current.value === "") {
    //         this.fetchUrl = "http://localhost:8080/users/trainer-type/" + this.inputTrainingType.current.value;
    //     } else {
    //         let inputAreaId = this.validateInputArea();
    //         if (inputAreaId !== -1) {
    //             this.fetchUrl = "http://localhost:8080/users/trainer/" + this.inputTrainingType.current.value + "/" + inputAreaId+ "/" + this.inputPrice.current.value;
    //         }
    //     }

  
        if (this.fetchUrl) {
            this.setState({
                currentPage: 0
            }, () => this.fetchPageResults());
        }
        event.preventDefault();
    }

    fetchPageResults() {
        const finalUrl = this.fetchUrl + '?page=' + this.state.currentPage + '&size=' + this.state.resultsPerPage;
        fetch(finalUrl, {
            method: 'GET',
        }).then((response) => {
            if (response.status === 200) {
                response.json().then(data => {
                    const lastPageResults = data.count % this.state.resultsPerPage;
                    const pagesNumber = (lastPageResults > 0) ? (((data.count - lastPageResults) / this.state.resultsPerPage) + 1) : (data.count / this.state.resultsPerPage);
                    this.setState({
                        numberOfTotalPages: pagesNumber,
                        numberOfTotalResults: data.count,
                        searchResults: data.results,
                        noResults: data.count === 0 ? true : false
                    });
                    console.log(this.state.searchResults);
                })
            } else { 
                this.setState({
                    currentPage: 0,
                    searchResults: [],
                    numberOfTotalPages: 0,
                    numberOfTotalResults: 0,
                    noResults: true,
                });
            }
        }).catch(error => console.error('Error:', error));
    }

    validateInputArea() {
        let areaNamesList = this.state.areas.map((area, index) => {
            return area.city.toLowerCase();
        })
        if (areaNamesList.includes(this.inputArea.current.value.toLowerCase())) {
            let i = areaNamesList.indexOf(this.inputArea.current.value.toLowerCase());
            return this.state.areas[i].id;
        } else {
            console.log('Input area :', this.inputArea.current.value, ' is NOT valid.');
            return -1;
        }
    }

    render() {
        return (
            <div style={{ minHeight: '70vh' }}>
                <div className="container my-4 py-5 mx-auto col-8">
                    <form className="form-inline row justify-content-between" onSubmit={this.handleSearch}>
                        <input list="areas" className="form-control form-control-lg mr-0 col-sm-5 custom-form" placeholder="&#8597; Choose area" ref={this.inputArea} />
                        <datalist id="areas">
                            {this.state.areas.map((area, index) => {
                                return <option key={index} value={area.city} />;
                            })}
                        </datalist>
                        <select className="custom-select custom-select-lg form-control form-control-lg mr-0 col-sm-5" ref={this.inputTrainingType}>
                            <option value="">Or choose workout style</option>
                            {this.state.trainingTypes.map((trainingType, index) => {
                                return <option key={index} value={trainingType.id}>{trainingType.title}</option>
                            })}
                        </select>
                        {/* not working for now <input className="custom-select custom-select-lg form-control form-control-lg mr-0 col-sm-5" placeholder=" Filter by price" ref={this.inputPrice}></input> */}
                        <button className="btn btn-primary btn-lg col-sm-2" type="submit">Search</button>
                    </form>
                </div>

                {this.state.noResults && <div className="container my-4 py-5 mx-auto col-8 text-center"><h3>NO TRAINERS FOUND</h3></div>}

                <PaginationHeader count={this.state.numberOfTotalResults} options={this.itemsPerPageOptions} activeOption={this.state.resultsPerPage} handle={this.setResultsPerPage} />
                <SearchResults results={this.state.searchResults} />
                <PaginationFooter activePage={this.state.currentPage + 1} totalPages={this.state.numberOfTotalPages} handle={this.setActivePage} />
            </div>
        );
    }

}

export default withAuthorization(TrainersSearch, [Role.Guest, Role.User], true);