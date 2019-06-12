import React from 'react';
import './login.css';
//<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">

// TODO: Capture enter
// TODO: Don't allow duplicate usernames, etc.
class Register extends React.Component {

    state = {
        username: '',
        password: '',
        email: ''
    }

    constructor(props) {
        super(props);
		this.state = {
            username: '',
            password: '',
            email: ''
        };
        this.onKeyUp = this.onKeyUp.bind(this);
        this.register = this.register.bind(this);
	}

	onKeyUp = (evt) => {
        this.setState( 
		{ 
			[evt.target.name]: evt.target.value
        }, () =>{
            // TODO: certs and then HTTPS app-wide, probably
            let nameUrl = new URL('http://localhost:8080/users/exists');
            if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
                nameUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/users/exists');
            }
            fetch(nameUrl, { 
                method: 'POST',
                body: this.state.username,
                headers:{
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(response => {
                console.log(response.json());
                if(response.ok){ // 200
                    return response.json();
                } else { // 403
                    return null;
                }
            }).then(jsonResponse => {
                //
            }).catch(error => {
                console.error('error message', error);
            });

        
            // TODO: Run checks (do password fields match?  Is email valid?  Is username taken?  Etc.)
        });
    }

    register = () => {
        document.body.style.cursor = 'wait';
        
        // TODO: certs and then HTTPS app-wide, probably
        let registerUrl = new URL('http://localhost:8080/users/register');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            registerUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/users/register');
        }

        fetch(registerUrl, { 
            method: 'POST',
            body: JSON.stringify(this.state),
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            if(response.ok){ // 200
                return true;
            } else { // 403
                return false;
            }
        }).then(ok => {
            if(ok){
                // if HTTP 200 (ok), clear fields and login user
                console.log("Registered");
                let loginUrl = new URL('http://localhost:8080/login');
                if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
                    loginUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/login');
                }
                var user = {
                    username: this.state.username,
                    password: this.state.password
                }
                fetch(loginUrl, {
                    method: 'POST',
                    body: JSON.stringify(user),
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
                        localStorage.JWT = jsonResponse.Authorization;
                        let fields = document.getElementsByClassName("form-control");
                        let i;
                        for (i = 0; i < fields.length; i++) {
                            fields[i].value = '';
                        }
                        this.props.history.push('/')
                        console.log("Logged in");
                    } else {
                        // TODO
                        console.log("403");
                    }
                });
            } else {
                // TODO
            }
        }).catch(error => {
            console.error('error message', error);
        });

        document.body.style.cursor = 'default';
    }

    render() {
        return (
            <div id="main" className="container register-form">
                <div className="form">
                    <div className="note">
                        <p>Register</p>
                    </div>

                    <div className="form-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" className="form-control" name="username" placeholder="My Username *" onChange={this.onKeyUp}/>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" name="email" placeholder="Email Address *" onChange={this.onKeyUp}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" className="form-control" name="password" placeholder="My Password *" onChange={this.onKeyUp}/>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Confirm Password *"/>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btnSubmit" onClick={this.register}>Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;