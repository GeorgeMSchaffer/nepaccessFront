import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import App from './App';
import Login from './Login.js';
import Logout from './Logout.js';
// import Register from './Register.js';
import Generate from './Generate.js';
import UserDetails from './UserDetails.js';

import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
// TODO: Show account link that links to user details page
// TODO: User details page where user can edit email and password, see role
// Can simply be a logged in or logged out version of the navbar that we display here.
// Or, can add .css rules to hide/display items.

ReactDOM.render(
    <BrowserRouter>
    <div>
        <div id="nav-background">
            <span className="right-nav-item logged-in">
                <Link className="nav-link right-nav-item" to="/logout">Logout</Link>
            </span>
            <span className="right-nav-item logged-in display-none">
                <Link id="details" className="nav-link right-nav-item" to="/details"></Link>
            </span>
            <div id="navbar">
                <ul>
                    <li className="nav-item logged-in">
                        <Link className="nav-link" to="/">Search</Link>
                    </li>
                    <li className="nav-item logged-out">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    {/* <li className="nav-item logged-out">
                        <Link className="nav-link" to="/register">Register</Link>
                    </li> */}
                </ul>
            </div>
        </div>
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/generate" component={Generate}/>
            {/* <Route path="/register" component={Register}/> */}
            <Route path="/details" component={UserDetails}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/" component={App}/>
        </Switch>
    </div>
    </BrowserRouter>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
