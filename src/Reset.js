import React from 'react';
import axios from 'axios';
import './login.css';

// TODO: new route for backend and get JWT from url (link)
// JWT may need to be special to allow changing password with no current password provided
// If we do that, can just use the regular change password route, but account for that "special" nature

class Reset extends React.Component {
    state = {
        newPassword: '',
        newChecked: "password",
        successLabel: '',
        newPasswordError: ''
    }

    constructor(props) {
        super(props);
		this.state = {
            newPassword: '',
            newChecked: "password",
            successLabel: '',
            newPasswordError: ''
        };
    }
    
    changePassword = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        
        let changeUrl = new URL('user/details/newPassword', this.state.baseURL);

        axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        axios({ 
            method: 'POST',
            url: changeUrl,
            data: this.state.newPassword
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
                // Server down?  Even then not sure we ever get here because if not successful then I think it has to be an error
            }
        }).catch(error => { // 401
            console.error('error message', error);
            this.setState({
                successLabel: "Password was not changed."
            });
            this.setState({
                newPasswordError: "Reset token may be expired or invalid."
            });
        });

        document.body.style.cursor = 'default';
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
        this.setState({ disabled: test1 });
        return (test1);
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


	onNewPasswordChange = (evt) => {
        this.setState({ newPassword: evt.target.value }, () => { this.invalidNewPassword(); });
    }


    check = () => { // check if JWT is expired/invalid
		let verified = false;

        let checkURL = new URL('test/check', this.state.baseURL);
        
        // TODO: Get JWT from reset token, should find it in the URL
        var token;
        
		if(token){
			axios.defaults.headers.common['Authorization'] = token;
            axios({
                method: 'POST', // or 'PUT'
                url: checkURL
            }).then(response => {
                verified = response && response.status === 200;
                return verified;
            }).catch(error => {
                console.error('Server is probably down.', error);
            });
        } else {
            this.setState({
                shouldRender: false
            });
        }
	}
    
    
    render() {
        if(!this.state.shouldRender)
        {
            console.log("Not rendering reset");
            return (
                <div id="main" className="container login-form">
                    <div className="form">
                        <div className="note">
                            <p>Set New Password</p>
                        </div>
                        <div className="col-md-6">
                            <label className="errorLabel">Token is expired or invalid, please try again.</label>
                        </div>
                    </div>
                </div>)
        } else {
            console.log("Reset");
            return (
                <div id="main" className="container login-form">
                    <div className="form">
                        <div className="note">
                            <p>Set New Password</p>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="newPassword">Enter a new password:</label>
                                <input type={this.state.currentChecked} id="newPassword" className="form-control password-field" name="newPassword" placeholder="New Password *" onChange={this.onNewPasswordChange}/>
                                <label className="errorLabel">{this.state.oldPasswordError}</label>
                                <br />
                                <input type="checkbox" id="showNewPassword" onClick={this.showNewPassword}></input>
                                <label className="inline noSelect">Show password</label>
                            </div>
                        </div>
                        <br />
                        <br />
                        <button type="button" className="button" disabled={this.state.disabled} onClick={this.changePassword}>Change Password</button>
                        <label className="infoLabel">{this.state.successLabel}</label>
                    </div>
                </div>
            )
        }
    }

	componentDidMount() {
		let currentHost = new URL('http://localhost:8080/');
        let resetToken = "Bearer " + window.location.href.split("?=")[1]; // expect JWT to be in reset link after ?=
        localStorage.JWT = resetToken;
		if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
			currentHost = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/');
		}

		this.setState( 
            { 
                baseURL: currentHost
            }, () =>{
                this.check();
            });

		// this.setState( 
		// { 
		// 	baseURL: currentHost
		// }, () =>{
        //     this.check();
        // }, () =>{
        //     // TODO: Not sure if this is needed or even works to make sure we finish check() before rendering
		// });
	}
}

export default Reset;