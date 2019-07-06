import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header/Header";
import Landing from "./components/Landing/Landing";
import Footer from "./components/Footer";
import Register from "./components/Register";
import InboxMessages from './components/Messages/InboxMessages';
import OutboxMessages from './components/Messages/OutboxMessages';
import UserContext from './context/user-context';
import UserNavbar from './components/User/UserNavbar';
import PastTrainingSessions from './components/TrainingSessions/PastTrainingSessions';
import FutureTrainingSessions from './components/TrainingSessions/FutureTrainingSessions';
import CancelledTrainingSessions from './components/TrainingSessions/CancelledTrainingSessions';
import MyAccount from './components/User/MyAccount';
import AdminPage from './components/Admin/AdminPage';
import AllUsers from './components/Admin/AllUsers';
import MyTrainingTypes from './components/User/MyTrainingTypes';
import TrainersSearchPaginated from './components/User/TrainersSearchPaginated';
import TrainerProfile from './components/User/TrainerProfile';
import TrainersCalendar from './components/User/TrainersCalendar';
import BookTrainingSession from './components/TrainingSessions/BookTrainingSession';
import Calendar from './components/MyCalendar/Calendar';
import TrainingSession from './components/MyCalendar/TrainingSession';

class App extends Component {

  constructor(props) {
    super(props);

    // Setter method for userContext which will be included in userContext
    this.updateUserContext = () => {
      this.setState(() => ({
        // decided to update state directly from localstorage (we consider it the single source of truth)
        isLoggedIn: localStorage.getItem('token') ? true : false,
        token: localStorage.getItem('token') && localStorage.getItem('token'),
        userInfo: localStorage.getItem('token') && JSON.parse(localStorage.getItem('userInfo')),
      }));
    };

    this.state = {
      isLoggedIn: this.props.userProps ? true : false,
      token: this.props.userProps ? this.props.userProps.token : '',
      userInfo: this.props.userProps ? this.props.userProps.userInfo : {},
      updateUserContext: this.updateUserContext
    };

    console.log('App state in constructor:', this.state);
  }

  render() {
    return (
      <Router>
        <UserContext.Provider value={this.state}> {/* Passing this state as UserContext value */}
          <Header />
          <UserNavbar />
          <Switch>
            <Route path="/admin" exact component={AdminPage} />
            <Route path="/allUsers" component={AllUsers} />
            <Route path="/register/:rolename" exact component={Register} /> {/*perhaps needs consideration to restrain possible values/routes*/}
            <Route path="/messages/out" exact component={OutboxMessages} />
            <Route path="/messages/" exact component={InboxMessages} />
            <Route path="/training-sessions/cancelled" exact component={CancelledTrainingSessions} />
            <Route path="/training-sessions/past" exact component={PastTrainingSessions} />
            <Route path="/training-sessions" exact component={FutureTrainingSessions} />
            <Route path="/myaccount" exact component={MyAccount} />
            <Route path="/my-training-types" exact component={MyTrainingTypes} />
            <Route path="/trainers2" exact component={TrainersSearchPaginated} />
            <Route path="/trainer-profile/:trainerId" exact component={TrainerProfile} />
            <Route path="/trainersCalendar/:id" component={TrainersCalendar} />
            <Route path="/myCalendar" component={Calendar} />
            <Route path="/trainingSession" component={TrainingSession} />
            <Route path="/bookTrainingSession" component={BookTrainingSession} />
            <Route path="/" component={Landing} />
          </Switch>
          <Footer />
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;