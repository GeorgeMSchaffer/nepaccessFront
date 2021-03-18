import React from 'react';
import './iframes.css';
import SearcherLanding from '../SearcherLanding.js';

import IframeResizer from 'iframe-resizer-react';

export default class Iframes extends React.Component {

    render(){
        return (
                
          <div id="landing">
            <div id="landing-images">
              <div id="image-1">
                <h1 id="headline" className="no-select cursor-default">
                  <p className="size">The National Environmental Policy Act of 1969 (NEPA) requires review of the potential impacts of all major Federal actions on the natural and human environment.
                  </p>
                  <p className="size">The Environmental Impact Statement (EIS) is NEPA’s central means to conduct this review.
                  </p>
                </h1>
              </div>
              <div id="image-2">
                <h2 id="subhead" className="no-select cursor-default">
                  <p className="size">NEPAccess makes available to you thousands of EISs, and related documents, to search, download, and analyze.
                  </p>
                  <p className="size">NEPAccess offers you the power to gather useable data from multiple review processes.
                  </p>
                </h2>
              </div>
            </div>
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
            <IframeResizer
                log
                id="iframe-landing-container"
                src="https://about.nepaccess.org/about-nepa/"
                style={{ width: '1px', minWidth: '100%'}}
            />
  
            
            <div id="search-container">
              <div id="landing-container-text">
                Begin with a simple keyword search:
              </div>
              <SearcherLanding 
              />
            </div>
          </div>
        )
        
      }
      
}