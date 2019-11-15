import React from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

import DownloadFile from './DownloadFile.js';
import MatchSearcher from './MatchSearcher.js';
import MatchResults from './MatchResults.js';

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

export default class RecordDetails extends React.Component {

    // Receives needed props from React-Tabular instance in SearchResults.js
	constructor(props){
		super(props);
        this.state = {
            searcherInputs: {
                id: 0,
                matchPercent: 75,
            },
            searchResults: [],
            networkError: '',
            searcherClassName: '',
            message: "Related documents:",
            show: false,
            resultsText: "",
        };
    }
    
    showModal = (e) => { this.setState({ show: true }); }
    hideModal = (e) => { this.setState({ show: false }); }

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

			console.log("Inputs");
            console.log(JSON.stringify(this.state.searcherInputs));
            
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
						resultsText: "No results found"
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
			
			console.log("Out search");
		
		});
	}

    Build = () => {
    
        return (
            <button className='link' onClick={e => {
                this.showModal();
            }}>
                {this.props.cell._cell.row.data.title}
            </button>
        );
    }

    // TODO: Include a download link?
    /** Return all metadata, not just what search table shows (right now table has all, though)*/
    showDetails = () => {
        const cellData = this.props.cell._cell.row.data;
        if(cellData) {
            return Object.keys(cellData).map( ((key, i) => {
                if(key==='filename') {
                    return <p key={i} className='modal-line'><span className='modal-title'>{key}:</span> <DownloadFile downloadType="EIS" filename={cellData[key]}/> {cellData[key]}</p>;
                } else if(key==='commentsFilename') {
                    return <p key={i} className='modal-line'><span className='modal-title'>{key}:</span> <DownloadFile downloadType="Comments" filename={cellData[key]}/> {cellData[key]}</p>;
                } else if(key==='matchPercent') {
                    return '';
                }
                else {
                    return <p key={i} className='modal-line'><span className='modal-title'>{key}:</span> {cellData[key]}</p>;
                }
            }));
        }
    }

    showDocuments = () => {
        return (
            <div>
                <MatchSearcher search={this.search} matchPercent={this.state.searcherInputs.matchPercent} id={this.props.cell._cell.row.data.id} />
                <MatchResults results={this.state.searchResults} resultsText={this.state.resultsText} />
            </div>
        )
	}

    render () {
        if(!this.state.show){
            return this.Build();
        } 
        // else {
        //     const cellData = this.props.cell._cell.row.data;
        //     for(var key in cellData) {
        //         if(cellData.hasOwnProperty(key)) {
        //             console.log(key, cellData[key]);
        //         }
        //     }
        // }

        if (typeof(window) !== 'undefined') {
            ReactModal.setAppElement('body');
        }

        // TODO: Get related files from database, display here in interactive table with % slider
        return (
            <div>
                {this.Build()}
                <ReactModal 
                    isOpen={this.state.show}
                    parentSelector={() => document.body}
                    // ariaHideApp={false}
                >
                    <button className='button' onClick={this.hideModal}>Close Details View</button>
                    <label className="errorLabel">{this.state.networkError}</label>
                    <h2>Record details:</h2>
                    {this.showDetails()}
                    <h2>{this.state.message}</h2>
                    {this.showDocuments()}
                </ReactModal>
            </div>
        );
    }
}