import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import DownloadFile from './DownloadFile.js';
import RecordDetailsLink from './RecordDetailsLink.js';

class FulltextResults extends React.Component {

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }

    // While the context is working, the columns are not being filled properly on switch for unknown reasons, so we use FulltextResults2 for now
    setupData = (results, context) => {
        // console.log(results);
        // console.log("Context: ", context);
        if(context){
            return results.map((result, idx) =>{
                let doc = result.doc;
                let newObject = {title: doc.title, agency: doc.agency, commentDate: doc.commentDate, 
                    registerDate: doc.registerDate, state: doc.state, documentType: doc.documentType, 
                    filename: doc.filename, 
                    commentsFilename: doc.commentsFilename,
                    id: doc.id,
                    plaintext: result.highlight,
                    name: result.filename
                };
                return newObject;
            });
        // } else if(results[0].title){
        //     return results.map((result, idx) =>{
        //         let doc = result;
        //         let newObject = {title: doc.title, agency: doc.agency, commentDate: doc.commentDate, 
        //             registerDate: doc.registerDate, state: doc.state, documentType: doc.documentType, 
        //             filename: doc.filename, 
        //             commentsFilename: doc.commentsFilename,
        //             documentId: doc.id
        //         };
        //         return newObject;
        //     });
        } else {
            return [];
        }
    }

    setupColumns = (context) => {
        if(context){
            return [
                { title: "Title", field: "title", width: 200, formatter: reactFormatter(<RecordDetailsLink />), variableHeight: true, headerFilter:"input" },
                { title: "Filename", field: "name", width: 200, formatter: "textarea", variableHeight: true, headerFilter:"input" },
                { title: "Text", field: "plaintext", formatter: "html", headerFilter:"input" },
                // { title: "Published date", field: "registerDate", width: 180 }, // can include but space is a premium with context
                { title: "Version", field: "documentType", width: 114, headerFilter:"input" },
                { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
                { title: "EPA Comments", field: "commentsFilename", width: 157, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) }
            ];
        // } else {
        //     return [
        //         { title: "Title", field: "title", formatter: reactFormatter(<RecordDetails />), variableHeight: true },
        //         { title: "Lead Agency", field: "agency", width: 242 },
        //         { title: "Published date", field: "registerDate", width: 180 },
        //         { title: "State", field: "state", width: 112 },
        //         { title: "Version", field: "documentType", width: 114 },
        //         { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
        //         { title: "EPA Comments", field: "commentsFilename", width: 157, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) }
        //     ];
        } else {
            return [];
        }
    }

	render() {

        let results = this.props.results;
        let context = this.props.context;

        if(results && results.length > 0) {

        }
        else {
            return (
                <div id="search-results">
                <h2 id="results-label">{this.props.resultsText}</h2></div>
            );
        }
        
        try {
            let data = this.setupData(results, context);
            let columns = this.setupColumns(context);

            let options = {
                layoutColumnsOnNewData: true,
                tooltips:true,
                responsiveLayout:"collapse",  //collapse columns that dont fit on the table
                pagination:"local",       //paginate the data
                paginationSize:10,       //allow 10 rows per page of data
                paginationSizeSelector:[10, 25, 50],
                movableColumns:true,      //allow column order to be changed
                resizableRows:true,       //allow row order to be changed
                layout:"fitColumns",
                tooltips: false,
                footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
            };

            var resultsText = this.props.resultsText;
            if(resultsText==="100 Results") { // Probably more results, can get rid of this logic if pagination is implemented to support more results
                resultsText = "100+ Results";
            }

            return (
                <div id="search-results">
                    <h2 id="results-label">{resultsText}</h2>
                    <ReactTabulator
                        ref={this.my_table}
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </div>
            );
        }
        catch (e) {
            if(e instanceof TypeError){
                // expected problem with Tabulator trying to render new results before it switches to new column definitions
            } else {
                console.log(e.toString());
            }
            return (
                <div>
                    <h2 id="results-label">{this.props.resultsText}</h2>
                </div>
            )
        }
    }
    
    componentDidUpdate() {
        /** setTimeout with 0ms activates at the end of the Event Loop, redrawing the table and thus fixing the text wrapping.
         * Does not work when simply fired on componentDidUpdate().
         */
        if(this.my_table && this.my_table.current){
            const tbltr = this.my_table.current;
            setTimeout(function() {
                tbltr.table.redraw(true);
            },0)
        }
    }
}

export default FulltextResults;