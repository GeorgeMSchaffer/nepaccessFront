import React from 'react';
import {Helmet} from 'react-helmet';

import axios from 'axios';

import DownloadFile from '../DownloadFile.js';

import '../index.css';
import './match.css';

import Globals from '../globals.js';

const _ = require('lodash');

// TODO: Get all data for all records for process (needs new backend route)
// buildProcess() gets all metadata for process ID.  Move that to the ?id= param and give it the process ID from the results
// Then for each metadata record, populate each with a filenames call.  Show DownloadFile for whole folder like before, but
// for all of them.  Expandable individual downloads.
// Finally, decide which metadata to show at the top (use latest except account for blanks), and which per record 
// Maybe show a timeline of all dates using d3-timeline
export default class ProcessDetailsTab extends React.Component {

	constructor(props){
		super(props);
        this.state = {
            details: {

            },
            detailsID: 0,
            networkError: '',
            exists: true,

            logged: false
        };

        // this.debouncedSize = _.debounce(this.getFileSize, 300);
        this.debouncedFilenames = _.debounce(this.getFilenames, 300);
    }

    
	onDropdownChange = (evt) => {
        this.setState({ dropdownOption: evt });
    }

    get = async (_url, _params) => {
        try {
            const response = await axios.get(_url, {
                params: _params
            });

            let responseOK = response && response.status === 200;
            if (responseOK) {
                return response.data;
            }
        } catch (error) {
            throw error;
        }
    }   
    post = async (_url, _data) => {
        try {
            const response = await axios({
                url: _url,
                method: 'POST',
                data: _data
            });

            return response;
        } catch(e) {
            throw e;
        }
    }

    getNepaFileResults = () => {
        const url = Globals.currentHost + "file/nepafiles";
        const params = {id: this.state.detailsID};

        this.get(url, params).then(results => {
            if(results){
                this.setState({
                    nepaResults: results,
                });
            } else { // null: no files?
    
            }
        }).catch(e => {
            console.error(e);
        })
    }
    
    /** Log details page "click" (render) -
     * user could type the page in or navigate from related process member, could check if a search preceded it.
     */
    logInteraction = () => {
        const _url = new URL('interaction/set', Globals.currentHost);
        const dataForm = new FormData(); 
        dataForm.append('source',"UNKNOWN"); // Can't actually know this with current logic
        dataForm.append('type',"DETAILS_CLICK"); 
        dataForm.append('docId',this.state.detailsID);

        this.post(_url, dataForm).then(resp => {
            console.log(resp.status);
        }).catch(e => {
            console.error(e);
        })

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
    
    renderDownload = (_id,_size,_filename,_results, _downloadType) => {
        return (<DownloadFile key={_id} downloadType={_downloadType}
                        recordId={_id}
                        id={_id}
                        size={_size}
                        filename={_filename}
                        innerText={_filename}
                        results={_results} />);
    }

    showView = () => {
        return (
            <div className="record-details">
                <h2 className="title-color">Process details</h2>
                {this.showTitle()}
                <div className="containers">
                    <div className="metadata-container-container">
                        <div className="metadata-container">
                            <h3>Metadata</h3>
                            {this.showDetails()}
                        </div>
                        {this.populate()}
                    </div>
                </div>
            </div>
        );
    }

    showFilesNew = (_id, filenames) => {
        
        return filenames.map(
            (_filename) => 
            <span key={_filename} className="detail-filename">
                <DownloadFile key={_filename} downloadType="nepafile" 
                        id={_id}
                        filename={_filename}/>
            </span>
        );
    }

    showFilenames = (_id) => {
        this.debouncedFilenames(_id);
        if(this.state.filenames) {
            if(this.state.details.folder) {
                const filenamesForDownload = this.state.filenames.map(
                    (_filename) => 
                    <span key={_filename} className="detail-filename">
                        <DownloadFile key={_filename} downloadType="nepafile" 
                                id={_id}
                                filename={_filename}/>
                    </span>
                    
                );

                return (<div className='modal-line'>
                <span className='detail-filenames modal-title bold'>Individual files</span>
                    <p>{filenamesForDownload}</p>
                </div>);
            } else {
                const filenameItems = this.state.filenames.map(
                    (_filename) => <span key={_filename} className="detail-filename">{_filename}</span>
                );

                return (<div className='modal-line'>
                <span className='detail-filenames modal-title bold'>Individual files</span>
                    <p>{filenameItems}</p>
                </div>);
            }
        }
    }

    showTitle = () => {
        if(this.state.title) {
            return (<p key={-1} className='modal-line'><span className='modal-title'>Title:</span> 
                <span className="bold record-details-title">{this.state.title}</span>
            </p>);
        }
    }

    

    interpretProcess = (process) => {
        return Object.keys(process).map( ((key, i) => {
            let proc = process[key].doc;
            let filenames = process[key].filenames;
            
            if(proc && proc.id) {

                let size = 0;
                if(proc.size && proc.size > 0) {
                    size = (Math.ceil((proc.size / 1024) / 10.24)/100);
                }

                let recordDownload;
    
                if(proc.size && proc.size > 200) {
                    if(proc.folder) {
                        recordDownload = this.renderDownload(proc.id,size,proc.folder,true,"Folder");
                    } else if(proc.filename) {
                        recordDownload = this.renderDownload(proc.id,size,proc.filename,true,"EIS");
                    }
                } else {
                    recordDownload = <div className="table-row"><span className="cardHeader filename">File(s) not yet available</span></div>;
                }

                return (<>
                    <div key={key} className='modal-line'>
                        <a href={window.location.href.split("/")[0]+"record-details?id="+proc.id} target="_blank">
                            <span className='modal-title'>
                                <b>{proc.documentType}</b>
                            </span>
                        </a>
                        {recordDownload}
                    </div>
                    {this.showFilesNew(proc.id,filenames)}
                    </>
                );
            } else {
                return "";
            }
        }));
    }

    // Gets all metadata records for this process if available
    populate = () => {
        
        let processId = this.state.detailsID;
        
        if(this.state.processId && this.state.process) {

            // already have this data. No need for any axios calls
            if(this.state.process.length > 0) { 
                for(let i = 0; i < this.state.process.length; i++) {
                    return (
                        <div className="metadata-container">
                            <h3>Files</h3>
                            {this.interpretProcess(this.state.process)}
                        </div>);
                }
            }

        } else {

            // need to get and build
            const url = Globals.currentHost + "test/get_process_full";
            const params = {processId: processId};

            //Send the AJAX call to the server
            this.get(url, params).then(response => {
                // console.log("Populate",response);

                let _title = response[0].doc.title;
                for(let i = 0; i < response.length; i++) {
                    if(Globals.isFinalType(response[i].doc.documentType)) {
                        _title = response[i].doc.title;
                    }
                }

                this.setState({
                    processId: processId,
                    process: response,
                    title: _title
                });

                return <>
                    <h3>Other files from this NEPA process</h3>
                    {this.interpretProcess(response)}
                </>
            }).catch(error => {
                console.error(error);

                return <></>;
            });

        }
    }

    /** Return all metadata, not just what search table shows */
    showDetails = () => {
        let cellData = null;

        // Build "process metadata"
        if(this.state.process && this.state.process[0]) {
            const process = this.state.process;
            cellData = this.state.process[0].doc;
            
            process.some(function(el) {
                if(Globals.isFinalType(el.documentType)) {
                    cellData = el;
                    return true;
                }
                return false;
            });

            return Object.keys(cellData).map( ((key, i) => {
                let keyName = key;
                // hide blank fields
                if(!cellData[key] || cellData[key].length === 0) {
                    return '';
                // reword fields
                } else if (key==='documentType') {
                    keyName = 'type';
                } else if (key==='cooperatingAgency') {
                    keyName = 'Cooperating agencies';
                } else if (key==='noiDate') {
                    keyName = 'Notice of Intent (NOI) date'
                } else if (key==='draftNoa') {
                    keyName = 'Draft EIS Notice of Availability (NOA) date'
                } else if (key==='finalNoa') {
                    keyName = 'Final EIS Notice of Availability (NOA) date'
                } else if (key==='firstRodDate') {
                    keyName = 'Record of Decision (ROD) date'
                // exclusions:
                } else if(key==='size' || key==='matchPercent' || key==='commentDate' || key==='id' || key==='id_' || 
                        key==='plaintext' || key==='folder' || key==='link' || key==='notes' || key==='commentsFilename'
                        || key === 'filename' || key==='luceneIds' || key==='status' || key==='processId' || key==='summaryText'
                        || key==='registerDate' || key==='title') { 
                    return '';
                } 
                // else: everything else
                return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> <span className="bold">{cellData[key]}</span></p>);
            }));
        }
    }


    render () {

        if(!this.state.exists) {
            return(
                <div id="details">
                    <label className="errorLabel">{this.state.networkError}</label>
                </div>
            )
        }
        
        return (
            <div id="details">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Record Details - NEPAccess</title>
                    <link rel="canonical" href={"https://nepaccess.org/process-details?id="+Globals.getParameterByName("id")} />
                </Helmet>
                <label className="errorLabel">{this.state.networkError}</label>
                <br />
                {this.showView()}
            </div>
        );
    }


    // After render
	componentDidMount() {
        if(this.props.id) {
            if(!this.state.detailsID || this.state.detailsID !== this.props.id) {
                this.setState({
                    detailsID: this.props.id
                });
            } 
        } else {
            const idString = Globals.getParameterByName("id");
            if(idString){
                this.setState({
                    detailsID: idString
                }, () => {
                    if(!this.state.detailsID) {
                        this.setState({
                            networkError: "No record found (try a different ID)"
                        });
                    }
                });
            }
        }
	}

    componentDidUpdate() {
    }
}