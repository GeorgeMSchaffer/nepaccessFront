import React from 'react';
import './iframes.css';
import App from '../App.js';

import IframeResizer from 'iframe-resizer-react';

export default class Iframes extends React.Component {

    render(){
        return (
            <>
                {/* <IframeResizer
                    title="Title"
                    forwardRef={this.iframeRef}
                    // ref="iframe" 
                    heightCalculationMethod="lowestElement"
                    inPageLinks
                    log
                    // onMessage={onMessage}
                    // onResized={onResized}
                    // onLoad={this.resizeIframe(this)}
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/about-nepa/"
                    scrolling="auto"
                    // scrolling="no" frameBorder="0" width="100%" height="100%" name="ContentCenter"
                    style={{ width: '1px', minWidth: '100%', minHeight: '100%'}}
                /> */}
                <App />
                {/* <IframeResizer
                    log
                    id="footer-2"
                    src="https://about.nepaccess.org/footer/"
                    style={{ width: '1px', minWidth: '100%'}}
                /> */}
                <iframe src="https://about.nepaccess.org/footer/" title="Footer" id="footer-2"
                    scrolling="no" frameBorder="0" width="100%" height="100%" name="ContentCenter">
                        <p>
                            This should only display if your browser doesn't support iframes 
                            or if you have iframe support turned off.
                        </p>
                </iframe>
            </>
        )
        
      }
      
}