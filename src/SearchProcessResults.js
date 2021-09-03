import React from 'react';

import ResultsHeader from './ResultsHeader.js';
import SearchProcessResult from './SearchProcessResult.js';

import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import './cardProcess.css';

export default class SearchProcessResults extends React.Component {

    _columns = [];
    hidden = new Set();

    constructor(props) {
        super(props);
        this.state = {
            showContext: true,
            hidden: new Set()
        }
        window.addEventListener('resize', this.handleResize);
        
        this._columns = [
            { title: "", field: "", formatter: reactFormatter(
                    <SearchProcessResult 
                        show={this.state.showContext}
                        hideText={this.hideText}
                        hidden={this.hide} />
                )
            }
        ];
        
        this.options = {
            selectable:false,
            tooltips:false,
            pagination:"local",             //paginate the data
            paginationSize:10,              //allow 10 rows per page of data
            paginationSizeSelector:[10, 25, 50], // with all the text, even 50 is a lot.
            movableColumns:false,            //don't allow column order to be changed
            resizableRows:false,             
            resizableColumns:false,
            layout:"fitColumns",
            invalidOptionWarnings:false, // spams spurious warnings without this
        };
    }
    
    page = 1;

    hide = (props) => {
        return this.hidden.has(props);
    }

    hideText = (id) => {
        if(this.hidden.has(id)) {
            this.hidden.delete(id);
            this.setState({hidden: this.hidden});
        } else {
            this.hidden.add(id);
            this.setState({hidden: this.hidden});
        }
    }
    
    // Table needs help to resize its cells if window is resized
    handleResize = () => {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        });
    }
    
    onPageLoaded = (pageNumber) => {
        if(this.page !== pageNumber){
            this.page = pageNumber;

            try {
                this.props.scrollToTop();
            } catch(e) {
                console.error(e);
                // do nothing
            }
        }
    }
    
    onCheckboxChange = (evt) => {
        this.setState({ 
            showContext: evt.target.checked
        });
    }
    
    /** To update show/hide text snippets, updates columns; also redraws table to accommodate potentially 
     * different-sized contents (particularly height) so that nothing overflows and disappears outside the table itself
    */
    updateTable = () => {
        if(this.ref && this.ref.table) {
            const TABLE = this.ref.table;
            try {
                // all needed for text snippets show/hide
                let _columns = [];
                if(this.props.results && this.props.results[0]){
                    _columns = [
                        { title: "", field: "", formatter: reactFormatter(<SearchProcessResult 
                            show={this.state.showContext} 
                            hideText={this.hideText}
                            hidden={this.hide} />)}
                    ];
                }
                TABLE.setColumns(_columns); 
    
                // to maintain page user is on even after rerender (ex. show/hide text snippets), 
                // we save page as a local variable and set it here
                TABLE.setPage(this.page);
                // Note that we might want the page to be reset in some circumstances but that can be handled if so
            } catch (e) {
                console.log("Column setup error");
                // that's okay
            } finally {
                // need to redraw to accommodate new data (new dimensions) or hiding/showing texts
                setTimeout(function() {
                    TABLE.redraw(true);
                    // console.log("Redrawn");
                },0)
            }
        }
        
    }

	render() {
        if(!this.props.results || !(this.props.results.length > 0)) {
            /** Show nothing until loading results. props.resultsText will just be "Results" before any search.
             * During a search, it will be "Loading results..." and if 100+ async results we may
             * simultaneously have 100 props.results.  After a search we won't hit this logic because we'll have props.results
             */
            if(this.props.resultsText && this.props.resultsText!=="Results") {
                return (
                    <div className="sidebar-results">
                        <div id="process-results">
                            <div className="tabulator-holder">
                                <h2 id="results-label">
                                    {this.props.resultsText}
                                </h2>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <></>
                );
            }
        }
        
        try {

            return (
                <div className="sidebar-results">
                    <div id="process-results">
                        <div className="tabulator-holder">
                            <ResultsHeader 
                                sort={this.props.sort}
                                resultsText={this.props.resultsText} 
                                searching={this.props.searching}
                                snippetsDisabled={this.props.snippetsDisabled} 
                                showContext={this.state.showContext}
                                onCheckboxChange={this.onCheckboxChange}
                                download={this.props.download}
                            />
                             <ReactTabulator
                                ref={ref => (this.ref = ref)}
                                data={this.props.results}
                                columns={this._columns}
                                options={this.options}
                                pageLoaded={this.onPageLoaded}
                            />
                        </div>
                    </div>
                </div>
            );
        }
        catch (e) {
            if(e instanceof TypeError){
                // Tabulator trying to render new results before it switches to new column definitions
                console.error("TypeError",e);
            } else {
                console.error(e);
            }
            return (
                <div className="sidebar-results">
                    <h2 id="results-label">{this.props.resultsText}</h2>
                </div>
            )
        }
    }

    componentDidMount() {
        // console.log("Mounted results");
    }
    
    componentDidUpdate() {
        this.updateTable();
    }
}