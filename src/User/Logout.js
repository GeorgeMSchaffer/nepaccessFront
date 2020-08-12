import React from 'react';

import Globals from '../globals.js';

import './login.css';

class Logout extends React.Component {
    state = {
        logoutText: "Logging out..."
    }

    render() {
        return (
            <div className="container login-form">
                <div className="form">
                    <div className="note">
                        <p>Logout</p>
                    </div>

                    <span id="logoutSpan">{this.state.logoutText}</span>
                </div>
            </div>
        )
    }

    componentDidMount(){
        Globals.signOut();
        Globals.emitEvent('refresh', {
            loggedIn: false
        });
        // Globals.emitEvent(false);
        // TODO: Make sure signOut() is done first?
        this.setState({ logoutText: "Successfully logged out." });
    }
}

export default Logout;