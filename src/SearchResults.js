import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import DownloadFile from './DownloadFile.js';
import RecordDetailsLink from './RecordDetailsLink.js';
// import DetailsLink from './DetailsLink.js';

import { Link, Switch, Route } from 'react-router-dom';

class SearchResults extends React.Component {

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }

    // Only works when results focused (ie clicking on a row), could focus programmatically after hitting enter.
    /** Left and right arrow keys scroll results pages */
    onArrow = (e) => {
        if(this.my_table){
            const tbltr = this.my_table.current;
            if(e.which===39){
                tbltr.table.nextPage();
            } else if(e.which===37){
                tbltr.table.previousPage();
            }
        }
    }

    onClearFiltersClick = (e) => {
        if(this.my_table && this.my_table.current){
            const tbltr = this.my_table.current;
            tbltr.table.clearFilter(true);
            // tbltr.table.clearHeaderFilter();
        }
    }

	render() {
    //   console.log("SearchResults");
      if(this.my_table){
        // if(this.my_table.props.data.length > 0){
            // console.log(this.my_table);
            // this.my_table.table.setSort("title", "asc");
            // this.my_table.table.redraw();
            // console.log("Redrawn");
        // }
      }

      // Note: At some point, the backend/database could give us the headers to use.
      const results = this.props.results;
    //   if(results.length == 0){
    //       return (
    //             <div id="search-results"></div>
    //         );
    //   }
      try {
          var data = results.map((result, idx) =>{
              var newObject = {title: result.title, agency: result.agency, commentDate: result.commentDate, 
              registerDate: result.registerDate, state: result.state, documentType: result.documentType, 
              filename: result.filename, 
              commentsFilename: result.commentsFilename,
              id: result.id,
              folder: result.folder};
              return newObject;
          });
          
          const columns = [
              { title: "Title", field: "title", formatter: reactFormatter(<RecordDetailsLink />), variableHeight: true, headerFilter:"input", headerFilterPlaceholder:"Type to filter results..." },
              { title: "Lead Agency", field: "agency", width: 242, headerFilter:"input" },
              { title: "Published date", field: "registerDate", width: 154, headerFilter:"input" },
              { title: "State", field: "state", width: 112, headerFilter:"input" },
              { title: "Version", field: "documentType", width: 114, headerFilter:"input" },
              { title: "Documents", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
              { title: "EPA Comments", field: "commentsFilename", width: 157, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) }
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
              layout:"fitColumns",
              tooltips: false,
              maxHeight:"100%",
              footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
          };
          
          return (
              <div id="search-results">
                {/* <button className="button" onClick={() => this.testRedraw()}>Test redraw</button> */}
                <h2 id="results-label">{this.props.resultsText}</h2>
                <button className="link margin" onClick={() => this.onClearFiltersClick()}>Clear filters</button>
                <div className="tabulator-holder">
                    <ReactTabulator
                        ref={this.my_table}
                        data={data}
                        columns={columns}
                        options={options}
                        dataLoading={()=>{
                        }}
                        dataLoaded={()=>{
                        }}
                        onKeyUp={this.onArrow}
                        rowClick={(e, row) => this.Action}
                        
                    />
                </div>
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
    //         this.my_table.current.table.redraw(true);
    //         console.log(this.my_table.current);
    //         console.log("Redrawn manually");
    //     }
    // }

    componentDidUpdate() {
        // console.log("Update");
        /** setTimeout with 0ms activates at the end of the Event Loop, redrawing the table and thus fixing the text wrapping.
         * Does not work when simply fired on componentDidUpdate().
         */
        if(this.my_table){
            const tbltr = this.my_table.current;
            setTimeout(function() {
                // console.log(tbltr);
                // Redraw table to fix text wrapping issues
                tbltr.table.redraw(true);
                // console.log("Redrawn automatically");
            },0)
        }
    }
}

export default SearchResults;