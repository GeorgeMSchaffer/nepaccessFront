import React from 'react';
import axios from 'axios';

import './index.css';

import Landing from './Landing.js';
import App from './App';
import Login from './Login.js';
import Logout from './Logout.js';
import Reset from './Reset.js';
// import Register from './Register.js';
import Generate from './Generate.js';
import UserDetails from './UserDetails.js';
import ForgotPassword from './ForgotPassword';

import Fulltext from './Fulltext.js';

import AboutNepa from './AboutNepa.js';
import AboutNepaccess from './AboutNepaccess';
// import Help from './Help';

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
        console.log("Main check");
        
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
        <div id="home-page">

            <div id="header" className="no-select">

                <div id="logo" className="no-select" to="/">
                    <Link id="logo-type" to="/">
                        <span id="NEP">NEP</span>
                        <span id="A">A</span>
                        <span id="ccess">ccess</span>
                    </Link>
                    <div id="logo-box">

                    </div>
                </div>

                <div id="top-menu" className="no-select">
                    <span className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                        <Link className="top-menu-link" to="/details">Profile</Link>
                    </span>
                    <span className={this.state.loggedInDisplay + " cursor-default no-select right-nav-item logged-in"}>
                        |
                    </span>
                    <span className={this.state.loggedOutDisplay + " logged-out"}>
                        <Link className="top-menu-link" to="/login">Log in</Link>
                    </span>
                    <span className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                        <Link className="top-menu-link" to="/logout">Log out</Link>
                    </span>
                </div>

                <div id="main-menu">
                    <Link className="main-menu-link" to="/search">Search NEPAccess</Link>
                    <Link className="main-menu-link" to="/aboutnepa">About NEPA</Link>
                    <Link className="main-menu-link" to="/aboutnepaccess">About NEPAccess</Link>
                    <Link className="main-menu-link" to="/fulltext">Fulltext search</Link>
                </div>
                
            </div>
            <Switch>
                <Route path="/details" component={UserDetails}/>
                <Route path="/login" component={Login}/>
                <Route path="/forgotPassword" component={ForgotPassword}/>
                <Route path="/reset" component={Reset}/>
                <Route path="/logout" component={Logout}/>

                <Route path="/fulltext" component={Fulltext}/>
                <Route path="/search" component={App}/>
                <Route path="/aboutnepa" component={AboutNepa}/>
                <Route path="/aboutnepaccess" component={AboutNepaccess}/>
                
                <Route path="/generate" component={Generate}/>

                <Route path="/" component={Landing}/>
            </Switch>
        </div>
        )
    }

    
    componentDidMount() {
        Globals.registerListener('refresh', this.refresh);
        this.check();
    }
}

export default Main;