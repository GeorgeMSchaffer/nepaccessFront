import React from 'react';
import './index.css';
import './landing.css';

import SearcherLanding from './SearcherLanding.js';
import './login.css';

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
      this.setState({ [inputId]: inputValue }, () =>
      {
        // this.props.handleChange(inputId, inputValue);
        console.log(this.state.render);
        console.log(this.state.rawInput);
      });
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
          <div id="landing-images">
            <div id="image-1">
              <span id="headline" className="no-select cursor-default">
                <p className="size">The National Environmental Policy Act of 1970 (NEPA) requires review of the potential impacts of all major Federal actions on the natural and human environment.
                </p>
                <p className="size">The Environmental Impact Statement (EIS) is NEPA’s central means to conduct this review.
                </p>
              </span>
            </div>
            <div id="image-2">
              <span id="subhead" className="no-select cursor-default">
                <p className="size">NEPAccess makes available to you thousands of EISs, and related documents, to search, download, and analyze.
                </p>
                <p className="size">NEPAccess offers you the power to gather useable data from multiple review processes.
                </p>
              </span>
            </div>
          </div>
          <div>
            <span id="post-text">
              {/* <span>Whether you are a:</span>
              <span className="post-text-bullet">  • community stakeholder,</span>
              <span className="post-text-bullet">  • NEPA project manager or engineer, </span>
              <span className="post-text-bullet">  • researcher or student, </span>
              <span className="post-text-bullet">  • environmental advocate, librarian, or member of the public, </span> */}
              <span>NEPAccess is a portal to decades of applied science, and information about public participation in environment decision making.</span>
            </span>
            <br />
          </div>

          
          <div id="search-container">
            <div id="landing-container-text">
              Begin with a simple keyword search:
            </div>
            <SearcherLanding 
              id="rawInput"
              onChange={this.handleChange}
              onClick={this.handleClick}
              value={this.state.rawInput}
            />
          </div>
        </div>
      )
      
    }

}

export default Landing;