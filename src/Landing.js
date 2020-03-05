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
              The National Environmental Policy Act of 1970 (NEPA) is the cornerstone of US environmental policy. The heart of NEPA is the Environmental Impact Statement (EIS).
              </span>
            </div>
            <div id="image-2">
              <span id="subhead" className="no-select cursor-default">
              This site provides unprecedented access to decades of environmental data.  Get started with a simple search.
              </span>
            </div>
          </div>
          <div>
            <span id="post-text">
            From a local flood control project, to interstate highways, to regional management of national forests, NEPAccess gives you the power to gather data, assess impacts, and determine the effectiveness of the governmental process.
            </span>
          </div>



          <div id="search-container">
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