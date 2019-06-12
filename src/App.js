import React from 'react';
import axios from 'axios';

import SearchResults from './SearchResults.js';
import Searcher from './Searcher.js';

// import './App.css';

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
		searchResults: []
	}

	search = (searcherState) => {
		console.log("In search");
		document.body.style.cursor = 'wait';

		this.setState({
			searcherInputs: searcherState
		}, () => {
			//Send the AJAX call to the server
			let searchUrl = new URL('http://localhost:8080/test/search');
			// This hooks up to current deployment while also working with local dev environment
			// console.log(window.location);
			console.log(window.location.hostname);
			if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
				searchUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/test/search');
			} // else continue with localhost

			console.log(searchUrl);

			// TODO: Pass through universal validator first that can handle multiple types and return sane values
			// Object.keys(this.state.searcherInputs).forEach(key => {
			// 	searchUrl.searchParams.append(key, this.state.searcherInputs[key]);
			// });
			// for(let value in this.state.searcherInputs) {
			// 	console.log(value);
			// 	console.log(this.state.searcherInputs[value]);
			// }


			var token = localStorage.JWT;
			if(token){
				axios.defaults.headers.common['Authorization'] = token;
				// if(false){ // TODO: Test auth token, prompt login if invalid (expired probably)
				// 	this.props.history.push('/login') // Prompt login if expired token
				// }
			} else {
				axios.defaults.headers.common['Authorization'] = null;
				this.props.history.push('/login') // Prompt login if no auth token
			}


			console.log("Inputs");
			console.log(JSON.stringify(this.state.searcherInputs));
			axios({ // TODO: Provide JWT or else redirect user to login/registration
				method: 'POST', // or 'PUT'
				url: searchUrl,
				data: this.state.searcherInputs, // data can be `string` or {object}
				headers:{
					'Content-Type': 'application/json; charset=utf-8'
				}
			}).then(response => {
				let responseOK = response && response.status === 200;
				if (responseOK) {
					console.log("OK");
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
					// TODO: Something broke, maybe try logging in again
                	this.props.history.push('/login')
				}
			}).catch(error => {
				console.error('error message', error);
			});

			document.body.style.cursor = 'default';
			console.log("Out search");
		});
	}

	render() {

		console.log("App rendering");
		return (
			<div id="main">
				<button className="collapsible">
					<span className="button-text">+ Search Criteria</span>
				</button>
				<Searcher search={this.search} />
				<SearchResults results={this.state.searchResults} />
			</div>
		)
	}

	
	check = async () => {
				
		let checkURL = new URL('http://localhost:8080/test/check');
		console.log(window.location.hostname);
		if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
			checkURL = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/test/check');
		}
	
		let verified = false;
		var token = localStorage.JWT;
		if(token){
			axios.defaults.headers.common['Authorization'] = token;
			let response = await axios.post(checkURL);
			verified = response && response.status === 200;
		} else {
			axios.defaults.headers.common['Authorization'] = null;
		}
		refreshNav(verified);
		if(!verified){
			this.props.history.push('/login');
		}
	}
	
	// Onload
	componentDidMount() {
		collapsibles();
		this.check();
	}
	
}

export default App;

// TODO: Animation
function collapsibles(){
	let coll = document.getElementsByClassName("collapsible");
	let i;
	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
		// this.classList.toggle("active");
		let content = this.nextElementSibling;
		if (content.style.display !== "none") {
			content.style.display = "none";
		} else {
			content.style.display = "block";
		}
		});
	}
}

function refreshNav(verified) {
	var loggedOutStyle = "block";
	var loggedInStyle = "block";

	if(verified){
		loggedOutStyle="none";
	} else {
		loggedInStyle="none";
	}

	let loggedOutItems = document.getElementsByClassName("logged-out");
	let i;
	for (i = 0; i < loggedOutItems.length; i++) {
		loggedOutItems[i].style.display = loggedOutStyle;
	}

	let loggedInItems = document.getElementsByClassName("logged-in");
	let j;
	for (j = 0; j < loggedInItems.length; j++) {
		loggedInItems[j].style.display = loggedInStyle;
	}
}