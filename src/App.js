import React from 'react';
import axios from 'axios';

import SearchResults from './SearchResults.js';
import Searcher from './Searcher.js';

// import './App.css';
import './login.css';

import Globals from './globals.js';

// App and Main could trade names since App is normally the top level class
class App extends React.Component {

	state = {
		searcherInputs: {
			searchMode: '',
			startPublish: '',
			endPublish: '',
			agency: [],
			state: [],
			needsComments: false,
			needsDocument: false,
			limit: ''
		},
		searchResults: [],
		resultsText: 'Results',
		networkError: ''
	}

	search = (searcherState) => {
		// console.log("In search");

		this.setState({
			searcherInputs: searcherState,
			resultsText: "Loading results...",
			networkError: "" // Clear network error
		}, () => {

			// TODO: Sanity check searcherInputs
			// Object.keys(this.state.searcherInputs).forEach(key => {
			// 	searchUrl.searchParams.append(key, this.state.searcherInputs[key]);
			// });
			// for(let value in this.state.searcherInputs) {
			// 	console.log(value);
			// 	console.log(this.state.searcherInputs[value]);
			// }

			let searchUrl = new URL('test/search', Globals.currentHost);

			if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
				this.props.history.push('/login') // Prompt login if no auth token
			}
			let titleToPass = "";
			if(this.state.searcherInputs.searchMode==='natural'){
				titleToPass = this.state.searcherInputs.naturalTitle;
			} else {
				titleToPass = this.state.searcherInputs.booleanTitle;
			}

			let dataToPass = { 
				searchMode: this.state.searcherInputs.searchMode,
				title: titleToPass, 
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

			// console.log("Inputs");
			// console.log(JSON.stringify(this.state.searcherInputs));
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
				// else {
				// 	this.setState({
				// 		resultsText: "Unknown error: Couldn't parse results"
				// 	});
				// }
			}).catch(error => { // If verification failed, it'll be a 403 error (includes expired tokens) or server down
				// console.error('Server is down or verification failed.', error);
				this.setState({
					networkError: 'Server is down or you may need to login again.'
				});
				this.setState({
					resultsText: "Error: Couldn't get results from server"
				});
				// this.props.history.push('/login'); // TODO: Preserve Search state
			});
			
			// console.log("Out search");
		
		});
	}
	

	check = () => { // check if JWT is expired/invalid
		
		let checkURL = new URL('test/check', Globals.currentHost);

		axios.post(checkURL)
		.then(response => {
			// verified = response && response.status === 200;
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
		console.log("App check");
	}
	

	render() {
		// console.log("App");
		return (
			<div id="app-content">
				<label className="errorLabel">{this.state.networkError}</label>
				<Searcher search={this.search} />
				<SearchResults results={this.state.searchResults} resultsText={this.state.resultsText} />
			</div>
		)
	}

	// After render
	componentDidMount() {
		this.check();
	}
	
}

export default App;
