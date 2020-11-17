import React from 'react';

import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import '../card.css';
import '../sidebar.css';
import '../css/tabulator.css';

import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";

// import DownloadFile from '../DownloadFile.js';
import CardResult from '../CardResult.js';

// import RecordDetailsLink from './RecordDetailsLink.js';

class MatchResults extends React.Component {

    constructor(props) {
        super(props);
        
        this.match_table = React.createRef();
    }

	render() {
        try {
            console.log("Rendering",this.props.results);
            if(this.props.results) {
                // proceed
            } else { // return early
                return (
                    <div>
                        <h2>{this.props.resultsText}</h2>
                    </div>
                )
            }
            // const columns = [
            //     { title: "Title", field: "title" },
            //     { title: "Lead Agency", field: "agency", width: 150 },
            //     { title: "Date", field: "registerDate", width: 90 },
            //     { title: "State", field: "state", width: 80 },
            //     { title: "Version", field: "documentType", width: 90 },
            //     { title: "Documents", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
            //     { title: "EPA Comments", field: "commentsFilename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) },
            //     { title: "Match", field: "matchPercent", width: 95 }
            // ];
            
            const columns = [
                { title: "", field: "", formatter: reactFormatter(<CardResult />)}
            ];

            var options = {
                tooltips:false,
                // responsiveLayout:"collapse",  //collapse columns that dont fit on the table
                // responsiveLayoutCollapseUseFormatters:false,
                pagination:"local",       //paginate the data
                paginationSize:10,       //allow 10 rows per page of data
                paginationSizeSelector:[10, 25, 50, 100],
                movableColumns:false,      //allow column order to be changed
                resizableRows:false,       //allow row order to be changed
                resizableColumns:false,
                layout:"fitColumns",
                invalidOptionWarnings:false, // spams warnings without this
                footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
            };

            // TODO: Rig up a filter to help narrow down the results with another search.
            // This could be used to entirely replace the MySQL fulltext search (fulltext index must add to overhead, and the search behavior is odd)

            // Could use just a bool prop to build the results text here instead of resultsText prop?
            return (
                <div className='modal-results'>
                    {/* <h2>{results.length} Results</h2> */}
                    <h2>{this.props.resultsText}</h2>
                    <div className="tabulator-holder">
                        <ReactTabulator
                            ref={this.match_table}
                            data={this.props.results}
                            columns={columns}
                            options={options}
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
                    <h2>{this.props.resultsText}</h2>
                    <ReactTabulator />
                </div>
            )
        }
    }

    componentDidUpdate() {
        // console.log("Results updated");
        if(this.match_table && this.match_table.current){
            const tbltr = this.match_table.current;
            setTimeout(function() {
                tbltr.table.redraw(true);
            },0)
        }
    }

}

export default MatchResults;