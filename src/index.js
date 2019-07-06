import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRunning, faMapMarkedAlt, faWallet, faAngleLeft, faAngleRight, faBan, faSearch, faCheck, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle, faCalendarAlt, faEye, faUser } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';
// import * as serviceWorker from './serviceWorker';

library.add(faRunning, faMapMarkedAlt, faWallet, faAngleLeft, faAngleRight, faBan, faSearch, faCheck, faBell, faEnvelope, faUserCircle, faCalendarAlt, fasFaStar, farFaStar, faEye, faUser);

let localStorageVals = null;

if (localStorage.getItem('token')) {
  localStorageVals = {
    isLoggedIn: true,
    token: localStorage.getItem('token'),
    userInfo: JSON.parse(localStorage.getItem('userInfo')),
  }
}

ReactDOM.render(
  <BrowserRouter>
    <App userProps={localStorageVals} />
  </BrowserRouter>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
