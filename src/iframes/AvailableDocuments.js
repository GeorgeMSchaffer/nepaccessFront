import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class AvailableDocuments extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - Available Files</title>
                    <link rel="canonical" href="https://nepaccess.org/available-documents" />
                </Helmet>

                <IframeResizer
                    // log
                    data-hj-allow-iframe="true"
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/available-documents/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}