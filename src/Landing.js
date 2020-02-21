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
          // this.props.handleChange(id, val);
          this.props.history.push('search?q='+this.state.rawInput);
          // this.props.history.push({
          //     pathname: '/search?' + test
          // })
        });

      
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