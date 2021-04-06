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

export default class Pairs2 extends React.Component {
    ref = null;

    state = {
        datums: [],
        approver: false
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
        let getUrl = Globals.currentHost + "test/match_all_pairs_one";
        
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

    setupData = (results) => {
        if(results && results[0]) {
            return results.filter(function(result) {
                let doc = result;
                let newObject = {
                    id1: doc[0],
                    title1: doc[1], 
                    filename1: doc[2], 
                    agency1: doc[3], 
                    type1: doc[4], 
                    date1: doc[5], 
                    id2: doc[6],
                    title2: doc[7], 
                    filename2: doc[8], 
                    agency2: doc[9], 
                    type2: doc[10], 
                    date2: doc[11],
                    match_percent: doc[12],
                };
                return sanityCheck(newObject)
            }).map((result, idx) =>{
                let doc = result;
                let newObject = {
                    id1: doc[0],
                    title1: doc[1], 
                    filename1: doc[2], 
                    agency1: doc[3], 
                    type1: doc[4], 
                    date1: doc[5], 
                    id2: doc[6],
                    title2: doc[7], 
                    filename2: doc[8], 
                    agency2: doc[9], 
                    type2: doc[10], 
                    date2: doc[11],
                    match_percent: doc[12],
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
                            Less strict pairs (1-2 actual file documents on file server per pair).  Data may take a bit to load and show up, please be patient.
                        </span>
                    </div>

                    <ReactTabulator
                        ref={ref => (this.ref = ref)}
                        data={this.state.datums}
                        columns={[]}
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

function sanityCheck(doc) {
    if(doc.agency1 !== doc.agency2) {
        return false;
    }

    let draftOne = isDraft(doc.type1);
    let draftTwo = isDraft(doc.type2);
    let finalOne = isFinal(doc.type1);
    let finalTwo = isFinal(doc.type2);

    if(
        (draftOne && finalTwo)
        || (finalOne && draftTwo)
    ) {
        // Good
        if(draftOne) {
            // Make sure date1 < date2
            // console.log("date1,date2",doc.date1,doc.date2);
            if(doc.date1.localeCompare(doc.date2) === -1) {
                // console.log("Correct dates");
            } else {
                return false;
            }
        } else if(draftTwo) {
            // Make sure date2 < date1
            // console.log("date2,date1",doc.date2,doc.date1);
            if(doc.date2.localeCompare(doc.date1) === -1) {
                // console.log("Correct dates");
            } else {
                return false;
            }
        }
    } else {
        return false; // "bad" document types
    }

    return true;
}

function isDraft(type) {
    return (
        (type === "Draft") 
        || (type === "Second Draft")
        || (type === "Revised Draft")
        || (type === "Draft Supplement")
        || (type === "Second Draft Supplemental")
        || (type === "Third Draft Supplemental")
    );
}

function isFinal(type) {
    return (
        (type === "Final") 
        || (type === "Second Final")
        || (type === "Revised Final")
        || (type === "Final Supplement")
        || (type === "Second Final Supplemental")
        || (type === "Third Final Supplemental")
    );

}