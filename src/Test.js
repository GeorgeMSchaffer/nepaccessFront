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

        };
    }

    onSubmit = (evt) => {
        evt.preventDefault();
        const recaptchaValue = recaptchaRef.current.getValue();
        console.log(recaptchaValue);
        axios.post(Globals.currentHost + 'user/recaptcha_test', {recaptcha: recaptchaValue});
        // this.props.onSubmit(recaptchaValue);
    }
    // onInput = (evt) => {
    //     this.setState({ [evt.target.name]: evt.target.value });
    // }
    captchaChange(value) {
        console.log("Captcha value:", value);
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
                <form>
                    <button type='submit' onClick={this.onSubmit}>Submit</button>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LdLG5AaAAAAADg1ve-icSHsCLdw2oXYPidSiJWq"
                        onChange={this.captchaChange}
                        onErrored={this.log}
                    />
                </form>
            </div>
        )
    }
    
	componentDidMount() {
	}
}