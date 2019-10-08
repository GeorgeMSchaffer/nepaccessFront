import React from 'react';
import axios from 'axios';
import './login.css';
import Globals from './globals.js';
class DownloadFile extends React.Component {

  // Receives needed props from React-Tabular instance in SearchResults.js
	constructor(props){
		super(props);
      this.state = { // Each and every download link via <DownloadFile /> has its own state
        progressValue: null,
        downloadText: 'Download',
        downloadClass: 'download'
      };
	}

    download = (_filename) =>{
        const FileDownload = require('js-file-download');
        
        // Indicate download
        this.setState({
          downloadText: 'Downloading...',
          downloadClass: 'disabled_download'
        });
        
        axios.get(Globals.currentHost + 'file/downloadFile',{
          params: {
            filename: _filename
          },
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => { // Show progress if available
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            // console.log("onDownloadProgress", totalLength);
            if (totalLength !== null) {
              this.setState({
                  progressValue: Math.round( (progressEvent.loaded * 100) / totalLength ) + '%'
              });
            } // else progress remains blank
          }
        }).then((response) => {
          
          // Indicate download completed as file is saved/prompted save as (depending on browser settings)
          this.setState({
            downloadText: 'Downloaded'
          });
          FileDownload(response.data, _filename);
          // verified = response && response.status === 200;
        })
        .catch((err) => { // TODO: Test, This will catch a 404
          this.setState({
            downloadText: 'Download not found',
            downloadClass: 'disabled_download'
          });
          // console.log(err);
        });
        
      }

    render(){ // TODO: Test
      if(this.props){
        const cellData = this.props.cell._cell.row.data;
        let propFilename = null;
        // Should receive exactly one downloadType prop and one filename prop (this.props.cell._cell.row.data.____)
        if(this.props.downloadType === "Comments"){
          propFilename = cellData.commentsFilename;
        } else if(this.props.downloadType === "EIS"){
          propFilename = cellData.filename;
        }
        if(propFilename){
          return <a className={this.state.downloadClass} onClick={() => {this.download(propFilename)} }>{this.state.downloadText} {this.state.progressValue}</a>;
        } else {
          return propFilename;
        }
      } else {
        return "";
      }
    }
}

export default DownloadFile;