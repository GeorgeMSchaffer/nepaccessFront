import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class AboutNepaccess extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>About NEPAccess</title>
                    <meta name="description" content="NEPAccess allows anyone to search, download, and analyze thousands of NEPA environmental review documents, from Notice of Intent, through the Environmental Impact Statement, to the final Record of Decision." />
                    
                    <link rel="canonical" href="https://nepaccess.org/about-nepaccess" />
                </Helmet>
                
                <IframeResizer
                    // log
                    data-hj-allow-iframe="true"
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/about-nepaccess/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}