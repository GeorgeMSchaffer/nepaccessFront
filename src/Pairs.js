import React from 'react';
import axios from 'axios';

import Globals from './globals.js';

import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import { ReactTabulator } from 'react-tabulator';

const options = {
    // maxHeight: "100%",           // for limiting table height
    // IMPORTANT: downloadDataFormatter and downloadReady assignments are necessary for download:
    downloadDataFormatter: (data) => data, 
    downloadReady: (fileContents, blob) => blob,
    selectable:true,
    layoutColumnsOnNewData: true,
    tooltips:false,
    responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination:"local",             //paginate the data
    paginationSize:10,              //allow 10 rows per page of data
    paginationSizeSelector:[10, 50, 100, 250, 1000], 
    movableColumns:false,            //don't allow column order to be changed
    resizableRows:false,             
    resizableColumns:true,
    autoColumns:true,
    layout:"fitColumns",
    invalidOptionWarnings:false, // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

// const columns = [
//     { title: "Title", field: "document1", width:150, headerFilter:"input"},
// ];
const columns = [
    {title: "id1", field: "id1"},
    {title: "title1", field: "title1"},
    {title: "filename1", field: "filename1"},
    {title: "id2", field: "id2"},
    {title: "title2", field: "title2"},
    {title: "filename2", field: "filename2"},
    {title: "match_percent", field: "match_percent"},
]

export default class Pairs extends React.Component {
    ref = null;
    resp = "";

    state = {
        datums: [],
        approver: false,
        response: ""
    }

    constructor(props) {
        super(props);

        // this.my_table = React.createRef();
    }
    
    checkApprover = () => {
        let checkUrl = new URL('user/checkApprover', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            console.log("Response", response);
            console.log("Status", response.status);
            let responseOK = response.data && response.status === 200;
            if (responseOK) {
                this.setState({
                    approver: true
                });
            } else {
                console.log("Else");
            }
        }).catch(error => {
            //
        })
    }

    getData = () => {
        console.log("Fetching data");
        let getUrl = Globals.currentHost + "test/match_all_pairs";
        
        axios.get(getUrl, {
            // params: {
                
            // }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                console.log("Data",response.data);
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    datums: this.setupData(parsedJson)
                });
            } else { // null/404

            }
        }).catch(error => {
            console.error(error);
        });
    }

    // TODO: Verify same agency, one draft-type, one final-type, final date later than draft
    setupData = (results) => {
        if(results && results[0]) {
            return results.map((result, idx) =>{
                let doc = result;
                let newObject = {
                    id1: doc[0],
                    title1: doc[1], 
                    filename1: doc[2], 
                    id2: doc[3], 
                    title2: doc[4], 
                    filename2: doc[5], 
                    match_percent: doc[6]
                };
                return newObject;
            });
        } else { // ??
            return [];
        }
    }

    downloadData = () => {
        // console.log("Will download this data: ",this.ref.state.data)
        this.ref.table.download("csv", "data.tsv", {delimiter:'\t'}); // tab delimiter
    }; 

    render() {

        if(this.state.approver) {
            return (
                <div id="data-pairs" className="content">
                    <div className="instructions">
                        <span className="bold">
                            Unstrict pairs (0-2 actual file documents on file server per pair)
                        </span>
                    </div>

                    <ReactTabulator
                        ref={ref => (this.ref = ref)}
                        data={this.state.datums}
                        columns={columns}
                        options={options}
                        pageLoaded={this.onPageLoaded}
                    />
                    <br />
                    
                    <button onClick={this.downloadData}>
                        Download data as tab separated values (should open fine in excel)
                    </button>

                </div>
            );
        } else {
            return <div id="data-pairs">401</div>
        }
    }

    componentDidMount = () => {
        try {
            this.checkApprover();
            this.getData();
        } catch(e) {
            console.error(e);
        }
    }
}