import React from 'react';
import './login.css';
import Globals from './globals';

class Logout extends React.Component {
    state = {
        logoutText: "Logging out..."
    }

    render() {
        return (
            <div id="main" className="container login-form">
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
        
        // TODO: Make sure signOut() is done first?
        this.setState({ logoutText: "Successfully logged out." });

        // TODO: Do this with state
        let itemsToShow = document.getElementsByClassName("logged-out");
        let i;
        for (i = 0; i < itemsToShow.length; i++) {
            itemsToShow[i].style.display = "block";
        }
        let itemsToHide = document.getElementsByClassName("logged-in");
        let j;
        for (j = 0; j < itemsToHide.length; j++) {
            itemsToHide[j].style.display = "none";
        }
    }
}

export default Logout;