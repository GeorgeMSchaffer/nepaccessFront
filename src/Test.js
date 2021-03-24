import React from 'react';
import {Helmet} from "react-helmet";

// import axios from 'axios';

// import Globals from './globals.js';

export default class Test extends React.Component {

    constructor(props) {
        super(props);
		this.state = {

        };
    }

    onInput = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    render () {
        return (
            <div id="test-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - Test</title>
                    <link rel="canonical" href="http://nepaccess.org/test" />
                </Helmet>
                
                <span>test</span>
            </div>
        )
    }
    
	componentDidMount() {
	}
}