import React from 'react';

import Select from 'react-select';
import axios from 'axios';

import DownloadFile from '../DownloadFile.js';
import MatchSearcher from './MatchSearcher.js';
import MatchResults from './MatchResults.js';
import DetailsUpdate from './DetailsUpdate.js';
import DetailsFileResults from './DetailsFileResults.js';

import '../index.css';
import './match.css';

import Globals from '../globals.js';
// 1. User clicks Record
// 2. Tab opens, shows Record metadata from backend call
// Good place to put curation options for authorized users
// i.e. alter metadata, import new relations (maybe do this elsewhere), verify/unlink existing relations...  
// and the database updates to reflect it after they confirm changes (confirmation window is a big plus, also cancel/reset option to put the original values back in)

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
            dropdownOption: {value: 'Details', label: 'Details'},
            detailsID: 0,
            searchResults: [

            ],
            networkError: '',
            searcherClassName: '',
            show: false,
            resultsText: "",
        };
    }

    
	onDropdownChange = (evt) => {
        this.setState({ dropdownOption: evt });
    }

    getNepaFileResults = () => {
        let populateUrl = Globals.currentHost + "file/nepafiles";
            
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
			}).then(parsedJson => { // can be empty if nothing found
				if(parsedJson){
                    this.setState({
                        nepaResults: parsedJson,
                    }, () => {
                        if(!this.state.nepaResults || !this.state.nepaResults[0]){
                            this.getDocumentTextResults();
                        }
                    });
                } else { // 404
                    
				}
			}).catch(error => {
                
            });
            
        
    }
    
    getDocumentTextResults = () => {
        let populateUrl = Globals.currentHost + "file/doc_texts";
            
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
			}).then(parsedJson => { // can be empty if nothing found
				if(parsedJson){
                    this.setState({
                        nepaResults: parsedJson,
                    });
                } else { // 404
                    
				}
			}).catch(error => {
                
			});
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
    
    
    getIdParam = () => {
        let idString = Globals.getParameterByName("id");
        return parseInt(idString);
    }


    
    showView = () => {
        // One benefit of switching here instead of dynamically hiding elements is that Tabulator doesn't error out when hidden
        if(this.state.dropdownOption.value === 'Details'){ // Show details panel
            return (
                <div className="record-details">
                    <h2 className="title-color">Record details:</h2>
                    {this.showDetails()}
                </div>
            );
        } else if(this.state.dropdownOption.value === 'Match') {
            return (
                <div className="record-details">
                    <h2 className="title-color">Find similar documents by title:</h2>
                    <div><p className='modal-line'><span className='modal-title'>Title:</span> {this.state.details.title} </p></div>
                    {this.showDocuments()}
                </div>
            );
        } else { // Show update panel
            return (
                <div className="record-details">
                    {this.showUpdate()}
                </div>
            );
        }
    }


    /** Return all metadata, not just what search table shows */
    showDetails = () => {
        let cellData = this.state.details;
        if(cellData) {
            return Object.keys(cellData).map( ((key, i) => {
                let keyName = key;
                // console.log(i, keyName, cellData[key]);
                if(key==='registerDate') {
                    keyName = 'date';
                } else if (key==='documentType') {
                    keyName = 'type';
                }
                if(key==='folder' && cellData[key] && cellData[key].length > 0) {
                    return <p key={i} className='modal-line'><span className='modal-title'>download files:</span> <DownloadFile downloadType="Folder" id={cellData["id"]}/> {cellData[key]}</p>;
                } else if(key==='filename') {
                    // If we have a folder available for download, never mind showing the filename, certainly not a (probably invalid) download link for it
                    if (cellData[key] && cellData[key].length > 0
                        && (!cellData["folder"] || !(cellData["folder"].length > 0))) {
                        return <p key={i} className='modal-line'><span className='modal-title'>download files:</span> <DownloadFile downloadType="EIS" filename={cellData[key]}/> {cellData[key]}</p>;
                    } else {
                        return '';
                    }
                } else if(key==='commentsFilename') {
                    if (cellData[key] && cellData[key].length > 0) {
                        return <p key={i} className='modal-line'><span className='modal-title'>download EPA comments:</span> <DownloadFile downloadType="Comments" filename={cellData[key]}/> {cellData[key]}</p>;
                    } else {
                        return '';
                    }
                // exclusions:
                } else if(key==='matchPercent' || key==='commentDate' || key==='id_' || key==='plaintext' || key==='folder' || key==='link' || key==='notes') { 
                    return '';
                } else {
                    return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> {cellData[key]}</p>);
                }
            }));
        }
    }

    showDocuments = () => {
        return (
            <>
                <MatchSearcher search={this.search} matchPercent={this.state.searcherInputs.matchPercent} id={this.getIdParam()} />
                <MatchResults results={this.state.searchResults} resultsText={this.state.resultsText} />
            </>
        )
    }
    
    showUpdate = () => {
        return (<>
                <DetailsUpdate record={this.state.details} />
                <DetailsFileResults results={this.state.nepaResults} />
            </>
        );
    }


    render () {
        
        const customStyles = {
            option: (styles, state) => ({
                 ...styles,
                borderBottom: '1px dotted',
	            backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                    backgroundColor: 'lightgreen'
                },
                width: "500px",
            }),
            control: (styles) => ({
                ...styles,
                backgroundColor: 'white',
            })
        }

        // TODO: Curator check

        let curator = localStorage.curator;
        let viewOptions = [ { value: 'Details', label: 'Details' }, {value: 'Match', label: 'Title similarity search'}];
        if(curator) {
            viewOptions.push({ value: 'Update', label: 'Edit' });
        }
        

        return (
            <div id="details">
                <label className="errorLabel">{this.state.networkError}</label>
                <br />
                <h3 className="advanced-label inline" htmlFor="detailsDropdown">Select view: </h3>
                <Select id="detailsDropdown" className="multi inline-block" classNamePrefix="react-select" name="detailsDropdown" isSearchable 
                    styles={customStyles}
                    options={viewOptions} 
                    onChange={this.onDropdownChange} 
                    value={this.state.dropdownOption}
                    // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                    // menuIsOpen={true}
                />
                {this.showView()}
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
                    this.getNepaFileResults();
                } else {
                    this.setState({
                        networkError: "No record found (try a different ID)"
                    });
                }
            });
        }
	}
}