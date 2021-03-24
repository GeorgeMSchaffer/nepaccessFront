import React from 'react';
import {Helmet} from 'react-helmet';

export default class AboutSearchTips2 extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - What Can I Search For?</title>
                    <link rel="canonical" href="https://nepaccess.org/what-can-i-search-for" />
                </Helmet>
                <iframe src="https://about.nepaccess.org/what-can-i-search-for/" title="Search Tips 2"
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