import React from 'react';
// import Select from 'react-select';
import Creatable from 'react-select/lib/Creatable';

import axios from 'axios';
import globals from './globals.js';

import './contact.css';

const subjects = [
    {value:"Problem using the website", label:"Problem using the website"}, 
    {value:"Question about NEPAccess", label:"Question about NEPAccess"}, 
    {value:"Feedback on website", label:"Feedback on website"}
];

export default class Contact extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            name: '',
            email: '',
            subject: '',
            message: '', 

            disabled: false,

            nameError: '',
            emailError: '',
            subjectError: '',
            messageError: '',

            statusLabel: '',
            statusClass: '',
        };

        document.body.style.cursor = 'default';
    }
    

    /** Axios call to fill fields with full name and email address */
    getUserFields = () => {

        if(this.state.name.length > 0) {
            return;
        }

        document.body.style.cursor = 'wait';
        
        let _url = new URL('user/getFields', globals.currentHost);

        axios({ 
            method: 'GET',
            url: _url,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            // console.log(response);

            let responseOK = response && response.status === 200;
            if(responseOK) {
                this.setState({
                    name: response.data.name,
                    email: response.data.email,
                });
                
            }
        }).catch(error => {
            console.error(error);
        });
        
        document.body.style.cursor = 'default';
    }



    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidEmail();
        let test2 = this.invalidName();
        let test3 = this.invalidSubject();
        let test4 = this.invalidMessage();

        // this.setState({ disabled: test1 || test2 || test3 || test4 });
        
        return ( test1 || test2 || test3 || test4 );
    }

    invalidName = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.name.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty.";
        }
        this.setState({ 
            nameError: message, 
            // disabled: invalid 
        });
        return invalid;
    }
    invalidSubject = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.subject.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty.";
        }
        this.setState({ 
            subjectError: message, 
            // disabled: invalid 
        });
        return invalid;
    }
    invalidMessage = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.message.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty.";
        }

        this.setState({ 
            messageError: message,
            // disabled: invalid
         });
         
        return invalid;
    }
    invalidEmail(){
        let emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let invalid = !(emailPattern.test(this.state.email));
        let message = "";
        if(invalid){
            message = "Please enter your email address.";
        }
        this.setState({ emailError: message });
        return invalid;
    }
	onNameChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidName(); });
    }
    
	onEmailChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidEmail(); });
    }
    onChangeHandler = (evt) => {
		// evt.target.name defined by name= in input
        const name = evt.target.name;
		this.setState( 
		{ 
            [name]: evt.target.value,
        }, () => { 
            // validate (also disables button if invalid)
            
            switch (name) {
                case 'message':
                    this.invalidMessage();
                    break;
                default:
                    this.invalidFields(); // org selection/other org name handles itself from here
            }

        });
    }

    onSelectHandler = (val, act) => {
        console.log("Val/act",val,act);
        if(!val || !act){
            return;
        }

        // if(act.action === ""){
        // }

        this.setState(
        { 
            subject: val.value
        }, () => {
            this.invalidSubject();
            // console.log("Subject", this.state.subject);
        });

    }
    
    onChangeDummy = () => {
        // do nothing: can't change name, email
    }




    /** Axios call to contact */
    contact = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        this.setState({ 
            disabled: true,
            statusLabel: ''
         });
        
        let _url = new URL('user/contact', globals.currentHost);

        let _data = { 
            name: this.state.name, 
            email: this.state.email,
            subject: this.state.subject,
            body: this.state.message
        };

        axios({ 
            method: 'POST',
            url: _url,
            data: _data,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            console.log(response.status);
        
            if(responseOK){ // 200
                this.setState({
                    statusClass: 'successLabel',
                    statusLabel: 'Email sent.'
                });
            } else { // 500 or 503, or server down
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred. Server responded with ' + response.status
                });
            }
        }).catch(error => {
            this.setState({
                statusClass: 'errorLabel',
                statusLabel: 'Sorry, an error has occurred.  Server may currently be down.  Please try again later.'
            });
            console.error(error);
        });

        this.setState({ disabled: false });
        document.body.style.cursor = 'default';
    }
    
    render() {
        return (
            <div id="contact-form">
                <div className="note">
                    Contact Us
                </div>

                <div id="contact-form-content">
                    <div id="contact-form-left">

                        <div className="contact-form-input-group">
                            <div className="contact-form-group">
                                <span className="contact-leading-text">Name:</span>
                                <label className="errorLabel inline-block">{this.state.nameError}</label>
                                <input type="text" maxLength="191"
                                    className="contact-form-control" id="name" name="name" 
                                    placeholder="Your full name *" 
                                    value={this.state.name}
                                    onBlur={this.onNameChange}
                                    onChange={this.onChangeDummy}
                                />
                                
                            </div>
                            <div className="contact-form-group">
                                <span className="contact-leading-text">Email:</span>
                                <label className="errorLabel inline-block">{this.state.emailError}</label>
                                <input type="text" maxLength="191"
                                    className="contact-form-control" 
                                    id="email" 
                                    name="email" 
                                    placeholder="Your email address *" 
                                    value={this.state.email}
                                    onBlur={this.onEmailChange}
                                    onChange={this.onChangeDummy}
                                />
                            </div>
                            <div className="contact-form-group">
                                <span className="contact-leading-text">Subject</span>
                                <label className="errorLabel inline-block">{this.state.subjectError}</label>
                                <Creatable id="contact-subject-container" 
                                    className="contact-form-control" 
                                    options={subjects}
                                    name="subject" 
                                    placeholder="Please choose or type a subject *" 
                                    onChange={this.onChangeDummy}
                                />
                            </div>
                        </div>
                        <div className="contact-form-input-group">
                            <div className="contact-form-group">
                                <span className="contact-leading-text">Your Message</span>
                                <label className="errorLabel inline-block">{this.state.messageError}</label>
                                <textarea 
                                    className="contact-form-control" 
                                    id="contact-message" 
                                    name="message" 
                                    placeholder="" 
                                    autoFocus 
                                    onBlur={this.onChangeHandler}
                                />
                            </div>
                        </div>

                        <div className="contact-form-input-group">
                            <div className="contact-form-group">
                                <button type="button" className="button inline-block" id="contact-submit" 
                                        disabled={this.state.disabled} 
                                        onClick={this.contact}>
                                    Send
                                </button>
                            </div>
                            <label className={this.state.statusClass}>{this.state.statusLabel}</label>
                        </div>
                    </div>

                    <div id="contact-address">
                        <span>NEPAccess</span>
                        <span>University of Arizona</span>
                        <span>Udall Center for Studies in Public Policy</span>
                        <span>803 E. First St.</span>
                        <span>Tucson, Arizona 85719</span>
                        <span>USA</span>
                    </div>
                    

                </div>
            </div>
        )
    }

    componentDidMount() {
        this.getUserFields();
    }
}