import React from 'react';
// import { Link } from 'react-router-dom';
import {Helmet} from 'react-helmet';

import axios from 'axios';

import SearchProcessResults from './SearchProcessResults.js';
import Search from './Search.js';

import Footer from './Footer.js';

import './User/login.css';

import Globals from './globals.js';
import persist from './persist.js';

const _ = require('lodash');

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
        geoResults: null,
        geoLoading: true,
        count: 0,
		resultsText: 'Results',
		networkError: '',
        parseError: '',
		verified: false,
        searching: false,
        useSearchOptions: false,
        snippetsDisabled: false,
        shouldUpdate: false,
        loaded: false,
        down: false,
        isMapHidden: false
    }
    
    constructor(props){
        super(props);
        this.endRef = React.createRef();
        // this.getGeoDebounced = _.debounce(this.getGeoData,1000);
        this.getGeoDebounced = _.debounce(this.getAllGeoData,1000);
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

    _finalCount = "";
    _draftCount = "";
    _eaCount = "";
    _noiCount = "";
    _rodCount = "";
    _scopingCount = "";

    resetTypeCounts = () => {
       this._finalCount = "";
       this._draftCount = "";
       
       this._eaCount = "";
       this._noiCount = "";
       this._rodCount = "";
       this._scopingCount = "";
    }

    optionsChanged = (val) => {
        this.setState({
            useSearchOptions: val
        });
    }

    countTypes = () => {
        let finals = 0;
        let drafts = 0;
        let eas = 0;
        let rods = 0;
        let nois = 0;
        let scopings = 0;

        this.state.searchResults.forEach(process => {
            process.records.forEach(item => {
                if(Globals.isFinalType(item.documentType)) {
                    finals++;
                }
                else if(Globals.isDraftType(item.documentType)) {
                    drafts++;
                }
                else if(matchesEa(item.documentType)) {
                    eas++;
                }
                else if(matchesRod(item.documentType)) {
                    rods++;
                }
                else if(matchesScoping(item.documentType)) {
                    scopings++;
                } else if(matchesNOI(item.documentType)) {
                    nois++;
                }
            })
        })

        this._finalCount = "("+finals+")";
        this._draftCount = "("+drafts+")";
        this._eaCount = "("+eas+")";
        this._rodCount = "("+rods+")";
        this._noiCount = "("+nois+")";
        this._scopingCount = "("+scopings+")";
        // this.setState({finalCount: "("+count+")"});
    }

    /** Get all state/county geodata. Doesn't hit backend if we have the data in state. */
    getAllGeoData = () => {
        if(!this.state.geoResults || !this.state.geoResults[0]) {
            let url = Globals.currentHost + "geojson/get_all_state_county";

            axios.get(url).then(response => {
                if(response.data && response.data[0]) {
                    for(let i = 0; i < response.data.length; i++) {
                        // console.log(response.data[i].count); // TODO: use count
                        let json = JSON.parse(response.data[i]['geojson']);
                        json.style = {};
                        json.sortPriority = 0;

                        if(json.properties.COUNTYFP) {
                            json.originalColor = "#3388ff";
                            json.style.color = "#3388ff"; // county: default (blue)
                            json.style.fillColor = "#3388ff";
                            json.sortPriority = 5;
                        } else if(json.properties.STATENS) {
                            json.originalColor = "#000";
                            json.style.color = "#000"; // state: black
                            json.style.fillColor = "#000";
                            json.sortPriority = 4;
                        } else {
                            json.originalColor = "#D54E21";
                            json.style.color = "#D54E21";
                            json.style.fillColor = "#D54E21";
                            json.sortPriority = 6;
                        }
                        response.data[i] = json;
                    }

                    let sortedData = response.data.sort((a, b) => parseInt(a.sortPriority) - parseInt(b.sortPriority));
                    
                    // console.log("Called for geodata", sortedData);
                    this.setState({
                        geoResults: sortedData,
                        geoLoading: false
                    });
                } else {
                    this.setState({
                        geoLoading: false
                    });
                }
            });
        }
    }

    // legacy logic got geodata + counts from the backend, every time the results changed incl. filtering
    // getGeoData = (filteredResults) => {
    //     if(filteredResults) {
            
    //         let _ids = [];
    //         filteredResults.forEach(process => {
    //             process.records.forEach(record => {
    //                 _ids.push(record.id);
    //             })
    //         })
            
    //         let url = Globals.currentHost + "geojson/get_all_state_county_for_eisdocs";

    //         axios.post(url, { ids: _ids } ).then(response => {
    //             if(response.data && response.data[0]) {
    //                 for(let i = 0; i < response.data.length; i++) {
    //                     // console.log(response.data[i].count); // TODO: use count
    //                     let json = JSON.parse(response.data[i]['geojson']);
    //                     json.style = {};
    //                     json.sortPriority = 0;
    //                     json.count = response.data[i]['count'];

    //                     if(json.properties.COUNTYFP) {
    //                         json.style.color = "#3388ff"; // county: default (blue)
    //                         json.style.fillColor = "#3388ff";
    //                         json.sortPriority = 5;
    //                     } else if(json.properties.STATENS) {
    //                         json.style.color = "#000"; // state: black
    //                         json.style.fillColor = "#000";
    //                         json.sortPriority = 4;
    //                     } else {
    //                         json.style.color = "#D54E21";
    //                         json.style.fillColor = "#D54E21";
    //                         json.sortPriority = 6;
    //                     }
    //                     response.data[i] = json;
    //                 }

    //                 let sortedData = response.data.sort((a, b) => parseInt(a.sortPriority) - parseInt(b.sortPriority));
                    
    //                 // console.log("Called for geodata", sortedData);
    //                 this.setState({
    //                     geoResults: sortedData,
    //                     geoLoading: false
    //                 });
    //             } else {
    //                 this.setState({
    //                     geoResults: null,
    //                     geoLoading: false
    //                 });
    //             }
    //         });

            
    //     } 
    // }

    /** Design: Search component calls this parent method which controls
    * the results, which gives a filtered version of results to SearchResults */
    filterResultsBy = (searcherState) => {
        this._searcherState = searcherState; // for live filtering
        // Only filter if there are any results to filter
        if(this.state.searchResults && this.state.searchResults.length > 0) {

            const filtered = Globals.doFilter(searcherState, this.state.searchResults, this.state.searchResults.length, false);
            
            
            // Even if there are no filters active we still need to update to reflect this,
            // because if there are no filters the results must be updated to the full unfiltered set
            this.setState({
                outputResults: filtered.filteredResults,
                // geoResults: null,
                // geoLoading: true,
                resultsText: filtered.textToUse,
                shouldUpdate: true
            }, () => {
                // this.getGeoDebounced(filtered.filteredResults);
                this.getGeoDebounced();
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
        // console.log("Sorting");
        this.setState({
            // searchResults: this.state.searchResults.sort((a, b) => (a[field] > b[field]) ? 1 : -1)
            outputResults: this.state.outputResults.sort((this.alphabetically(field, ascending))),
            shouldUpdate: true
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

    /** Rebuild results into process-oriented results, where a new object property is created for every process ID.
     * It's basically a hashmap where the processIDs are keys.
     * A new unique key is created if there is no process.
     * So results returned look like: results{ 
     *  key: {title: "", agency: "", state: "", relevance: #, date?: ..., records: [...]},
     *  otherKey: {...}, ...
     * }
     * 
     * can iterate over a results object later using forEach() if you transform the object into an array first, 
     * using Object.keys(), Object.values(), or Object.entries() 
     */
    buildData = (data) => {
        let processResults = {};
        let newUniqueKey = -1;

        data.forEach(datum => {
            // Use process IDs as keys
            let key = datum.processId;

            // Set impossible process ids as keys for records without one and use them as "solo" process items
            if(key === null || key === 0) {
                key = newUniqueKey;
                newUniqueKey = newUniqueKey - 1;
            } 

            // Init if necessary
            if(!processResults[key]) {
                processResults[key] = {records: [], processId: key, isProcess: true};
            }
            if(key < 0) { // Solo process, use ID
                processResults[key].processId = datum.id;
                processResults[key].isProcess = false;
            }

            // Assign latest date and latest title at the same time
            if(!processResults[key].registerDate && datum.registerDate) {
                processResults[key].registerDate = datum.registerDate;
                processResults[key].title = datum.title;
            } else if(datum.registerDate && 
                        processResults[key].registerDate && 
                        processResults[key].registerDate < datum.registerDate) {
                processResults[key].registerDate = datum.registerDate;
                processResults[key].title = datum.title;
            }
            
            // Try to simply get first non-null county, if available (if multiple choices, we don't know which is
            // the most accurate)
            if(!processResults[key].county) {
                processResults[key].county = datum.county;
            }


            // Add record to array of records for this "key"
            processResults[key].records.push(datum);

            // Lowest number = highest relevance; keep the highest relevance.  All datums have a relevance value.
            if(processResults[key].relevance) { // already have relevance: use lowest
                processResults[key].relevance = Math.min(datum.relevance,processResults[key].relevance)
            } else { // don't have relevance yet: init
                processResults[key].relevance = datum.relevance;
            }

            // Assume state and agency are consistent
            if(!processResults[key].agency) {
                processResults[key].agency = datum.agency;
            }
            if(!processResults[key].state) {
                processResults[key].state = datum.state;
            }

            // titles change, which makes everything harder.
            // This logic just assigns the first final type's title as the title.
            // if(!processResults[key].title) {
            //     processResults[key].title = _title;
            // } else if(Globals.isFinalType(datum.documentType)) {
            //     processResults[key].title = datum.title;
            // }
        });
        
        // Have to "flatten" and also sort that by relevance
        return Object.values(processResults).sort(function(a,b){return a.relevance - b.relevance;});
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

        // throw out anything we really don't want to support/include
        searcherState.titleRaw = preProcessTerms(searcherState.titleRaw);

        // Parse terms, set to what Lucene will actually use for full transparency.  Disabled on request
        // const oldTerms = searcherState.titleRaw;

        // axios({
        //     method: 'GET', 
        //     url: Globals.currentHost + 'text/test_terms',
        //     params: {
        //         terms: searcherState.titleRaw
        //     }
        // }).then(response => {

        //     if(response.data !== oldTerms && "\""+response.data+"\"" !== oldTerms) {
        //         searcherState.titleRaw = response.data; // escape terms

        //         this.setState({
        //             parseError: 'Special characters were escaped to avoid parsing error.  Old search terms: ' + oldTerms
        //         })
        //     } else {
        //         this.setState({
        //             parseError: ''
        //         })
        //     }
            
        // reset sort
        this._sortVal = "relevance"; 
        this._ascVal = true;

        this._canceled = false;
        this._searcherState = searcherState; // for live filtering

        this.resetTypeCounts();
        
        // 0: Get top 100 results
        // 1: Collect contextless results
        //        - Consolidate all of the filenames by metadata record into singular results
        //          (maintaining original order by first appearance)
        this.startSearch(searcherState);
        // 2: Begin collecting text fragments 10-100 at a time or all for current page,  
        //          assign accordingly, in a cancelable recursive function
        //          IF TITLE ONLY SEARCH: We can stop here.

        // }).catch(error => {
        //     console.error(error);
        // })

    }

    /** Just get the top results quickly before launching the "full" search with initialSearch() */
    startSearch = (searcherState) => {
        if(!this._mounted){ // User navigated away or reloaded
            return;
        }

		this.setState({
            // Fresh search, fresh results
            outputResults: [],
            // geoResults: null,
            count: 0,
            searcherInputs: searcherState,
            snippetsDisabled: searcherState.searchOption==="C",
			resultsText: "Loading results...",
            networkError: "", // Clear network error
            searching: true,
            shouldUpdate: true
		}, () => {
            // title-only
            let searchUrl = new URL('text/search', Globals.currentHost);
            
            // For the new search logic, the idea is that the limit and offset are only for the text
            // fragments.  The first search should get all of the results, without context.
            // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
            // properly
            if(searcherState.searchOption && searcherState.searchOption === "A") {
                searchUrl = new URL('text/search_top', Globals.currentHost);
            } else if(searcherState.searchOption && searcherState.searchOption === "B") {
                searchUrl = new URL('text/search_top', Globals.currentHost);
            }

            this._searchTerms = this.state.searcherInputs.titleRaw;

            // Update query params
            // We could also probably clear them on reload (component will unmount) if anyone wants
            let currentUrlParams = new URLSearchParams(window.location.search);
            currentUrlParams.set('q', this._searchTerms);
            this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());

			let dataToPass = { 
				title: this._searchTerms
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

            dataToPass.title = postProcessTerms(dataToPass.title);

            // Proximity search from UI - surround with quotes, append ~#
            if(!this.state.searcherInputs.proximityDisabled && this.state.searcherInputs.proximityOption)
            {
                if(this.state.searcherInputs.proximityOption.value >= 0) {
                    try {
                        dataToPass.title = 
                            ("\"" + dataToPass.title + "\"~" + this.state.searcherInputs.proximityOption.value);
                    } catch(e) {
                        
                    }
                }
            }

            //Send the AJAX call to the server
            let shouldContinue = true;

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
                } else if(response.status === 403) {
                    // Not logged in
                    Globals.emitEvent('refresh', {
                        loggedIn: false
                    });
                } else if(response.status === 202) {
                    shouldContinue = false; // found all results already
                    return response.data;
                } else {
                    console.log(response.status);
                    return null;
                }
            }).then(currentResults => {
                let _data = [];
                if(currentResults && currentResults[0] && currentResults[0].doc) {
                    // console.log("Raw results",currentResults);
                    
                    _data = currentResults
                    // .filter((result) => { // Soft rollout logic
                    //     return result.doc.size > 200; // filter out if no files (200 bytes or less)
                    // })
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
                            luceneIds: result.ids,
                            folder: doc.folder,
                            plaintext: result.highlights,
                            name: result.filenames,

                            link: doc.link,
                            firstRodDate: doc.firstRodDate,
                            processId: doc.processId,
                            notes: doc.notes,
                            status: doc.status,
                            subtype: doc.subtype,
                            county: doc.county,

                            relevance: idx + 1 // sort puts "falsy" values at the bottom incl. 0
                        };
                        return newObject;
                    }); 

                    // Important: This is where we're shifting to process-based results.
                    let processResults = {};
                    processResults = this.buildData(_data);
                    _data = processResults;
                    // console.log("Process oriented results flattened",_data);

                    // At this point we don't need the hashmap design anymore, it's just very fast for its purpose.
                    // Now we have to iterate through all of it anyway, and it makes sense to put it in an array.

                    this.setState({
                        searchResults: _data,
                        outputResults: _data,
                    }, () => {
                    
                        // title-only (or blank search===no text search at all): return
                        if(Globals.isEmptyOrSpaces(dataToPass.title) || 
                                (searcherState.searchOption && searcherState.searchOption === "C"))
                        {
                            this.filterResultsBy(this._searcherState);
                            this.countTypes();

                            this.setState({
                                searching: false,
                                snippetsDisabled: true,
                                shouldUpdate: true
                            });
                        } else if(!shouldContinue) {
                            // got all results already, so stop searching and start highlighting.
                            this.filterResultsBy(this._searcherState);
                            this.countTypes();
                        
                            this._searchId = this._searchId + 1;
                            // console.log("Launching fragment search ",this._searchId);
                            this.gatherHighlightsFVH(this._searchId, 0, searcherState, _data);
                        } else {
                            this.initialSearch(searcherState);
                        }
                    });
                } else {
                    // console.log("No results");
                    this.setState({
                        searching: false,
                        searchResults: [],
                        outputResults: [],
                        resultsText: "No results found for " + this._searchTerms + " (try adding OR between words for less strict results?)"
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
                } else if (error.response && error.response.status === 403) { // token expired?
                    this.setState({
                        resultsText: "Error: Please login again (session expired)"
                    });
                    Globals.emitEvent('refresh', {
                        loggedIn: false
                    });
                } else if(error.response && error.response.status === 400) { // bad request
                    this.setState({
                        networkError: Globals.errorMessage.default,
                        resultsText: "Couldn't parse terms, please try removing any special characters"
                    });
                } else {
                    this.setState({
                        networkError: Globals.errorMessage.default,
                        resultsText: "Error: Couldn't get results from server"
                    });
                }
                this.setState({
                    searching: false
                });
            })
    
        });
    }

    /** Populates full results without text highlights and then starts the highlighting process */
    initialSearch = (searcherState) => {
        if(!this._mounted){ // User navigated away or reloaded
            return;
        }

        console.log("initialSearch");

        let searchUrl = new URL('text/search_no_context', Globals.currentHost);

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

        dataToPass.title = postProcessTerms(dataToPass.title);

        // Proximity search from UI - surround with quotes, append ~#
        if(!this.state.searcherInputs.proximityDisabled && this.state.searcherInputs.proximityOption)
        {
            if(this.state.searcherInputs.proximityOption.value >= 0) {
                try {
                    dataToPass.title = 
                        ("\"" + dataToPass.title + "\"~" + this.state.searcherInputs.proximityOption.value);
                } catch(e) {
                    
                }
            }
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
            } else if(response.status === 403) {
                // Not logged in
                Globals.emitEvent('refresh', {
                    loggedIn: false
                });
            
            } else {
                console.log(response.status);
                return null;
            }
        }).then(currentResults => {
            let _data = [];
            if(currentResults && currentResults[0] && currentResults[0].doc) {
                
                _data = currentResults
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
                        luceneIds: result.ids,
                        folder: doc.folder,
                        plaintext: result.highlights,
                        name: result.filenames,

                        link: doc.link,
                        firstRodDate: doc.firstRodDate,
                        processId: doc.processId,
                        notes: doc.notes,
                        status: doc.status,
                        subtype: doc.subtype,
                        county: doc.county,

                        relevance: idx + 1 // sort puts "falsy" values at the bottom incl. 0
                    };
                    return newObject;
                }); 

                // Important: This is where we're shifting to process-based results.
                let processResults = {};
                processResults = this.buildData(_data);
                _data = processResults;

                this.setState({
                    searchResults: _data,
                    outputResults: _data,
                    resultsText: _data.length + " Results",
                }, () => {
                    this.filterResultsBy(this._searcherState);
                    // console.log("Mapped data",_data);

                    this.countTypes();
                
                    this._searchId = this._searchId + 1;
                    // console.log("Launching fragment search ",this._searchId);
                    this.gatherHighlightsFVH(this._searchId, 0, searcherState, _data);
                });
            } else {
                // console.log("No results");
                this.setState({
                    searching: false,
                    searchResults: [],
                    outputResults: [],
                    resultsText: "No results found for " + this._searchTerms + " (try adding OR between words for less strict results?)"
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
            } else if (error.response && error.response.status === 403) { // token expired?
                this.setState({
                    resultsText: "Error: Please login again (session expired)"
                });
                Globals.emitEvent('refresh', {
                    loggedIn: false
                });
            } else if(error.response && error.response.status === 400) { // bad request
                this.setState({
                    networkError: Globals.errorMessage.default,
                    resultsText: "Couldn't parse terms, please try removing any special characters"
                });
            } else {
                this.setState({
                    networkError: Globals.errorMessage.default,
                    resultsText: "Error: Couldn't get results from server"
                });
            }
            this.setState({
                searching: false
            });
        })
    }
    

    //     // Possible logic: 
    //     // 1. Send list of objects with filename + EISDoc ID.
    //     // Offset determines how many objects to send at a time.
    //     // They have to match the order that the frontend displays the filenames in, per card.
    //     // Getting highlights for page user is on, debounced, would be cool, but could be difficult.
    //     // Adding spinner as placeholder for highlights would also be cool.
    //     // 2. Backend gets text by matching on given list of data, and gets highlights from texts.
    //     // 3. Backend sends list of objects containing filename, EISDoc ID, highlight.
    //     // 4. Frontend receives, matches, updates highlights.

    //     // There shouldn't be any cause for giving the entire result set back to the backend.
    //     // Other logic would be to expect only highlights back in a particular order.  However sorting
    //     // would complicate this in several ways.

    

    // Because this seems so optimized on the backend now, we'll try getting 1000 at once after the first page.
    gatherHighlightsFVH = (searchId, _offset, _inputs, currentResults) => {
        if(!this._mounted){ // User navigated away or reloaded
            return; // cancel search
        }
        if(searchId < this._searchId) { // Search interrupted
            return; // cancel search
        }
        if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
            // this.props.history.push('/login'); // Prompt login if no auth token
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
            // console.log("Nothing left to highlight",currentResults);
            this.setState({
                searching: false,
                resultsText: resultsText,
                shouldUpdate: true
            }, () => {
                this.filterResultsBy(this._searcherState);
            });
            return;
        }

        let _limit = 1000; // normally get 1000
        if(_offset === 0) {
            _limit = 10; // start with 10
        } else if(_offset === 10) {
            _limit = 990;
        }

        this.setState({
            snippetsDisabled: false,
			resultsText: currentResults.length + " Results.  Getting Text Snippets...",
            networkError: "", // Clear network error
		}, () => {
            
            // For the new search logic, the idea is that the limit and offset are only for the text
            // fragments.  The first search should get all of the results, without context.
            // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
            // properly
            let searchUrl = new URL('text/get_highlightsFVH', Globals.currentHost);

            // TODO: Gather limit # IDs and filenames starting at offset # from current results,
            // feed as data.  Because we're deciding what we want from the backend, offset is handled
            // locally.
            let _unhighlighted = [];
            for(let i = _offset; i < Math.min(currentResults.length, _offset + _limit); i++){
                for(let j = 0; j < currentResults[i].records.length; j++) {
                    // Push Lucene IDs and >-delimited list of filenames
                    if(!Globals.isEmptyOrSpaces(currentResults[i].records[j].name)) {
                        // console.log("Pushing",i,j,currentResults[i].records[j].id);
                        _unhighlighted.push(
                            {
                                luceneIds: currentResults[i].records[j].luceneIds, 
                                filename: currentResults[i].records[j].name
                            }
                        );
                    }
                }
            }


            // If nothing to highlight in this batch, skip to next run
            if(_unhighlighted.length === 0) {
                if(searchId < this._searchId) {
                    return;
                } else {
                    this.gatherHighlightsFVH(searchId, _offset + _limit, _inputs, currentResults);
                }
                return;
            }

			let dataToPass = 
            { 
				unhighlighted: _unhighlighted,
                terms: postProcessTerms(_inputs.titleRaw),
                markup: _inputs.markup,
                fragmentSizeValue: _inputs.fragmentSizeValue
            };

            // console.log("For backend",dataToPass);

            //Send the AJAX call to the server
            axios({
                method: 'POST', // or 'PUT'
                url: searchUrl,
                data: (dataToPass)
            }).then(response => {
                let responseOK = response && response.status === 200;
                if (responseOK) {
                    return response.data;
                } else {
                    return null;
                }
            }).then(parsedJson => {
                if(parsedJson){
                    // Incoming data is an array of arrays of text fragments, so for example if a record has 4 file hits,
                    // we expect it to get an array of 4 fragments.
                    // Since it goes out and comes back in in order of relevance and that's how we maintain the association
                    // during multiple calls, we'd have to be aware of that if rearranging internal file
                    // or record order to not be by relevance (safest would be only rearranging after getting all fragments)
                    // console.log("Processing results", parsedJson.length);
                    let updatedResults = this.state.searchResults;

                    // IMPORTANT: Redone to accommodate for process view of course
                    // Fill highlights here; update state
                    // Presumably comes back in order it was sent out, so we could just do this?:
                    let x = 0;
                    for(let i = _offset; i < Math.min(currentResults.length, _offset + _limit); i++) {
                        for(let j = 0; j < currentResults[i].records.length; j++) {
                            // If search is interrupted, updatedResults[i] may be undefined (TypeError)
                            if(!Globals.isEmptyOrSpaces(currentResults[i].records[j].name)){
                                // console.log("Assigning",i,j,currentResults[i].records[j].name);
                                updatedResults[i].records[j].plaintext = parsedJson[x];
                                x++;
                            }
                        }
                    }
                    
                    // Verify one last time we want this before we actually commit to these results
                    if(searchId < this._searchId) {
                        return;
                    } else {
                        this.setState({
                            searchResults: updatedResults,
                            outputResults: updatedResults,
                            count: _offset,
                            // shouldUpdate: false
                        }, () => {
                            if(this._sortVal) {
                                this.sortDataByField(this._sortVal, this._ascVal);
                            }
                            this.filterResultsBy(this._searcherState);
                        });
                        
                        // offset for next run incremented by limit used
                        this.gatherHighlightsFVH(searchId, _offset + _limit, _inputs, updatedResults);
                    }
                }
            }).catch(error => { 
                if(error.name === 'TypeError') {
                    console.error(error);
                } else { // Server down or 408 (timeout)
                    console.error('Server is down or verification failed.', error);
                    let _networkError = 'Server is down or you may need to login again.';
                    let _resultsText = Globals.errorMessage.default;

                    if(error.response && error.response.status === 408) {
                        _networkError= 'Request has timed out.';
                        _resultsText = 'Timed out';
                    }

                    this.setState({
                        networkError: _networkError,
                        resultsText: _resultsText,
                        searching: false,
                        shouldUpdate: true
                    });
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


    /** Currently this should always get a 200 back since searches were allowed when not logged in. */
	check = () => { // check if JWT is expired/invalid
		
        this.setState({loaded:false,down:false});

		let checkURL = new URL('test/check', Globals.currentHost);
		let result = false;
		axios.post(checkURL)
		.then(response => {
			result = response && response.status === 200;
			this.setState({
				verified: result,
			})
		})
		.catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
			if(!err.response){ // server isn't responding
				this.setState({
					networkError: Globals.errorMessage.default,
                    shouldUpdate: true,
                    down: true
				});
			} else if(err.response && err.response.status===403) {
                this.setState({
                    verified: false,
                    shouldUpdate: true
                });
                // this.props.history.push('/login');
                // this.setState({
                //     networkError: Globals.errorMessage.auth,
                //     shouldUpdate: true
                // });
            }
		})
		.finally(() => {
            this.setState({loaded:true});
			// console.log("Returning... " + result);
		});
		// console.log("App check");
    }
    
    /** Scroll to bottom on page change and populate full table with latest results */
    scrollToBottom = (_rows) => {
        try {
            // console.log("Page update");
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
                displayRows: _rows,
                shouldUpdate: true
            }, () => {
                setTimeout(() => {
                    this.endRef.current.scrollIntoView({ behavior: 'smooth' })
                }, 100);
            });
        } catch(e) {
            console.log("Scroll error", e);
        }
    }

    scrollToTop = () => {
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch(e) {
            console.log("Scroll error", e);
        }
    }


    displayedRowsUnpopulated = () => {
        // console.log("Checking displayed rows...");
        for(let i = 0; i < this.state.displayRows.length; i++) {
            // console.log(this.state.displayRows[i].data);
            if(this.state.displayRows[i].data.plaintext.length === 0){
                console.log("No text.  Should populate.");
                return true;
            }
        }

        return false;
    }

    /** Flattens results to relevant fields for basic users */
    exportToCSV = () => {
        if(this.state.outputResults && this.state.outputResults.length > 0) {
            const resultsForDownload = this.state.outputResults.map((process, idx) => {
                let newResult = process.records.map((result, idx) => {
                    let newRecord = {
                        title: result.title,
                        documentType: result.documentType,
                        registerDate: result.registerDate,
                        agency: result.agency,
                        cooperating_agency: result.cooperatingAgency,
                        state: result.state,
                        county: result.county,
                        processId: result.processId
                    }
                    if(!newRecord.processId) { // don't want to imply zeroes are valid
                        newRecord.processId = '';
                    }
                    return newRecord;
                });
                return newResult;
                
            });

            // flatten, sort, convert to TSV, download
            this.downloadResults(Globals
                .jsonToCSV(resultsForDownload
                    .flat() // have to flatten from process structure
                    .sort((a, b) => a.title.localeCompare(b.title)) // just sort by title?
                ), 'csv'
            );
        }
    }

    /** Flattens process-oriented data to download as record metadata */
    downloadCurrentAsTSV = () => {
        if(this.state.outputResults && this.state.outputResults.length > 0) {
            const resultsForDownload = this.state.outputResults.map((process, idx) => {
                let newResult = process.records.map((result, idx) => {
                    let newRecord = {
                        id: result.id,
                        title: result.title,
                        documentType: result.documentType,
                        registerDate: result.registerDate,
                        agency: result.agency,
                        cooperating_agency: result.cooperatingAgency,
                        state: result.state,
                        county: result.county,
                        processId: result.processId,
                        notes: result.notes,
                        status: result.status,
                        folder: result.folder,
                        size: result.size
                    }
                    if(!newRecord.processId) { // don't want to imply zeroes are valid
                        newRecord.processId = '';
                    }
                    return newRecord;
                });
                return newResult;
                
            });

            // flatten, sort, convert to TSV, download
            this.downloadResults(Globals
                .jsonToTSV(resultsForDownload
                    .flat() // have to flatten from process structure
                    .sort( 
                        function(a, b) { // sort by ID
                            return a.id - b.id;
                        }
                    )
                ), 'tsv'
            );
        }
    }
    // Only works for records, not processes
    // downloadCurrentAsTSVOld = () => {
    //     if(this.state.outputResults && this.state.outputResults.length > 0) {
    //         const resultsForDownload = this.state.outputResults.map((result, idx) => {
    //             // omit stuff like comments, highlights, relevance, lucene stuff
    //             let newResult = {
    //                 id: result.id,
    //                 title: result.title,
    //                 documentType: result.documentType,
    //                 registerDate: result.registerDate,
    //                 agency: result.agency,
    //                 cooperating_agency: result.cooperatingAgency,
    //                 state: result.state,
    //                 // county: result.county,
    //                 // subtype: result.subtype,
    //                 processId: result.processId,
    //                 // link: result.link,
    //                 notes: result.notes,
    //                 // rodDate: result.firstRodDate
    //                 status: result.status,
    //                 folder: result.folder
    //             }
    //             if(!newResult.processId) { // don't want to imply zeroes are valid
    //                 newResult.processId = '';
    //             }
    //             return newResult;
    //         });
    //         this.downloadResults(Globals.jsonToTSV(resultsForDownload));
    //     }
    // }

    // best performance is to Blob it on demand
    downloadResults = (results, fileExt) => {
        if(results) {
            const csvBlob = new Blob([results]);
            const today = new Date().toISOString();
            const csvFilename = `search_results_${today}.${fileExt}`;

    
            if (window.navigator.msSaveOrOpenBlob) {  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
                window.navigator.msSaveBlob(csvBlob, csvFilename);
            }
            else {
                const temporaryDownloadLink = window.document.createElement("a");
                temporaryDownloadLink.href = window.URL.createObjectURL(csvBlob);
                temporaryDownloadLink.download = csvFilename;
                document.body.appendChild(temporaryDownloadLink);
                temporaryDownloadLink.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
                document.body.removeChild(temporaryDownloadLink);
            }

        }
    }
    toggleMapHide = () => {
        this.setState({isMapHidden: !this.state.isMapHidden});
    }
	

	render() {
		if(this.state.verified){

			return (
                <>
				<div id="app-content" className="footer-content">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Search - NEPAccess</title>
                        <meta name="description" content="Search, download, and analyze environmental impact statements and other NEPA documents created under the US National Environmental Policy Act of 1969." />
                        <link rel="canonical" href="https://www.nepaccess.org/search" />
                    </Helmet>
                    <Search 
                        search={this.startNewSearch} 
                        stop={this.stopSearch}
                        filterResultsBy={this.filterResultsBy} 
                        searching={this.state.searching} 
                        useOptions={this.state.useSearchOptions}
                        optionsChanged={this.optionsChanged}
                        count={this.state.count}
                        networkError={this.state.networkError}
                        parseError={this.state.parseError}
                        finalCount={this._finalCount}
                        draftCount={this._draftCount}
                        eaCount={this._eaCount}
                        noiCount={this._noiCount}
                        rodCount={this._rodCount}
                        scopingCount={this._scopingCount}
                    />
                    <SearchProcessResults 
                        sort={this.sort}
                        results={this.state.outputResults} 
                        geoResults={this.state.geoResults}
                        // searcherState={this._searcherState}
                        geoLoading={this.state.geoLoading}
                        resultsText={this.state.resultsText} 
                        searching={this.state.searching}
                        snippetsDisabled={this.state.snippetsDisabled} 
                        scrollToBottom={this.scrollToBottom}
                        scrollToTop={this.scrollToTop}
                        shouldUpdate={this.state.shouldUpdate}
                        download={this.downloadCurrentAsTSV}
                        exportToSpreadsheet={this.exportToCSV}
                        isMapHidden={this.state.isMapHidden}
                        toggleMapHide={this.toggleMapHide}
                    />
				</div>
                <div ref={this.endRef} />
                <Footer id="footer"></Footer>
                </>
			)

		}
        else if(this.state.down) {
            return (
            <div className="content">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Search - NEPAccess</title>
                    <meta name="description" content="Search, download, and analyze environmental impact statements and other NEPA documents created under the US National Environmental Policy Act of 1969." />
                    <link rel="canonical" href="https://www.nepaccess.org/search" />
                </Helmet>
                <div>
                    <label className="logged-out-header">
                        Sorry, the server may be down for maintenance.  Please try reloading the page in a minute.
                    </label>
                </div>
            </div>);
        }
		// else if(this.state.loaded)
		// {
		// 	return (
		// 		<div className="content">
        //             <div>
        //                 <label className="logged-out-header">
        //                     Please <Link to="/login">log in</Link> or <Link to="/register">register</Link> to use NEPAccess.
        //                 </label>
        //             </div>
		// 		</div>
		// 	)
		// }
        else { // show nothing until at least we've loaded
            return (<div className="content">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Search - NEPAccess</title>
                    <meta name="description" content="Search, download, and analyze environmental impact statements and other NEPA documents created under the US National Environmental Policy Act of 1969." />
                    <link rel="canonical" href="https://www.nepaccess.org/search" />
                </Helmet>

                <div className="loader-holder">
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>);
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

function matchesEa(docType) {
    return (
        (docType.toLowerCase() === "ea") );
}

function matchesRod(docType) {
    return (
        (docType.toLowerCase() === "rod") );
}

function matchesScoping(docType) {
    return (
        (docType.toLowerCase() === "scoping report") );
}
function matchesNOI(docType) {
    return (
        (docType.toLowerCase() === "noi") );
}

/** Return modified terms for user to see */
function preProcessTerms(terms) {
    return terms;
}

/** Return modified terms but not for user to see */
function postProcessTerms(terms) {
    return terms.replaceAll(':','');
        // .replaceAll(/(^|[\s]+)US($|[\s]+)/g,' ("U. S." | U.S. | US) ') // this was a very bad idea
        // .replaceAll(/(^|[\s]+)U\.S\.($|[\s]+)/g,' ("U. S." | U.S. | US) ');
}