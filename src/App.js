import React from 'react';
import axios from 'axios';

import CardResults from './CardResults.js';
import Search from './Search.js';

import './User/login.css';

import Globals from './globals.js';
import persist from './persist.js';

class App extends React.Component {

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
		resultsText: 'Results',
		networkError: '',
		verified: false,
        searching: false,
        useSearchOptions: false,
        snippetsDisabled: false,
        isDirty: false
    }
    
    _mounted = false;

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
                (a["documentType"] === "Final" && matchFinal) || 
                (a["documentType"] === "Draft" && matchDraft)
            );
        };
    }

    /** TODO: Design: Search component calls this parent method which controls
    * the results, which gives a filtered version of results to CardResults */
    filterResultsBy = (searcherState) => {
        // Only filter if there are any results to filter
        if(this.state.searchResults && this.state.searchResults.length > 0){
            // Deep clone results
            let isDirty = false;
            let filteredResults = JSON.parse(JSON.stringify(this.state.searchResults));
            console.log(filteredResults.length);
            if(searcherState.agency && searcherState.agency.length > 0){
                isDirty = true;
                filteredResults = filteredResults.filter(this.matchesArray("agency", searcherState.agency));
            }
            if(searcherState.state && searcherState.state.length > 0){
                isDirty = true;
                filteredResults = filteredResults.filter(this.matchesArray("state", searcherState.state));
            }
            if(searcherState.startPublish){
                isDirty = true;
                let formattedDate = Globals.formatDate(searcherState.startPublish);
                filteredResults = filteredResults.filter(this.matchesStartDate(formattedDate));
            }
            if(searcherState.endPublish){
                isDirty = true;
                let formattedDate = Globals.formatDate(searcherState.endPublish);
                filteredResults = filteredResults.filter(this.matchesEndDate(formattedDate));
            }
            if(searcherState.typeFinal || searcherState.typeDraft){
                isDirty = true;
                filteredResults = filteredResults.filter(this.matchesType(searcherState.typeFinal, searcherState.typeDraft));
            }
            
            // If there are any active filters, display as "Matches", else "Results"
            if(isDirty){
                this.setState({
                    outputResults: filteredResults,
                    resultsText: filteredResults.length + " Matches"
                });
            } else {
                this.setState({
                    outputResults: filteredResults,
                    resultsText: filteredResults.length + " Results"
                });
            }
        }
    }

    // Sort search results on call from results component
    sort = (val) => {
        this.sortDataByField(val, true);
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

	search = (searcherState, _offset, currentResults) => {
        if(!this._mounted){
            return;
        }
        let _inputs = searcherState;

        // There is no longer an advanced search so this is no longer useful
        // if(!searcherState.optionsChecked){
        //     _inputs = Globals.convertToSimpleSearch(searcherState);
        // }
        
        if (typeof _offset === 'undefined') {
            // console.log("Offset undefined, using " + searcherState.offset);
            _offset = _inputs.offset;
        }
        if (typeof currentResults === 'undefined') {
            // console.log("Resetting results");
            currentResults = [];
        }
        
        // For now, first do a run of limit 100 with 0 offset, then a run of limit 1000000 and 100 offset
        
        let _limit = 100; // start with 100
        if(_inputs.titleRaw.trim().length < 1 
                || _inputs.searchOption==="C" 
                || _offset === 100) {
            _limit = 1000000; // go to 1000000 if this is the second pass (offset of 100) or textless/title-only search
        }

		this.setState({
            searcherInputs: _inputs,
            isDirty: true,
            snippetsDisabled: _inputs.searchOption==="C",
			resultsText: "Loading results...",
			networkError: "" // Clear network error
		}, () => {

            // title-only
            let searchUrl = new URL('text/search', Globals.currentHost);
            
            if(_inputs.searchOption && _inputs.searchOption === "A") {
                searchUrl = new URL('text/search_title_priority', Globals.currentHost);
            } else if(searcherState.searchOption && searcherState.searchOption === "B") {
                searchUrl = new URL('text/search_lucene_priority', Globals.currentHost);
            }

			if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
				this.props.history.push('/login') // Prompt login if no auth token
            }

			let dataToPass = { 
				title: this.state.searcherInputs.titleRaw, 
				// startPublish: this.state.searcherInputs.startPublish,
				// endPublish: this.state.searcherInputs.endPublish,
				// startComment: this.state.searcherInputs.startComment,
				// endComment: this.state.searcherInputs.endComment,
				// agency: this.state.searcherInputs.agency,
				// state: this.state.searcherInputs.state,
				// typeAll: this.state.searcherInputs.typeAll,
				// typeFinal: this.state.searcherInputs.typeFinal,
				// typeDraft: this.state.searcherInputs.typeDraft,
				// typeOther: this.state.searcherInputs.typeOther,
				// needsComments: this.state.searcherInputs.needsComments,
				// needsDocument: this.state.searcherInputs.needsDocument,
                limit: _limit,
                offset: _offset
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
                    needsDocument: this.state.searcherInputs.needsDocument,
                    limit: _limit,
                    offset: _offset
                };
            }

            this.setState({
                searching: true
            }, () => {
                //Send the AJAX call to the server
                // console.log("Running with offset: " + _offset + " and limit: " + this.state.searcherInputs.limit + " and searching state: " + this.state.searching);


                axios({
                    method: 'POST', // or 'PUT'
                    url: searchUrl,
                    // data: this.state.searcherInputs // data can be `string` or {object}
                    data: dataToPass
                }).then(response => {
                    let responseOK = response && response.status === 200;
                    if (responseOK) {
                        return response.data;
                    } else if (response.status === 204) {  // Probably invalid query due to misuse of *, "
                        this.setState({
                        resultsText: "No results: Please check use of * and \" characters"
                    })
                    } else {
                        return null;
                    }
                }).then(parsedJson => {
                    // console.log('this should be json', parsedJson);
                    if(parsedJson){

                        currentResults = currentResults.concat(parsedJson);

                        // console.log("Setup data");
                        let _data = [];
                        if(currentResults){
                            if(currentResults[0] && currentResults[0].doc) {
                                _data = currentResults.map((result, idx) =>{
                                    let doc = result.doc;
                                    let newObject = {title: doc.title, 
                                        agency: doc.agency, 
                                        commentDate: doc.commentDate, 
                                        registerDate: doc.registerDate, 
                                        state: doc.state, 
                                        documentType: doc.documentType, 
                                        filename: doc.filename, 
                                        commentsFilename: doc.commentsFilename,
                                        size: doc.size,
                                        id: doc.id,
                                        folder: doc.folder,
                                        plaintext: result.highlight,
                                        name: result.filename,
                                        relevance: idx
                                    };
                                    return newObject;
                                }); 
                            }
                        }

                        this.setState({
                            searchResults: _data,
                            outputResults: _data,
                            resultsText: currentResults.length + " Results",
                        });
                        
                        // If we got less results than our limit allowed, this could be because of
                        // the new results condensing.  Therefore we need a new way to know if we
                        // actually ran out of results.
                        // if (parsedJson.length < this.state.searcherInputs.limit) {

                        // With this logic we will always run at least two searches, however the second
                        // search may instantly return with no new results so there isn't much harm
                        // if limit is maxed we can stop
                        if (_limit === 1000000) { 
                            this.setState({
                                searching: false
                            //     searchResults: currentResults,
                            //     resultsText: currentResults.length + " Results",
                            }, () => {
                                this.filterResultsBy(searcherState);
                            });
                            console.log("Search done");
                        } else {
                            // offset for next run should be incremented by previous limit used
                            this.search(searcherState, _offset + _limit, currentResults);
                        }


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
                    } else {
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
                // .finally(x => {
                //     this.setState({
                //         searching: false
                //     });
                // });
            });

            // axios({
            //     method: 'POST', // or 'PUT'
            //     url: searchUrl,
            //     // data: this.state.searcherInputs // data can be `string` or {object}
            //     data: dataToPass
            // }).then(response => {
            //     let responseOK = response && response.status === 200;
            //     if (responseOK) {
            //         return response.data;
            //         } else if (response.status === 204) {  // Probably invalid query due to misuse of *, "
            //         this.setState({
            //             resultsText: "No results: Please check use of * and \" characters"
            //         })
            //     } else {
            //         return null;
            //     }
            // }).then(parsedJson => {
            //     // console.log('this should be json', parsedJson);
            //     if(parsedJson){
            //         this.setState({
            //             searchResults: parsedJson,
            //             resultsText: parsedJson.length + " Results",
            //         });
            //     }
            // }).catch(error => { // If verification failed, it'll be a 403 error (includes expired tokens) or server down
            //     console.error('Server is down or verification failed.', error);
            //     this.setState({
            //         networkError: 'Server is down or you may need to login again.'
            //     });
            //     this.setState({
            //         resultsText: "Error: Couldn't get results from server"
            //     });
            // }).finally(x => {
            //     this.setState({
            //         searching: false
            //     });
            // });
		
        });
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
			} else { // 403
				// this.props.history.push('/login');
			}
		})
		.finally(() => {
			// console.log("Returning... " + result);
		});
		// console.log("App check");
	}
	

	render() {
		if(this.state.verified){

			return (
				<div id="app-content">
					<label className="errorLabel">{this.state.networkError}</label>
                    <Search 
                        search={this.search} 
                        filterResultsBy={this.filterResultsBy} 
                        searching={this.state.searching} 
                        useOptions={this.state.useSearchOptions}
                        optionsChanged={this.optionsChanged}
                    />
                    <CardResults 
                        sort={this.sort}
                        results={this.state.outputResults} 
                        resultsText={this.state.resultsText} 
                        searching={this.state.searching}
                        snippetsDisabled={this.state.snippetsDisabled} 
                    />
				</div>
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
            console.log("Old results", rehydrate);
            this.setState(
                rehydrate
            );
        }
        catch(e) {
            // do nothing
        }
    }
    
    async componentWillUnmount() {
        console.log("Unmount app");
        this._mounted = false;

        // Option: Rehydrate if not interrupting a search
        if(!this.state.searching){
            persist.setItem('results', JSON.stringify(this.state));
        }
    }
	
}

export default App;
