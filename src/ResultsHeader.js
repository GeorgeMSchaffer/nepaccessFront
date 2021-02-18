import React from 'react';
import Select from 'react-select';

const sortOptions = [ { value: 'relevance', label: 'Relevance' },
    { value: 'title', label: 'Title'},
    { value: 'agency', label: 'Lead Agency'},
    { value: 'registerDate', label: 'Date'},
    { value: 'state', label: 'State'},
    { value: 'documentType', label: 'Type'}
];

const sortOrderOptions = [ { value: true, label: 'Asc'},
    { value: false, label: 'Desc' }
];

export default class ResultsHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sort: { value: 'relevance', label: 'Relevance' },
            order: { value: true, label: 'Asc'}
        }
    }

    onSortChange = (value_label, event) => {
        if(event.action === "select-option"){
            this.setState({
                sort: value_label
            }, () => {
                this.props.sort(this.state.sort.value, this.state.order.value);
            });
        }
    }
    
    onSortOrderChange = (value_label, event) => {
        if(event.action === "select-option"){
            this.setState({
                order: value_label
            },() => {
                this.props.sort(this.state.sort.value, this.state.order.value);
            });
        }
    }

    render () {

        return (
            <div className="results-bar">
                    <h2 id="results-label" className="inline">
                        {/* {((this.props.page*10) - 9) + " - " + this.props.page*10 + " of " + this.props.resultsText} */}
                        {this.props.resultsText}
                    </h2>
                    
                    <div className="sort-container inline-block">
                        <label className="dropdown-text" htmlFor="post-results-dropdown">
                            Sort by:
                        </label>
                        <Select id="post-results-dropdown" 
                            className={"multi inline-block"} classNamePrefix="react-select" name="sort" 
                            // styles={customStyles}
                            options={sortOptions} 
                            onChange={this.onSortChange}
                            selected={this.state.sort}
                            placeholder="Relevance"
                        />
                        <Select id="post-results-dropdown-order" 
                            className={"multi inline-block"} classNamePrefix="react-select" name="sortOrder" 
                            // styles={customStyles}
                            options={sortOrderOptions} 
                            onChange={this.onSortOrderChange}
                            selected={this.state.order}
                            placeholder="Asc"
                        />
                    </div>
                    
                    <div  id="results-bar-checkbox" className="checkbox-container inline-block">
                        <input id="post-results-input" type="checkbox" name="showContext" className="sidebar-checkbox"
                                checked={this.props.showContext} 
                                onChange={this.props.onCheckboxChange}
                                disabled={this.props.snippetsDisabled}  />
                        <label className="checkbox-text" htmlFor="post-results-input">
                            Show text snippets
                        </label>
                    </div>

                </div>
        )
    }
    

}