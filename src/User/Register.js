import React from 'react';
import Select from 'react-select';

import axios from 'axios';
import globals from '../globals.js';

import './login.css';
import './register.css';

const _ = require('lodash');
const affiliations = [
    {value:"Federal government", label:"Federal government"}, 
    {value:"Tribal government", label:"Tribal government"}, 
    {value:"State/local government", label:"State/local government"}, 
    {value:"NEPA consultant/preparer", label:"NEPA consultant/preparer"}, 
    {value:"Private industry", label:"Private industry"}, 
    {value:"NGO", label:"NGO"}, 
    {value:"Lawyer", label:"Lawyer"}, 
    {value:"Academic research", label:"Academic research"}, 
    {value:"General public", label:"General public"}, 
    {value:"Other", label:"Other"}
];
//<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">

// TODO: Send email for validation before actually registering user
// TODO: certs and then HTTPS app-wide, probably
class Register extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            username: '',
            password: '',
            email: '',
            disabled: false,
            passwordType: "password",

            usernameError: '',
            emailError: '',
            passwordError: '',
            firstNameError: '',
            lastNameError: '',
            affiliationError: '',
            affiliationOtherError: '',

            firstName: '',
            lastName: '',
            affiliation: '', // "Field"
            affiliationOther: '', 
            jobTitle: '', // optional
            organization: '', // optional
        };

        this.checkUsername = _.debounce(this.checkUsername, 300);
        document.body.style.cursor = 'default';
    }
    


    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidEmail();
        let test2 = this.checkUsername();
        let test3 = this.invalidPassword();
        let test4 = this.invalidFirst();
        let test5 = this.invalidLast();
        let test6 = this.invalidAffiliation();
        let test7 = this.invalidAffiliationOther();

        this.setState({ disabled: test1 || test2 || test3 || test4 || test5 || test6 || test7 });
        
        return (test1 || test2 || test3 || test4 || test5 || test6 || test7 );
    }
    invalidUsername = () => {
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.username));
        let message = "";
        if(invalid){
            message = "Username invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({ usernameError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidFirst = () => {
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.firstName));
        let message = "";
        if(invalid){
            message = "Name invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({ firstNameError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidLast = () => {
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.lastName));
        let message = "";
        if(invalid){
            message = "Name invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({ lastNameError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidEmail(){
        let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let invalid = !(emailPattern.test(this.state.email));
        let message = "";
        if(invalid){
            message = "Email address invalid.";
        }
        this.setState({ emailError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidAffiliation(){
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.affiliation));
        let message = "";
        if(invalid){
            message = "Please select a field.  If other, select \"Other\" and then type field below.";
        }
        this.setState({ affiliationError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    
    invalidAffiliationOther(){
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.affiliationOther)) && this.state.affiliation==="Other";
        let message = "";
        if(invalid){
            message = "Required field when selecting \"Other\"";
        }
        this.setState({ affiliationOtherError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidPassword(){
        let passwordPattern = /[ -~]/;
        let invalid = !(passwordPattern.test(this.state.password));
        let message = "";
        if(invalid){
            message = "Password invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({ passwordError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }



    // Check if username is taken to prevent submission of duplicates
    checkUsername = () => {
        if(this.invalidUsername()){
            this.setState({ disabled: true });
            return;
        } else {
            this.setState({ disabled: false });
        }

        let nameUrl = new URL('user/exists', globals.currentHost);
        
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
                this.setState({ usernameError: "Username taken." });
            } else {
                this.setState({ usernameError: "" });
            }
        }).catch(error => {
            console.error('Server probably down.', error);
        });
    }

	onUsernameChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.checkUsername(); });
    }

	onPasswordChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidPassword(); });
    }
    
	onEmailChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidEmail(); });
    }

    onChangeHandler = (evt) => {
		// evt.target.name defined by name= in input
		this.setState( 
		{ 
            [evt.target.name]: evt.target.value,
        }, () => { 
            // check for invalids (also disables register button if invalid)
            this.invalidFields();
        });
    }

    onSelectHandler = (val, act) => {
        console.log("Val/act",val,act);
        if(!val || !act){
            return;
        }

        // if(act.action === ""){
        // }

        this.setState(
        { 
            affiliation: val.value
        }, () => {
            this.invalidFields();
        });

    }



    // Register
    register = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        this.setState({ disabled: true });
        
        let registerUrl = new URL('user/register', globals.currentHost);

        let dataToPass = { 
            username: this.state.username, 
            password: this.state.password, 
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            affiliation: this.state.affiliation,
            organization: this.state.organization,
            jobTitle: this.state.jobTitle
        };

        axios({ 
            method: 'POST',
            url: registerUrl,
            data: dataToPass,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                console.log("OK");
                return true;
            } else { // 403
                return false;
            }
        }).then(ok => {
            if(ok){
                // if HTTP 200 (ok), clear fields and login user
                console.log("Registered");
                
                let loginUrl = new URL('login', globals.currentHost);
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
                        localStorage.username = this.state.username;
                        // let fields = document.getElementsByClassName("form-control");
                        // let i;
                        // for (i = 0; i < fields.length; i++) {
                        //     fields[i].value = '';
                        // }
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

        this.setState({ disabled: false });
        document.body.style.cursor = 'default';
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
    
    render() {
        return (
            <div className="container content register-form">
                <div className="form">
                    <div className="note">
                        <p>Register</p>
                    </div>

                    <div className="form-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <span>Username</span><input type="text" className="form-control" id="username" name="username" placeholder="My Username *" autoFocus onKeyUp={this.onUsernameChange}/>
                                    <label className="errorLabel">{this.state.usernameError}</label>
                                </div>
                                <div className="form-group">
                                    <span>First name</span><input type="text" className="form-control" id="firstName" name="firstName" placeholder="First name *" onChange={this.onChangeHandler}/>
                                    <label className="errorLabel">{this.state.firstNameError}</label>
                                </div>
                                <div className="form-group">
                                    <span>Last name</span><input type="text" className="form-control" id="lastName" name="lastName" placeholder="Last name *" onChange={this.onChangeHandler}/>
                                    <label className="errorLabel">{this.state.lastNameError}</label>
                                </div>
                                <div className="form-group">
                                    <span>Email</span><input type="text" className="form-control" id="email" name="email" placeholder="Email Address *" onKeyUp={this.onEmailChange}/>
                                    <label className="errorLabel">{this.state.emailError}</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                <span>Field</span><Select id="affiliation" 
                                        className="form-control inline-block" 
                                        options={affiliations}
                                        name="affiliation" 
                                        placeholder="Select Field *" 
                                        onChange={this.onSelectHandler}/>
                                    <label className="errorLabel">{this.state.affiliationError}</label>
                                </div>
                                <div className="form-group">
                                <span></span><input disabled={this.state.affiliation !== "Other"} type="text" className="form-control" id="affiliationOther" name="affiliationOther" placeholder="If selecting other: Type field here" onChange={this.onChangeHandler}/>
                                    <label  className="errorLabel">{this.state.affiliationOtherError}</label>
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                                <div className="form-group">
                                    <span>Name of organization</span><input type="text" className="form-control" id="organization" name="organization" placeholder="Organization name" onKeyUp={this.onChangeHandler}/>
                                </div>
                                <div className="form-group">
                                    <span>Job title</span><input type="text" className="form-control" id="jobTitle" name="jobTitle" placeholder="Job title" onChange={this.onChangeHandler}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <span>Password</span><input type={this.state.passwordType} id="password" className="form-control password-field" name="password" placeholder="My Password *" onKeyUp={this.onPasswordChange}/>
                                    <label className="errorLabel">{this.state.passwordError}</label>
                                    <br />
                                    <input type="checkbox" id="showPassword" onClick={this.showPassword}></input>
                                    <label className="inline noSelect">Show password</label>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="button" id="submit" disabled={this.state.disabled} onClick={this.register}>Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;