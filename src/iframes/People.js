import React from 'react';
import {Helmet} from 'react-helmet';

export default class People extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - People</title>
                    <link rel="canonical" href="https://nepaccess.org/people" />
                </Helmet>
                <iframe src="https://about.nepaccess.org/people/" title="About Nepaccess"
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