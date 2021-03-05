import React from 'react';

import axios from 'axios';

import CardResults from './CardResults.js';
import Search from './Search.js';

import './User/login.css';

import Globals from './globals.js';
import persist from './persist.js';

/** For testing redesigned, consolidated search which is in progress */
export default class App extends React.Component {

	state = {
		searcherInputs: {
			startPublish: '',
			endPublish: '',
			agency: [],
			state: [],
			needsComments: false,
			needsDocument: false,
            limit: 1000000
		},
        searchResults: [],
        outputResults: [],
        displayRows: [],
        count: 0,
		resultsText: 'Results',
		networkError: '',
		verified: false,
        searching: false,
        useSearchOptions: false,
        snippetsDisabled: false
    }
    
    constructor(props){
        super(props);
        this.endRef = React.createRef();
    }
    
    // For canceling a search when component unloads
    _mounted = false;

    // For canceling a search on demand
    _canceled = false;

    // For canceling any running search if user starts a new search before results are done
    _searchId = 1;

    // For filtering results mid-search
    _searcherState = null; 

    // For display
    _searchTerms = "";

    // For sorting mid-search
    _sortVal = null;
    _ascVal = true;

    optionsChanged = (val) => {
        this.setState({
            useSearchOptions: val
        });
    }

    matchesArray(field, val) {
        return function (a) {
            let returnValue = false;
            val.forEach(item =>{
                if (a[field] === item) {
                    returnValue = true;
                }
            });
            return returnValue;
        };
    }
    
    /** Special logic for ;-delimited states or cooperating agencies newly from Buomsoo */
    arrayMatchesArray(field, val) {
        return function (a) {
            // console.log(a);
            let returnValue = false;
            val.forEach(item =>{
                if(a[field]){
                    // let _vals = a[field].split(";"); // e.g. AK;AL;...
                    let _vals = a[field].split(/[; ]+/); // e.g. AK;AL or AK AL or AK; AL
                    for(let i = 0; i < _vals.length; i++) {
                        if (_vals[i] === item) {
                            returnValue = true; // if we hit ANY of them, then true
                        }
                    }
                }
            });
            return returnValue;
        };
    }

    matchesStartDate(val) {
        return function (a) {
            return (a["registerDate"] >= val);
        };
    }
    
    matchesEndDate(val) {
        return function (a) {
            return (a["registerDate"] <= val); // should this be inclusive? <= or <
        };
    }
    
    matchesType(matchFinal, matchDraft) {
        return function (a) {
            return (
                ((
                    (a["documentType"] === "Final") 
                    || (a["documentType"] === "Second Final")
                    || (a["documentType"] === "Revised Final")
                    || (a["documentType"] === "Final Supplement")
                    || (a["documentType"] === "Second Final Supplemental")
                    || (a["documentType"] === "Third Final Supplemental")
                ) 
                && matchFinal) || 
                ((
                    (a["documentType"] === "Draft") 
                    || (a["documentType"] === "Second Draft")
                    || (a["documentType"] === "Revised Draft")
                    || (a["documentType"] === "Draft Supplement")
                    || (a["documentType"] === "Second Draft Supplemental")
                    || (a["documentType"] === "Third Draft Supplemental")
                ) 
                && matchDraft)
            );
        };
    }

    /** Design: Search component calls this parent method which controls
    * the results, which gives a filtered version of results to CardResults */
    filterResultsBy = (searcherState) => {
        this._searcherState = searcherState; // for live filtering
        // Only filter if there are any results to filter
        if(this.state.searchResults && this.state.searchResults.length > 0){
            // Deep clone results
            let isFiltered = false;
            let filteredResults = JSON.parse(JSON.stringify(this.state.searchResults));
            
            if(searcherState.agency && searcherState.agency.length > 0){
                isFiltered = true;
                filteredResults = filteredResults.filter(this.matchesArray("agency", searcherState.agency));
            }
            if(searcherState.cooperatingAgency && searcherState.cooperatingAgency.length > 0){
                isFiltered = true;
                filteredResults = filteredResults.filter(this.arrayMatchesArray("cooperatingAgency", searcherState.cooperatingAgency));
            }
            if(searcherState.state && searcherState.state.length > 0){
                isFiltered = true;
                filteredResults = filteredResults.filter(this.arrayMatchesArray("state", searcherState.state));
            }
            if(searcherState.startPublish){
                isFiltered = true;
                let formattedDate = Globals.formatDate(searcherState.startPublish);
                filteredResults = filteredResults.filter(this.matchesStartDate(formattedDate));
            }
            if(searcherState.endPublish){
                isFiltered = true;
                let formattedDate = Globals.formatDate(searcherState.endPublish);
                filteredResults = filteredResults.filter(this.matchesEndDate(formattedDate));
            }
            if(searcherState.typeFinal || searcherState.typeDraft){
                isFiltered = true;
                filteredResults = filteredResults.filter(this.matchesType(searcherState.typeFinal, searcherState.typeDraft));
            }
            
            let textToUse = filteredResults.length + " Results"; // unfiltered: "Results"
            if(isFiltered) { // filtered: "Matches"
                textToUse = filteredResults.length + " Matches";
                if(filteredResults.length === 0) {
                    textToUse = filteredResults.length + " Matches (try relaxing filters?)";
                }
            }
            
            this.setState({
                outputResults: filteredResults,
                resultsText: textToUse
            });
        }
    }

    // Sort search results on call from results component
    sort = (val, asc) => {
        this._sortVal = val;
        this._ascVal = asc;
        this.sortDataByField(val, asc);
    }

    // TODO: asc/desc (> vs. <, default desc === >)
    sortDataByField = (field, ascending) => {
        this.setState({
            // searchResults: this.state.searchResults.sort((a, b) => (a[field] > b[field]) ? 1 : -1)
            outputResults: this.state.outputResults.sort((this.alphabetically(field, ascending)))
        });
    }

    /** Sorts falsy (undefined, null, NaN, 0, "", and false) field value to the end instead of the top */
    alphabetically(field, ascending) {

        return function (a, b) {
      
            // equal items sort equally
            if (a[field] === b[field]) {
                return 0;
            }
            // falsy sort after anything else
            else if (!a[field]) {
                return 1;
            }
            else if (!b[field]) {
                return -1;
            }
            // otherwise, if we're ascending, lowest sorts first
            else if (ascending) {
                return a[field] < b[field] ? -1 : 1;
            }
            // if descending, highest sorts first
            else { 
                return a[field] < b[field] ? 1 : -1;
            }
        
        };
      
    }

    // TODO: Can't set state here, state update logic needs to happen elsewhere?
    stopSearch = () => {
        this._canceled = true;
        // this.filterResultsBy(searcherState);
        // this.setState({searching:false})
        // this.setState({
        //     searching: false
        // }, () => {
        //     this.filterResultsBy(this._searcherState);
        // });
    }

    // Start a brand new search.
    startNewSearch = (searcherState) => {
        // reset sort
        this._sortVal = "relevance"; 
        this._ascVal = true;

        this._canceled = false;
        this._searcherState = searcherState; // for live filtering

        // 1: Collect contextless results
        //        - Consolidate all of the filenames by metadata record into singular results
        //          (maintaining original order by first appearance)
        this.initialSearch(searcherState);
        // 2: Begin collecting text fragments 10-100 at a time or all for current page,  
        //          assign accordingly, in a cancelable recursive function
        //          IF TITLE ONLY SEARCH: We can stop here.

    }

    initialSearch = (searcherState) => {
        if(!this._mounted){ // User navigated away or reloaded
            return;
        }

		this.setState({
            // Fresh search, fresh results
            outputResults: [],
            count: 0,
            searcherInputs: searcherState,
            snippetsDisabled: searcherState.searchOption==="C",
			resultsText: "Loading results...",
            networkError: "", // Clear network error
            searching: true
		}, () => {

            // title-only
            let searchUrl = new URL('text/search', Globals.currentHost);
            
            // For the new search logic, the idea is that the limit and offset are only for the text
            // fragments.  The first search should get all of the results, without context.
            // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
            // properly
            if(searcherState.searchOption && searcherState.searchOption === "A") {
                searchUrl = new URL('text/search_no_context', Globals.currentHost);
            } else if(searcherState.searchOption && searcherState.searchOption === "B") {
                searchUrl = new URL('text/search_no_context', Globals.currentHost);
            }

			if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
				this.props.history.push('/login') // Prompt login if no auth token
            }

            this._searchTerms = this.state.searcherInputs.titleRaw;

			let dataToPass = { 
				title: this.state.searcherInputs.titleRaw
            };

            // OPTION: If we restore a way to use search options for faster searches, we'll assign here
            if(this.state.useSearchOptions) {
                dataToPass = { 
                    title: this.state.searcherInputs.titleRaw, 
                    startPublish: this.state.searcherInputs.startPublish,
                    endPublish: this.state.searcherInputs.endPublish,
                    startComment: this.state.searcherInputs.startComment,
                    endComment: this.state.searcherInputs.endComment,
                    agency: this.state.searcherInputs.agency,
                    state: this.state.searcherInputs.state,
                    typeAll: this.state.searcherInputs.typeAll,
                    typeFinal: this.state.searcherInputs.typeFinal,
                    typeDraft: this.state.searcherInputs.typeDraft,
                    typeOther: this.state.searcherInputs.typeOther,
                    needsComments: this.state.searcherInputs.needsComments,
                    needsDocument: this.state.searcherInputs.needsDocument
                };
            }
            //Send the AJAX call to the server

            // console.log("Search init");
            axios({
                method: 'POST', // or 'PUT'
                url: searchUrl,
                data: dataToPass
            }).then(response => {
                let responseOK = response && response.status === 200;
                if (responseOK) {
                    return response.data;
                } else if (response.status === 204) {  // Probably invalid query due to misuse of *, "
                    this.setState({
                        resultsText: "No results: Please check use of term modifiers"
                    });
                    return null;
                } else {
                    console.log(response.status);
                    return null;
                }
            }).then(currentResults => {
                let _data = [];
                if(currentResults && currentResults[0] && currentResults[0].doc) {
                    
                    // console.log(currentResults);
                    // TODO: Probably don't want filter permanently, but it was requested for now
                    _data = currentResults
                    .filter((result) => { // Soft rollout logic added to filter out anything without docs.
                        return result.doc.size > 200; // filter out if no files (200 bytes or less)
                        // return true;
                    })
                    .map((result, idx) =>{
                        let doc = result.doc;
                        let newObject = {title: doc.title, 
                            agency: doc.agency, 
                            cooperatingAgency: doc.cooperatingAgency,
                            commentDate: doc.commentDate, 
                            registerDate: doc.registerDate, 
                            state: doc.state, 
                            documentType: doc.documentType, 
                            filename: doc.filename, 
                            commentsFilename: doc.commentsFilename,
                            size: doc.size,
                            id: doc.id,
                            folder: doc.folder,
                            plaintext: result.highlights,
                            name: result.filenames,
                            relevance: idx + 1 // sort puts "falsy" values at the bottom incl. 0
                        };
                        return newObject;
                    }); 
                    this.setState({
                        searchResults: _data,
                        outputResults: _data,
                        resultsText: _data.length + " Results",
                    }, () => {
                        this.filterResultsBy(this._searcherState);
                    
                        // title-only (or blank search===no text search at all): return
                        if(Globals.isEmptyOrSpaces(searcherState.titleRaw) || 
                                (searcherState.searchOption && searcherState.searchOption === "C"))
                        {
                            this.setState({
                                searching: false,
                                snippetsDisabled: true
                            });
                        } else {
                            this._searchId = this._searchId + 1;
                            console.log("Launching fragment search ",this._searchId);
                            this.gatherHighlights(this._searchId, 0, searcherState, _data);
                        }
                    });
                } else {
                    // Found nothing
                    // console.log("No results");
                    this.setState({
                        searching: false,
                        resultsText: "No results found"
                    });
                }
            }).catch(error => { // Server down or 408 (timeout)
                console.error('Server is down or verification failed.', error);
                if(error.response && error.response.status === 408) {
                    this.setState({
                        networkError: 'Request has timed out.'
                    });
                    this.setState({
                        resultsText: "Error: Request timed out"
                    });
                } else if (error.response && error.response.status === 403) {
                    this.props.history.push('/login');
                }
                else {
                    this.setState({
                        networkError: 'Server is down or you may need to login again.'
                    });
                    this.setState({
                        resultsText: "Error: Couldn't get results from server"
                    });
                }
                this.setState({
                    searching: false
                });
            })
    
        });
    }
    
    gatherHighlights = (searchId, _offset, _inputs, currentResults) => {
        if(!this._mounted){ // User navigated away or reloaded
            return; // cancel search
        }
        if(searchId < this._searchId) { // Search interrupted
            return; // cancel search
        }
        if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
            this.props.history.push('/login'); // Prompt login if no auth token
        }
        if (typeof _offset === 'undefined') {
            _offset = 0;
        }
        if (typeof currentResults === 'undefined') {
            currentResults = [];
        }

        if(_offset > currentResults.length || this._canceled) {
            let resultsText = currentResults.length + " Results";
            if(this._canceled) {
                resultsText += " (stopped)";
            }
            console.log("Nothing left to highlight");
            this.setState({
                searching: false,
                resultsText: resultsText
            }, () => {
                this.filterResultsBy(this._searcherState);
            });
            return;
        }

        let _limit = 100; // normally get 100
        if(_offset === 0) {
            _limit = 10; // start with 10
        } else if(_offset === 10) {
            _limit = 90;
        }

        this.setState({
            snippetsDisabled: false,
			resultsText: currentResults.length + " Results.  Getting Texts...",
            networkError: "", // Clear network error
		}, () => {
            
            // For the new search logic, the idea is that the limit and offset are only for the text
            // fragments.  The first search should get all of the results, without context.
            // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
            // properly
            let searchUrl = new URL('text/get_highlights', Globals.currentHost);

            // TODO: Gather limit # IDs and filenames starting at offset # from current results,
            // feed as data.  Because we're deciding what we want from the backend, offset is handled
            // locally.
            let _unhighlighted = [];
            for(let i = _offset; i < Math.min(currentResults.length, _offset + _limit); i++){
                // Push EISDoc ID and comma-delimited list of filenames
                if(!Globals.isEmptyOrSpaces(currentResults[i].name)){
                    _unhighlighted.push({id: currentResults[i].id, filename: currentResults[i].name});
                }
            }

            // If nothing to highlight in this batch, skip to next run
            if(_unhighlighted.length === 0) {
                if(searchId < this._searchId) {
                    return;
                } else {
                    this.gatherHighlights(searchId, _offset + _limit, _inputs, currentResults);
                }
                return;
            }

			let dataToPass = { 
				unhighlighted: _unhighlighted,
                terms: _inputs.titleRaw,
            };

            //Send the AJAX call to the server
            axios({
                method: 'POST', // or 'PUT'
                url: searchUrl,
                data: dataToPass
            }).then(response => {
                let responseOK = response && response.status === 200;
                if (responseOK) {
                    return response.data;
                } else {
                    return null;
                }
            }).then(parsedJson => {
                if(parsedJson){
                    // console.log("Processing results", parsedJson.length);
                    let updatedResults = this.state.searchResults;

                    // Fill highlights here; update state
                    // Presumably comes back in order it was sent out, so we could just do this?:
                    let j = 0;
                    for(let i = _offset; i < Math.min(currentResults.length, _offset + _limit); i++) {
                        // If search is interrupted, updatedResults[i] may be undefined (TypeError)
                        if(!Globals.isEmptyOrSpaces(currentResults[i].name)){
                            updatedResults[i].plaintext = parsedJson[j];
                            j++;
                        }
                    }
                    
                    // Verify one last time we want this before we actually commit to these results
                    // (new search could have started while getting them)
                    if(searchId < this._searchId) {
                        return;
                    } else {
                        if(_limit===10 || this.displayedRowsUnpopulated()) { // Always populate first ten immediately, also populate if user already is looking at unpopulated records
                            this.setState({
                                searchResults: updatedResults,
                                outputResults: updatedResults,
                                count: _offset,
                                resultsText: currentResults.length + " Results",
                            }, () => {
                                if(this._sortVal) {
                                    this.sortDataByField(this._sortVal, this._ascVal);
                                }
                                this.filterResultsBy(this._searcherState);
                            });
                            
                            // offset for next run incremented by limit used
                            this.gatherHighlights(searchId, _offset + _limit, _inputs, updatedResults);
                        } else { // Save data but wait to populate it
                            this.setState({
                                searchResults: updatedResults,
                                count: _offset,
                                resultsText: currentResults.length + " Results",
                            }, () => {
                                if(this._sortVal) {
                                    this.sortDataByField(this._sortVal, this._ascVal);
                                }
                                this.filterResultsBy(this._searcherState);
                            });
                            
                            // offset for next run incremented by limit used
                            this.gatherHighlights(searchId, _offset + _limit, _inputs, updatedResults);
                        }
                    }
                }
            }).catch(error => { 
                if(error.name === 'TypeError') {
                    console.error(error);
                } else { // Server down or 408 (timeout)
                    console.error('Server is down or verification failed.', error);
                    if(error.response && error.response.status === 408) {
                        this.setState({
                            networkError: 'Request has timed out.',
                            resultsText: 'Timed out',
                            searching: false
                        });
                    } else {
                        this.setState({
                            networkError: 'Server is down or you may need to login again.',
                            resultsText: 'Server unresponsive',
                            searching: false
                        });
                    }
                }
            });
        });

        // Possible logic: 
        // 1. Send list of objects with filename + EISDoc ID.
        // Offset determines how many objects to send at a time.
        // They have to match the order that the frontend displays the filenames in, per card.
        // Getting highlights for page user is on, debounced, would be cool, but could be difficult.
        // Adding spinner as placeholder for highlights would also be cool.
        // 2. Backend gets text by matching on given list of data, and gets highlights from texts.
        // 3. Backend sends list of objects containing filename, EISDoc ID, highlight.
        // 4. Frontend receives, matches, updates highlights.

        // There shouldn't be any cause for giving the entire result set back to the backend.
        // Other logic would be to expect only highlights back in a particular order.  However sorting
        // would complicate this in several ways.

        
    }



	check = () => { // check if JWT is expired/invalid
		
		let checkURL = new URL('test/check', Globals.currentHost);
		let result = false;
		axios.post(checkURL)
		.then(response => {
			result = response && response.status === 200;
			this.setState({
				verified: result
			})
		})
		.catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
			if(!err.response){ // Probably no need to redirect to login if server isn't responding
				this.setState({
					networkError: "Server may be down, please try again later."
				});
			} else { // 403?
                if(err.response && err.response.status===403) {
                    this.props.history.push('/login');
                }
			}
		})
		.finally(() => {
			// console.log("Returning... " + result);
		});
		// console.log("App check");
    }
    
    /** Scroll to bottom on page change and populate full table with latest results */
    scrollToBottom = (_rows) => {
        try {
            // console.log("Paged");
            // console.log("Rows", _rows);
            // for(let i = 0; i < _rows.length; i++) {
            //     console.log(_rows[i].data);
            //     if(_rows[i].data.plaintext.length === 0){
            //         console.log("No text.  Should populate.");
            //         i = _rows.length;
            //     }
            // }
            this.setState({
                outputResults: this.state.searchResults,
                displayRows: _rows
            }, () => {
                setTimeout(() => {
                    this.endRef.current.scrollIntoView({ behavior: 'smooth' })
                }, 100);
            });
        } catch(e) {
            console.log("Scroll error", e);
        }
    }


    displayedRowsUnpopulated = () => {
        // console.log("Checking displayed rows...");
        for(let i = 0; i < this.state.displayRows.length; i++) {
            // console.log(this.state.displayRows[i].data);
            if(this.state.displayRows[i].data.plaintext.length === 0){
                // console.log("No text.  Should populate.");
                return true;
            }
        }

        return false;
    }
	

	render() {
		if(this.state.verified){

			return (
                <>
				<div id="app-content">
					<label className="errorLabel">{this.state.networkError}</label>
                    <Search 
                        search={this.startNewSearch} 
                        stop={this.stopSearch}
                        filterResultsBy={this.filterResultsBy} 
                        searching={this.state.searching} 
                        useOptions={this.state.useSearchOptions}
                        optionsChanged={this.optionsChanged}
                        count={this.state.count}
                    />
                    <CardResults 
                        sort={this.sort}
                        results={this.state.outputResults} 
                        resultsText={this.state.resultsText} 
                        searching={this.state.searching}
                        snippetsDisabled={this.state.snippetsDisabled} 
                        scrollToBottom={this.scrollToBottom}
                    />
				</div>
                <div ref={this.endRef} />
                </>
			)

		}
		else 
		{
			return (
				<div className="content">
					<label className="logged-out-header">
                        NEPAccess searches are not currently available to the public.
                    </label>
				</div>
			)
		}
    }
    
	// After render
	componentDidMount() {
        this.check();
        this._mounted = true;

        // Option: Rehydrate old search results and everything?
        try {
            const rehydrate = JSON.parse(persist.getItem('results'));
            // console.log("Old results", rehydrate);
            this.setState(
                rehydrate
            );
        }
        catch(e) {
            // do nothing
        }
    }
    
    async componentWillUnmount() {
        // console.log("Unmount app");
        this._mounted = false;

        // Option: Rehydrate if not interrupting a search
        if(!this.state.searching){
            persist.setItem('results', JSON.stringify(this.state));
        }
    }
	
}