import React from 'react';

import {Helmet} from 'react-helmet';

import './index.css';
import './landing.css';

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
                    <title>NEPAccess: Bringing NEPA into the 21st Century</title>
                    <meta name="description" content="NEPAccess.org is a new knowledge and discovery platform for finding and analyzing decades of applied science in NEPA’s environmental decision-making process." data-react-helmet="true" />
                    <link rel="canonical" href="https://nepaccess.org/" />
                </Helmet>

                <div id="landing-images">
                    <div id="headline" className="no-select cursor-default">
                        <div id="landing-headline-container">
                            <h1 id="landing-headline-left">
                                <span className="glow">
                                    Fulfilling NEPA’s Promise Through the Power of Data Science.
                                </span>
                            </h1>
                            <h2 id="landing-headline-right">
                                <span className="glow">
                                    Help grow our community of knowledge to fulfill NEPA’s promise — put our information infrastructure to work for you.
                                </span>
                            </h2>
                        </div>
            
                        <SearcherLanding 
                            id="rawInput"
                            onChange={this.handleChange}
                            onClick={this.handleClick}
                            value={this.state.rawInput}
                        />
                    </div>
                </div>

                <IframeResizer
                    // log
                    data-hj-allow-iframe="true"
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}

export default Landing;