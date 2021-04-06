import React from 'react';
import {Helmet} from 'react-helmet';
import './iframes.css';

export default class PrivacyPolicy extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>About NEPA - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/privacy-policy" />
                </Helmet>
                <iframe src="https://about.nepaccess.org/privacy-policy/" title="About Nepa"
                    scrolling="yes" frameBorder="0" width="100%" height="100%" name="ContentCenter">
                        <p>
                            This should only display if your browser doesn't support iframes 
                            or if you have iframe support turned off.
                        </p>
                </iframe>
            </div>
        );
    }
}