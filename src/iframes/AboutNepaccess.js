import React from 'react';
import {Helmet} from 'react-helmet';

export default class AboutNepaccess extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>About NEPAccess</title>
                    <link rel="canonical" href="http://nepaccess.org/about-nepaccess" />
                </Helmet>
                <iframe src="https://about.nepaccess.org/about-nepaccess/" title="About Nepaccess"
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