import React from 'react';

import {Helmet} from 'react-helmet';

import './index.css';
import './landing-2.css';

import SearcherLanding from './SearcherLanding.js';
import './User/login.css';

import IframeResizer from 'iframe-resizer-react';

class Landing extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        rawInput: '',
        render: 'landing'
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    handleChange(inputId, inputValue){
        this.setState({ [inputId]: inputValue });
    }

    handleClick(id, val){
      this.setState({ [id]: val }, () =>
        {
          this.props.history.push('search?q='+this.state.rawInput);
        });
    }

    render(){
      return (
        <div id="landing">
            <Helmet>
                <meta charSet="utf-8" />
                <title>NEPAccess</title>
                <link rel="canonical" href="https://nepaccess.org/" />
            </Helmet>
          {/* <div id="landing-images">
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
          </div> */}
          <div id="landing-images">
                <div id="headline" className="no-select cursor-default">
                    <h1 id="landing-headline-text">
                        Bringing NEPA into the 21st Century<br /> through the Power of Data Science
                    </h1>
                    <h2 id="sub-headline">
                        Engage with data from thousands of environmental review documents.
                    </h2>
                    {/* <h1 id="landing-headline-text">
                        Explore Thousands of Environmental Impact Statements.
                    </h1>
                    <h2 id="sub-headline">
                        Bringing NEPA into the 21st Century
                    </h2> */}
          
                    <SearcherLanding 
                        id="rawInput"
                        onChange={this.handleChange}
                        onClick={this.handleClick}
                        value={this.state.rawInput}
                    />
                </div>
                <div id="images-combo">
                </div>
                {/* <div id="image-1">
                </div>
                <div id="image-2">
                </div> */}
          </div>
          {/* <div>
            <span id="post-text">
              <span>Whether you are a:</span>
              <span className="post-text-bullet">  • community stakeholder,</span>
              <span className="post-text-bullet">  • NEPA project manager or engineer, </span>
              <span className="post-text-bullet">  • researcher or student, </span>
              <span className="post-text-bullet">  • environmental advocate, librarian, or member of the public, </span>
              <span>NEPAccess is a portal to decades of applied science, and information about public participation in environment decision making.</span>
            </span>
            <br />
          </div> */}

            <IframeResizer
                // log
                data-hj-allow-iframe="true"
                id="iframe-landing-container"
                src="https://about.nepaccess.org/"
                style={{ width: '1px', minWidth: '100%'}}
            />

          {/* <div id="search-container">
            <div id="landing-container-text">
              Begin with a simple keyword search:
            </div>
                <SearcherLanding 
                id="rawInput"
                onChange={this.handleChange}
                onClick={this.handleClick}
                value={this.state.rawInput}
                />
            </div>*/}
        </div>
      )
      
    }

}

export default Landing;