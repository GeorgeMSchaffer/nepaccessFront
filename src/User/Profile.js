import React from 'react';
import {Helmet} from 'react-helmet';

import axios from 'axios';

import Globals from '../globals';

import './profile.css';

// TODO: Move this to its own "change password" component and link to it from userdetails?

class UserDetails extends React.Component {
    state = {
        newPassword: '',
        oldPassword: '',
        currentChecked: "password",
        newChecked: "password",
        successLabel: '',
        newPasswordError: '',
        oldPasswordError: ''
    }

    changePassword = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        
        let changeUrl = new URL('user/details/changePassword', Globals.currentHost);

        let dataToPass = { oldPassword: this.state.oldPassword, newPassword: this.state.newPassword };
        axios({ 
            method: 'POST',
            url: changeUrl,
            data: dataToPass
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                console.log("OK");
                return true;
            } else { // Server down?
                return false;
            }
        }).then(success => {
            if(success){
                // if HTTP 200 (ok), clear fields and display success
                this.setState({
                    successLabel: "Password changed.",
                    oldPassword: '',
                    newPassword: ''
                });
                console.log("Changed");
            } else {
                // Server down?
            }
        }).catch(error => { // 401
            console.error('error message', error);
            this.setState({
                successLabel: "Password was not changed."
            });
            this.setState({
                oldPasswordError: "Password incorrect."
            });
        });

        document.body.style.cursor = 'default';
    }
    
    showCurrentPassword = () => {
        let value = "password";
        if(this.state.currentChecked === value){
            value = "text";
        }
        this.setState({
            currentChecked: value
        });
    } 
    
    showNewPassword = () => {
        let value = "password";
        if(this.state.newChecked === value){
            value = "text";
        }
        this.setState({
            newChecked: value
        });
    } 
    
    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidNewPassword();
        let test2 = this.invalidOldPassword();
        this.setState({ disabled: test1 || test2 });
        return (test1 || test2 );
    }
    // TODO: Enforce password length of ??? (maybe 50-100 characters)
    invalidNewPassword(){
        let passwordPattern = /[ -~]/;
        let invalid = !(passwordPattern.test(this.state.newPassword));
        let message = "";
        if(invalid){
            message = "Password invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({ newPasswordError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidOldPassword(){
        let passwordPattern = /[ -~]/;
        let invalid = !(passwordPattern.test(this.state.oldPassword));
        let message = "";
        if(invalid){
            message = "Password invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({ oldPasswordError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }


	onNewPasswordChange = (evt) => {
        this.setState({ newPassword: evt.target.value }, () => { this.invalidNewPassword(); });
    }
	onOldPasswordChange = (evt) => {
        this.setState({ oldPassword: evt.target.value }, () => { this.invalidOldPassword(); });
    }


    check = () => { // check if JWT is expired/invalid
				
		let verified = false;

		let checkURL = new URL('test/check', Globals.currentHost);
        axios({
            method: 'POST', // or 'PUT'
            url: checkURL
        }).then(response => {
            verified = response && response.status === 200;
            return verified;
        }).then(result => {
            if(!result){
                this.props.history.push('/login');
            }
        }).catch(error => {
            console.error('Server is probably down.', error);
        });
	}
	

    render() {
        return (
            <div className="container login-form">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Profile - NEPAccess</title>
                <link rel="canonical" href="https://nepaccess.org/profile" />
            </Helmet>
            <div className="note">
                User Details
            </div>
                <div className="form-content">
                    <div className="col-md-6">
                        <div id="profile-container">
                            <div className="profile-row">
                                <label className="profile-leading" htmlFor="currentPassword">Enter your current password:</label>
                                <input type={this.state.currentChecked} id="currentPassword" className="form-control password-field" name="currentPassword" placeholder="Current Password *" onChange={this.onOldPasswordChange}/>
                                <label className="loginErrorLabel">{this.state.oldPasswordError}</label>
                                <div>
                                    <label className="profile-leading"></label>
                                    <input type="checkbox" id="showCurrentPassword" onClick={this.showCurrentPassword}></input>
                                    <label className="inline noSelect">Show password</label>
                                </div>
                            </div>

                            <div className="profile-row">
                                <label className="profile-leading" htmlFor="newPassword">Enter a new password:</label>
                                <input type={this.state.newChecked} id="newPassword" className="form-control password-field" name="newPassword" placeholder="New Password *" onChange={this.onNewPasswordChange}/>
                                <label className="loginErrorLabel">{this.state.newPasswordError}</label>

                                <div>
                                    <label className="profile-leading"></label>
                                    <input type="checkbox" id="showNewPassword" onClick={this.showNewPassword}></input>
                                    <label className="inline noSelect">Show password</label>
                                </div>
                            </div>
                            
                            <label className="profile-leading"></label>
                            <button type="button" className="button" disabled={this.state.disabled} onClick={this.changePassword}>Change Password</button>
                            <label className="infoLabel">{this.state.successLabel}</label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

	componentDidMount() {
		this.check();
	}
}

export default UserDetails;