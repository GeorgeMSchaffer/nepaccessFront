import React from 'react';
import axios from 'axios';
import './index.css';
import Globals from './globals.js';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_midnight.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";

class SearchResults extends React.Component {

	render() {
        // console.log("SearchResults");

	    // TODO: At some point, the database should probably be giving us the headers to use.
        const results = this.props.results;
        try {
            var data = results.map((result, idx) =>{
                var newObject = {title: result.title, agency: result.agency, commentDate: result.commentDate, 
                registerDate: result.registerDate, state: result.state, documentType: result.documentType, 
                filename: result.filename, 
                commentsFilename: result.commentsFilename};
                return newObject;
            });
            
            const columns = [
                { title: "Title", field: "title" },
                { title: "Agency", field: "agency", width: 150 },
                { title: "Register date", field: "registerDate", width: 140 },
                { title: "Comment date", field: "commentDate", width: 140 },
                { title: "State", field: "state", width: 80 },
                { title: "Version", field: "documentType", width: 90 },
                { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile />)},
                { title: "Comments", field: "commentsFilename", width: 150, formatter: reactFormatter(<DownloadComments />)}
            ];

            var options = {
                tooltips:true,
                responsiveLayout:"collapse",  //collapse columns that dont fit on the table
                pagination:"local",       //paginate the data
                paginationSize:"25",       //allow 25 rows per page of data
                movableColumns:true,      //allow column order to be changed
                resizableRows:true,       //allow row order to be changed
                layout:"fitColumns"
            };

            // TODO: Rig up a filter to help narrow down the results with another search.
            // This could also be used to entirely replace the MySQL fulltext search.
            // However, Tabulator doesn't work super great with React.

            // Could use just a bool prop to build the results text here instead of resultsText prop?
            return (
                <div>
                    {/* <h2>{results.length} Results</h2> */}
                    <h2>{this.props.resultsText}</h2>
                    <ReactTabulator
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </div>
            )
        }
        catch (e) {
            console.log(e.toString());
            // Show the user something other than a blank page
            return (
            <div>
                <h2>{this.props.resultsText}</h2>
                <ReactTabulator />
            </div>
            )
        }
	}
}

function DownloadFile(props) {
    const cellData = props.cell._cell.row.data;
    if(cellData.filename){
        return <a className="download" onClick={() => {download(cellData.filename)} }>Download</a>;
    } else { // Just return the blank unformatted string if that's what we have
        return cellData.filename;
    }
}

function DownloadComments(props) {
    const cellData = props.cell._cell.row.data;
    if(cellData.commentsFilename){
        return <a className="download" onClick={() => {download(cellData.commentsFilename)} }>Download</a>;
    } else { // Just return the blank unformatted string if that's what we have
        return cellData.commentsFilename;
    }
}

function download(_filename) { // TODO: Create state for row based on filename, use to update download progress?
    const FileDownload = require('js-file-download');
    
    // TODO: Progress bar or at least indication it is downloading

    // axios.get('http://localhost:8080/file/downloadFile',{
    axios.get(Globals.currentHost + 'file/downloadFile',{
      params: {
        filename: _filename
      },
      responseType: 'blob'
    })
    .then((response) => {
      
      // TODO: Indicate download completed as file is saved/save as prompts depending on browser settings
      FileDownload(response.data, _filename);
      // verified = response && response.status === 200;
    })
    .catch((err) => { // TODO: This will catch a 404
      // console.log(err);
    });
    
  }

export default SearchResults;