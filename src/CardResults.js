import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import CardResult from './CardResult.js';

import './card.css';

class CombinedResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.my_table = React.createRef();
    }
    
    onClearFiltersClick = (e) => {
        if(this.my_table && this.my_table.current){
            const tbltr = this.my_table.current;
            tbltr.table.clearFilter(true);
        }
    }

    // While the context is working, the columns are not being filled properly on switch for unknown reasons, so we use FulltextResults2 for now
    setupData = () => {
        if(this.props.results){
            let _data = [];
            if(this.props.results[0] && this.props.results[0].doc) {
                _data = this.props.results.map((result, idx) =>{
                    let doc = result.doc;
                    let newObject = {title: doc.title, agency: doc.agency, commentDate: doc.commentDate, 
                        registerDate: doc.registerDate, state: doc.state, documentType: doc.documentType, 
                        filename: doc.filename, 
                        commentsFilename: doc.commentsFilename,
                        id: doc.id,
                        folder: doc.folder,
                        plaintext: result.highlight,
                        name: result.filename
                    };
                    return newObject;
                }); 
            } else {
                _data = this.props.results.map((result, idx) =>{
                    let doc = result;
                    let newObject = {title: doc.title, agency: doc.agency, commentDate: doc.commentDate, 
                        registerDate: doc.registerDate, state: doc.state, documentType: doc.documentType, 
                        filename: doc.filename, 
                        commentsFilename: doc.commentsFilename,
                        id: doc.id
                    };
                    return newObject;
                }); 
            }
            
            try {
                this.my_table.current.table.setData(_data);
                // this.my_table.current.table.addData(_data,false);
                // this.setState({
                //     data: _data
                // });
                // console.log(_data);
            } catch (e) {
                // that's okay
            }
        }
    }

    setupColumns = () => {
        if(this.props.results){

            let _columns = [];

            if(this.props.results[0] && this.props.results[0].doc) {

                _columns = [
                    { title: "", field: "", formatter: reactFormatter(<CardResult />)}
                ];

            } 
            // else {
            //     _columns = [
            //         { title: "Title", field: "title", minWidth: 200, formatter: reactFormatter(<RecordDetailsLink />), headerFilter:"input" },
            //         { title: "Lead Agency", field: "agency", width: 242, headerFilter:"input" },
            //         { title: "Date", field: "registerDate", width: 90, headerFilter:"input" }, 
            //         { title: "State", field: "state", width: 112, headerFilter:"input" },
            //         { title: "Version", field: "documentType", width: 114, headerFilter:"input" },
            //         { title: "Document", field: "filename", width: 150, formatter: reactFormatter(<DownloadFile downloadType="EIS"/>) },
            //         { title: "EPA Comments", field: "commentsFilename", width: 157, formatter: reactFormatter(<DownloadFile downloadType="Comments"/>) }
            //     ];
            // }

            try {
                this.my_table.current.table.setColumns(_columns); // Very important if supporting dynamic data sets (differing column definitions)
            } catch (e) {
                // that's okay
            }
            // return _columns;
        }
    }

	render() {
        if(this.props.results && this.props.results.length > 0) {

        }
        else {
            return (
                <div id="search-results">
                <h2 id="results-label">{this.props.resultsText}</h2></div>
            );
        }
        
        try {
            // let data = this.setupData(results);
            // let columns = this.setupColumns();

            let options = {
                // maxHeight: "100%",
                // layoutColumnsOnNewData: true,
                tooltips:false,
                // responsiveLayout:"collapse",    //collapse columns that dont fit on the table
                // responsiveLayoutCollapseUseFormatters:false,
                pagination:"local",             //paginate the data
                paginationSize:100,              //allow 10 rows per page of data
                paginationSizeSelector:[10, 25, 50, 100],
                movableColumns:true,            //allow column order to be changed
                resizableRows:false,             //allow row order to be changed
                resizableColumns:false,
                layout:"fitColumns",
                invalidOptionWarnings:false, // spams warnings without this
                footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
            };

            var resultsText = this.props.resultsText;

            return (
                <div id="search-results">
                    <h2 id="results-label">
                        {resultsText}
                    </h2>
                    {/* <button className="link margin" onClick={() => this.onClearFiltersClick()}>Clear filters</button> */}
                    <div className="tabulator-holder">
                        <ReactTabulator
                            ref={this.my_table}
                            data={[]}
                            columns={[]}
                            options={options}
                        />
                    </div>
                </div>
            );
        }
        catch (e) {
            if(e instanceof TypeError){
                console.log(e.toString());
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
    
    // TODO: Maintain or clear filter text (filters stay in play, but annoyingly, any entered text in the filter boxes disappears?)
    // TODO: Maintain page user is on, preferably even the current scroll position, future things like checkboxes, state of downloads if possible, etc.
    componentDidUpdate() {
        /** setTimeout with 0ms activates at the end of the Event Loop, redrawing the table and thus fixing the text wrapping.
         * Does not work when simply fired on componentDidUpdate().
         */
        // console.log("Results updated itself");
        if(this.my_table && this.my_table.current){
            // console.log("Updating data and columns");
            // console.log(this.props);
            this.setupColumns();
            this.setupData();

            // console.log("Searching: " + this.props.searching);
            if(!this.props.searching){
                // console.log("Redrawing table");
                const tbltr = this.my_table.current;
                setTimeout(function() {
                    tbltr.table.redraw(true);
                },0)
            }
        }
    }
}

export default CombinedResults;