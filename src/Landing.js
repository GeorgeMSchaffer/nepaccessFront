import React from 'react';
import axios from 'axios';
import './index.css';
import './landing.css';
import Globals from './globals.js';

import SearcherLanding from './SearcherLanding.js';

class Landing extends React.Component {
    state = {
    }

    constructor(props){
        super(props);
    }

    render(){
          return (
            <div id="landing">
              <div id="landing-images">
                  <div id="image-1"></div>
                  <div id="image-2"></div>
              </div>
              <span id="headline" className="no-select cursor-default">Headline goes here: Find NEPA documents and find em good</span>
              <span id="subhead" className="no-select cursor-default">Subhead here. The viewer should understand concisely what the site does for them.</span>
              <div id="search-container">
                <SearcherLanding />
              </div>
            </div>
          )
    }

}

export default Landing;