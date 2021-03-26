import React from 'react';
import {Helmet} from "react-helmet";
import ReCAPTCHA from "react-google-recaptcha";

import axios from 'axios';

import Globals from './globals.js';

const recaptchaRef = React.createRef();

export default class Test extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            captcha: ''
        };
    }
    
    captchaValid = () => {
        let valid = false;

        const recaptchaValue = recaptchaRef.current.getValue();
        const recaptchaUrl = new URL('user/recaptcha_test', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('recaptcha', recaptchaValue);

        axios({
            url: recaptchaUrl,
            method: 'POST',
            data: dataForm
        }).then(response => {
            let responseOK = response && response.status === 200;
            valid = responseOK;
        }).catch(error => { 
            console.error(error);
            // TODO: Handle 424 code (current code used for captcha invalid)
        })
        
        return valid;
    }

    testClick = () => {
        // this.props.onSubmit(recaptchaValue);
        console.log("Valid?", this.captchaValid());
    }
    // onInput = (evt) => {
    //     this.setState({ [evt.target.name]: evt.target.value });
    // }
    captchaChange(value) {
        console.log("Captcha value:", value);
        this.setState({
            captcha: value
        });
    }
    log(val) {
        console.log("Log", val);
    }

    render () {
        return (
            <div id="test-container" className="content">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - Test</title>
                    <link rel="canonical" href="https://nepaccess.org/test" />
                </Helmet>
                
                <span>test</span>
                <div>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LdLG5AaAAAAADg1ve-icSHsCLdw2oXYPidSiJWq"
                        onChange={this.captchaChange}
                        onErrored={this.log}
                    />
                    <button type='button' onClick={this.testClick}>Submit</button>
                </div>
            </div>
        )
    }
    
	componentDidMount() {
	}
}