import React from 'react';
import './login.css';

class Login extends React.Component {
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
        this.login = this.login.bind(this);
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

    login = () => {
        document.body.style.cursor = 'wait';
        
        // TODO: certs and then HTTPS app-wide, probably
        let loginUrl = new URL('http://localhost:8080/login');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            loginUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/login');
        }

        fetch(loginUrl, { 
            method: 'POST',
            body: JSON.stringify(this.state),
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
            if(jsonResponse){
                // if HTTP 200 (ok), save JWT and clear login
                localStorage.JWT = jsonResponse.Authorization;
                let fields = document.getElementsByClassName("form-control");
                let i;
                for (i = 0; i < fields.length; i++) {
                    fields[i].value = '';
                }
                console.log("Logged in");
                this.props.history.push('/')
                // this.setState({
                //     username: '',
                //     password: ''
                // });
            } else {
                // TODO: Tell user to try logging in again
            }
        }).catch(error => {
            console.error('error message', error);
        });

        document.body.style.cursor = 'default';
    }

    render() {
        return (
            <div id="main" className="container login-form">
                <div className="form">
                    <div className="note">
                        <p>Login</p>
                    </div>

                    <div className="form-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Username" name="username" onChange={this.onKeyUp}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Password" name="password" onChange={this.onKeyUp}/>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btnSubmit" onClick={this.login} >Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;