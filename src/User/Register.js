import React from 'react';
import {Helmet} from 'react-helmet';
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

            statusLabel: '',
            statusClass: '',
            registered: false
        };

        this.checkUsername = _.debounce(this.checkUsername, 300);
        this.checkEmail = _.debounce(this.checkEmail, 300);
        document.body.style.cursor = 'default';
    }
    


    // Validation
    invalidFields = () => {
        if(this.state.registered) {
            return true;
        }
        // Run everything and all appropriate errors will show at once.
        let test1 = this.checkEmail();
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
        let usernamePattern = /[a-zA-Z0-9]/;
        let invalid = !(usernamePattern.test(this.state.username));
        let message = "";
        if(invalid){
            message = "Cannot be empty, alphanumeric only.";
        }
        this.setState({ usernameError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidFirst = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.firstName.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty, alphabetical characters only.";
        }
        this.setState({ firstNameError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidLast = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.lastName.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty, alphabetical characters only.";
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
            message = "Please enter a valid email address.";
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
            message = "Cannot be empty, must be printable characters.";
        }
        this.setState({ passwordError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }



    // Check if email is taken to prevent submission of duplicates
    checkEmail = () => {
        if(this.invalidEmail() || this.state.registered){
            this.setState({ disabled: true });
            return;
        } else {
            this.setState({ disabled: false });
        }

        let nameUrl = new URL('user/email-exists', globals.currentHost);
        
        fetch(nameUrl, { 
            method: 'POST',
            body: this.state.email,
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
            if(jsonResponse && jsonResponse === true){
                this.setState({ emailError: "Email already claimed.  Please try another email." });
            } else if(jsonResponse === false) {
                this.setState({ emailError: "" });
            }
        }).catch(error => {
            this.setState({
                statusClass: 'errorLabel',
                statusLabel: 'Sorry, an error has occurred.  Server may currently be down.  Please try again later.'
            });
            console.error('Server probably down.', error);
        });
    }

    // Check if username is taken to prevent submission of duplicates
    checkUsername = () => {
        if(this.invalidUsername() || this.state.registered){
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
            if(jsonResponse && jsonResponse === true){
                this.setState({ usernameError: "Username taken.  Please try another username." });
            } else if(jsonResponse === false) {
                this.setState({ usernameError: "" });
            }
        }).catch(error => {
            this.setState({
                statusClass: 'errorLabel',
                statusLabel: 'Sorry, an error has occurred.  Server may currently be down.  Please try again later.'
            });
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
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.checkEmail(); });
    }

    onChangeHandler = (evt) => {
		// evt.target.name defined by name= in input
        const name = evt.target.name;
		this.setState( 
		{ 
            [name]: evt.target.value,
        }, () => { 
            // validate (also disables register button if invalid)
            
            switch (name) {
                case 'affiliation':
                    this.invalidAffiliation();
                    break;
                case 'firstName':
                    this.invalidFirst();
                    break;
                case 'lastName':
                    this.invalidLast();
                    break;
                default:
                    this.invalidFields(); // org selection/other org name handles itself from here
            }

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
            // this.invalidFields();
            this.invalidAffiliation();
        });

    }

    // Register
    register = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        this.setState({ 
            disabled: true,
            statusLabel: ''
         });
        
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
            console.log(response.status);
        
            if(responseOK){ // 200
                this.setState({
                    statusClass: 'successLabel',
                    statusLabel: 'Successfully registered.  An email will be sent to you with a verification link.  After clicking that, your account will still need to be approved before you can use the system.',
                    registered: true
                });
            } else { // 500 or 503, or server down
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred. Server responded with ' + response.status
                });
            }
        }).catch(error => {
            if(error.response.status===418) {
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, that username is taken.'
                });
            } else {
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred.  Server may currently be down.  Please try again later.'
                });
            }
            console.error(error);
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
            <div id="register-form">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - Register</title>
                    <link rel="canonical" href="https://nepaccess.org/register" />
                </Helmet>
                <div className="note">
                    Register
                </div>

                <div className="form-content">
                    <div className="row">

                        <div className="register-form-input-group">
                            <div className="register-form-group">
                                <span className="register-leading-text">First name</span><input type="text" maxLength="191"
                                    className="register-form-control" id="firstName" name="firstName" placeholder="First name *" autoFocus onBlur={this.onChangeHandler}/>
                                <label className="errorLabel">{this.state.firstNameError}</label>
                            </div>
                            <div className="register-form-group">
                                <span className="register-leading-text">Last name</span><input type="text" maxLength="191"
                                    className="register-form-control" id="lastName" name="lastName" placeholder="Last name *" onBlur={this.onChangeHandler}/>
                                <label className="errorLabel">{this.state.lastNameError}</label>
                            </div>
                            <div className="register-form-group">
                                <span className="register-leading-text">Email</span><input type="text" maxLength="191"
                                    className="register-form-control" id="email" name="email" placeholder="Email Address *" onBlur={this.onEmailChange}/>
                                <label hidden={this.state.registered} className="errorLabel">{this.state.emailError}</label>
                            </div>
                        </div>
                        <div className="register-form-input-group">
                            <div className="register-form-group">
                            <span className="register-leading-text">Field</span><Select id="affiliation" 
                                    className="register-form-control inline-block" 
                                    options={affiliations}
                                    name="affiliation" 
                                    placeholder="Select Field *" 
                                    onChange={this.onSelectHandler}/>
                                <label className="errorLabel">{this.state.affiliationError}</label>
                            </div>
                            <div className="register-form-group">
                                <span className="register-leading-text"></span>
                                <input disabled={this.state.affiliation !== "Other"} type="text" maxLength="1000"
                                    className="register-form-control" id="affiliationOther" name="affiliationOther" placeholder="If selecting other: Type field here" onBlur={this.onChangeHandler} />
                                <label className="errorLabel">{this.state.affiliationOtherError}</label>
                            </div>
                        </div>
                        
                        <div className="register-form-input-group">
                            <div className="register-form-group">
                                <span className="register-leading-text">Name of organization</span><input type="text" maxLength="1000" className="register-form-control" id="organization" name="organization" placeholder="Organization name" />
                            </div>
                            <div className="register-form-group">
                                <span className="register-leading-text">Job title</span><input type="text" maxLength="1000" className="register-form-control" id="jobTitle" name="jobTitle" placeholder="Job title" />
                            </div>
                            <div className="register-form-group">
                                <span className="register-leading-text">Preferred Username</span><input type="text" maxLength="191"
                                    className="register-form-control" id="username" name="username" placeholder="My Username *" onBlur={this.onUsernameChange}/>
                                <label hidden={this.state.registered} className="errorLabel">{this.state.usernameError}</label>
                            </div>
                            <div className="register-form-group">
                                <span className="register-leading-text">Password</span><input type={this.state.passwordType} maxLength="191" 
                                    id="password" className="register-form-control password-field" name="password" placeholder="My Password *" onBlur={this.onPasswordChange} />
                                <label className="errorLabel">{this.state.passwordError}</label>
                            </div>
                            <div className="register-form-group">
                                <span className="register-leading-text"></span>
                                <input type="checkbox" id="showPassword" onClick={this.showPassword}></input>
                                <label className="inline noSelect">Show password</label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="register-form-input-group">
                            <div className="register-form-group">
                                <span className="register-leading-text"></span>
                                <button type="button" className="button inline-block" id="register-submit" disabled={this.state.disabled} onClick={this.register}>Register</button>
                            </div>
                            <label className={this.state.statusClass}>{this.state.statusLabel}</label>
                    </div>

                </div>
            </div>
        )
    }
}

export default Register;