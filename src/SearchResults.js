import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import DownloadFile from './DownloadFile.js';
import RecordDetails from './RecordDetails.js';

class SearchResults extends React.Component {

    constructor(props) {
        super(props);
    }

	render() {
      console.log("SearchResults");

      // TODO: At some point, the backend/database should probably be giving us the headers to use.
      const results = this.props.results;
      try {
          var data = results.map((result, idx) =>{
              var newObject = {title: result.title, agency: result.agency, commentDate: result.commentDate, 
              registerDate: result.registerDate, state: result.state, documentType: result.documentType, 
              filename: result.filename, 
              commentsFilename: result.commentsFilename,
              id: result.id};
              return newObject;
          });
          
          const columns = [
              { title: "Title", field: "title", formatter: reactFormatter(<RecordDetails />) },
              { title: "Lead Agency", field: "agency", width: 242 },
              { title: "Published date", field: "registerDate", width: 180 },
              { title: "State", field: "state", width: 112 },
              { title: "Version", field: "documentType", width: 114 },
              { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
              { title: "Comments", field: "commentsFilename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) }
          ];

          var options = {
              tooltips:true,
              responsiveLayout:"collapse",  //collapse columns that dont fit on the table
              pagination:"local",       //paginate the data
              paginationSize:10,       //allow 10 rows per page of data
              paginationSizeSelector:[10, 25, 50, 100],
              movableColumns:true,      //allow column order to be changed
              resizableRows:true,       //allow row order to be changed
              layout:"fitColumns"
          };
          
          return (
              <div>
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