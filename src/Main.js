import React from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios';

import './index.css';

import Landing from './Landing.js';
import App from './App';

import RecordDetailsTab from './Details/RecordDetailsTab.js';

import Login from './User/Login.js';
import Logout from './User/Logout.js';
import Reset from './User/Reset.js';
import UserDetails from './User/Profile.js';
import ForgotPassword from './User/ForgotPassword.js';
import Register from './User/Register.js';
import Verify from './User/Verify.js';


import AboutNepa from './iframes/AboutNepa.js';
import AboutNepaccess from './iframes/AboutNepaccess.js';
import People from './iframes/People.js';
import AboutSearchTips from './iframes/AboutSearchTips.js';
import AboutSearchTips2 from './iframes/AboutSearchTips2.js';
import Media from './iframes/Media.js';

import Contact from './Contact.js';

import AboutHelpContents from './AboutHelpContents.js';
import AboutStats from './AboutStats.js';


import Importer from './Importer.js';
import AdminFiles from './AdminFiles.js';
import Generate from './Generate.js';
import Iframes from './iframes/Iframes.js';
import Approve from './Approve.js';
import Admin from './Admin.js';

import Test from './Test.js';

import Globals from './globals.js';

import { Link, Switch, Route, withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import { hotjar } from 'react-hotjar';

class Main extends React.Component {
    
    static propTypes = {
        location: PropTypes.object.isRequired
    }

    constructor(props){
        super(props);
        this.state = {
            displayUsername: '',
            loggedIn: false,
            loggedInDisplay: 'display-none',
            loggedOutDisplay: '',
            loaderClass: 'loadDefault',
            curator: false,
            approver: false,
            currentPage: ""
        };
        this.refresh = this.refresh.bind(this);
        this.refreshNav = this.refreshNav.bind(this);
        Globals.setUp();

        // Init hotjar for webapp, unless local test
        if(window.location.hostname != 'localhost') {
            hotjar.initialize(2319391, 6);
        }
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
        // console.log("Main check");
        
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
        this.checkCurator();

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


    componentDidUpdate(prevProps) {
        // console.log("Main update");
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }
    onRouteChanged() {
        // console.log("Route changed",this.props.location.pathname);
        this.setState({
            currentPage: this.props.location.pathname
        });
    }


    render(){
        return (
        <div id="home-page">
            <Helmet>
                <meta charSet="utf-8" />
                <title>NEPAccess</title>
                <link rel="canonical" href="https://nepaccess.org/" />
            </Helmet>

            <div id="header" className="no-select">

                <div id="logo" className="no-select">
                    <Link id="logo-link" to="/">
                    </Link>
                    {/* <div id="logo-type">
                        <span id="NEP">NEP</span>
                        <span id="A">A</span>
                        <span id="ccess">ccess</span>
                    </div> */}
                    <div id="logo-box">

                    </div>
                </div>

                <div id="top-menu" className="no-select">
                    
                    {this.state.menuItems}

                    <span id="profile-span" className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                        <Link className="top-menu-link" to="/profile">Profile</Link>
                    </span>
                    <span id="login-span" className={this.state.loggedOutDisplay + " logged-out"}>
                        <Link className="top-menu-link" to="/login">Log in</Link>
                    </span>
                    <span className={this.state.loggedOutDisplay + " right-nav-item logged-out"}>
                        <Link className="top-menu-link" to="/register">Register</Link>
                    </span>
                    <span className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                        <Link className="top-menu-link" to="/logout">Log out</Link>
                    </span>
                </div>

                <div id="main-menu">
                    <Link currentpage={(this.state.currentPage==="/search").toString()} className="main-menu-link" to="/search">
                        Search
                    </Link>
                    <Link currentpage={(this.state.currentPage==="/aboutnepa").toString()} className="main-menu-link" to="/aboutnepa">
                        About NEPA
                    </Link>
                    <div id="about-dropdown" className="main-menu-link dropdown">
                        <Link currentpage={(this.state.currentPage==="/aboutnepaccess" || this.state.currentPage==="/people" || this.state.currentPage==="/media").toString()} id="about-button" className="main-menu-link drop-button" to="/aboutnepaccess">
                            About NEPAccess
                        </Link>
                        <i className="fa fa-caret-down"></i>
                        <div className="dropdown-content">
                            <Link to="/aboutnepaccess">About NEPAccess</Link>
                            <Link to="/media">
                                Videos
                            </Link>
                            <Link to="/people">People</Link>
                            {/* <Link to="/abouthelpcontents">Database Contents</Link> */}
                            {/* <Link to="/stats">Content Statistics</Link> */}
                        </div>
                    </div>
                    
                    <div id="about-dropdown-2" className="main-menu-link dropdown">
                        <Link currentpage={(this.state.currentPage==="/abouthelp" || this.state.currentPage==="/abouthelp2").toString()} id="about-button-2" className="main-menu-link drop-button" to="/abouthelp">
                            Search Tips
                        </Link>
                        <i className="fa fa-caret-down"></i>
                        <div className="dropdown-content">
                            <Link to="/abouthelp">Search Tips</Link>
                            <Link to="/abouthelp2">What Can I Search For?</Link>
                        </div>
                    </div>
                    <Link currentpage={(this.state.currentPage==="/contact").toString()} className="main-menu-link" to="/contact">
                        Contact
                    </Link>

                </div>
                
            </div>
            <Switch>
                <Route path="/profile" component={UserDetails}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/forgotPassword" component={ForgotPassword}/>
                <Route path="/reset" component={Reset}/>
                <Route path="/logout" component={Logout}/>

                <Route path="/search" component={App}/>
                <Route path="/aboutnepa" component={AboutNepa}/>
                <Route path="/aboutnepaccess" component={AboutNepaccess}/>
                <Route path="/people" component={People}/>
                <Route path="/abouthelp" component={AboutSearchTips}/>
                <Route path="/abouthelp2" component={AboutSearchTips2}/>
                <Route path="/abouthelpcontents" component={AboutHelpContents}/>
                <Route path="/stats" component={AboutStats}/>
                <Route path="/media" component={Media}/>

                <Route path="/contact" component={Contact}/>

                <Route path="/record-details" component={RecordDetailsTab}/>
                
                <Route path="/importer" component={Importer}/>
                <Route path="/adminFiles" component={AdminFiles}/>
                <Route path="/generate" component={Generate}/>

                <Route path="/iframes" component={Iframes} />
                <Route path="/verify" component={Verify} />
                <Route path="/approve" component={Approve} />
                <Route path="/admin" component={Admin} />
                
                <Route path="/test" component={Test} />

                <Route path="/" component={Landing}/>
            </Switch>
        </div>
        )
    }


    checkCurator = () => {
        if(this.state.loggedIn === false) { // No need for axios call
            this.setState({
                curator: false
            }, () =>{
                this.getCuratorMenuItems();
            })
        } else {
            let checkUrl = new URL('user/checkCurator', Globals.currentHost);
            let result = false;
            axios({
                url: checkUrl,
                method: 'POST'
            }).then(response => {
                result = response && response.status === 200;
                this.setState({
                    curator: result
                }, () => {
                    this.getCuratorMenuItems();
                });
            }).catch(error => { // 401/403
                this.setState({
                    curator: false
                }, () => {
                    this.getCuratorMenuItems();
                });
            });
        }

        if(this.state.loggedIn === false) { // No need for axios call
            this.setState({
                approver: false
            }, () =>{
                this.getCuratorMenuItems();
            })
        } else {
            let checkUrl = new URL('user/checkApprover', Globals.currentHost);
            let result = false;
            axios({
                url: checkUrl,
                method: 'POST'
            }).then(response => {
                result = response && response.status === 200;
                this.setState({
                    approver: result
                }, () => {
                    this.getCuratorMenuItems();
                });
            }).catch(error => { // 401/403
                this.setState({
                    approver: false
                }, () => {
                    this.getCuratorMenuItems();
                });
            });
        }


    }

    getCuratorMenuItems = () => {
        if(this.state.curator === true) {
            localStorage.curator = true;

            this.setState({
                menuItems: 
                <span id="admin-span" className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                    
                    <div id="admin-dropdown" className="main-menu-link dropdown">
                        <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
                            Admin
                        </Link>
                        <i className="fa fa-caret-down"></i>
                        <div className="dropdown-content">
                            <Link to="/importer">Import New Documents</Link>
                            <Link to="/adminFiles">Find Missing Files</Link>
                            <Link to="/approve">Approve Users</Link>
                        </div>
                    </div>
                </span>
            });
        } else if(this.state.approver === true) {
            
            localStorage.approver = true;

            this.setState({
                menuItems: 
                <span id="admin-span" className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                    
                    <div id="admin-dropdown" className="main-menu-link dropdown">
                        <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
                            Admin
                        </Link>
                        <i className="fa fa-caret-down"></i>
                        <div className="dropdown-content">
                            <Link to="/approve">Approve Users</Link>
                        </div>
                    </div>
                </span>
            });
        } else {
            this.setState({
                menuItems: <></>
            });
        }
    }

    
    componentDidMount() {
        Globals.registerListener('refresh', this.refresh);
        this.setState({
            currentPage: window.location.pathname
        });
        this.check();
        this.checkCurator();
    }
}

export default withRouter(Main);