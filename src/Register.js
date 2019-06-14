import React from 'react';
import './login.css';

const _ = require('lodash');
//<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">

// TODO: Send email for validation before actually registering user
// TODO: certs and then HTTPS app-wide, probably
class Register extends React.Component {

    state = {
        username: '',
        password: '',
        email: ''
    }

    constructor(props) {
        super(props);
		this.state = {
            username: '',
            password: '',
            email: ''
        };
        this.checkUsername = _.debounce(this.checkUsername, 300);
    }
    


    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidEmail();
        let test2 = this.invalidUsername();
        let test3 = this.invalidPassword();
        return (test1 || test2 || test3);
    }
    invalidUsername = () => {
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.username));
        let message = "";
        if(invalid){
            message = "Username invalid. Cannot be empty, must be printable characters.";
        }
        document.getElementById("username").nextSibling.innerHTML = message;
        return invalid;
    }
    invalidEmail(){
        let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let invalid = !(emailPattern.test(this.state.email));
        let message = "";
        if(invalid){
            message = "Email address invalid.";
        }
        document.getElementById("email").nextSibling.innerHTML = message;
        return invalid;
    }
    invalidPassword(){
        let passwordPattern = /[ -~]/;
        let invalid = !(passwordPattern.test(this.state.password));
        let message = "";
        if(invalid){
            message = "Password invalid. Cannot be empty, must be printable characters.";
        }
        document.getElementById("password").nextSibling.innerHTML = message;
        return invalid;
    }



    // Check if username is taken to prevent duplicates
    checkUsername = () => {
        if(this.invalidUsername()){
            return;
        }
        let nameUrl = new URL('http://localhost:8080/users/exists');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            nameUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/users/exists');
        }
        fetch(nameUrl, { 
            method: 'POST',
            body: this.state.username,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            if(response.ok){ // 200
                return response.json();
            } else { // 403
                return null;
            }
        }).then(jsonResponse => {
            if(jsonResponse === true){
                document.getElementById("username").nextSibling.innerHTML = "Username taken.";
            } else {
                document.getElementById("username").nextSibling.innerHTML = "";
            }
        }).catch(error => {
            console.error('Server probably down.', error);
        });
    }



    // onKeyUp events (KeyUp to capture keyCodes)
	onUsernameChange = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            document.getElementById("submit").click();
        }
        this.setState( 
		{ 
			[evt.target.name]: evt.target.value
        }, () =>{
            this.checkUsername();
        });
    }

	onPasswordChange = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            document.getElementById("submit").click();
        }
        this.setState( 
		{ 
			[evt.target.name]: evt.target.value
        }, () => {
            this.invalidPassword();
        });
    }
    
	onEmailChange = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            document.getElementById("submit").click();
        }
        this.setState( 
		{ 
			[evt.target.name]: evt.target.value
        }, () => {
            this.invalidEmail();
        });
    }



    // Register
    register = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        
        let registerUrl = new URL('http://localhost:8080/users/register');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            registerUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/users/register');
        }

        fetch(registerUrl, { 
            method: 'POST',
            body: JSON.stringify(this.state),
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            if(response.ok){ // 200
                return true;
            } else { // 403
                return false;
            }
        }).then(ok => {
            if(ok){
                // if HTTP 200 (ok), clear fields and login user
                console.log("Registered");
                let loginUrl = new URL('http://localhost:8080/login');
                if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
                    loginUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/login');
                }
                var user = {
                    username: this.state.username,
                    password: this.state.password
                }
                fetch(loginUrl, {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers:{
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }).then(response => {
                    if(response.ok){ // 200
                        return response.json();
                    } else { // 403
                        return null;
                    }
                }).then(jsonResponse => {
                    if(jsonResponse){
                        localStorage.JWT = jsonResponse.Authorization;
                        let fields = document.getElementsByClassName("form-control");
                        let i;
                        for (i = 0; i < fields.length; i++) {
                            fields[i].value = '';
                        }
                        this.props.history.push('/')
                        console.log("Logged in");
                    } else {
                        // TODO
                        console.log("403");
                    }
                });
            } else {
                // TODO
            }
        }).catch(error => {
            console.error('error message', error);
        });

        document.body.style.cursor = 'default';
    }

    
    showPassword() {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
            document.getElementById("showPassword").checked = true;
        } else {
            x.type = "password";
            document.getElementById("showPassword").checked = false;
        }
    } 
    
    render() {
        return (
            <div id="main" className="container register-form">
                <div className="form">
                    <div className="note">
                        <p>Register</p>
                    </div>

                    <div className="form-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" className="form-control" id="username" name="username" placeholder="My Username *" autoFocus onKeyUp={this.onUsernameChange}/>
                                    <label className="errorLabel"></label>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="email" name="email" placeholder="Email Address *" onKeyUp={this.onEmailChange}/>
                                    <label className="errorLabel"></label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="password" id="password" className="form-control password-field" name="password" placeholder="My Password *" onKeyUp={this.onPasswordChange}/>
                                    <label className="errorLabel"></label>
                                    <br />
                                    <input type="checkbox" id="showPassword" onClick={this.showPassword}></input>
                                    <label className="inline noSelect">Show password</label>
                                </div>
                            </div>
                        </div>
                        <button type="button" id="submit" className="btnSubmit" onClick={this.register}>Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;