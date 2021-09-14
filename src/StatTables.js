import React from 'react';
import axios from 'axios';

import Select from 'react-select';

import Globals from './globals.js';

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
];

export default class StatTables extends React.Component {

    state = {
        data: [],
        columns: [],

        response: "",

        approver: false,
        busy: false,

        getRoute: "",
        date: '1999'
    }

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
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
            }
        })
        .catch(error => {
            console.error(error);
        })
        .finally(onF => {
            this.setState({
                approver: _approver
            });
        });
    }


    get = () => {
        this.setState({ busy: true });

        let getUrl = Globals.currentHost + this.state.getRoute;
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            let newColumns = [];
            let headers = getKeys(parsedJson[0]);

            for(let i = 0; i < headers.length; i++) {
                newColumns[i] = {title: headers[i], field: headers[i], headerFilter: "input"};
            }

            // Changed to 2000 from 2010
            let postDate = 0;
            let preDate = 0;
            let _noDate = 0;
            if(parsedJson && parsedJson.length > 0){
                parsedJson.forEach(el => {
                    if(el[0] === null) {
                        _noDate += el[1];
                    }
                    else if(el[0] >= this.state.date) {
                        postDate += el[1];
                    } else {
                        preDate += el[1];
                    }
                });

                this.setState({
                    columns: newColumns,
                    data: parsedJson,
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false,
                    preDate: preDate,
                    postDate: postDate,
                    noDate: _noDate
                });
            } else {
                this.setState({
                    columns: newColumns,
                    data: [],
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false,
                    pre2010: preDate,
                    post2010: postDate,
                    noDate: _noDate
                });
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ busy: false });
        });
    }
    
    updateTable = () => {
        try {
            // seems necessary when using dynamic columns
            this.my_table.current.table.setColumns(this.state.columns);

            // this.my_table.current.table.replaceData(this.state.data);
        } catch (e) {
            console.error(e);
        }
    }
    
    onSelectHandler = (val, act) => {
        if(!val || !act){
            return;
        }

        this.setState(
        { 
            getRoute: val.value,
            getLabel: val.label
        }, () => {
            this.get();
        });

    }

    
    // best performance is to Blob it on demand
    downloadResults = () => {
        if(this.state.response) {
            const csvBlob = new Blob([this.state.response]);
            const today = new Date().toISOString().split('T')[0];
            const csvFilename = `${this.state.getLabel}_${today}.tsv`;

    
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

    // event handlers

    onChange = (evt) => {
        this.setState({date: evt.target.value}, () => {
            this.updateArithmetic();
        });
    }
    updateArithmetic = () => {
        let _post = 0;
        let _pre = 0;
        let _noDate = 0;
        if(this.state.data && this.state.data.length > 0){
            this.state.data.forEach(el => {
                if(el[0] === null) {
                    _noDate += el[1];
                }
                else if(el[0] > this.state.date) {
                    _post += el[1];
                } else {
                    _pre += el[1];
                }
            })
            this.setState({
                preDate: _pre,
                postDate: _post,
                noDate: _noDate
            });
        }
    }


    render() {

        if(this.state.approver) {
            return (
                <div className="content padding-all">

                    <div className="loader-holder">
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>
                    
                    <ReactTabulator
                        ref={this.my_table}
                        data={this.state.data}
                        columns={this.state.columns}
                        options={options}
                    />
                    <br />
                    
                    <Select
                        className="block"
                        options={getRoutes}
                        name="getRoute" 
                        onChange={this.onSelectHandler}
                    />

                    <div>
                        <label><b>Count after {this.state.date}: {this.state.postDate}</b></label>
                    </div>
                    <div>
                        <label><b>Count through {this.state.date}: {this.state.preDate}</b></label>
                    </div>
                    <div>
                        <label><b>Count with no date: {this.state.noDate}</b></label>
                    </div>

                    Type year to break on: <input type="text" value={this.state.date} onChange={(e) => this.onChange(e)} />

                    <button 
                        className="button"
                        onClick={this.downloadResults}
                    >
                        Download results as .tsv
                    </button>

                </div>
            );
        } else {
            return <div className="content">401</div>;
        }
        
    }

    componentDidMount = () => {
        this.checkApprover();
    }
    
    componentDidUpdate() {
        if(this.my_table && this.my_table.current){
            this.updateTable();
        }
    }
}

function getKeys(obj) {
    let keysArr = [];
    for (var key in obj) {
      keysArr.push(key);
    }
    return keysArr;
}