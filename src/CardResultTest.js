import React from 'react';
import axios from 'axios';
import './User/login.css';
import Globals from './globals.js';
// import DownloadFile from './DownloadFile.js';
import CardDetailsLink from './CardDetailsLink.js';

// TODO: May be wise to have child components for each element that may change (i.e. download links)
// TODO: Right now, results from initialSearch include a filename string with zero to many 
// comma-separated filenames.  So, CardResult will have to parse that, 
// and distribute highlights appropriately.

class CardResult extends React.Component {

	// Receives needed props from React-Tabular instance in SearchResults.js
	constructor(props) {
		super(props);
		this.state = { 
            fileProgressValue: null,
			downloadText: 'Download',
            downloadClass: 'download',
            commentProgressValue: null,
            commentDownloadText: 'Download',
            commentDownloadClass: 'download'
		};
    }
    
	download = (filenameOrID, isFolder, downloadTextName, className, progressName) => {
        // console.log("Downloading with filename; folder; dtn; class; progress",filenameOrID,isFolder,downloadTextName,className,progressName);
		const FileDownload = require('js-file-download');

		// Indicate download
		this.setState({
			[downloadTextName]: 'Downloading...',
			[className]: 'disabled_download'
        });
        
        let _filename = filenameOrID;
        if(isFolder){ // folder case handles this on download if _filename===null
            _filename = null;
        }

        let getRoute = Globals.currentHost + 'file/downloadFile';
        if(isFolder){
            getRoute = Globals.currentHost + 'file/downloadFolder';
        }
		axios.get(getRoute, {
            params: {
                filename: filenameOrID,
                id: filenameOrID
            },
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => { // Show progress if available
                let totalLength = null;

                if(progressEvent){
                    totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') 
                        || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                } 

                if(isFolder && !_filename){ // multi-file case, archive filename needs to be extracted from header
                    // filename is surrounded by "quotes" so get that and remove those
                    let fileInfo = progressEvent.target.getResponseHeader('content-disposition');
                    if (!fileInfo){
                        return null; // Never mind
                    }
                    let fileInfoName = fileInfo.split("filename=");

                    // set filename for saving from backend, sans quotes
                    _filename = fileInfoName[1].substr(1, fileInfoName[1].length - 2);
                }

                if (totalLength !== null) { // Progress as percent, if we have total
                    this.setState({
                        [progressName]: Math.round((progressEvent.loaded * 100) / totalLength) + '%'
                    });
                } else if(progressEvent.loaded){ // Progress as KB
                    this.setState({
                        [progressName]: Math.round(progressEvent.loaded / 1024) + 'KB'
                    });
                }
                // else progress remains blank
            }
        }).then((response) => {

            // Indicate download completed as file is saved/prompted save as (depending on browser settings)
            if(response){
                this.setState({
                    [downloadTextName]: 'Done'
                });
                FileDownload(response.data, _filename);
            }
            
            // verified = response && response.status === 200;
        })
        .catch((err) => {
            this.setState({
                [downloadTextName]: 'Download not found',
                [className]: 'disabled_download'
            });
            // console.log("Error::: ", err);
            this.setState({
                downloadText: 'File not found'
            });
        });

    }

    showTitle = () => {
        if (this.props) {
            return (
                <CardDetailsLink 
                    id={this.props.cell._cell.row.data.id} 
                    title={this.props.cell._cell.row.data.title} 
                />
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
                    <span>{this.props.cell._cell.row.data.folder}.zip</span></span>
                </div>
            );
        } else {
            return <div><span className="cardHeader"></span></div>
        }
    }
    // End goal: Show list of filenames each with highlight(s) as highlights are populated
    showTextTest = () => {
        if(this.props && this.props.cell._cell.row.data.name){
            let filenames = this.props.cell._cell.row.data.name.split(">");
            let texts = this.props.cell._cell.row.data.plaintext.split(">");
            
            for(let i = 0; i < filenames.length; i++){
                return (
                    <div className="fragment-container">
                        <span className="cardHeader bold filename-inner">
                            {filenames[i]}
                        </span>
                        <span hidden={!this.props.show} 
                            dangerouslySetInnerHTML={{
                                __html: texts[i]
                        }} />
                    </div>
                );
            }
        } else if(this.props && this.props.cell._cell.row.data.matchPercent) {
            return (
                <div className="fragment-container">
                    <div>
                        <span className="cardHeader"><span>
                            {"" + (this.props.cell._cell.row.data.matchPercent*100) + "% Match"}
                        </span></span>
                    </div>
                </div>
            );
        }
    }
    showText = () => {
        if(this.props && this.props.cell._cell.row.data.plaintext){
            let innerFilename = "";
            if(this.props.cell._cell.row.data.name){
                innerFilename = this.props.cell._cell.row.data.name;
            }
            return (
                <div className="fragment-container">
                    <span className="cardHeader bold filename-inner">
                        {innerFilename}
                    </span>
                    <span hidden={!this.props.show} 
                        dangerouslySetInnerHTML={{
                            __html: this.props.cell._cell.row.data.plaintext
                    }} />
                </div>
            );
        } else if(this.props && this.props.cell._cell.row.data.matchPercent) {
            return (
                <div className="fragment-container">
                    <div>
                        <span className="cardHeader"><span>
                            {"" + (this.props.cell._cell.row.data.matchPercent*100) + "% Match"}
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
        }
    }
    showState = () => {
        if(this.props && this.props.cell._cell.row.data.state){
            return (
                <div><span className="cardHeader">State:
                    <span>{this.props.cell._cell.row.data.state}</span></span>
                </div>
            );
        } else {
            return (
                <div>
                    <span className="cardHeader">State: <span>?</span></span>
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

    // getFilenames = (_id) => {
    //     let filenamesUrl = Globals.currentHost + "file/filenames";

    //     //Send the AJAX call to the server
    //     axios.get(filenamesUrl, {
    //         params: {
    //             document_id: _id
    //         }
    //         }).then(response => {
    //             let responseOK = response && response.status === 200;
    //             if (responseOK && response.data && response.data.length > 0) {
    //                 this.setState({
    //                     filenames: response.data
    //                 });
    //             }
    //         }).catch(error => {
    //     });
    // }
    
    // TODO: Rework when we have folder file sizes
    showFileDownload = () => {
        if (this.props) {
			let cellData = null;
            let propFilename = null;
            let propID = null;
			if (this.props.cell) { // filename/cell data from React-Tabulator props
                cellData = this.props.cell._cell.row.data;
                // console.log(cellData);
				if (this.props.downloadType === "Comments") {
					propFilename = cellData.commentsFilename;
                }
                else if (cellData.id && cellData.folder) {
                    propID = cellData.id;
                }
				else if (this.props.downloadType === "EIS") {
					propFilename = cellData.filename;
                } else {
					propFilename = cellData.filename;
                }
			}
            else if (this.props.downloadType && this.props.downloadType === "Folder") { // from record details page
                propID = this.props.id;
            }
            else if (this.props.filename) { // filename only
                // console.log("Filename only?: " + this.props.filename);
				propFilename = this.props.filename;
            } 

            let size = 0;
            if(cellData.size && cellData.size > 0) {
                size = parseInt(cellData.size / 1024);
            }
            
			if (propFilename && size) {
                return (
                    <div className="table-row">
                        <span className="cardHeader">EIS:
                            <button className = {this.state.downloadClass + " document-download"} onClick = { () => {this.download(propFilename, false, "downloadText", "downloadClass", "fileProgressValue")} }> 
                                <span className="innerText">
                                    {this.state.downloadText} {this.state.fileProgressValue} {" " + size + " KB"}
                                </span>
                            </button>
                        </span>
                        
                    </div>
                );
			} else if (propID && size) {
                return (
                    <div className="table-row">
                        <span className="cardHeader">EIS:
                            <button className = {this.state.downloadClass + " document-download"} onClick = { () => {this.download(propID, true, "downloadText", "downloadClass", "fileProgressValue")} }> 
                                <span className="innerText">
                                    {this.state.downloadText} {this.state.fileProgressValue} {" " + size + " KB"}
                                </span>
                            </button>
                        </span>
                        
                    </div>
                );
            } else {
                return <div className="table-row"><span className="cardHeader">EIS File not in system</span></div>;
            }
		}
		else {
			return "";
		}
    }

    // TODO: Don't show this if the actual file is for some reason missing from the server
    showCommentsDownload = () => {
        if (this.props) {
			let cellData = null;
            let propFilename = null;
            
			if (this.props.cell) { // filename/cell data from React-Tabulator props
                cellData = this.props.cell._cell.row.data;
				if (cellData.commentsFilename) {
					propFilename = cellData.commentsFilename;
                }
            }
            
			if (propFilename) {
                return (
                    <div className="table-row">
                        <span className="cardHeader">EPA Comments:
                            <button 
                                className = {this.state.commentDownloadClass} 
                                onClick = { () => {
                                    this.download(propFilename, false, "commentDownloadText", "commentDownloadClass", "commentProgressValue")} 
                                }> 
                                <span className="innerText">
                                    {this.state.commentDownloadText} {this.state.commentProgressValue} 
                                </span>
                            </button>
                        </span>
                        
                    </div>
                );
            } else {
				return "";
			}
		}
		else {
			return "";
		}
    }

	render() {
        return (<>
            <div className="table-holder">
                <div className="upper-tables">
                    <div className="table-like">
                        <div className="table-row cardTitle">
                            {this.showTitle()}
                        </div>
                        <div className="table-row table-meta">
                            {this.showVersion()}
                            {this.showDate()}
                            {this.showAgency()}
                            {this.showState()}
                        </div>
                    </div>
                    <div className="table-like">
                        {this.showFilename()}
                        {this.showFileDownload()}
                        {this.showCommentsDownload()}
                    </div>
                </div>
                {this.showTextTest()}
            </div>
            
        </>);
    }
    
    componentDidMount() {
        // if(
        //     this.props 
        //     && this.props.cell._cell.row.data.id 
        //     && (this.props.cell._cell.row.data.folder || this.props.cell._cell.row.data.filename)
        // ) {
        //     this.getFilenames(this.props.cell._cell.row.data.id);
            // if(this.props.cell._cell.row.data.filename) {
                // This means we can run a file size query, however in the future we want to
                // have file sizes stored in the database so we don't have to ask the file server for them
            // }
        // }
    }
}

export default CardResult;