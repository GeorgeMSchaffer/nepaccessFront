import React from 'react';
import axios from 'axios';

import CombinedResults from './CombinedResults.js';
import UnifiedSearch from './UnifiedSearch.js';

// import './App.css';
import './User/login.css';

import Globals from './globals.js';

class CombinedAB extends React.Component {

	state = {
		searcherInputs: {
			startPublish: '',
			endPublish: '',
			agency: [],
			state: [],
			needsComments: false,
			needsDocument: false,
            limit: '',
            isDirty: false
		},
		searchResults: [],
		resultsText: 'Results',
		networkError: '',
		verified: false,
		searching: false
	}

	search = (searcherState) => {
        let _inputs = searcherState;

        // If search executes with advanced options collapsed, assume user does not want to run with the advanced options
        if(!searcherState.optionsChecked){
            _inputs = Globals.convertToSimpleSearch(searcherState);
        }
		this.setState({
            searcherInputs: _inputs,
            isDirty: true,
			resultsText: "Loading results...",
			networkError: "" // Clear network error
		}, () => {

            let searchUrl = new URL('text/search', Globals.currentHost); // This route uses Lucene on two fields
            
            if(searcherState.searchOption && searcherState.searchOption === "A") {
                searchUrl = new URL('text/search_title_priority', Globals.currentHost);
            } else if(searcherState.searchOption && searcherState.searchOption === "B") {
                searchUrl = new URL('text/search_lucene_priority', Globals.currentHost);
            }

			if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
				this.props.history.push('/login') // Prompt login if no auth token
			}

			let dataToPass = { 
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
				limit: this.state.searcherInputs.limit
            };

            this.setState({
                searching: true
            });
            
			//Send the AJAX call to the server
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
					this.setState({
						searchResults: parsedJson,
						resultsText: parsedJson.length + " Results",
					});
				}
			}).catch(error => { // If verification failed, it'll be a 403 error (includes expired tokens) or server down
				console.error('Server is down or verification failed.', error);
				this.setState({
					networkError: 'Server is down or you may need to login again.'
				});
				this.setState({
					resultsText: "Error: Couldn't get results from server"
				});
			}).finally(x => {
				this.setState({
					searching: false
				});
			});
		
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
		// console.log("App");
		if(this.state.verified){

			return (
				<div id="app-content">
					<label className="errorLabel">{this.state.networkError}</label>
					<UnifiedSearch search={this.search} searching={this.state.searching} />
					<CombinedResults results={this.state.searchResults} resultsText={this.state.resultsText} isDirty={this.state.isDirty} />
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
	}
	
}

export default CombinedAB;
