import React from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios';

import Globals from './globals.js';
import './statCounts.css';

import Select from 'react-select';
import { ReactTabulator } from 'react-tabulator';

const options = {
    // maxHeight: "100%",           // for limiting table height
    selectable:true,
    layoutColumnsOnNewData: true,
    tooltips:true,
    responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination:"local",             //paginate the data
    paginationSize:100,              //allow 100 rows per page of data
    paginationSizeSelector:[10, 25, 50, 100], 
    movableColumns:true,
    resizableRows:true,
    resizableColumns:true,
    layout:"fitColumns",
    invalidOptionWarnings:false,    // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

const getRoutes = [
    { label: "Downloadable EIS count by year", value: "stats/count_year_downloadable" },
    { label: "Total EIS count by year", value: "stats/count_year" },
    { label: "Downloadable ROD count by year", value: "stats/count_year_downloadable_rod" },
    { label: "Total ROD count by year", value: "stats/count_year_rod" },
    { label: "Downloadable draft count by year", value: "stats/count_year_downloadable_draft" },
    { label: "Total draft count by year", value: "stats/count_year_draft" },
    { label: "Downloadable final count by year", value: "stats/count_year_downloadable_final" },
    { label: "Total final count by year", value: "stats/count_year_final" },
    { label: "Downloadable supplement count by year", value: "stats/count_year_downloadable_supplement" },
    { label: "Total supplement count by year", value: "stats/count_year_supplement" },
    { label: "Downloadable non-final/draft/rod/EA count by year", value: "stats/count_year_downloadable_other" },
    { label: "Total non-final/draft/rod/EA count by year", value: "stats/count_year_other" },
];

export default class StatCounts extends React.Component {

    state = {
        data: null,
        tableData: [],
        columns: [{title: "Date", field: "0", headerFilter: "input"},
            {title: "Count", field: "1", headerFilter: "input"}],

        approver: false,
        busy: false,

        date: '1999'
    }

    constructor(props) {
        super(props);
        
        this.my_table = React.createRef();
    }

    buildData = () => {
        this.setState({ busy: true }, () => {
            const orderPromises = getRoutes.map(getRoute => this.get(getRoute));
            Promise.all(orderPromises).then(arrayOfResponses => {
                this.setState({
                    data: arrayOfResponses,
                    busy: false
                });
            })
        });
    }


    checkApprover = () => {
        let checkUrl = new URL('user/checkApprover', Globals.currentHost);
        let _approver = false;

        axios({
            url: checkUrl,
            method: 'POST'
        })
        .then(response => {
            let responseOK = response.data && response.status === 200;

            if (responseOK) {
                _approver = true;
            } else {
                alert("Not logged in or not an authorized user? Error status: " + response.status);
            }
        })
        .catch(error => {
            alert(error);
            console.error(error);
        })
        .finally(onF => {
            this.setState({
                approver: _approver
            });
        });
    }


    get = (getRoute) => {
        let getUrl = Globals.currentHost + getRoute.value;
        
        return axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return {label: getRoute.label, data: response.data};
            } else {
                return null;
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            alert(error);
        });

    }

    // event handlers

    onChange = (evt) => {
        this.setState({
            date: evt.target.value
        }, () => {
            // TODO: Rebuild counts? I'll probably do the logic such that this happens automatically when state is updated
        });
    }
    
    getBreakdown = (arr) => {
        let _post = 0;
        let _pre = 0;
        let _noDate = 0;
        let _total = 0;
        if(arr && arr.length > 0){
            arr.forEach(el => {
                _total += el[1];

                if(el[0] === null) {
                    _noDate += el[1];
                }
                else if(el[0] > this.state.date) {
                    _post += el[1];
                } else {
                    _pre += el[1];
                }
            })
        }
        
        return {_pre,_post,_noDate, _total};
    }

    renderTableItems = () => {
        return this.state.data.map( ((datum, i) => {
            let breakdown = this.getBreakdown(datum.data);
            return (
                <tr key={datum.label + i}><td>
                        {datum.label}
                    </td>
                    <td>
                        {breakdown._pre}
                    </td>
                    <td>
                        {breakdown._post}
                    </td>
                    <td>
                        {breakdown._noDate}
                    </td>
                    <td>
                        {breakdown._total}
                    </td>
                </tr>
            );
        }));
    }

    renderTable = () => {
        if(this.state.data) {
            return (
                <div>
                    <table id="countsTable">
                        <thead>
                            <tr>
                                <th>Type of count</th>
                                <th>Count through {this.state.date}</th>
                                <th>Count after {this.state.date}</th>
                                <th>Count with no date</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTableItems()}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            console.log("No data yet");
            return null;
        }
    }


    onSelectHandler = (val, act) => {
        console.log(val);
        if(!val || !act){
            return;
        }

        this.setState({ 
            tableData: this.state.data.find(element =>  element.label === val.label).data,
            tableLabel: val.label
        }, () => {
            console.log(this.state.data);
        });

    }
    downloadResults = () => {
        if(this.state.tableData) {
            const csvBlob = new Blob([Globals.jsonToTSV(this.state.tableData)]);
            const today = new Date().toISOString().split('T')[0];
            const csvFilename = `${this.state.tableLabel}_${today}.tsv`;

    
            if (window.navigator.msSaveOrOpenBlob) {  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
                window.navigator.msSaveBlob(csvBlob, csvFilename);
            }
            else {
                const temporaryDownloadLink = window.document.createElement("a");
                temporaryDownloadLink.href = window.URL.createObjectURL(csvBlob);
                temporaryDownloadLink.download = csvFilename;
                document.body.appendChild(temporaryDownloadLink);
                temporaryDownloadLink.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
                document.body.removeChild(temporaryDownloadLink);
            }

        }
    }


    render() {

        if(this.state.approver) {
            return (
                <div className="content padding-all">
                    <Helmet>
                        <title>NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/stat_counts" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>

                    <div className="loader-holder" hidden={!this.state.busy}>
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>

                    <h2>Counts split by year</h2>
                    <hr />
                    <b>Type year to break on: <input type="text" value={this.state.date} onChange={(e) => this.onChange(e)} /></b>
                   
                    {this.renderTable()}

                    <br />
                    <h2>Table of counts for all years</h2>
                    <hr />
                    
                    <Select
                        className="block"
                        options={getRoutes}
                        name="getRoute" 
                        onChange={this.onSelectHandler}
                    />
                    <button 
                        className="button"
                        onClick={this.downloadResults}
                    >
                        Download table below as .tsv
                    </button>
                    <br />

                    <ReactTabulator
                        ref={this.my_table}
                        data={this.state.tableData}
                        columns={this.state.columns}
                        options={options}
                    />
                    

                </div>
            );
        } else {
            return <div className="content">
                <Helmet>
                    <title>NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/stat_counts" />
                    <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                </Helmet>
                401
            </div>;
        }
        
    }

    componentDidMount = () => {
        this.checkApprover();
        this.buildData();
    }


    updateTable = () => {
        try {
            // seems necessary when using dynamic columns
            this.my_table.current.table.setColumns(this.state.columns);

            this.my_table.current.table.replaceData(this.state.tableData);
        } catch (e) {
            console.error(e);
        }
    }
    componentDidUpdate() {
        // if(this.my_table && this.my_table.current){
        //     this.updateTable();
        // }
    }

    
}