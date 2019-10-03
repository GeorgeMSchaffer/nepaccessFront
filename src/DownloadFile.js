import React from 'react';
import axios from 'axios';
import './login.css';
import Globals from './globals.js';
// TODO: Pass props to this from SearchResults
class DownloadFile extends React.Component {

	constructor(props){
		super(props);
        this.state = { 
            progressValue: null,
            downloadText: 'Download',
            downloadClass: 'download'
        };
	}

    download = (_filename) =>{ // TODO: Create state for row based on filename, use to update download progress?
        const FileDownload = require('js-file-download');
        
        // TODO: Progress bar or at least indication it is downloading
        this.setState({
          downloadText: 'Downloading...',
          downloadClass: 'disabled_download'
        });
        
        // axios.get('http://localhost:8080/file/downloadFile',{
        axios.get(Globals.currentHost + 'file/downloadFile',{
          params: {
            filename: _filename
          },
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            console.log("onUploadProgress", totalLength);
            if (totalLength !== null) {
                this.setState({
                    progressValue: Math.round( (progressEvent.loaded * 100) / totalLength )
                });
            }
          }
        }).then((response) => {
          
          // TODO: Indicate download completed as file is saved/save as prompts depending on browser settings
          this.setState({
            downloadText: 'Downloaded'
          });
          FileDownload(response.data, _filename);
          // verified = response && response.status === 200;
        })
        .catch((err) => { // TODO: This will catch a 404
          // console.log(err);
        });
        
      }

    render(){
        if(this.props){
            if(this.props.downloadType === "Comments"){
              const cellData = this.props.cell._cell.row.data;
              if(cellData.commentsFilename){
                  return <a className={this.state.downloadClass} onClick={() => {this.download(cellData.commentsFilename)} }>{this.state.downloadText} {this.state.progressValue}</a>;
              } else { // Just return the blank unformatted string if that's what we have
                  return cellData.commentsFilename;
              }
            } else if(this.props.downloadType === "EIS"){
              const cellData = this.props.cell._cell.row.data;
              if(cellData.filename){
                  return <a className={this.state.downloadClass} onClick={() => {this.download(cellData.filename)} }>{this.state.downloadText} {this.state.progressValue}</a>;
              } else { // Just return the blank unformatted string if that's what we have
                  return cellData.filename;
              }
            }
          } else {
              return "";
          }
    }
}

export default DownloadFile;