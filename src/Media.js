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
                        What is NEPaccess? (2:42)
                    </h2>

                    <iframe title="What is NEPaccess? (2:42)" className="video" src="https://player.vimeo.com/video/508049098" 
                        frameBorder="0" allow="autoplay" allowFullScreen>
                    </iframe>
                </div>
                <div className="caption">
                    University of Arizona students explain the meanings behind the National Environmental Policy Act (NEPA) from their various perspectives as part of the NEPAccess team. 
                </div>

                <div className="video-container">
                    <h2>
                        Being on the NEPAccess team (3:02)
                    </h2>
                    
                    <iframe title="Being on the NEPAccess team (3:02)" className="video" src="https://player.vimeo.com/video/508048710" 
                        frameBorder="0" allow="autoplay" allowFullScreen>
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