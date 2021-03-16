import React from 'react';
import './iframes.css';

export default class Iframes extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                {/* style={{overflow: 'hidden', marginTop: '0px'}}>* /}
                {/* <iframe src="https://techpatterns.com/web_design/frames_iframes/iframes.php" */}
                <iframe src="https://about.nepaccess.org/about-nepa/" title="Title"
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