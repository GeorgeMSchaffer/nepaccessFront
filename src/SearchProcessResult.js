import React from 'react';
import axios from 'axios';
import './User/login.css';
import Globals from './globals.js';
import DownloadFile from './DownloadFile.js';

// TODO: Filtering results etc. rerenders and loses track of downloads

export default class SearchProcessResult extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
            fileProgressValue: null,
            downloadText: 'Download',
            downloadClass: 'bold',
            commentProgressValue: null,
            commentDownloadText: 'Download',
            commentDownloadClass: 'download'
        };
    }

    /** Log download */
    logInteraction = (isFolder, recordId) => {
        const _url = new URL('interaction/set', Globals.currentHost);
        const dataForm = new FormData(); 

        dataForm.append('source',"RESULTS");
        
        // individual downloads are presented as DownloadFile components, but could be a comment letter
        if(isFolder) {
            dataForm.append('type',"DOWNLOAD_ARCHIVE"); 
        } else {
            dataForm.append('type','DOWNLOAD_ONE'); // comment letter
        }
        if(recordId) { 
            dataForm.append('docId',recordId);
        } else {
            dataForm.append('docId',this.props.cell._cell.row.data.id);
        }
        
        axios({
            url: _url,
            method: 'POST',
            data: dataForm
        }).then(response => {
            // let responseOK = response && response.status === 200;
            console.log(response.status);
        }).catch(error => { 
            console.error(error);
        })
    }

    hidden = (id) => {
        return this.props.hidden(id);
    }

    hide = (id) => {
        this.props.hideText(id);
    }

    showTitle = () => {
        if (this.props) {
            let _href = `./process-details?id=${this.props.cell._cell.row.data.processId}`;
            if(!this.props.cell._cell.row.data.isProcess) {
                _href = `./record-details?id=${this.props.cell._cell.row.data.processId}`
            }
            return (
                <span className="table-row">
                    <span className="cardHeader">Title:
                        <a className="link" target="_blank" rel="noopener noreferrer" 
                                href={_href}>
                            {this.props.cell._cell.row.data.title} 
                        </a>
                    </span>
                </span>
            );
        }
    }

    showAgency = () => {
        return (
            <div><span className="cardHeader">Agency:
                <span>{this.props.cell._cell.row.data.agency}</span></span>
            </div>
        );
    }
    showState = () => {
        if(this.props && this.props.cell._cell.row.data.state){
            return (
                <div><span className="cardHeader">State:
                    <span>{this.props.cell._cell.row.data.state.replaceAll(";","; ")}</span></span>
                </div>
            );
        } else {
            return (
                <div>
                    <span className="cardHeader">State: <span></span></span>
                </div>
            );
        }
    }

    
    showFilename = () => {
        if(this.props && this.props.cell._cell.row.data.filename){
            return (
                <div><span className="cardHeader filename">Filename:
                    <span>{this.props.cell._cell.row.data.filename}</span></span>
                </div>
            );
        } else if(this.props && this.props.cell._cell.row.data.folder){
            return (
                <div><span className="cardHeader filename">Filename:
                    <span>{this.props.cell._cell.row.data.folder + "_" + this.props.cell._cell.row.data.documentType}.zip</span></span>
                </div>
            );
        } else {
            return <div><span className="cardHeader"></span></div>
        }
    }
    /** Show list of downloadable filenames each with highlight(s) as highlights are populated */ 
    showText = (record) => {
        if(record && record.name){
            let filenames = record.name.split(">");
            // Note: texts should be an array already
            let texts = record.plaintext;
            let combined = filenames.map(function (value, index){
                return [value, texts[index]]
            });

            let _id = record.id; 
            if(!this.props.show) {
                return (
                    <div>
                        (text snippets hidden)
                    </div>
                );
            } else if(this.hidden(record.id)) {
                return (
                    <div>
                        <div>
                            <button className="hide-button" onClick={() => this.hide(record.id)}>Unhide these text snippets</button>
                        </div>
                        ...
                    </div>
                );
            } else if(record.folder) {
                return (
                    <div>
                        <div className="wide-flex">
                            <button className="hide-button" onClick={() => this.hide(record.id)}>Hide these text snippets</button>
                        </div>
                        {combined.map(function(combo, index){
                            return (
                                <span className="fragment-container" key={ index }>
                                    <span className="cardHeader bold filename-inner">
                                        <DownloadFile key={combo[0]} downloadType="nepafile" 
                                            recordId={record.id}
                                            id={_id}
                                            filename={combo[0]}
                                            results={true} />
                                    </span>
                                    
                                    
                                    <span className="card-highlight fragment" 
                                            dangerouslySetInnerHTML={{
                                                __html:combo[1]
                                            }}>
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                );
            } else {
                return (
                    <div>
                        <div className="wide-flex">
                            <button className="hide-button" onClick={() => this.hide(record.id)}>Hide these text snippets</button>
                        </div>
                        {combined.map(function(combo, index){
                            return (
                                <span className="fragment-container" key={ index }>
                                    <span className="cardHeader bold filename-inner">
                                        {combo[0]}
                                    </span>
                                    
                                    
                                    <span className="card-highlight fragment" 
                                            dangerouslySetInnerHTML={{
                                                __html:combo[1]
                                            }}>
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                );
            }
            

        } else if(record && record.matchPercent) {
            return (
                <div className="fragment-container">
                    <div>
                        <span className="cardHeader"><span>
                            {"" + (record.matchPercent*100) + "% Match"}
                        </span></span>
                    </div>
                </div>
            );
        }
    }
    showDate = () => {
        if(this.props && this.props.cell._cell.row.data.registerDate){
            return (
                <div><span className="cardHeader">Date:
                    <span>{this.props.cell._cell.row.data.registerDate}</span></span>
                </div>
            );
        } else {
            return (
                <div><span className="cardHeader">Date:
                    <span></span></span>
                </div>
            );
        }
    }
    showVersion = () => {
        if(this.props && this.props.cell._cell.row.data.documentType){
            return (
                <div>
                    <span className="cardHeader">Type:
                        <span>{this.props.cell._cell.row.data.documentType}</span>
                    </span>
                    
                </div>
            );
        }
    }
    
    // Show download availability, filename, size, and download progress if downloading/downloaded
    showFileDownload = (record) => {
        if (record) {
            let size = 0;
            if(record.size && record.size > 0) {
                size = (Math.ceil((record.size / 1024) / 10.24)/100);
            }

            if(record.size && record.size > 200) {
                if(record.folder) {
                    return this.renderDownload(record.id,size,record.folder,true,"Folder");
                } else if(record.filename) {
                    return this.renderDownload(record.id,size,record.filename,true,"EIS");
                }
            } else {
                return <div className="table-row"><span className="cardHeader filename warning">File(s) not yet available</span></div>;
            }
		}
		else {
			return "";
		}
    }


    showRecords = () => {
        if(this.props && this.props.cell._cell.row.data.records){
            const records = this.props.cell._cell.row.data.records;

            const newRecords = records.map(record => {
                return this.showRecord(record);
            })
            return newRecords;
        }
    }
    showRecord = (record) => {
        return (<div key={record.relevance} className="record">
            <div className="record-line">
                <span className="record-field">
                    <a className="link" target="_blank" rel="noopener noreferrer" href={`./record-details?id=${record.id}`}>
                        {record.documentType}
                    </a>
                </span>
                <span className="record-field">{record.registerDate}</span>
                {this.showFileDownload(record)}
            </div>
            {this.showText(record)}
        </div>)
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



	render() {
        return (
            <div className="table-holder">
                <div className="">
                    <div className="table-like">
                        <div className="table-row cardTitle">
                            {this.showTitle()}
                        </div>
                        <div className="table-meta">
                            {this.showAgency()}
                            {this.showState()}
                        </div>
                    </div>
                    <div className="records">
                        {this.showRecords()}
                    </div>
                </div>
            </div>
        );
    }
}