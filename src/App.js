import React from 'react';
import './App.css';

class App extends React.Component {

	state = {
		searchTitle: '',
		searchResults: []
	}

	search = (title) => {
		console.log("In search");
		this.setState({
			searchTitle: title
		});
			
		//Send the AJAX call to the server
		let searchUrl = new URL('http://localhost:8080/test/search');

		// This hooks up to current deployment while also working with local dev environment
		console.log(window.location);
		if(window.location.hostname==='localhost'){
			// Continue with localhost
		} else {
			searchUrl = new URL('http://hvpb.azurewebsites.net/test/search');
		}

        searchUrl.searchParams.append('title', encodeURIComponent(title.trim()));
        fetch(searchUrl).then(response => {
            return response.json();
        }).then(parsedJson => {
            console.log('this should be json', parsedJson);
            this.setState({
				searchResults: parsedJson
            });
        }).catch(error => {
            console.error('error message', error);
        });

        console.log("Out");
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
				<form className="content dark">
					<label htmlFor="searchTitle">Search by title</label>
					<Searcher id="searchTitle" search={this.search} />
					<label>Publication date</label>
					<input className="date" type="date" /> to <input className="endDate date" type="date" />
					<label>Comments date</label>
					<input className="date" type="date" /> to <input className="endDate date" type="date" />
					<div>
					<label htmlFor="searchAgency">Agencies</label>
					<select multiple id="searchAgency">
						<option value="ACHP">Advisory Council on Historic Preservation (ACHP)</option><option value="USAID">Agency for International Development (USAID)</option><option value="ARS">Agriculture Research Service (ARS)</option><option value="APHIS">Animal and Plant Health Inspection Service (APHIS)</option><option value="AFRH">Armed Forces Retirement Home (AFRH)</option><option value="BPA">Bonneville Power Administration (BPA)</option><option value="BIA">Bureau of Indian Affairs (BIA)</option><option value="BLM">Bureau of Land Management (BLM)</option><option value="USBM">Bureau of Mines (USBM)</option><option value="BOEM">Bureau of Ocean Energy Management (BOEM)</option><option value="BOP">Bureau of Prisons (BOP)</option><option value="BR">Bureau of Reclamation (BR)</option><option value="Caltrans">California Department of Transportation (Caltrans)</option><option value="CHSRA">California High-Speed Rail Authority (CHSRA)</option><option value="CIA">Central Intelligence Agency (CIA)</option><option value="NYCOMB">City of New York, Office of Management and Budget (NYCOMB)</option><option value="CDBG">Community Development Block Grant (CDBG)</option><option value="CTDOH">Connecticut Department of Housing (CTDOH)</option><option value="BRAC">Defense Base Closure and Realignment Commission (BRAC)</option><option value="DLA">Defense Logistics Agency (DLA)</option><option value="DNA">Defense Nuclear Agency (DNA)</option><option value="DNFSB">Defense Nuclear Fac. Safety Board (DNFSB)</option><option value="DSA">Defense Supply Agency (DSA)</option><option value="DRB">Delaware River Basin Commission (DRB)</option><option value="DC">Denali Commission (DC)</option><option value="USDA">Department of Agriculture (USDA)</option><option value="DOC">Department of Commerce (DOC)</option><option value="DOD">Department of Defense (DOD)</option><option value="DOE">Department of Energy (DOE)</option><option value="HHS">Department of Health and Human Services (HHS)</option><option value="DHS">Department of Homeland Security (DHS)</option><option value="HUD">Department of Housing and Urban Development (HUD)</option><option value="DOJ">Department of Justice (DOJ)</option><option value="DOL">Department of Labor (DOL)</option><option value="DOS">Department of State (DOS)</option><option value="DOT">Department of Transportation (DOT)</option><option value="TREAS">Department of Treasury (TREAS)</option><option value="VA">Department of Veteran Affairs (VA)</option><option value="DOI">Department of the Interior (DOI)</option><option value="DEA">Drug Enforcement Administration (DEA)</option><option value="EDA">Economic Development Administration (EDA)</option><option value="ERA">Energy Regulatory Administration (ERA)</option><option value="ERDA">Energy Research and Development Administration (ERDA)</option><option value="EPA">Environmental Protection Agency (EPA)</option><option value="FSA">Farm Service Agency (FSA)</option><option value="FHA">Farmers Home Administration (FHA)</option><option value="FAA">Federal Aviation Administration (FAA)</option><option value="FCC">Federal Communications Commission (FCC)</option><option value="FEMA">Federal Emergency Management Agency (FEMA)</option><option value="FEA">Federal Energy Administration (FEA)</option><option value="FERC">Federal Energy Regulatory Commission (FERC)</option><option value="FHWA">Federal Highway Administration (FHWA)</option><option value="FMC">Federal Maritime Commission (FMC)</option><option value="FMSHRC">Federal Mine Safety and Health Review Commission (FMSHRC)</option><option value="FMCSA">Federal Motor Carrier Safety Administration (FMCSA)</option><option value="FPC">Federal Power Commission (FPC)</option><option value="FRA">Federal Railroad Administration (FRA)</option><option value="FRBSF">Federal Reserve Bank of San Francisco (FRBSF)</option><option value="FTA">Federal Transit Administration (FTA)</option><option value="USFWS">Fish and Wildlife Service (USFWS)</option><option value="FDOT">Florida Department of Transportation (FDOT)</option><option value="FDA">Food and Drug Administration (FDA)</option><option value="USFS">Forest Service (USFS)</option><option value="GSA">General Services Administration (GSA)</option><option value="USGS">Geological Survey (USGS)</option><option value="GLB">Great Lakes Basin Commission (GLB)</option><option value="IHS">Indian Health Service (IHS)</option><option value="IRS">Internal Revenue Service (IRS)</option><option value="IBWC">International Boundary and Water Commission (IBWC)</option><option value="ICC">Interstate Commerce Commission (ICC)</option><option value="JCS">Joint Chiefs of Staff (JCS)</option><option value="MARAD">Maritime Administration (MARAD)</option><option value="MTB">Materials Transportation Bureau (MTB)</option><option value="MSHA">Mine Safety and Health Administration (MSHA)</option><option value="MMS">Minerals Management Service (MMS)</option><option value="MESA">Mining Enforcement and Safety (MESA)</option><option value="MRB">Missouri River Basin Commission (MRB)</option><option value="NASA">National Aeronautics and Space Administration (NASA)</option><option value="NCPC">National Capital Planning Commission (NCPC)</option><option value="NGA">National Geospatial-Intelligence Agency (NGA)</option><option value="NHTSA">National Highway Traffic Safety Administration (NHTSA)</option><option value="NIGC">National Indian Gaming Commission (NIGC)</option><option value="NIH">National Institute of Health (NIH)</option><option value="NMFS">National Marine Fisheries Service (NMFS)</option><option value="NNSA">National Nuclear Security Administration (NNSA)</option><option value="NOAA">National Oceanic and Atmospheric Administration (NOAA)</option><option value="NPS">National Park Service (NPS)</option><option value="NSF">National Science Foundation (NSF)</option><option value="NSA">National Security Agency (NSA)</option><option value="NTSB">National Transportation Safety Board (NTSB)</option><option value="NRCS">Natural Resource Conservation Service (NRCS)</option><option value="NER">New England River Basin Commission (NER)</option><option value="NJDEP">New Jersey Department of Environmental Protection (NJDEP)</option><option value="NRC">Nuclear Regulatory Commission (NRC)</option><option value="OCR">Office of Coal Research (OCR)</option><option value="OSM">Office of Surface Mining (OSM)</option><option value="OBR">Ohio River Basin Commission (OBR)</option><option value="RSPA">Research and Special Programs (RSPA)</option><option value="REA">Rural Electrification Administration (REA)</option><option value="RUS">Rural Utilities Service (RUS)</option><option value="SEC">Security and Exchange Commission (SEC)</option><option value="SBA">Small Business Administration (SBA)</option><option value="SCS">Soil Conservation Service (SCS)</option><option value="SRB">Souris-Red-Rainy River Basin Commission (SRB)</option><option value="STB">Surface Transportation Board (STB)</option><option value="SRC">Susquehanna River Basin Commission (SRC)</option><option value="TVA">Tennessee Valley Authority (TVA)</option><option value="TxDOT">Texas Department of Transportation (TxDOT)</option><option value="TPT">The Presidio Trust (TPT)</option><option value="TDA">Trade and Development Agency (TDA)</option><option value="USACE">U.S. Army Corps of Engineers (USACE)</option><option value="USCG">U.S. Coast Guard (USCG)</option><option value="CBP">U.S. Customs and Border Protection (CBP)</option><option value="RRB">U.S. Railroad Retirement Board (RRB)</option><option value="USAF">United States Air Force (USAF)</option><option value="USA">United States Army (USA)</option><option value="USMC">United States Marine Corps (USMC)</option><option value="USN">United States Navy (USN)</option><option value="USPS">United States Postal Service (USPS)</option><option value="USTR">United States Trade Representative (USTR)</option><option value="UMR">Upper Mississippi Basin Commission (UMR)</option><option value="UMTA">Urban Mass Transportation Administration (UMTA)</option><option value="UDOT">Utah Department of Transportation (UDOT)</option><option value="WAPA">Western Area Power Administration (WAPA)</option>
					</select>
					</div>
					<div>
					<label htmlFor="searchState">States</label>
					<select multiple id="searchState">
						<option value="AK">Alaska</option><option value="AL">Alabama</option><option value="AQ">Antarctica</option><option value="AR">Arkansas</option><option value="AS">American Samoa</option><option value="AZ">Arizona</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DC">District of Columbia</option><option value="DE">Delaware</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="GU">Guam</option><option value="HI">Hawaii</option><option value="IA">Iowa</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="MA">Massachusetts</option><option value="MD">Maryland</option><option value="ME">Maine</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MO">Missouri</option><option value="MS">Mississippi</option><option value="MT">Montana</option><option value="NAT">National</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="NE">Nebraska</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NV">Nevada</option><option value="NY">New York</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="PR">Puerto Rico</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TT">Trust Territory of the Pacific Islands</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VA">Virginia</option><option value="VI">Virgin Islands</option><option value="VT">Vermont</option><option value="WA">Washington</option><option value="WI">Wisconsin</option><option value="WV">West Virginia</option><option value="WY">Wyoming</option>
					</select>
					</div>
					<br />
				</form>
				<h2>Results</h2>
				<SearchResults results={this.state.searchResults} />
			</div>
		)
	}
	
	// Onload
	componentDidMount() {

		// collapsibles don't work like this in React
		collapsibles();

		// this date formatting doesn't work in React
		// extract current date from current dateTime, apply as default and max of endDate input
		dateHelper();
	}
	
}

const _ = require('lodash');

class Searcher extends React.Component {

    constructor(props) {
        super(props);
        this.debouncedSearch = _.debounce(this.props.search, 300);
    }

    searchTitleKeyUp = (event) => {
        console.log('keyUp', event.target.value);
        this.debouncedSearch(event.target.value);
    }

    render () {
        console.log("Searcher");
        return (
            <input id="searchTitle" type="search" size="50" autoFocus 
            placeholder="Leave blank to include all titles" onChange={this.searchTitleKeyUp} />
        )
    }
}

class SearchResults extends React.Component {

	// TODO: At some point, the database should probably be giving us the headers to use.

	render() {
		console.log("SearchResults");
		const results = this.props.results;
		return (
			<table>
				<thead><tr>
				<th>Title</th>
				<th>Agency</th>
				<th>Comments date</th>
				<th>Register date</th>
				<th>State</th>
				<th>Document type</th>
				</tr></thead>
				<tbody>
					{results.map((result, idx) =>
						<tr key={idx}>
							<td><a href={result.documents} className='detailLink' id={`eis${result.id}`}>{result.title}</a></td>
							<td>{result.agency}</td>
							<td>{result.commentDate}</td>
							<td>{result.registerDate}</td>
							<td>{result.state}</td>
							<td>{result.documentType}</td>
						</tr>
					)}
				</tbody>
			</table>
		)
	}
}

export default App;

// TODO: moment.js
function dateHelper() {
	console.log("Date");
	var i;
	var today = new Date().toISOString().split('T')[0];
	console.log(today);
	var classDates = document.getElementsByClassName("date");
	for (i = 0; i < classDates.length; i++) {
		classDates[i].setAttribute('max', today);
	}
	console.log(classDates);
	var endDates = document.getElementsByClassName("endDate");
	for (i = 0; i < endDates.length; i++) {
		endDates[i].setAttribute('value', today);
	}
	return i;
}

// TODO: Animations? Doesn't work with React like this
function collapsibles(){
	console.log("Collapse");
	var coll = document.getElementsByClassName("collapsible");
	var i;
	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
		// this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display !== "none") {
			content.style.display = "none";
		} else {
			content.style.display = "block";
		}
		});
	}
	
}