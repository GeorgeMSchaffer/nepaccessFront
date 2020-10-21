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
        this.state = {
            data: [],
            showContext: true
        }
        this.my_table = React.createRef();

        // Table needs help to resize its cells if window is resized
        window.addEventListener('resize', this.handleResize);
    }

	render() {
        const results = this.props.results;
        try {
          
            var data = [];
            if(results && results.docs && results.matches) {
            // console.log(' results here ', results);
            var matches = results.matches.map((result, idx) => {
                let newObject = {
                    matchId: result.match_id, document1: result.document1, document2: result.document2,
                    matchPercent: result.match_percent
                };
                return newObject;
            });
            var docs = results.docs.map((result, idx) =>{
                let newObject = {title: result.title, agency: result.agency, commentDate: result.commentDate, 
                    registerDate: result.registerDate, state: result.state, documentType: result.documentType, 
                    filename: result.filename, 
                    commentsFilename: result.commentsFilename,
                    id: result.id
                };
                return newObject;
                });
            // console.log('docs', docs);
            // console.log('matches', matches);
            docs.forEach(function(document) {
                matches.forEach(function(match) {
                    // console.log(document);
                    // console.log(match);
                    // If corresponding elements, concatenate them
                    if(document.id === match.document1 || document.id === match.document2) {
                        // TODO: Test live, also get and use ID dynamically, get and use match% dynamically
                        // console.log("Match: " + document.id);
                        document.matchPercent = match.matchPercent;
                        data.push(document);
                    }
                });
            });

            if(data.length > 0){
                data.sort((a, b)  => (a.matchPercent < b.matchPercent) ? 1 : -1);
            }

            // console.log(' data here ', data);
            } else {
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
                            ref={this.my_table}
                            data={data}
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
        if(this.my_table && this.my_table.current){
            const tbltr = this.my_table.current;
            setTimeout(function() {
                tbltr.table.redraw(true);
            },0)
        }
    }

}

export default MatchResults;