import React from 'react';

import './css/tabulator.css';
import "./search.css";

import "react-datepicker/dist/react-datepicker.css";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';

import globals from './globals.js';
import persist from './persist.js';

import { withRouter } from "react-router";

import PropTypes from "prop-types";

const _ = require('lodash');

class FulltextSearcher extends React.Component {

	static propTypes = {
        // match: PropTypes.object.isRequired,
        // location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
		this.state = {
            terms: '',
            context: false
        };
        this.debouncedSearch = _.debounce(this.props.search, 300);
    }
    
    /**
     * Event handlers
     */  
    
    /** Capture enter key to prevent default behavior of form submit, force a new search (refresh results) */
    onKeyUp = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.debouncedSearch(this.state);
        }
    }

    onIconClick = (evt) => {
        this.debouncedSearch(this.state);
    }
    
    onClearClick = (evt) => {
        this.setState({ terms: '' });
    }

    // Stopwords:
    // "a", "an", "and", "are", "as", "at", "be", "but", "by",
    // "for", "if", "in", "into", "is", "it",
    // "no", "not", "of", "on", "or", "such",
    // "that", "the", "their", "then", "there", "these",
    // "they", "this", "to", "was", "will", "with"

	onInput = (evt) => {
        if(this.state.terms === evt.target.value.trim() || this.state.context){ // Don't bother searching on spacebar hits and don't auto-search with contextual (too expensive)
            this.setState({ [evt.target.name]: evt.target.value });
        } else {
            this.setState( 
            { 
                [evt.target.name]: evt.target.value,
            }, () => { 
                this.debouncedSearch(this.state);
            });
        }
    }
    
    onCheckboxChange = (evt) => {
        this.setState( { [evt.target.name]: evt.target.checked}, () => {
            // console.log(this.state.context);
            this.debouncedSearch(this.state);
        } );
    }

    submitHandler(e) { e.preventDefault(); }

    onChangeHandler = (evt) => {} // just to silence warnings

    /** Sanity checking & Validation */

    validated = (term) => {
        
        term = term.trim();
        // console.log(term);
        if(term && /[a-zA-Z0-9\s]+/g.exec(term) === null){
            console.log("Invalid search query " + term);
            return false;
        }

        return true;
    }
    
    

    render () {
        // const { match, location, history } = this.props;
        const { history } = this.props;
        // const specials = '+ - && || ! ( ) { } [ ] ^ \" ~ * ? : \\ /';
        // const specials = '+ && || ! ( ) { } [ ] ^ ~ ? : \\ /';
        const fulltextTooltipTitle = "<p className=&quot;tooltip-line&quot;>Including any of these stopwords will get zero results: &quot;a&quot;, &quot;an&quot;, &quot;and&quot;, &quot;are&quot;, &quot;as&quot;, &quot;at&quot;, &quot;be&quot;, &quot;but&quot;, &quot;by&quot;,"
        + "&quot;for&quot;, &quot;if&quot;, &quot;in&quot;, &quot;into&quot;, &quot;is&quot;, &quot;it&quot;,"
        + "&quot;no&quot;, &quot;not&quot;, &quot;of&quot;, &quot;on&quot;, &quot;or&quot;, &quot;such&quot;,"
        + "&quot;that&quot;, &quot;the&quot;, &quot;their&quot;, &quot;then&quot;, &quot;there&quot;, &quot;these&quot;,"
        + "&quot;they&quot;, &quot;this&quot;, &quot;to&quot;, &quot;was&quot;, &quot;will&quot;, &quot;with&quot;";
        // console.log("FulltextSearcher");

        return (
            <div>
                <div>
                    <div className="content" onSubmit={this.submitHandler}>
                        <div id="searcher-container">
                            <label className="search-label">
                                <label className="flex-center no-select cursor-pointer">
                                    <input type="checkbox" className="cursor-pointer" name="context" checked={this.state.context} onChange={this.onCheckboxChange} 
                                            disabled={this.props.searching} />
                                    Show search terms in context (full view)
                                </label>
                            </label>
                            <div id="searcher-inner-container">

                                <div id="fake-search-box" className="inline-block">
                                    <Tooltip 
                                        className="cursor-default no-select"
                                        // position="left-end"
                                        // arrow="true"
                                        size="small"
                                        // distance="80"
                                        // offset="80"
                                        // open="true"
                                        title={fulltextTooltipTitle}
                                    >
                                        <svg className="cursor-default no-select" id="tooltip1" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M31.1311 16.5925C31.1311 24.7452 24.4282 31.3772 16.1311 31.3772C7.83402 31.3772 1.1311 24.7452 1.1311 16.5925C1.1311 8.43982 7.83402 1.80774 16.1311 1.80774C24.4282 1.80774 31.1311 8.43982 31.1311 16.5925Z" fill="#E5E5E5" stroke="black" strokeWidth="2"/>
                                        </svg>
                                        <span id="tooltip1Mark" className="cursor-default no-select">?</span>
                                    </Tooltip>
                                    <input className="search-box" 
                                        name="terms" 
                                        placeholder="Search by keywords within files" 
                                        value={this.state.terms}
                                        disabled={this.props.searching}
                                        autoFocus 
                                        onChange={this.onChangeHandler}
                                        onInput={this.onInput} onKeyUp={this.onKeyUp}
                                    />

                                    <div className="post-search-box-text" hidden={!this.state.context}>
                                        Press enter to search for terms.  Common words (a, and, the, ...) are not indexed.  
                                    </div>
                                    
                                    <div className="post-search-box-text" hidden={this.state.context}>
                                        Proximity searching (searching for terms within # words of each other) is done by encapsulating the terms in double quotes followed by tilde and the number of words. Example: "example phrase here"~100
                                    </div>
                                    {/* <div className="post-search-box-text" hidden={!this.state.context}>
                                        Press enter to search for terms.  Stopwords (a, and, the, ...) are not indexed.  Searching for "exact phrases" is supported, as well as wildcards* or -excluded -words.
                                    </div> */}
                                    {/* <div className="post-search-box-text" hidden={!this.state.context}>
                                        Special characters treated as spaces: {specials}
                                    </div> */}

                                    <svg onClick={this.onIconClick} id="search-icon" width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M26.4582 24.1397H28.2356L37.7751 33.3063C38.6976 34.1886 38.6976 35.6303 37.7751 36.5125C36.8526 37.3947 35.3452 37.3947 34.4228 36.5125L24.8607 27.3674V25.6675L24.2533 25.065C21.1034 27.6471 16.8061 28.9813 12.2388 28.2496C5.98416 27.2383 0.989399 22.2462 0.224437 16.2212C-0.945506 7.11911 7.0641 -0.541243 16.5811 0.577685C22.8808 1.30929 28.1006 6.08626 29.158 12.0682C29.923 16.4363 28.5281 20.5463 25.8282 23.5588L26.4582 24.1397ZM4.61171 14.4567C4.61171 19.8146 9.13399 24.1397 14.7362 24.1397C20.3384 24.1397 24.8607 19.8146 24.8607 14.4567C24.8607 9.09875 20.3384 4.77366 14.7362 4.77366C9.13399 4.77366 4.61171 9.09875 4.61171 14.4567Z" fill="black" fillOpacity="0.54"/>
                                    </svg>
                                    <svg onClick={this.onClearClick} id="cancel-icon" width="24" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.2689 1.92334C5.63289 1.92334 0.26889 7.28734 0.26889 13.9233C0.26889 20.5593 5.63289 25.9233 12.2689 25.9233C18.9049 25.9233 24.2689 20.5593 24.2689 13.9233C24.2689 7.28734 18.9049 1.92334 12.2689 1.92334Z" fill="#DADADA"/>
                                        <path d="M17.4289 19.0834C16.9609 19.5514 16.2049 19.5514 15.7369 19.0834L12.2689 15.6154L8.80089 19.0834C8.33289 19.5514 7.57689 19.5514 7.10889 19.0834C6.88418 18.8592 6.7579 18.5548 6.7579 18.2374C6.7579 17.9199 6.88418 17.6155 7.10889 17.3914L10.5769 13.9234L7.10889 10.4554C6.88418 10.2312 6.7579 9.92677 6.7579 9.60935C6.7579 9.29193 6.88418 8.98755 7.10889 8.76335C7.57689 8.29535 8.33289 8.29535 8.80089 8.76335L12.2689 12.2314L15.7369 8.76335C16.2049 8.29535 16.9609 8.29535 17.4289 8.76335C17.8969 9.23135 17.8969 9.98735 17.4289 10.4554L13.9609 13.9234L17.4289 17.3914C17.8849 17.8474 17.8849 18.6154 17.4289 19.0834Z" fill="#737272"/>
                                    </svg>

                                </div>

                            </div>
                            <span onClick={() => { history.push('/search'); }} id="fulltext-mode" className="inline-block no-select">Default search</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /** Lifecycle */
    
	componentWillUnmount() {
		persist.setItem('fulltextState', JSON.stringify(this.state));
	}

    // After render
	componentDidMount() {
        try {
            const rehydrate = JSON.parse(persist.getItem('fulltextState'));
            this.setState(rehydrate);
        }
        catch(e) {
            // do nothing
        }

        /** Supporting potential for fulltext search query from elsewhere (such as landing), or support saved search via bookmark; currently unused */
        var queryString = globals.getParameterByName("q");
        // console.log("Param " + queryString);
        if(queryString){
            this.setState({
                terms: queryString
            }, () => {
                if(this.state.terms){
                    this.debouncedSearch(this.state);
                }
            });
        }
	}
}

export default withRouter(FulltextSearcher);