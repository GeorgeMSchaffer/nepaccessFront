import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import Globals from '../globals.js';

import './login.css';

class Login extends React.Component {
    
    constructor(props) {
        super(props);
		// this.state = {
        //     username: '',
        //     password: '',
        //     usernameError: '',
        //     passwordError: '',
        //     passwordType: "password"
        // };
        this.state = { 
            user: {
                username: '',
                password: ''
            },
            usernameError: '',
            passwordError: '',
            networkError: '',
            passwordType: "password"
        };
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);
    }
    

    onChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        this.setState( prevState =>
        { 
            const updatedUser = prevState.user;
            updatedUser[name] = value;
            return {
                user: updatedUser
            }
        });
    }

    onKeyUp = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.login();
        }
    }

    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidUsername();
        let test2 = this.invalidPassword();
        return (test1 || test2);
    }
    invalidUsername = () => {
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.user.username));
        let message = "";
        if(invalid){
            message = "Username invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({
            usernameError: message
        });
        return invalid;
    }
    invalidPassword = () =>{
        let passwordPattern = /[ -~]/;
        let invalid = !(passwordPattern.test(this.state.user.password));
        let message = "";
        if(invalid){
            message = "Password invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({
            passwordError: message
        });
        return invalid;
    }

    showPassword = () => {
        let value = "password";
        if(this.state.passwordType === value){
            value = "text";
        }
        this.setState({
            passwordType: value
        });
    } 
    

    check = () => {
				
		let verified = false;

		let checkURL = new URL('test/check', Globals.currentHost);
		if(localStorage.username){ // If they have a username saved, check if JWT is expired/invalid
            axios({
                method: 'POST', // or 'PUT'
                url: checkURL
            }).then(response => {
                // console.log(response.data);
                verified = response && response.status === 200;
                // Logged in user hitting login with valid JWT should be redirected to search, or user should logout.
                if(verified) {
                    this.props.history.push('/search');
                }
            }).catch(error => { // JWT is invalid or missing, or server problem
                if (!error.response) { // If no response, should mean server is down
                    this.setState({
                        networkError: 'Error: Network Error'
                    });
                } else { // should be a 403 for expired/invalid JWT, backend fires TokenExpiredException if expired
                    // console.log(error.response);
                }
            });
        }

        
    }
    

    login = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        
        // TODO: certs and then HTTPS app-wide, probably

        let loginUrl = new URL('login', Globals.currentHost);

        axios({ 
            method: 'POST',
            url: loginUrl,
            data: this.state.user
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return response.data;
            } else { // ???
                return null;
            }
        }).then(jsonResponse => {
            if(jsonResponse){
                // if HTTP 200 (ok), save JWT, username and clear login
                localStorage.JWT = jsonResponse.Authorization;
                localStorage.username = this.state.user.username;
                Globals.signIn();
                Globals.emitEvent('refresh', {
                    loggedIn: true
                });

                this.setState({ user: {} }); // clear
                // TODO: Other logic than .push() for navigation?
                this.props.history.push('/')
                // this.setState({
                //     username: '',
                //     password: ''
                // });
            } else {
                // Impossible?  Should either be error or 200
            }
        }).catch(error => {
            // TODO: Less brittle way to check error type
            if(error.toString() === 'Error: Network Error') {
                this.setState({
                    networkError: "Server may be down, please try again later.  If you are on a VPN, there are occasional issues with logging in (you can try connecting without the VPN)."
                });
            }
            else {
                this.setState({
                    passwordError: "Couldn't login with that username/password combination, please try again."
                });
            }
            console.error('error message', error);
        });

        document.body.style.cursor = 'default';
    }

    render() {
        // console.log("Login");
        return (
            <div className="container login-form">
                <div className="form">
                    <div className="note">
                        <p>Login</p>
                    </div>
                    <label className="loginErrorLabel">{this.state.networkError}</label>

                    <div className="form-content">
                        <div className="login-row">
                            Please login or quickly <Link to="/register">create an account here.</Link>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" id="username" className="form-control" name="username" 
                                    placeholder="Username" value={this.state.username} autoFocus onChange={this.onChange} onKeyUp={this.onKeyUp}/>
                                    <label className="loginErrorLabel">{this.state.usernameError}</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type={this.state.passwordType} id="password" className="form-control" name="password" 
                                    placeholder="Password"  value={this.state.password} onChange={this.onChange} onKeyUp={this.onKeyUp}/>
                                    <label className="loginErrorLabel">{this.state.passwordError}</label>
                                    <br />
                                    <input type="checkbox" id="showPassword" onClick={this.showPassword}></input>
                                    <label className="inline noSelect">Show password</label>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="button" id="submit" onClick={this.login} >Submit</button>
                        
                        <div className="login-row">
                            <Link to="/forgotPassword">Forgot password?</Link>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }

    componentDidMount() {
        this.check();
        Globals.emitEvent(false);
	}
}

export default Login;