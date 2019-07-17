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
			title: '',
			startPublish: '',
			endPublish: '',
			agency: [],
			state: [],
			needsComments: false
		},
		searchResults: [],
		networkError: ''
	}

	search = (searcherState) => {
		// console.log("In search");
		document.body.style.cursor = 'wait';

		this.setState({
			searcherInputs: searcherState
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

			if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it saves a backend call
				this.props.history.push('/login') // Prompt login if no auth token
			}

			// console.log("Inputs");
			// console.log(JSON.stringify(this.state.searcherInputs));
			//Send the AJAX call to the server
			axios({
				method: 'POST', // or 'PUT'
				url: searchUrl,
				data: this.state.searcherInputs // data can be `string` or {object}
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
						searchResults: parsedJson
					});
				} else {
					// Probably can't get here, if it isn't a 200 it should be some kind of caught error
				}
			}).catch(error => { // If verification failed, it'll be a 403 error (includes expired tokens)
				// console.error('Server is down or verification failed.', error);
				this.props.history.push('/login'); // TODO: Preserve Search state
			});

			document.body.style.cursor = 'default';
			// console.log("Out search");
		});
	}
	
	check = () => { // check if JWT is expired/invalid
		
		let checkURL = new URL('test/check', Globals.currentHost);

		axios.post(checkURL)
		.then(response => {
			// verified = response && response.status === 200;
		})
		.catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT
			// this.setState({
			// 	networkError: "Server may be down, please try again later."
			// });
			this.props.history.push('/login');
		});
	}
	

	render() {
		// console.log("App");
		return (
			<div id="main">
				<label className="errorLabel">{this.state.networkError}</label>
				<button className="collapsible">
					<span className="button-text">- Search Criteria</span>
				</button>
				<Searcher search={this.search} />
				<SearchResults results={this.state.searchResults} />
			</div>
		)
	}

	
	// After render
	componentDidMount() {
		this.check();
		collapsibles();
	}
	
}

export default App;

// TODO: Animation
// TODO: Do this with state
function collapsibles(){
	let coll = document.getElementsByClassName("collapsible");
	let i;
	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
			// this.classList.toggle("active");
			let content = this.nextElementSibling;
			if (content.style.display !== "none") {
				content.style.display = "none";
				this.innerHTML = "+ Search Criteria";
			} else {
				content.style.display = "block";
				this.innerHTML = "- Search Criteria";
			}
		});
	}
}