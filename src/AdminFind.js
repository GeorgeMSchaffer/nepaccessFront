import React from 'react';
import axios from 'axios';

import Select from 'react-select';

import Globals from './globals.js';

import { ReactTabulator } from 'react-tabulator';

const getRoutes = [
    { label: "admin/findAllEmailLogs", value: "admin/findAllEmailLogs" },
    { label: "admin/findAllFileLogs", value: "admin/findAllFileLogs" },
    { label: "admin/findAllUpdateLogs", value: "admin/findAllUpdateLogs" },
    { label: "test/findAllDocs", value: "test/findAllDocs" },
    { label: "test/findAllSearchLogs", value: "test/findAllSearchLogs" },
    { label: "file/findAllNepaFiles", value: "file/findAllNepaFiles" },
    { label: "user/findAllUsers", value: "user/findAllUsers" },
    { label: "user/findAllOptedOut", value: "user/findAllOptedOut" },
    { label: "user/findAllContacts", value: "user/findAllContacts" },
    
    { label: "test/duplicates", value: "test/duplicates" },
    { label: "test/duplicates_close", value: "test/duplicates_close" },
    { label: "test/duplicates_no_date", value: "test/duplicates_no_date" },
    { label: "test/duplicates_process", value: "test/duplicates_process" },
    { label: "test/size_under_200", value: "test/size_under_200" },
    { label: "test/findMissingProcesses", value: "test/findMissingProcesses" },

    // Headers: Agency, Record count, Count with files
    { label: "reports/report_agency", value: "reports/report_agency" },
    { label: "reports/report_agency_2000", value: "reports/report_agency_2000" },
    // Headers: Agency, Record count, Count with files, Process Count, Process Count where at least one document in the process has files
    { label: "reports/report_agency_process", value: "reports/report_agency_process" },
    { label: "reports/report_agency_process_2000", value: "reports/report_agency_process_2000" },

    { label: "reports/duplicates_size", value: "reports/duplicates_size" },
];

const options = {
    // maxHeight: "100%",           // for limiting table height
    selectable:true,
    layoutColumnsOnNewData: true,
    tooltips:true,
    responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination:"local",             //paginate the data
    paginationSize:10,              //allow 10 rows per page of data
    paginationSizeSelector:[10, 25, 50, 100], 
    movableColumns:true,
    resizableRows:true,
    resizableColumns:true,
    layout:"fitColumns",
    invalidOptionWarnings:false,    // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

export default class AdminFind extends React.Component {


    state = {
        data: [],
        columns: [],
        rows: [],
        selected: "",

        response: "",

        admin: false,
        busy: false,

        getRoute: "",
        selectedName: ""
    }
    constructor(props) {
        super(props);

        this.ref = null;
    }

    checkAdmin = () => {
        let checkUrl = new URL('user/checkAdmin', Globals.currentHost);
        let _admin = false;

        axios({
            url: checkUrl,
            method: 'POST'
        })
        .then(response => {
            let responseOK = response.data && response.status === 200;

            if (responseOK) {
                _admin = true;
            }
        })
        .catch(error => {
            console.error(error);
        })
        .finally(onF => {
            this.setState({
                admin: _admin
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

            console.log("Keys",headers);

            for(let i = 0; i < headers.length; i++) {
                newColumns[i] = {title: headers[i], field: headers[i], headerFilter: "input"};
                // headerFilter: "input",
                // cellClick: (e, cell) => {
                //     console.log( cell.getRow().getData() );
                // },
            }

            if(parsedJson && parsedJson.length > 0){
                this.setState({
                    columns: newColumns,
                    data: this.handleData(parsedJson),
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false
                }, () => {
                    if(this.ref && this.ref.table){
                        this.updateTable();
                    }
                });
            } else {
                console.log("Null results");
                this.setState({
                    columns: [],
                    data: [],
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false
                });
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ busy: false });
        });
    }

    // stringify expected objects rather than just displaying [object Object]
    handleData = (results) => {
        if(results && results[0]) {
            let headers = getKeys(results[0]);

            // stringify any incoming objects
            if(headers.includes("eisdoc") || headers.includes("user")) {
                results.forEach(function(result) {
                    if(result.eisdoc) {
                        result.eisdoc = JSON.stringify(result.eisdoc);
                    }
                    else if(result.user) {
                        result.user = JSON.stringify(result.user);
                    }
                });
            }
            
        }

        return results;
    }
    
    updateTable = () => {
        try {
            // seems necessary when using dynamic columns
            this.ref.table.setColumns(this.state.columns);

            // this.ref.table.replaceData(this.state.data);
        } catch (e) {
            console.error(e);
        }
    }

    // onChange = (evt) => {
    //     this.setState({ [evt.target.name]: evt.target.value });
    // }
    
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

    // rowSelectionChanged = (data, rows) => {
    //     console.log(data,rows);
    //     if(data && data.length > 0) {
    //         this.setState({ selectedData: data[0].id });
    //     }
    // }
    // rowClick = (e, row) => {
    //     console.log("ref table: ", this.ref); // this is the Tabulator table instance
    //     console.log(`rowClick id: \${row.getData().id}`, row, e);
    //     this.setState({ selectedName: row.getData().name });
    // };

    copy = () => {
        if(this.ref.table) {
            console.log(this.ref.table.getSelectedData());
            this.setState({ 
                selected: JSON.stringify(this.ref.table.getSelectedData()),
                rows: this.ref.table.getSelectedRows()
            });
        }
        // this.ref.table.modules.selectRow.selectRows(this.state.rows[0]);
        // this.state.rows[0].select();
        // can't seem to persist rows through state change (update)...
    }

    render() {

        if(this.state.admin) {
            return (
                <div className="content padding-all">

                    <div className="loader-holder">
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>

                    <ReactTabulator
                        ref={ref => (this.ref = ref)}
                        data={this.state.data}
                        columns={[]}
                        options={options}
                        // rowClick={this.rowClick}
                        // rowSelectionChanged={this.rowSelectionChanged}
                    />
                    <br />
                    
                    <button 
                        className="button"
                        onClick={this.copy}
                    >
                        Stringify selection
                    </button>
                    <textarea value={this.state.selected} readOnly />
                    
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
                        Download results as .tsv
                    </button>


                </div>
            );
        } else {
            return <div className="content">401</div>;
        }
        
    }

    componentDidMount = () => {
        this.checkAdmin();
    }
    
    componentDidUpdate() {
        console.log("Updated");
    }
}

function getKeys(obj) {
    let keysArr = [];
    for (var key in obj) {
      keysArr.push(key);
    }
    return keysArr;
}