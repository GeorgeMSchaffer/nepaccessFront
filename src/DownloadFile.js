import React from 'react';
import axios from 'axios';
import './User/login.css';
import Globals from './globals.js';
class DownloadFile extends React.Component {

	// Receives needed props from React-Tabular instance in SearchResults.js
	constructor(props) {
		super(props);
		this.state = { // Each and every download link via <DownloadFile /> has its own state
			progressValue: null,
			downloadText: 'Download',
			downloadClass: 'download'
		};
	}

    // TODO: Cell resets to default state if parent re-renders, preserve the fact it was downloaded
    // at least until user reloads the page or navigates
    // TODO: reset download link if canceled
    // these could be very difficult to figure out for low payoff, however
	download = (filenameOrID, isFolder) => {
        console.log("Downloading: " + filenameOrID);
        console.log("Folder: " + isFolder);
		const FileDownload = require('js-file-download');

		// Indicate download
		this.setState({
			downloadText: 'Downloading...',
			downloadClass: 'disabled_download'
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
					const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    
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
							progressValue: Math.round((progressEvent.loaded * 100) / totalLength) + '%'
						});
                    } else if(progressEvent.loaded){ // Progress as KB
						this.setState({
							progressValue: Math.round(progressEvent.loaded / 1024) + 'KB'
						});
                    }
                    // else progress remains blank
				}
			}).then((response) => {

                // Indicate download completed as file is saved/prompted save as (depending on browser settings)
                if(response){
                    this.setState({
                        downloadText: 'Done'
                    });
                    FileDownload(response.data, _filename);
                }
                
				// verified = response && response.status === 200;
			})
			.catch((err) => { // TODO: Test, This will catch a 404
				this.setState({
					downloadText: 'Download not found',
					downloadClass: 'disabled_download'
				});
				console.log("Error::: ", err);
				this.setState({
					downloadText: 'Error: Not found'
				});
			});

	}

	render() {
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
                }
			}
            else if (this.props.downloadType && this.props.downloadType === "Folder") { // from record details page
                propID = this.props.id;
            }
            else if (this.props.filename) { // filename only
                // console.log("Filename only?: " + this.props.filename);
				propFilename = this.props.filename;
			} 
			if (propFilename) {
                return (
                    <button className = {this.state.downloadClass} onClick = { () => {this.download(propFilename, false)} }> 
                        {this.state.downloadText} {this.state.progressValue} 
                    </button>
                );
			} else if (propID) {
                return (
                    <button className = {this.state.downloadClass} onClick = { () => {this.download(propID, true)} }> 
                        {this.state.downloadText} {this.state.progressValue} 
                    </button>
                );
            } else {
				return propFilename;
			}
		}
		else {
			return "";
		}
	}
}

export default DownloadFile;