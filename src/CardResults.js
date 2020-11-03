import React from 'react';

import Select from 'react-select';

import CardResult from './CardResult.js';

import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import './card.css';

class CardResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showContext: true
        }
        this.my_table = React.createRef();

        // Table needs help to resize its cells if window is resized
        window.addEventListener('resize', this.handleResize);
    }
    
    // Table needs help to resize its cells if window is resized
    handleResize = () => {
        // console.log("Resize event");
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        });
    }

    onClearFiltersClick = (e) => {
        if(this.my_table && this.my_table.current){
            const tbltr = this.my_table.current;
            tbltr.table.clearFilter(true);
        }
    }

    onCheckboxChange = (evt) => {
        this.setState({ 
            [evt.target.name]: evt.target.checked
        });
    }

    onSortChange = (value_label, event) => {
        if(event.action === "select-option"){
            this.props.sort(value_label.value);
        }
    }

    resetSort = () => {
        this.my_table.current.table.setData(this.props.results);
    }

    setupColumns = () => {
        if(this.props.results){

            let _columns = [];

            if(this.props.results[0] && this.props.results[0].doc) {

                _columns = [
                    { title: "", field: "", formatter: reactFormatter(<CardResult show={this.state.showContext} />)}
                ];
            
            } else if (this.props.results[0] && this.props.results[0].title) { // Metadata only
                
                _columns = [
                    { title: "", field: "", formatter: reactFormatter(<CardResult show={this.state.showContext} />)}
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
            /** Show nothing, until we are loading results.
             * props.resultsText will just be "Results" before any search.
             * During a search, it will be "Loading results..." and if 100+ async results we may
             * simultaneously have 100 props.results
             * After a search we won't hit this logic because we'll have props.results
             */
            if(this.props.resultsText && this.props.resultsText!=="Results") {
                return (
                    <div className="sidebar-results">
                    <div id="search-results">
                    <div className="tabulator-holder">
                        <h2 id="results-label">
                            {this.props.resultsText}
                        </h2>
                    </div></div></div>
                );
            } else {
                return "";
            }
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
                movableColumns:false,            //don't allow column order to be changed
                resizableRows:false,             //don't allow row order to be changed
                resizableColumns:false,
                layout:"fitColumns",
                invalidOptionWarnings:false, // spams warnings without this
                footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
            };

            var resultsText = this.props.resultsText;
            
            // title: doc.title, agency: doc.agency, commentDate: doc.commentDate, 
            // registerDate: doc.registerDate, state: doc.state, documentType: doc.documentType, 
            // filename: doc.filename, 
            // commentsFilename: doc.commentsFilename,
            // id: doc.id,
            // folder: doc.folder,
            // plaintext: result.highlight,
            // name: result.filename,
            // relevance: idx


            const sortOptions = [ { value: 'relevance', label: 'Relevance' },
                { value: 'title', label: 'Title'},
                { value: 'agency', label: 'Lead Agency'},
                { value: 'registerDate', label: 'Date'},
                { value: 'state', label: 'State'},
                { value: 'documentType', label: 'Type'}
            ];

            return (
                <div className="sidebar-results">
                <div id="search-results">

                    {/* <button className="link margin" onClick={() => this.onClearFiltersClick()}>Clear filters</button> */}
                    <div className="tabulator-holder">
                        <div className="results-bar">
                            <h2 id="results-label" className="inline">
                                {resultsText}
                            </h2>
                            <div className="checkbox-container inline-block">
                                <input id="post-results-input" type="checkbox" name="showContext" className="sidebar-checkbox"
                                        checked={this.state.showContext} onChange={this.onCheckboxChange}
                                        disabled={this.props.snippetsDisabled}  />
                                <label className="checkbox-text" htmlFor="post-results-input">
                                    Show text snippets
                                </label>
                                <label className="dropdown-text" htmlFor="post-results-dropdown">
                                    Sort by:
                                </label>
                                <Select id="post-results-dropdown" 
                                    className="multi inline-block" classNamePrefix="react-select" name="sort" 
                                    // styles={customStyles}
                                    options={sortOptions} 
                                    onChange={this.onSortChange}
                                    value={this.state.sortOption}
                                    placeholder="Select sort by"
                                />
                            </div>
                        </div>
                        <ReactTabulator
                            ref={this.my_table}
                            data={this.props.results}
                            columns={[]}
                            options={options}
                        />
                    </div>
                </div></div>
            );
        }
        catch (e) {
            if(e instanceof TypeError){
                console.log(e.toString());
                // expected problem with Tabulator trying to render new results before it switches to new column definitions
            } else {
                console.log(e.toString());
            }
            /** Wishlist: Put the most relevant error message in here */
            return (
                <div className="sidebar-results">
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

            // console.log("Searching: " + this.props.searching);

            // card height can't figure itself out precisely without a redraw so for now we 
            // disable this check
            // if(!this.props.searching){ 
                // console.log("Redrawing table");
                const tbltr = this.my_table.current;
                setTimeout(function() {
                    tbltr.table.redraw(true);
                    console.log("Redraw");
                },0)
            // }
        }
    }
}

export default CardResults;