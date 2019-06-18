import React from 'react';
import axios from 'axios';
import './login.css';

// TODO: Move this to its own "change password" component and link to it from userdetails

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

    constructor(props) {
        super(props);
		this.state = {
            newPassword: '',
            oldPassword: '',
            currentChecked: "password",
            newChecked: "password",
            successLabel: '',
            newPasswordError: '',
            oldPasswordError: ''
        };
    }
    
    // TODO: Validate new password, if invalid show error
    changePassword = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        
        let changeUrl = new URL('http://localhost:8080/user/details/changePassword');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            changeUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/user/details/changePassword');
        }

        let dataToPass = { oldPassword: this.state.oldPassword, newPassword: this.state.newPassword };
        axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
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
                let fields = document.getElementsByClassName("form-control");
                let i;
                for (i = 0; i < fields.length; i++) {
                    fields[i].value = '';
                }
                this.setState({
                    successLabel: "Password changed."
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
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.changePassword();
        }
        this.setState({ newPassword: evt.target.value }, () => { this.invalidNewPassword(); });
    }
	onOldPasswordChange = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.changePassword();
        }
        this.setState({ oldPassword: evt.target.value }, () => { this.invalidOldPassword(); });
    }


    check = () => { // check if JWT is expired/invalid
				
		let verified = false;

		let checkURL = new URL('test/check', this.state.baseURL);
		var token = localStorage.JWT;
		if(token && localStorage.username){
			axios.defaults.headers.common['Authorization'] = token;
        } else {
            refreshNav(false);
            this.props.history.push('/login');
        }
        axios({
            method: 'POST', // or 'PUT'
            url: checkURL
        }).then(response => {
            verified = response && response.status === 200;
            return verified;
        }).then(result => {
            refreshNav(result);
            if(!result){
                this.props.history.push('/login');
            }
        }).catch(error => {
            console.error('Server is probably down.', error);
        });
	}
	

    render() {
        return (
            <div id="main" className="container login-form">
                <div className="form">
                    <div className="note">
                        <p>User Details</p>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="currentPassword">Enter your current password to change your password:</label>
                            <input type={this.state.currentChecked} id="currentPassword" className="form-control password-field" name="currentPassword" placeholder="Current Password *" onKeyUp={this.onOldPasswordChange}/>
                            <label className="errorLabel">{this.state.oldPasswordError}</label>
                            <br />
                            <input type="checkbox" id="showCurrentPassword" onClick={this.showCurrentPassword}></input>
                            <label className="inline noSelect">Show password</label>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="currentPassword">Enter a new password:</label>
                            <input type={this.state.newChecked} id="newPassword" className="form-control password-field" name="newPassword" placeholder="New Password *" onKeyUp={this.onNewPasswordChange}/>
                            <label className="errorLabel">{this.state.newPasswordError}</label>
                            <br />
                            <input type="checkbox" id="showNewPassword" onClick={this.showNewPassword}></input>
                            <label className="inline noSelect">Show password</label>
                        </div>
                    </div>
                    <button type="button" className="button" disabled={this.state.disabled} onClick={this.changePassword}>Change Password</button>
                    <label className="infoLabel">{this.state.successLabel}</label>
                </div>
            </div>
        )
    }

	componentDidMount() {
		let currentHost = new URL('http://localhost:8080/');
		console.log(window.location.hostname);
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

export default UserDetails;

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
}