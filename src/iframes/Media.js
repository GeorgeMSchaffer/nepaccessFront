import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';
import './media.css';

export default class Media extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Videos - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/videos" />
                </Helmet>

                <IframeResizer
                    // log
                    data-hj-allow-iframe="true"
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/videos/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}