import React from 'react';
import {Helmet} from 'react-helmet';
import './iframes.css';

export default class AboutNepa extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - About NEPA</title>
                    <link rel="canonical" href="https://nepaccess.org/about-nepa" />
                </Helmet>
                <iframe src="https://about.nepaccess.org/about-nepa/" title="About Nepa"
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