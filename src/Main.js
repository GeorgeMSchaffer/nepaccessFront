import React from 'react';
import axios from 'axios';

import './index.css';

import App from './App';
import Login from './Login.js';
import Logout from './Logout.js';
import Reset from './Reset.js';
// import Register from './Register.js';
import Generate from './Generate.js';
import UserDetails from './UserDetails.js';

import { Link, Switch, Route } from 'react-router-dom';

class Main extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            displayUsername: '',
            loggedInDisplay: 'display-none',
            loggedOutDisplay: ''
        };
        this.check = this.check.bind(this);
        this.refreshNav = this.refreshNav.bind(this);
    }


    check() { // check if JWT is expired/invalid

        let currentHost = new URL('http://localhost:8080/');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            currentHost = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/');
        }
                    
        let verified = false;
        // let noError = true;
    
        let checkURL = new URL('test/check', currentHost);
        let token = localStorage.JWT;
        if(token){
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(checkURL)
            .then(response => {
                verified = response && response.status === 200;
                this.refreshNav(verified);
            })
            .catch((err) => {
                // noError = false; // Network or server error
            });
        } 
    }


    testHandle(){
        this.refreshNav(true);
    }


    // TODO: Lift up state instead of running the other refreshNavs in the project
    refreshNav(verified) {
        if(verified){
            this.setState({
                loggedOutDisplay: 'display-none',
                loggedInDisplay: ''
            });
        } else {
            this.setState({
                loggedInDisplay: 'display-none',
                loggedOutDisplay: ''
            });
        }
        
        if(localStorage.username){
            this.setState({
                displayUsername: localStorage.username
            });
        }
    }

    render(){
        return (
        <div>
            <div id="nav-background">
                <span className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                    <Link className="nav-link right-nav-item" to="/logout">Logout</Link>
                </span>
                <span className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                    <Link id="details" className="nav-link right-nav-item" to="/details">{this.state.displayUsername}</Link>
                </span>
                <div id="navbar">
                    <ul>
                        <li className={this.state.loggedInDisplay + " nav-item logged-in"}>
                            <Link className="nav-link" to="/">Search</Link>
                        </li>
                        <li className={this.state.loggedOutDisplay + " nav-item logged-out"}>
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        {/* <li className="nav-item logged-out">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li> */}
                    </ul>
                </div>
            </div>
            <Switch>
                <Route path="/login" component={Login} testAction={this.testHandle}/>
                <Route path="/reset" component={Reset}/>
                <Route path="/generate" component={Generate}/>
                {/* <Route path="/register" component={Register}/> */}
                <Route path="/details" component={UserDetails}/>
                <Route path="/logout" component={Logout}/>
                <Route path="/" component={App}/>
            </Switch>
        </div>
        )
    }

    
    componentDidMount() {
        this.check();
    }
}

export default Main;