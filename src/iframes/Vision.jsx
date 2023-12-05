import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class Vision extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - Vision </title>
                    <link rel="canonical" href="https://about.nepaccess.org/vision/" />
                </Helmet>

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/vision/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}