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

        getRoute: ""
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

            let _post2010 = 0;
            let _pre2010 = 0;
            if(parsedJson && parsedJson.length > 0){
                parsedJson.forEach(el => {
                    if(el[0] >= '2010') {
                        _post2010 += el[1];
                    } else {
                        _pre2010 += el[1];
                    }
                })
                this.setState({
                    columns: newColumns,
                    data: parsedJson,
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false,
                    pre2010: _pre2010,
                    post2010: _post2010
                });
            } else {
                console.log("Null results");
                this.setState({
                    columns: newColumns,
                    data: [],
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false,
                    pre2010: _pre2010,
                    post2010: _post2010
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
                        <label><b># after 2009: {this.state.post2010}</b></label>
                    </div>
                    <div>
                        <label><b># through 2009: {this.state.pre2010}</b></label>
                    </div>

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