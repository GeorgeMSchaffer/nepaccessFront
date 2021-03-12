import React from 'react';

import axios from 'axios';

import Globals from '../globals.js';

import './login.css';

export default class Verify extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            successLabel: ''
        };
    }

    verify = () => { // check if JWT is expired/invalid
		let verified = false;

        let checkURL = new URL('user/verify', Globals.currentHost);
        
        axios({
            method: 'POST', // or 'PUT'
            headers: {Authorization: localStorage.VerifyToken},
            url: checkURL
        }).then(response => {
            verified = response && response.status === 200;
            console.log(response);

            if(verified) {
                this.setState({
                    successLabel: 'Email has been verified.  If your account has already been approved, you can begin using the system.'
                });
            } else {
                this.setState({
                    successLabel: 'Sorry, we were unable to verify this email address.'
                });
            }
        }).catch(error => {
            console.error(error);
            this.setState({
                successLabel: 'Sorry, we were unable to verify this email address.'
            });
        });
    }

    
    
    render() {
        return (
            <div className="content">
                <div className="note">
                    <p>Verify email address</p>
                </div>
                <div id="verifyEmailContent">
                    <label className="infoLabel">{this.state.successLabel}</label>
                </div>
            </div>
        )
    }

	componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if(query && query.get('token')){ // If there's a reset token provided, set JWT and check it
            const verifyToken = ("Bearer " + query.get('token')); // .../reset?token={resetToken}
            localStorage.VerifyToken = verifyToken;
            this.verify();
        }
	}
}