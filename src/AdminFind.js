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
    paginationSize:10,              //allow 10 rows per page of data
    paginationSizeSelector:[10, 25, 50, 100], 
    movableColumns:true,
    resizableRows:true,
    resizableColumns:true,
    layout:"fitColumns",
    invalidOptionWarnings:false,    // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

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
];

export default class AdminFind extends React.Component {

    state = {
        data: [],
        columns: [],

        response: "",

        admin: false,
        busy: false,

        getRoute: ""
    }

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }


    checkAdmin = () => {
        let checkUrl = new URL('user/checkAdmin', Globals.currentHost);

        axios({
            url: checkUrl,
            method: 'POST'
        })
        .then(response => {
            let responseOK = response.data && response.status === 200;

            if (responseOK) {
                this.setState({
                    admin: true
                });
            } else {
                this.setState({
                    admin: false
                });
            }
        })
        .catch(error => {
            console.error(error);

            this.setState({
                admin: false
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
            }

            if(parsedJson){
                this.setState({
                    columns: newColumns,
                    data: this.handleData(parsedJson),
                    response: this.jsonToTSV(parsedJson),
                    busy: false
                });
            } else {
                console.log("Null");
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

    // format json as tab separated values to prep .tsv download
    jsonToTSV = (data) => {
        const items = data;
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        const tsv = [
        header.join('\t'), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join('\t'))
        ].join('\r\n')
        
        return tsv;
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

    // onChange = (evt) => {
    //     this.setState({ [evt.target.name]: evt.target.value });
    // }
    
    onSelectHandler = (val, act) => {
        if(!val || !act){
            return;
        }

        this.setState(
        { 
            getRoute: val.value
        }, () => {
            this.get();
        });

    }

    
    // best performance is to Blob it on demand
    downloadResults = () => {
        if(this.state.response) {
            const csvBlob = new Blob([this.state.response]);
            const today = new Date().toISOString().split('T')[0];
            const csvFilename = `results_${today}.tsv`;

    
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

        if(this.state.admin) {
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