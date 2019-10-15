import React from 'react';
import './index.css';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_midnight.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import DownloadFile from './DownloadFile.js';

class SearchResults extends React.Component {

	render() {
      // console.log("SearchResults");

      // TODO: At some point, the backend/database should probably be giving us the headers to use.
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
              { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>)},
              { title: "Comments", field: "commentsFilename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>)}
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
          // This could also be used to entirely replace the MySQL fulltext search, which is weird.

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

export default SearchResults;