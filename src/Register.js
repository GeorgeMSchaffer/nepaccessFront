import React from 'react';
import './login.css';
//<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">

// TODO: Hook up registration
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
		// get the evt.target.name (defined by name= in input)
		// and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState( 
		{ 
			[evt.target.name]: evt.target.value
        }, () =>{
            // console.log(this.state.username);
            // console.log(this.state.password);
        });
    }

    register() {
        
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
                                    <input type="text" className="form-control" placeholder="My Username *"/>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Email Address *"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="My Password *"/>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Confirm Password *"/>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btnSubmit">Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;