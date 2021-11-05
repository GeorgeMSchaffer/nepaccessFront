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
                    <meta name="description" content="Media explaining why we created NEPAccess.org, the work done by students building the database, and their perspectives on being on a high-level team." />
                    <link rel="canonical" href="https://nepaccess.org/media" />
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