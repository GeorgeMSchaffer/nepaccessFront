import React from 'react';

import ResultsHeader from './ResultsHeader.js';

import CardResult from './CardResult.js';

import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import './card.css';


const options = {
    // maxHeight: "100%",
    // layoutColumnsOnNewData: true,
    tooltips:false,
    // responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination:"local",             //paginate the data
    paginationSize:10,              //allow 10 rows per page of data
    paginationSizeSelector:[10, 25, 50, 100],
    movableColumns:false,            //don't allow column order to be changed
    resizableRows:false,             //don't allow row order to be changed
    resizableColumns:false,
    layout:"fitColumns",
    invalidOptionWarnings:false, // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

let page = 1;

class CardResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showContext: true,
            page: 1
        }
        this.my_table = React.createRef();

        // window.addEventListener('resize', this.handleResize);
    }
    
    // Table needs help to resize its cells if window is resized
    // handleResize = () => {
    //     this.setState({
    //         height: window.innerHeight,
    //         width: window.innerWidth
    //     });
    // }
    onPageLoaded = (pageNumber) => {
        // this.setState({
        //     page: pageNumber
        // });
        page = pageNumber;
    }

    onClearFiltersClick = (e) => {
        if(this.my_table && this.my_table.current){
            const tbltr = this.my_table.current;
            tbltr.table.clearFilter(true);
        }
    }
    
    onCheckboxChange = (evt) => {
        this.setState({ 
            showContext: evt.target.checked
        });
    }

    // resetSort = () => {
    //     this.my_table.current.table.setData(this.props.results);
    // }

    setupColumns = () => {
        let _columns = [];
        if(this.props.results && this.props.results[0]){
            _columns = [
                { title: "", field: "", formatter: reactFormatter(<CardResult show={this.state.showContext} />)}
            ];
        }
        
        try {
            this.my_table.current.table.setColumns(_columns); // Very important if supporting dynamic data sets (differing column definitions)
            this.my_table.current.table.setPage(page);
        } catch (e) {
            console.log("Column setup error");
            // that's okay
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

            let _columns = [
                { title: "", field: "", formatter: reactFormatter(<CardResult show={this.state.showContext} />)}
            ];

            return (
                <div className="sidebar-results">
                <div id="search-results">
                    <div className="tabulator-holder">
                        <ResultsHeader 
                            sort={this.props.sort}
                            resultsText={this.props.resultsText} 
                            searching={this.props.searching}
                            snippetsDisabled={this.props.snippetsDisabled} 
                            showContext={this.state.showContext}
                            onCheckboxChange={this.onCheckboxChange}
                        />
                        {/* <button className="link margin" onClick={() => this.onClearFiltersClick()}>Clear filters</button> */}
                        <ReactTabulator
                            ref={this.my_table}
                            data={this.props.results}
                            columns={_columns}
                            options={options}
                            pageLoaded={this.onPageLoaded}
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
    
    componentDidUpdate() {
        /** setTimeout with 0ms activates at the end of the Event Loop, redrawing the table and thus fixing the text wrapping.
         * Does not work when simply fired on componentDidUpdate().
         */
        if(this.my_table && this.my_table.current){
            // console.log("Updating data and columns");
            // console.log(this.props);
            this.setupColumns();

            // console.log("Searching: " + this.props.searching);

            // card height can't figure itself out precisely without a redraw so for now we disable 
            // this check: even while more results are loading, first page will redraw and look good
            // if(!this.props.searching){ 
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