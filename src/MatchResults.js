import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_midnight.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import DownloadFile from './DownloadFile.js';
import RecordDetails from './RecordDetails.js';

class MatchResults extends React.Component {

	render() {
        const results = this.props.results;
        try {
          
            var data = [];
            if(results.docs && results.matches){
            console.log(' results here ', results);
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
            console.log('docs', docs);
            console.log('matches', matches);
            docs.forEach(function(document) {
                matches.forEach(function(match) {
                    console.log(document);
                    console.log(match);
                    // If corresponding elements, concatenate them
                    if(document.id === match.document1 || document.id === match.document2) {
                        // TODO: Test, also get and use ID dynamically
                        data.push(document.matchPercent = (match.match_percent));
                    }
                });
            });
            console.log(' data here ', data);
            } else {
                return (
                    <div>
                    
                    </div>
                )
            }
            const columns = [
                { title: "Title", field: "title", formatter: reactFormatter(<RecordDetails />) },
                { title: "Agency", field: "agency", width: 150 },
                { title: "Register date", field: "registerDate", width: 140 },
                { title: "Comment date", field: "commentDate", width: 140 },
                { title: "State", field: "state", width: 80 },
                { title: "Version", field: "documentType", width: 90 },
                { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
                { title: "Comments", field: "commentsFilename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) },
                { title: "Match", field: "matchPercent", width: 80 }
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
            // This could be used to entirely replace the MySQL fulltext search (fulltext index must add to overhead, and the search behavior is odd)

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

export default MatchResults;