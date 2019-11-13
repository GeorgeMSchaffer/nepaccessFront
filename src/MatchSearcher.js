import React from 'react';

import "react-datepicker/dist/react-datepicker.css";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';

const _ = require('lodash');

class MatchSearcher extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            id: 0,
            matchPercent: 80,
            searcherClassName: '',
            matchPercentError: ''
		};
        this.debouncedSearch = _.debounce(this.props.search, 300);
		// this.onKeyUp = this.onKeyUp.bind(this);
    }

    // TODO: Probably need to change this to double on front and backend
    // and then maybe use Number.isNaN() for checks
    sanePercent = (percent) => { 
        let result = false;
        if(Number.isInteger(percent) && percent < 101 && percent > 0){
            result = true;
            this.setState({
                matchPercentError: ''
            });
        } else {
            this.setState({
                matchPercentError: 'Invalid percentage'
            });
        }
        return result;
    }
    
    onChange = (evt) => {
        // console.log(this.sanePercent(Number.parseInt(evt.target.value)));
        if(this.sanePercent(Number.parseInt(evt.target.value))){
            this.setState( 
            { 
                [evt.target.name]: evt.target.value
            }, () => {
                this.debouncedSearch(this.state);
            });
        }
    }

    // Can either just make the form a div or use this to prevent Submit default behavior
	submitHandler(e) { e.preventDefault(); }
    
    render () {
        return (
            <form onSubmit={this.submitHandler}>
                <label htmlFor="matchSearchPercent">Search by match percentage</label>
                <Tooltip title="Search by title match certainty">
                    <input id="matchSearchPercent" type="range" min="1" max="100" value={this.state.matchPercent} 
                        name="matchPercent" autoFocus onChange={this.onChange} />
                </Tooltip>
                {this.state.matchPercent}
            </form>
        )
    }

    componentDidMount() {
        this.setState({
            matchPercent: this.props.matchPercent,
            id: this.props.id
        }, () => {
            this.debouncedSearch(this.state);
        });
    }
}

export default MatchSearcher;