import React from 'react';
import './media.css';

export default class Media extends React.Component {
    render() {
        return (
            <div id="media">

                <h1>
                    Media
                </h1>
                
                <h3 className="intro">
                    The work of University of Arizona undergraduate students has been been critical to the NEPAccess project. Besides the time-consuming tasks of finding and cataloging EIS documents as we build our database, they are helping to develop the machine learning tools used to analyze NEPA documents. In order to train the algorithms, students are categorizing and labelling documents manually. 
                </h3>


                <div className="video-container">
                    <h2>
                        What is NEPaccess?
                    </h2>

                    <iframe className="video" title="What is NEPaccess?"
                        src="https://player.vimeo.com/video/508049098?  color&amp;autopause=0&amp;loop=0&amp;muted=0&amp;title=0&amp;portrait=0&amp;byline=0#t=" 
                        width="640" height="360" allowFullScreen="allowfullscreen">

                    </iframe>
                </div>
                <div className="caption">
                    University of Arizona students explain the meanings behind the National Environmental Policy Act (NEPA) from their various perspectives as part of the NEPAccess team. 
                </div>

                <div className="video-container">
                    <h2>
                        The NEPAccess Undergrad Student Team
                    </h2>
                    <iframe className="video" title="The NEPAccess Undergrad Student Team"
                        src="https://player.vimeo.com/video/508048710?  color&amp;autopause=0&amp;loop=0&amp;muted=0&amp;title=0&amp;portrait=0&amp;byline=0#t=" 
                        width="640" height="360" allowFullScreen="allowfullscreen">

                    </iframe>
                </div>
                <div className="caption">
                    In this 3-minute video, University of Arizona students enthusiastically describe their experience being a part of a high-level interdisciplinary team like NEPAccess.
                </div>

                <div className="spacer"></div>
            </div>
        );
    }
}