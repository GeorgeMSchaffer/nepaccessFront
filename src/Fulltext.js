import React from 'react';
import axios from 'axios';

import FulltextResults from './FulltextResults.js';
import FulltextSearcher from './FulltextSearcher.js';

// import './App.css';
import './login.css';
import './fulltext.css';

import Globals from './globals.js';

class Fulltext extends React.Component {

	state = {
		resultsText: 'Results',
		networkError: ''
	}

	/** Fulltext search(String searcherState) */
	search = (searcherState) => {
		if(!searcherState || !searcherState.terms || searcherState.terms.length == 0){
			return;
		}
		// console.log("In search :");
		// console.log(searcherState);

		this.setState({
			terms: searcherState.terms,
			context: searcherState.context,
			resultsText: "Loading results...",
			networkError: "" // Clear network error
		}, () => {
			var searchUrl;
			if(searcherState.context){
				searchUrl = new URL('text/fulltext_meta', Globals.currentHost);
			} else {
				searchUrl = new URL('text/full', Globals.currentHost);
			}

			if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
				this.props.history.push('/login') // Prompt login if no auth token
			}

			//Send the AJAX call to the server
			axios({
				url: searchUrl,
				method: 'POST', 
				data: this.state.terms,
				headers:{
					'Content-Type': 'application/json; charset=utf-8'
				}
			}).then(response => {
				let responseOK = response && response.status === 200;
				if (responseOK) {
					return response.data;
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
				else {
					this.setState({
						resultsText: "Unknown error: Couldn't parse results"
					});
				}
			}).catch(error => {
				console.log(error);
				this.setState({
					networkError: 'Server is down or you may need to login again.'
				});
				this.setState({
					resultsText: "Error: Couldn't get results from server"
				});
			});
			
			// console.log("Out search");
		
		});
	}
	

	check = () => { // check if JWT is expired/invalid
		
		let checkURL = new URL('test/check', Globals.currentHost);

		axios.post(checkURL)
		.then(response => {
			let verified = response && response.status === 200;
			return verified;
		})
		.catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
			if(!err.response){ // Probably no need to redirect to login if server isn't responding
				this.setState({
					networkError: "Server may be down, please try again later."
				});
			} else { // 403
				this.props.history.push('/login');
			}
		});
		return false;
	}
	

	render() {
		// console.log("Fulltext");
		return (
			<div id="app-content">
				<label className="errorLabel">{this.state.networkError}</label>
				<FulltextSearcher search={this.search} updateChecked={this.updateChecked} />
				<FulltextResults results={this.state.searchResults} resultsText={this.state.resultsText} context={this.state.context} />
			</div>
		)
	}
	
	// After render
	componentDidMount() {
		this.check();
	}
	
}

export default Fulltext;
