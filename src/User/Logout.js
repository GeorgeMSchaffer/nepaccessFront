import React from 'react';

import Globals from '../globals.js';

import './login.css';

class Logout extends React.Component {
    render() {
        return (
            <div className="container login-form">
                <div className="form">
                    <div className="note">
                        Logout
                    </div>

                    <span id="logoutSpan" hidden={localStorage.role}>Successfully logged out.</span>
                </div>
            </div>
        )
    }

    componentDidMount() {
        Globals.signOut();
        Globals.emitEvent('refresh', {
            loggedIn: false
        });
    }
}



export default Logout;