import React from 'react';
import SearchResults from './SearchResults.js';
import Searcher from './Searcher.js';
import './App.css';

class App extends React.Component {

	state = {
		searcherInputs: {
			title: '',
			startPublish: '',
			endPublish: '',
			needsComments: false
		},
		searchResults: []
	}

	search = (searcherState) => {
		console.log("In search");
		this.setState({
			searcherInputs: searcherState
		});
		// console.log("Search state");
		// console.log(this.state.searcherInputs);
		
		//Send the AJAX call to the server
		let searchUrl = new URL('http://localhost:8080/test/search');

		// This hooks up to current deployment while also working with local dev environment
		console.log(window.location);
		if(window.location.hostname==='localhost'){
			// Continue with localhost
		} else {
			searchUrl = new URL('https://hvpb.azurewebsites.net/test/search');
		}

		// TODO: Transform into POST, account for this on backend
		// Iterate through searcherInputs, encode and append to searchParams for the GET
		// TODO: Pass through universal validator first that can handle multiple types and return sane values
		// Object.keys(this.state.searcherInputs).forEach(key => {
		// 	searchUrl.searchParams.append(key, this.state.searcherInputs[key]);
		// });
		// for(let value in this.state.searcherInputs) {
		// 	console.log(value);
		// 	console.log(this.state.searcherInputs[value]);
		// }

		console.log("Inputs");
		console.log(JSON.stringify(this.state.searcherInputs));
        // searchUrl.searchParams.append('title', encodeURIComponent(this.state.searcherInputs.searchTitle.trim()));
        fetch(searchUrl, {
			method: 'POST', // or 'PUT'
			body: JSON.stringify(this.state.searcherInputs), // data can be `string` or {object}
			headers:{
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).then(response => {
            return response.json();
        }).then(parsedJson => {
            // console.log('this should be json', parsedJson);
            this.setState({
				searchResults: parsedJson
            });
        }).catch(error => {
            console.error('error message', error);
        });

        console.log("Out search");
	}

	render() {

		// need to use a new React specific multiselect plugin
		// document.multiselect('#searchAgency');
		// document.multiselect('#searchState');

		console.log("App rendering");
		return (
			<div id="main">
				<button className="collapsible">
				+ Search Criteria
				</button>
				<Searcher search={this.search} />
				<h2>Results</h2>
				<SearchResults results={this.state.searchResults} />
			</div>
		)
	}
	
	// Onload
	componentDidMount() {
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
		} else {
			content.style.display = "block";
		}
		});
	}
	
}