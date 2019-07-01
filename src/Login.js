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
        passwordType: "password"
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
        this.onKeyUp = this.onKeyUp.bind(this);
        this.login = this.login.bind(this);
	}

    onKeyUp = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.login();
        }

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


    login = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        
        // TODO: certs and then HTTPS app-wide, probably
        let loginUrl = new URL('http://localhost:8080/login');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            loginUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/login');
        }

        axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
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
            this.setState({
                passwordError: "Couldn't login with that username/password combination, please try again."
            });
            // console.error('error message', error);
        });

        document.body.style.cursor = 'default';
    }

    render() {
        return (
            <div id="main" className="container login-form">
                <div className="form">
                    <div className="note">
                        <p>Login</p>
                    </div>

                    <div className="form-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" id="username" className="form-control" name="username" 
                                    placeholder="Username" autoFocus onKeyUp={this.onKeyUp}/>
                                    <label className="errorLabel">{this.state.usernameError}</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type={this.state.passwordType} id="password" className="form-control" name="password" 
                                    placeholder="Password" onKeyUp={this.onKeyUp}/>
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
}

export default Login;