import React from 'react';
import axios from 'axios';

import Globals from './globals.js';

import './approve.css';

import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import { ReactTabulator } from 'react-tabulator';

const options = {
    // maxHeight: "100%",           // for limiting table height
    selectable:true,
    layoutColumnsOnNewData: true,
    tooltips:false,
    responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination:"local",             //paginate the data
    paginationSize:10,              //allow 10 rows per page of data
    paginationSizeSelector:[10, 25, 50, 100], // with all the text, even 50 is a lot.
    movableColumns:false,            //don't allow column order to be changed
    resizableRows:false,             
    resizableColumns:false,
    layout:"fitColumns",
    invalidOptionWarnings:false, // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

const columns = [
    { title: "Username", field: "username", headerFilter:"input"},
    { title: "Active", field: "active", width: 150, headerFilter:"input"  },
    { title: "Email", field: "email", width: 140, headerFilter:"input"  },
    { title: "Email verified", field: "verified", width: 200, headerFilter:"input"  },
    { title: "First name", field: "first", width: 150, headerFilter:"input" },
    { title: "Last name", field: "last", width: 140, headerFilter:"input"  },
];

// TODO: Get rid of most universal tabulator css and limit it to pages like record details and search.
// Then use it to select rows and setApprove() 
// (probably don't bother with editable table, just have external button)
// supporting one or multiple rows selected

export default class Approve extends React.Component {
    resp = "";

    state = {
        users: [],
        response: ""
    }

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }

    getUsers = () => {
        console.log("Fetching user list");
        let getUrl = Globals.currentHost + "user/getAll";
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                console.log(response.data);
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    users: this.setupData(parsedJson)
                });
            } else { // null/404

            }
        }).catch(error => {
            console.error(error);
        });
    }

    setupData = (results) => {
        if(results && results[0]) { // NEPAFiles should have Folders, necessarily
            return results.map((result, idx) =>{
                let doc = result;
                let newObject = {
                    // username: doc.username, 
                    // first: doc.firstName, 
                    // last: doc.lastName, 
                    // email: doc.email, 
                    // active: doc.active, 
                    // verified: doc.verified, 
                    // id: doc.id
                    id: doc[0],
                    username: doc[1], 
                    active: doc[2], 
                    email: doc[3], 
                    verified: doc[4], 
                    first: doc[5], 
                    last: doc[6], 
                };
                return newObject;
            });
        } else { // ??
            return [];
        }
    }

    setApprove = (_userId, status) => {
        const approveUrl = new URL('/user/setUserApproved', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('userId', _userId);
        dataForm.append('approved',status);

        axios({
            url: approveUrl,
            method: 'POST',
            data: dataForm
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                response: rsp 
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { // redirect
            console.error(error);
        })
        
        // this.updateTable();
    }

    approve = (status) => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = 0; i < selectedData.length; i++) {
            this.setApprove(selectedData[i].id, status);
        }
        setTimeout(() => {
            this.getUsers();
            document.body.style.cursor = 'default';
            this.resp = "";
        }, 1000);
    }

    // probably unneeded
    // updateTable = () => {
    //     try {
    //         this.my_table.current.table.replaceData(this.state.users);
    //     } catch (e) {
    //         console.error("update table error");
    //     }
    // }
    
    render() {

        return (
            <div id="approve">
                <div><span>
                    Hold shift and drag to select multiple users, or click to select/deselect.
                </span></div>
                <br />
                <br />
                <ReactTabulator
                    ref={this.my_table}
                    // data={this.state.users}
                    data={this.state.users}
                    columns={columns}
                    options={options}
                    pageLoaded={this.onPageLoaded}
                />
                <br />

                <div>
                    <button type="button" className="button" onClick={() => this.approve(true)}>
                        Approve (activate) user(s)
                    </button>

                    <button type="button" className="button"onClick={() => this.approve(false)}>
                        Deactivate user(s)
                    </button>
                </div>

                <br />
                <div><span>
                    Server response
                </span></div>
                <textarea readOnly value={this.state.response}></textarea>
            </div>
        );
    }

    componentDidMount = () => {
        try {
            this.getUsers();
        } catch(e) {
            console.error(e);
        }
    }
}