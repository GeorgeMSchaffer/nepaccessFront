import React from 'react';
import {Helmet} from 'react-helmet';

import axios from 'axios';

import DownloadFile from '../DownloadFile.js';
import Chart from './Chart.js';

import Globals from '../globals.js';

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
            process: null,
            processId: null,
            detailsID: null,
            networkError: '',
            exists: true,
            width: 400,
            showMore: [],
            reportText: ''
        };

        if(!this.state.processId) {
            this.populate();
        }
        
        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const WIDTH = parentWidth(document.getElementById('chart'));

        this.setState({
            width: WIDTH
        });
    }

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }
    

    get = async (_url, _params) => {
        try {
            const response = await axios.get(_url, {
                params: _params
            });

            // let responseOK = response && response.status === 200;
            // if (responseOK) {
                return response.data;
            // }
        } catch (error) {
            if(error.response.status === 403 ) {
                this.setState({ 
                    networkError: "Please log in.",
                    exists: false
                });
            }
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
    
    /** Log details page "click" (render) -
     * Since we know it's a process, we'll just be sending any ID from any of the records - they all have the same
     * process ID, so that can be derived from any record.
     * This will also fire if they reload the page, although there's no reason to reload.
     */
    logInteraction = (_id) => {
        const _url = new URL('interaction/set', Globals.currentHost);
        const dataForm = new FormData(); 
        dataForm.append('source',"UNKNOWN"); // Don't know if it's clicked, typed or reloaded until logic changes
        dataForm.append('type',"PROCESS_CLICK"); 
        dataForm.append('docId',_id);

        this.post(_url, dataForm).then(resp => {
            // console.log(resp.status);
        }).catch(e => {
            console.error(e);
        })

    }

    // Send report to server
    reportDataIssue = () => {
        this.setState({ reported: true });
        
        const _url = new URL('reports/report_data_issue', Globals.currentHost);
        const dataForm = new FormData(); 
        dataForm.append('report',this.state.reportText);
        dataForm.append('processId',this.state.processId); 

        this.post(_url, dataForm).then(resp => {
            // console.log(resp.status);
        }).catch(e => {
            console.error(e);
        })
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
                            {this.showTimeline()}
                        </div>
                        {this.showProcess()}
                    </div>
                </div>
            </div>
        );
    }
    showTimeline = () => {
        return <div className="timeline-container">
            <h3 className="timeline-header">Timeline</h3>
            <Chart dates={this.state.dates} WIDTH={this.state.width} />
        </div>
    }
    // Use record id to track showing or hiding of its individual files (empty array on mount)
    showMoreToggle = (id) => {
        let shows = this.state.showMore;
        if(shows.includes(id)) {
            const index = shows.indexOf(id);
            if (index > -1) {
                shows.splice(index, 1);
            }
        } else {
            shows.push(id);
        }

        this.setState({
            showMore: shows
        });
    }

    showFilesNew = (_id, filenames) => {

        let showMore = this.state.showMore.includes(_id);
        
        return filenames.map((_filename, i) => {
            if(i === 0) {
                if(!showMore) {
                    return <span className="show-more-link" onClick={() => {this.showMoreToggle(_id)}}>Show individual file downloads ↴</span>
                } else {
                    return <>
                        <span className="show-more-link" onClick={() => {this.showMoreToggle(_id)}}>Hide individual file downloads</span>
                        <span key={_filename} className="detail-filename">
                            <DownloadFile key={_filename} downloadType="nepafile" 
                                id={_id}
                                filename={_filename}/>
                        </span>
                    </>
                }
            } else if(showMore) {
                return <span key={_filename} className="detail-filename">
                    <DownloadFile key={_filename} downloadType="nepafile" 
                        id={_id}
                        filename={_filename}/>
                </span>
            } 
        });
    }

    showTitle = () => {
        if(this.state.title) {
            return (<p key={-1} className='modal-line'><span className='modal-title'>Title:</span> 
                <span className="bold record-details-title">{this.state.title}</span>
            </p>);
        }
    }

    

    interpretProcess = (process) => {
        process = (process.sort(
            (b,a) => {
                if (b.doc.registerDate > a.doc.registerDate) {
                  return 1;
                }
                if (b.doc.registerDate < a.doc.registerDate) {
                  return -1;
                }
                return 0;
            }
        ));
        
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
                        recordDownload = this.renderDownload(proc.id,size,proc.folder + "_" + proc.documentType + ".zip",true,"Folder");
                    } else if(proc.filename) {
                        recordDownload = this.renderDownload(proc.id,size,proc.filename,true,"EIS");
                    }
                } else {
                    recordDownload = <div className="table-row"><span className="cardHeader filename missing">File(s) not yet available</span></div>;
                }

                // TODO: Record link for admin only
                return (<>
                    <div key={key} className='modal-line'>
                        {/* <span className='modal-title'>
                            <b>{proc.documentType} : {proc.registerDate}</b>
                        </span> */}
                        <a href={window.location.href.split("/")[0]+"record-details?id="+proc.id} target="_blank" rel="noreferrer">
                            <span className='modal-title'>
                                <b>{proc.documentType} : {proc.registerDate}</b>
                            </span>
                        </a>
                        {recordDownload}
                    </div>
                    <div className="individual-files" key={key+"Files"}>
                        {this.showFilesNew(proc.id,filenames)}
                    </div>
                </>);
            } else {
                return "";
            }
        }));
    }

    showProcess = () => {
        if(this.state.processId && this.state.process) {

            // already have this data. No need for any axios calls
            if(this.state.process.length > 0) { 
                for(let i = 0; i < this.state.process.length; i++) {
                    return (
                        <div className="metadata-container process-files">
                            <h3>Files</h3>
                            {this.interpretProcess(this.state.process)}
                            {this.showDataIssueLink()}
                        </div>);
                }
            }

        }
    }
    showDataIssueLink = () => {
        return (<div className="report-holder">
                <span   className="report-link" 
                        hidden={this.state.linkClicked || this.state.reported} 
                        onClick={() => { this.setState({ linkClicked:true }) }}>
                    Report data issue
                </span>
                <div hidden={!this.state.linkClicked || this.state.reported}>
                    <div>Type report here:</div>
                    <textarea name="reportText" onChange={this.onChange} value={this.state.reportText} />
                    <span   className="report-link"
                            onClick={() => { this.reportDataIssue() }}>
                        Send report
                    </span>
                </div>
                <span hidden={!this.state.reported}>Report sent.  Thank you!</span>
            </div>);
    }

    // Gets all metadata records for this process if available
    populate = (_processId) => {

        if(!this.state.processId && this.state.detailsID) {
            // need to get and build
            const url = Globals.currentHost + "test/get_process_full";
            const params = {processId: _processId};

            //Send the AJAX call to the server
            this.get(url, params).then(response => {
                if(response && response.length > 0) {
                    let _title = response[0].doc.title;
                    for(let i = 0; i < response.length; i++) {
                        if(Globals.isFinalType(response[i].doc.documentType)) {
                            _title = response[i].doc.title;
                        }
                    }

                    // For Chart (timeline of dates)
                    let _dates = [];
                    response.forEach(record => {
                        _dates.push({registerDate: record.doc.registerDate, documentType: record.doc.documentType});
                    });
                    
                    this.setState({
                        processId: _processId,
                        process: response,
                        title: _title,
                        dates: _dates
                    }, () => {
                        this.logInteraction(response[0].doc.id);
                    });
                } // error handled inside get()
            })
            .catch(error => {
                console.error(error);
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
                if(Globals.isFinalType(el.doc.documentType)) {
                    cellData = el.doc;
                    return true;
                }
                return false;
            });

            return Object.keys(cellData).map( (key, i) => {
                let keyName = key;
                // hide blank fields
                if(!cellData[key] || cellData[key].length === 0) {
                    return '';
                } else if(key==='department' && cellData[key] && cellData['agency'] && cellData[key]===cellData['agency']) {
                    // No great need to show department if it's equal to agency, at least until departments are cleaned up manually
                    return '';
                // reword fields;
                } else if (key==='cooperatingAgency') {
                    keyName = 'Cooperating agencies';
                    
                    const coops = cellData[key].split(';').map( (coop,j) => {
                        return <span key={key+j} className="cooperating block"><b>{coop}</b></span>;
                    })

                    return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> {coops}</p>);
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
                        || key==='registerDate' || key==='title' || key==='documentType') { 
                    return '';
                } 

                return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> <span className="bold">{cellData[key]}</span></p>);
            });
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
        const idString = Globals.getParameterByName("id");
        if(idString){
            this.setState({
                detailsID: idString,
                width: parentWidth(document.getElementById('chart')) - 90
            }, () => {
                this.populate(idString);
            });
        }
	}

    componentDidUpdate(props,state) {
        // console.log(state);
    }
}

function parentWidth(elem) {
    if(elem && elem.clientWidth) {
        return Math.max(elem.clientWidth*.6,400);
    } else {
        return 400;
    }
}