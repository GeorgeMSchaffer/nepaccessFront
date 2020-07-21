import React from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

import DownloadFile from './DownloadFile.js';
import MatchSearcher from './MatchSearcher.js';
import MatchResults from './MatchResults.js';

import './index.css';
import './match.css';

import Globals from './globals.js';
// -1. User clicks Record
// -2. Modal opens, shows Record metadata from props
// 3. ID of record or foreign process ID is sent to backend with getRecordDetails(this.props.ID) and message becomes "Loading related documents..."
// 4. Table of title/type/% match/download for related records, message becomes "Related documents:"
// 5. Slider/1-100 textbox for % match (will have to re-request from database with new percentage, debounced)
// 0%+ match would return all records, and that would be silly, need to restrict on backend also
// 6. Good place to put curation options for authorized users
// i.e. alter metadata, import new relations (maybe do this elsewhere), verify/unlink existing relations...  
// and the database updates to reflect it after they confirm changes

export default class RecordDetailsTab extends React.Component {

    // Receives needed props from React-Tabular instance in SearchResults.js
	constructor(props){
		super(props);
        this.state = {
            searcherInputs: {
                id: 0,
                matchPercent: 50,
            },
            details: {

            },
            detailsID: 0,
            searchResults: [],
            networkError: '',
            searcherClassName: '',
            message: "Find similar documents by title:",
            show: false,
            resultsText: "",
        };
    }

    populate = () => {
            let populateUrl = Globals.currentHost + "test/get_by_id";
            
			//Send the AJAX call to the server
			axios.get(populateUrl, {
				params: {
					id: this.state.detailsID
				}
			}).then(response => {
				let responseOK = response && response.status === 200;
				if (responseOK) {
					return response.data;
				} else {
					return null;
				}
			}).then(parsedJson => { // can be empty (no record found)
				if(parsedJson){
                    this.setState({
                        details: parsedJson,
                    });
				} else { // 404
					this.setState({
						networkError: "No record found (try a different ID)"
					});
				}
			}).catch(error => {
				this.setState({
					networkError: 'Server is down or you may need to login again.'
				});
			});
    }

    search = (searcherState) => {

		this.setState({
			searcherInputs: searcherState,
			resultsText: "Loading results...",
			networkError: "" // Clear network error
		}, () => {
			let matchUrl = new URL('test/match', Globals.currentHost);

			let dataToPass = { 
				id: this.state.searcherInputs.id,
				matchPercent: (this.state.searcherInputs.matchPercent/100)
			};

			// console.log("Inputs");
            // console.log(JSON.stringify(this.state.searcherInputs));
            
			//Send the AJAX call to the server
			axios({
				method: 'POST',
				url: matchUrl,
				data: dataToPass
			}).then(response => {
				let responseOK = response && response.status === 200;
				if (responseOK) {
					return response.data;
				} else {
					return null;
				}
			}).then(parsedJson => { // can be empty (no results)
				// console.log('this should be json', parsedJson); 
				if(parsedJson){
                    let resultsText = " ";
                    if(parsedJson.matches.length === 1){
                        resultsText = " Result";
                    } else {
                        resultsText = " Results";
                    }
                    this.setState({
                        searchResults: parsedJson,
                        resultsText: parsedJson.matches.length + resultsText,
                    });
				} else { // 200 from server, but empty results
					this.setState({
                        searchResults: parsedJson,
						resultsText: "No similar titles found (try lowering the percentage?)"
					});
				}
			}).catch(error => {
				this.setState({
					networkError: 'Server is down or you may need to login again.'
				});
				this.setState({
					resultsText: "Error: Couldn't get results"
				});
			});
		
		});
	}

    /** Return all metadata, not just what search table shows */
    showDetails = () => {
        const cellData = this.state.details;
        if(cellData) {
            return Object.keys(cellData).map( ((key, i) => {
                let keyName = key;
                if(key==='registerDate'){
                    keyName = 'date';
                } else if (key==='documentType') {
                    keyName = 'type';
                }
                if(key==='filename') {
                    return <div><p key={i} className='modal-line'><span className='modal-title'>document:</span> <DownloadFile downloadType="EIS" filename={cellData[key]}/> {cellData[key]}</p></div>;
                } else if(key==='commentsFilename') {
                    return <div><p key={i} className='modal-line'><span className='modal-title'>comments:</span> <DownloadFile downloadType="Comments" filename={cellData[key]}/> {cellData[key]}</p></div>;
                // exclusions:
                } else if(key==='matchPercent' || key==='commentDate' || key==='id' || key==='plaintext' || key==='folder' || key==='link' || key==='notes') { 
                    return '';
                }
                else {
                    return <div><p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> {cellData[key]}</p></div>;
                }
            }));
        }
    }

    getIdParam = () => {
        let idString = Globals.getParameterByName("id");
        return parseInt(idString);
    }

    showDocuments = () => {
        return (
            <div>
                <MatchSearcher search={this.search} matchPercent={this.state.searcherInputs.matchPercent} id={this.getIdParam()} />
                <MatchResults results={this.state.searchResults} resultsText={this.state.resultsText} />
            </div>
        )
	}

    render () {

        if (typeof(window) !== 'undefined') {
            ReactModal.setAppElement('body');
        }

        return (
            <div id="details">
                <label className="errorLabel">{this.state.networkError}</label>
                <h2 className="title-color">Record details:</h2>
                <div className="record-details">
                    {this.showDetails()}
                </div>
                <hr />
                <h2 className="title-color">{this.state.message}</h2>
                {this.showDocuments()}
            </div>
        );
    }

    // After render
	componentDidMount() {
        const idString = Globals.getParameterByName("id");
        if(idString){
            this.setState({
                detailsID: idString
            }, () => {
                if(this.state.detailsID){
                    this.populate();
                } else {
                    this.setState({
                        networkError: "No record found (try a different ID)"
                    });
                }
            });
        }
	}
}