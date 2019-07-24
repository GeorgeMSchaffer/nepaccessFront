import React from 'react';
import axios from 'axios';

import './index.css';
import './login.css';

import App from './App';
import Login from './Login.js';
import Logout from './Logout.js';
import Reset from './Reset.js';
// import Register from './Register.js';
import Generate from './Generate.js';
import UserDetails from './UserDetails.js';
import ForgotPassword from './ForgotPassword';

import Globals from './globals.js';

import { Link, Switch, Route } from 'react-router-dom';

class Main extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            displayUsername: '',
            loggedIn: false,
            loggedInDisplay: 'display-none',
            loggedOutDisplay: '',
            loaderClass: 'loadDefault',
        };
        this.check = this.check.bind(this);
        this.refresh = this.refresh.bind(this);
        this.refreshNav = this.refreshNav.bind(this);
        Globals.setUp();
    }


    check = () => { // check if logged in (JWT is valid and not expired)
        let verified = false;
        let checkURL = new URL('test/check', Globals.currentHost);
        
        axios.post(checkURL)
        .then(response => {
            verified = response && response.status === 200;
            this.setState({
                loggedIn: verified
            }, () => {
                this.refreshNav();
            });
        })
        .catch((err) => { // Token expired or invalid, or server is down
            this.setState({
                loggedIn: false
            });
        });
        
    }

    // TODO: This and the relevant CSS is probably useless, use something like https://loading.io/css/
	waitCursor = (waiting) =>{ 
		if(waiting){ this.setState({ loaderClass: 'loadWait' }); }
		else { this.setState({ loaderClass: 'loadDefault' }); }
	}


    // refresh() has a global listener so as to change the loggedIn state and then update the navbar
    // as needed, from child components
    refresh(verified) { 
        this.setState({
            loggedIn: verified.loggedIn
        }, () => {
            this.refreshNav();
        });
    }

    refreshNav() {
        this.setState({
            loggedOutDisplay: 'display-none',
            loggedInDisplay: 'display-none'
        });
        if(this.state.loggedIn){
            // console.log("Logout etc. displaying");
            this.setState({
                loggedInDisplay: ''
            });
        } else {
            // console.log("Login button displaying");
            this.setState({
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
        <div id="main" className={this.state.loaderClass}>
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
                <Route path="/login" component={Login}/>
                <Route path="/reset" component={Reset}/>
                <Route path="/generate" component={Generate}/>
                {/* <Route path="/register" component={Register}/> */}
                <Route path="/details" component={UserDetails}/>
                <Route path="/logout" component={Logout}/>
                <Route path="/forgotPassword" component={ForgotPassword}/>
                <Route path="/" component={App}/>
            </Switch>
        </div>
        )
    }

    
    componentDidMount() {
        Globals.registerListener('refresh', this.refresh);
        // Globals.registerListener(this.refresh);
        this.check();
    }
}

export default Main;