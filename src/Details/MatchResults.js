import React from 'react';

import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import '../card.css';
import '../sidebar.css';
import '../css/tabulator.css';

import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";

// import DownloadFile from '../DownloadFile.js';
import SearchResult from '../SearchResult.js';

// import RecordDetailsLink from './RecordDetailsLink.js';

class MatchResults extends React.Component {

    constructor(props) {
        super(props);
        
        this.match_table = React.createRef();
    }

	render() {
        try {
            // console.log("Rendering",this.props.results);
            if(this.props.results) {
                // proceed
            } else { // return early
                return (
                    <div>
                        <h2>{this.props.resultsText}</h2>
                    </div>
                )
            }
            
            const columns = [
                { title: "", field: "", formatter: reactFormatter(<SearchResult />)}
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