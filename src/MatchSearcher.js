import React from 'react';

import "react-datepicker/dist/react-datepicker.css";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';

const _ = require('lodash');

class MatchSearcher extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            id: 4,
            matchPercent: 99,
            searcherClassName: ''
		};
        this.debouncedSearch = _.debounce(this.props.search, 300);
		// this.onKeyUp = this.onKeyUp.bind(this);
	}
    
    // Can either just make the form a div or use this to prevent Submit default behavior
	submitHandler(e) { e.preventDefault(); }
    
    render () {
        return (
            <div className={this.state.searcherClassName}>
                <form className="content dark" onSubmit={this.submitHandler}>
                    {/* <Tooltip title="Set minimum matching percentage to query by">
                    <label className="">
                        <input type="" name="" onChange={} />
                        Text
                    </label>
                    </Tooltip> */}
                </form>
            </div>
        )
    }

    componentDidMount() {
        this.debouncedSearch(this.state);
    }
}

export default MatchSearcher;