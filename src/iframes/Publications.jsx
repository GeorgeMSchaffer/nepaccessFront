import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class Publications extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - Publications </title>
                    <link rel="canonical" href="https://about.nepaccess.org/publications/" />
                </Helmet>

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/publications/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}