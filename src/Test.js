import React from 'react';
import {Helmet} from "react-helmet";
import {ReCAPTCHA} from "react-google-recaptcha";

// import axios from 'axios';

// import Globals from './globals.js';

const recaptchaRef = React.createRef();

export default class Test extends React.Component {

    constructor(props) {
        super(props);
		this.state = {

        };
    }

    onSubmit = () => {
        const recaptchaValue = recaptchaRef.current.getValue();
        console.log(recaptchaValue);
        // this.props.onSubmit(recaptchaValue);
    }
    // onInput = (evt) => {
    //     this.setState({ [evt.target.name]: evt.target.value });
    // }
    captchaChange(value) {
        console.log("Captcha value:", value);
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
                <form onSubmit={this.onSubmit}>
                    <input type="button" onClick={this.onSubmit}/>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LdLG5AaAAAAADg1ve-icSHsCLdw2oXYPidSiJWq"
                        onChange={this.captchaChange}
                    />
                </form>
            </div>
        )
    }
    
	componentDidMount() {
	}
}