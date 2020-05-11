import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import DownloadFile from './DownloadFile.js';
import RecordDetails from './RecordDetails.js';

class FulltextResults extends React.Component {

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }

	render() {
      console.log("FulltextResults");

      const results = this.props.results;

      console.log(results);

    //   if(results.length == 0){
    //       return (
    //             <div id="search-results"></div>
    //         );
    //   }
      try {
          var data = results.map((result, idx) =>{
              let doc = result.doc;
              let newObject = {title: doc.title, agency: doc.agency, commentDate: doc.commentDate, 
                registerDate: doc.registerDate, state: doc.state, documentType: doc.documentType, 
                filename: doc.filename, 
                commentsFilename: doc.commentsFilename,
                documentId: doc.id,
                plaintext: result.highlight
                };
              return newObject;
          });
          
          const columns = [
              { title: "Title", field: "title", width: 200, formatter: reactFormatter(<RecordDetails />), variableHeight: true },
              { title: "Text", field: "plaintext", formatter: "html" },
              { title: "Version", field: "documentType", width: 114 },
              { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
              { title: "Comments", field: "commentsFilename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) }
          ];

          var options = {
              layoutColumnsOnNewData: true,
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
              <div id="search-results">
                {/* <button className="button" onClick={() => this.testRedraw()}>Test redraw</button> */}
                <h2 id="results-label">{this.props.resultsText}</h2>
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
              <h2 id="results-label">{this.props.resultsText}</h2>
              <ReactTabulator />
          </div>
          )
      }
    }
    
    // testRedraw = () => {
    //     if(this.my_table.current){
    //         this.my_table.current.table.redraw();
    //         console.log(this.my_table.current);
    //         console.log("Redrawn manually");
    //     }
    // }

    componentDidUpdate() {
        // console.log("Update");
        /** setTimeout with 0ms activates at the end of the Event Loop, redrawing the table and thus fixing the text wrapping.
         * Does not work when simply fired on componentDidUpdate().
         */
        // if(this.my_table){
        //     const tbltr = this.my_table.current;
        //     setTimeout(function() {
        //         console.log(tbltr);
        //         // Redraw table to fix text wrapping issues
        //         tbltr.table.redraw();
        //         // console.log("Redrawn automatically");
        //     },0)
        // }
    }
}

export default FulltextResults;