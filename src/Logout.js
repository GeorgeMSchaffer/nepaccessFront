import React from 'react';
import './login.css';

class Logout extends React.Component {
    state = {
        username: '',
        password: ''
    }

    constructor(props) {
        super(props);
		this.state = {
            username: '',
            password: ''
        };
        this.onKeyUp = this.onKeyUp.bind(this);
	}

	onKeyUp = (evt) => {
		// get the evt.target.name (defined by name= in input)
		// and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState( 
		{ 
			[evt.target.name]: evt.target.value
        }, () =>{
            console.log(this.state.username);
            console.log(this.state.password);
        });
    }

    render() {
        return (
            <div id="main" className="container login-form">
                <div className="form">
                    <div className="note">
                        <p>Logout</p>
                    </div>

                    <span id="logoutSpan">Logging out...</span>
                </div>
            </div>
        )
    }

    
	// Onload
    componentDidMount(){
        localStorage.removeItem("JWT");
        localStorage.removeItem("username");
        
        document.getElementById("logoutSpan").innerHTML="Successfully logged out.";
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