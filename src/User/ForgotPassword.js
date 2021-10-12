import React from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios';

import Globals from '../globals.js';

import './login.css';

class ForgotPassword extends React.Component {


    constructor(props) {
        super(props);
        this.state = { 
            networkError: '',
            emailError: '',
            successLabel: '',
            resetEmail: {
                email: ''
            }
        };
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.sendResetLink = this.sendResetLink.bind(this);
    }
    
    
    onChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        this.setState( prevState =>
        { 
            const updatedEmail = prevState.resetEmail;
            updatedEmail[name] = value;
            return {
                resetEmail: updatedEmail
            }
        });
    }

    onKeyUp = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.sendResetLink();
        }
    }

    
    invalidEmail(){
        // let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
        let invalid = !(emailPattern.test(this.state.resetEmail.email));
        if(!invalid){
            if(this.state.resetEmail.email.length > 191){ // Max length
                invalid = true;
            }
        }
        let message = "";
        if(invalid){
            message = "Please enter a valid email address.";
        }
        this.setState({ emailError: message });
        // this.setState({ disabled: invalid });
        return invalid;
    }
    

    sendResetLink = () => {
        if(this.invalidEmail()){
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ emailError: '', networkError: '' });
        
        let resetUrl = new URL('reset/send', Globals.currentHost);

        axios({ 
            method: 'POST',
            url: resetUrl,
            data: this.state.resetEmail
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return true;
            } else { // Server down?
                return false;
            }
        }).then(success => {
            if(success){
                this.setState({
                    successLabel: "Reset link sent to provided email address from eller-nepaccess@email.arizona.edu."
                    + " Please allow roughly one minute for email to arrive."
                    + " If email doesn't arrive, please check your spam folder."
                });
            } else {
                // Server down?
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 418) {
                    this.setState({ 
                        networkError: "Too many reset emails sent, please wait 24 hours between requests."
                    });
                } else if (error.response.status === 500) {
                    this.setState({ 
                        networkError: "Email server error."
                    });
                } else if (error.response.status === 404) {
                    this.setState({ 
                        networkError: "Email address not found."
                    });
                } 
            } else {
                this.setState({
                    networkError: "Server may be down, please try again later."
                });
            }
            this.setState({
                successLabel: "Email could not be sent, please check address and try again."
            });
            console.error('error message', error);
        });

        document.body.style.cursor = 'default';
    }


    render() {
        return (
            <div className="container login-form">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Forgot Password - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/forgotPassword" />
                </Helmet>
                <div className="form">
                    <div className="note">
                        Reset Password
                    </div>
                    
                    <label className="loginErrorLabel">
                        {this.state.networkError}
                    </label>

                    <div className="form-content">
                        <div className="login-row">
                            
                            <span className="leading-text"></span>
                            <input type="text" id="email" className="form-control" name="email" autoFocus 
                                    placeholder="Email address" 
                                    onChange={this.onChange} 
                                    onKeyUp={this.onKeyUp}
                            />
                            <label className="loginErrorLabel">{this.state.emailError}</label>
                        </div>
                        
                        <div className="login-row">
                            <span className="leading-text"></span>
                            <button type="button" className="button" id="submit" onClick={this.sendResetLink}>
                                Send reset link
                            </button>
                            <label className="successLabel inline-block padding">{this.state.successLabel}</label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword;