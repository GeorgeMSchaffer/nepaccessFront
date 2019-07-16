import React from 'react';
import axios from 'axios';
import './login.css';

class Login extends React.Component {
    // state = { 
    //     username: '',
    //     password: '',
    //     usernameError: '',
    //     passwordError: '',
    //     passwordType: "password"
    // }

    state = { 
        user: {
            username: '',
            password: ''
        },
        usernameError: '',
        passwordError: '',
        passwordType: "password",
        networkError: ''
    }

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
    
    check = () => { // check if JWT is expired/invalid
				
		let verified = false;

		let checkURL = new URL('test/check', this.state.baseURL);
        var token = localStorage.JWT;
		if(token && localStorage.username){
			axios.defaults.headers.common['Authorization'] = token;
            axios({
                method: 'POST', // or 'PUT'
                url: checkURL
            }).then(response => {
                verified = response && response.status === 200;
            }).catch(error => {
                this.setState({
                    networkError: "The server may be down, please try again later."
                })
                // console.error('Server is probably down.', error);
            });
        }
        refreshNav(verified);
        
    }
    

    login = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        
        // TODO: certs and then HTTPS app-wide, probably
        // let loginUrl = new URL('http://localhost:8080/login');
        // if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
        //     loginUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/login');
        // }

        let loginUrl = new URL('login', this.state.baseURL);

        axios({ 
            method: 'POST',
            url: loginUrl,
            data: this.state.user
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                console.log("OK");
                return response.data;
            } else { // ???
                return null;
            }
        }).then(jsonResponse => {
            if(jsonResponse){
                // if HTTP 200 (ok), save JWT, username and clear login
                localStorage.JWT = jsonResponse.Authorization;
                localStorage.username = this.state.user.username;

                let fields = document.getElementsByClassName("form-control");
                let i;
                for (i = 0; i < fields.length; i++) {
                    fields[i].value = '';
                }
                console.log("Logged in");
                // TODO: Other logic than .push() for navigation?
                this.props.history.push('/')
                // this.setState({
                //     username: '',
                //     password: ''
                // });
            } else {
                // TODO: Tell user to try logging in again
            }
        }).catch(error => {
            if(error.toString() === 'Error: Network Error') {
                this.setState({
                    networkError: "Server may be down, please try again later."
                });
            }
            else {
                this.setState({
                    passwordError: "Couldn't login with that username/password combination, please try again."
                });
            }
            // console.error('error message', error);
        });

        document.body.style.cursor = 'default';
    }

    render() {
        console.log("Login");
        return (
            <div id="main" className="container login-form">
                <label className="errorLabel">{this.state.networkError}</label>
                <div className="form">
                    <div className="note">
                        <p>Login</p>
                    </div>

                    <div className="form-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" id="username" className="form-control" name="username" 
                                    placeholder="Username" autoFocus onChange={this.onChange} onKeyUp={this.onKeyUp}/>
                                    <label className="errorLabel">{this.state.usernameError}</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type={this.state.passwordType} id="password" className="form-control" name="password" 
                                    placeholder="Password" onChange={this.onChange} onKeyUp={this.onKeyUp}/>
                                    <label className="errorLabel">{this.state.passwordError}</label>
                                    <br />
                                    <input type="checkbox" id="showPassword" onClick={this.showPassword}></input>
                                    <label className="inline noSelect">Show password</label>
                                </div>
                            </div>
                        </div>
                        <button type="button" id="submit" onClick={this.login} >Submit</button>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
		let currentHost = new URL('http://localhost:8080/');
		if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
			currentHost = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/');
		}

		this.setState( 
		{ 
			baseURL: currentHost
		}, () =>{
			this.check();
		});
	}
}

export default Login;

function refreshNav(verified) {
	var loggedOutStyle = "block";
	var loggedInStyle = "block";

	if(verified){
		loggedOutStyle="none";
	} else {
		loggedInStyle="none";
	}

	let loggedOutItems = document.getElementsByClassName("logged-out");
	let i;
	for (i = 0; i < loggedOutItems.length; i++) {
		loggedOutItems[i].style.display = loggedOutStyle;
	}

	let loggedInItems = document.getElementsByClassName("logged-in");
	let j;
	for (j = 0; j < loggedInItems.length; j++) {
		loggedInItems[j].style.display = loggedInStyle;
	}
	if(localStorage.username){
		document.getElementById("details").innerHTML = localStorage.username;
    }
    
    // Logged in user hitting login with valid JWT should be redirected to search
    if(verified){
        this.props.history.push('/');
    } 
}