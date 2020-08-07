import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import DownloadFile from './DownloadFile.js';
import RecordDetailsLink from './RecordDetailsLink.js';

class FulltextResults2 extends React.Component {

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }
    
    onClearFiltersClick = (e) => {
        if(this.my_table && this.my_table.current){
            const tbltr = this.my_table.current;
            tbltr.table.clearFilter(true);
        }
    }

    setupData = (results) => {
        // console.log(results);
        if(results[0].title){
            return results.map((result, idx) =>{
                let doc = result;
                let newObject = {title: doc.title, agency: doc.agency, commentDate: doc.commentDate, 
                    registerDate: doc.registerDate, state: doc.state, documentType: doc.documentType, 
                    filename: doc.filename, 
                    commentsFilename: doc.commentsFilename,
                    id: doc.id,
                    folder: doc.folder
                };
                return newObject;
            });
        } else {
            return [];
        }
    }

    setupColumns = () => {
            return [
                { title: "Title", field: "title", formatter: reactFormatter(<RecordDetailsLink />), variableHeight: true, headerFilter:"input", headerFilterPlaceholder:"Type to filter results..." },
                { title: "Lead Agency", field: "agency", width: 242, headerFilter:"input" },
                { title: "Published date", field: "registerDate", width: 154, headerFilter:"input" },
                { title: "State", field: "state", width: 112, headerFilter:"input" },
                { title: "Version", field: "documentType", width: 114, headerFilter:"input" },
                { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
                { title: "EPA Comments", field: "commentsFilename", width: 157, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) }
            ];
    }

	render() {

        const results = this.props.results;

        if(results && results.length > 0) {

        }
        else {
            return (
                <div id="search-results">
                <h2 id="results-label">{this.props.resultsText}</h2></div>
            );
        }
        
        try {
            const data = this.setupData(results);
            const columns = this.setupColumns();

            var options = {
                layoutColumnsOnNewData: true,
                tooltips:true,
                responsiveLayout:"collapse",  //collapse columns that dont fit on the table
                pagination:"local",       //paginate the data
                paginationSize:10,       //allow 10 rows per page of data
                paginationSizeSelector:[10, 25, 50],
                movableColumns:true,      //allow column order to be changed
                resizableRows:true,       //allow row order to be changed
                layout:"fitColumns",
                footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
            };

            return (
                <div id="search-results">
                    <h2 id="results-label">{this.props.resultsText}</h2>
                    <button className="link margin" onClick={() => this.onClearFiltersClick()}>Clear filters</button>
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

export default FulltextResults2;