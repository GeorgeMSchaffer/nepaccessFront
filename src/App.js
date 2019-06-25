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
		searchResults: [],
		baseURL: ''
	}

	search = (searcherState) => {
		console.log("In search");
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

			let searchUrl = new URL('test/search', this.state.baseURL);

			var token = localStorage.JWT;
			if(token){
				axios.defaults.headers.common['Authorization'] = token;
			} else {
				axios.defaults.headers.common['Authorization'] = null;
				this.props.history.push('/login') // Prompt login if no auth token
			}
			axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';


			console.log("Inputs");
			console.log(JSON.stringify(this.state.searcherInputs));
			//Send the AJAX call to the server
			axios({
				method: 'POST', // or 'PUT'
				url: searchUrl,
				data: this.state.searcherInputs // data can be `string` or {object}
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
			}).catch(error => { // If verification failed, it's considered an error and it's a 403
				console.error('Server is down or verification failed.', error);
				this.props.history.push('/login'); // TODO: Preserve Search state
			});

			document.body.style.cursor = 'default';
			console.log("Out search");
		});
	}
	
	check = async () => { // check if JWT is expired/invalid
				
		let verified = false;

		let checkURL = new URL('test/check', this.state.baseURL);
		var token = localStorage.JWT;
		if(token){
			axios.defaults.headers.common['Authorization'] = token;
			let response = await axios.post(checkURL);
			verified = response && response.status === 200;
		} 

		refreshNav(verified);
		if(!verified){
			this.props.history.push('/login');
		}
	}
	

	render() {

		console.log("App rendering");
		return (
			<div id="main">
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
		let currentHost = new URL('http://localhost:8080/');
		console.log(window.location.hostname);
		if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
			currentHost = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/');
		}

		this.setState( 
		{ 
			baseURL: currentHost
		}, () =>{
			this.check();
		});
		collapsibles();
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
				this.innerHTML = "+ Search Criteria";
			} else {
				content.style.display = "block";
				this.innerHTML = "- Search Criteria";
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
	if(localStorage.username){
		document.getElementById("details").innerHTML = localStorage.username;
	}
}