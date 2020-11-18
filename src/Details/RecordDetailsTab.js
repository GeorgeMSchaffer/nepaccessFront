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

const _ = require('lodash');
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
            resultsText: "",
            exists: true
        };

        this.debouncedSize = _.debounce(this.getFileSize, 300);
        this.debouncedFilenames = _.debounce(this.getFilenames, 300);
    }

    
	onDropdownChange = (evt) => {
        this.setState({ dropdownOption: evt });
    }

    getNepaFileResults = () => {
        let populateUrl = Globals.currentHost + "file/nepafiles";
        
        // console.log("Trying to get nepafile results", this.state.detailsID);
            
        //Send the AJAX call to the server
        axios.get(populateUrl, {
            params: {
                id: this.state.detailsID
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { // can be empty if nothing found
            console.log("Parsed", parsedJson);
            if(parsedJson){
                this.setState({
                    nepaResults: parsedJson,
                }, () => {
                    if(!this.state.nepaResults || !this.state.nepaResults[0]){
                        this.getDocumentTextResults();
                    }
                });
            } else { // null/404
                // if(!this.state.nepaResults || !this.state.nepaResults[0]){
                //     this.getDocumentTextResults();
                // }
            }
        }).catch(error => {
            
        });
           
        this.getDocumentTextResults();
        
    }
    
    getDocumentTextResults = () => {
        let populateUrl = Globals.currentHost + "file/doc_texts";

        // console.log("Trying to get document text results", this.state.detailsID);
            
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
                    textResults: parsedJson,
                });
            } else { // 404
                
            }
        }).catch(error => {
            
        });
    }


    populate = () => {
        let populateUrl = Globals.currentHost + "test/get_by_id";
            
        // console.log("Trying to populate details", this.state.detailsID);
            
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
                    networkError: "No record found (try a different ID)",
                    exists: false
                });
            }
        }).catch(error => {
            this.setState({
                networkError: 'Server is down or you may need to login again.'
            });
        });
    }

    // Match search (title alignment)
    search = (searcherState) => {

        let matchUrl = new URL('test/match', Globals.currentHost);

        // "advanced" match search uses additional heuristics for more probable "linked" records
        if(searcherState.matchType && searcherState.matchType === 'advanced'){
			matchUrl = new URL('test/match_advanced', Globals.currentHost);
        }

		this.setState({
			searcherInputs: searcherState,
			resultsText: "Loading results...",
			networkError: "" // Clear network error
		}, () => {
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
                    this.parseMatches(parsedJson, searcherState.matchType);
				} else { // 200 from server, but empty results
					this.setState({
						resultsText: "No related documents could be found"
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

    parseMatches = (results, searchType) => {

        console.log("Raw results",results);

        let resultsText = " ";
        let data = [];

        let matches = results.matches.map((result, idx) => {
            let newObject = {
                matchId: result.match_id, document1: result.document1, document2: result.document2,
                matchPercent: result.match_percent
            };
            return newObject;
        });
        let docs = results.docs.map((result, idx) =>{
            let newObject = {title: result.title, agency: result.agency, commentDate: result.commentDate, 
                registerDate: result.registerDate, state: result.state, documentType: result.documentType, 
                filename: result.filename, 
                commentsFilename: result.commentsFilename,
                id: result.id
            };
            return newObject;
        });

        docs.forEach(function(document) {
            matches.forEach(function(match) {
                // If corresponding elements, concatenate them
                if(document.id === match.document1 || document.id === match.document2) {
                    document.matchPercent = match.matchPercent;
                    data.push(document);
                }
            });
        });

        if(data.length > 0){
            data.sort((a, b)  => (a.matchPercent < b.matchPercent) ? 1 : -1);
        }
        // At this point, weed out the identical types and only keep the highest, if advanced

        if(searchType && searchType === "advanced") {
            

            const docsByType = {};

            data.forEach(doc => {
                const entries = docsByType[doc.documentType] || []
                entries.push(doc)
                docsByType[doc.documentType] = entries
            });

            const masterSet = [];

            Object.keys(docsByType).forEach(documentType => {
                const entries = docsByType[documentType]
                // entries.sort((a, b) => {
                // return b.score - a.score // or whatever
                // })

                const best = entries[0]
                masterSet.push(best)
            });

            data = masterSet;
        }

        if(data.length === 1){
            resultsText = " Result";
        } else {
            resultsText = " Results";
        }

        this.setState({
            searchResults: data,
            resultsText: data.length + resultsText
        }, () => {
            console.log(this.state.searchResults);
        });
    }
    
    
    getIdParam = () => {
        let idString = Globals.getParameterByName("id");
        return parseInt(idString);
    }
    
    getFilenames = (_id) => {
        if(this.state.filenames){
            // do nothing (already have this data)
        } else {
            let filenamesUrl = Globals.currentHost + "file/filenames";

            // console.log("Inputs");
            // console.log(JSON.stringify(this.state.searcherInputs));
            
            //Send the AJAX call to the server
            axios.get(filenamesUrl, {
                params: {
                    document_id: _id
                }
                }).then(response => {
                    let responseOK = response && response.status === 200;
                    if (responseOK && response.data && response.data.length > 0) {
                        this.setState({
                            filenames: response.data
                        });
                    } else {
                        // console.log("Can't have filenames");
                        return null;
                    }
                }).then(parsedJson => { // can be empty (no results)
                    // return "Unknown";
                }).catch(error => {
                    // return "Unknown (server error)";
            });
            
        }
    }

    getFileSize = (_filename) => {
        if(this.state.fileSize){
            // do nothing
        } else {
            let sizeUrl = Globals.currentHost + "file/file_size";

            // console.log("Inputs");
            // console.log(JSON.stringify(this.state.searcherInputs));
            
            //Send the AJAX call to the server
            axios.get(sizeUrl, {
                params: {
                    filename: _filename
                }
                }).then(response => {
                    let responseOK = response && response.status === 200;
                    if (responseOK && response.data && response.data > 0) {
                        this.setState({
                            fileSize: Math.round(response.data / 1024)
                        });
                    } else {
                        return null;
                    }
                }).then(parsedJson => { // can be empty (no results)
                    // return "Unknown";
                }).catch(error => {
                    // return "Unknown (server error)";
            });
            
        }
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
                    <div><p className='modal-line'><span className='modal-title'>Title:</span> 
                        <span className="bold">{this.state.details.title}</span> 
                    </p></div>
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

    showFilenames = (_id) => {
        this.debouncedFilenames(_id);
        if(this.state.filenames) {
            const filenameItems = this.state.filenames.map(
                (filename) => <span key={filename} className="detail-filename">{filename}</span>
            );
            return (<div className='modal-line'>
            <span className='detail-filenames modal-title'>Contents:</span>
                <p>{filenameItems}</p>
            </div>);
        }
    }

    /** Return all metadata, not just what search table shows */
    showDetails = () => {
        let cellData = this.state.details;
        if(cellData) {
            return Object.keys(cellData).map( ((key, i) => {
                let keyName = key;
                // Title now needs its own style
                if(key==='title') {
                    return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> 
                        <span className="bold">{cellData[key]}</span>
                    </p>);
                }
                if(key==='registerDate') {
                    keyName = 'date';
                } else if (key==='documentType') {
                    keyName = 'type';
                }
                if(key==='folder' && cellData[key] && cellData[key].length > 0) {
                    let filenames = this.showFilenames(cellData.id);
                    if(filenames){
                        return (<div key={i}>
                            <p className='modal-line'><span className='modal-title'>download files:</span> <DownloadFile downloadType="Folder" id={cellData["id"]}/> {cellData[key]}</p>
                            {filenames}
                        </div>);
                    }
                } else if(key==='filename') {
                    // If we have a folder available for download, never mind showing the filename, certainly not a (probably invalid) download link for it
                    if (cellData[key] && cellData[key].length > 0
                                && (!cellData["folder"] || !(cellData["folder"].length > 0))) {
                        let filenames = this.showFilenames(cellData.id);
                        if(filenames) {
                            /** If we do have just a filename then we should be able to get the filesize */
                            return <div key={i}>
                                <p className='modal-line'>
                                    <span className='modal-title'>download files:</span> 
                                    <DownloadFile downloadType="EIS" filename={cellData[key]}/>
                                </p>

                                {this.debouncedSize(cellData[key])}
                                <p><span className='modal-title'>&nbsp;File size: </span>{this.state.fileSize} KB</p>
                                <p><span className='modal-title'>&nbsp;Filename: </span>{cellData[key]}</p>

                                {filenames}
                            </div>;
                        }
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
                } else if(key==='size' || key==='matchPercent' || key==='commentDate' || key==='id' || key==='id_' || key==='plaintext' || key==='folder' || key==='link' || key==='notes') { 
                    return '';
                }
                // else: everything else
                return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> {cellData[key]}</p>);
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
                <DetailsFileResults results={this.state.nepaResults} headerText="Downloadable file records" />
                <DetailsFileResults results={this.state.textResults} headerText="Texts" />
            </>
        );
    }


    render () {

        if(!this.state.exists) {
            return(
                <div id="details">
                    <label className="errorLabel">{this.state.networkError}</label>
                </div>
            )
        }
        
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
        let viewOptions = [ { value: 'Details', label: 'Details' }, {value: 'Match', label: 'More documents from this process'}];
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