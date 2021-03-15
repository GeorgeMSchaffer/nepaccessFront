import React from 'react';
import axios from 'axios';

import Globals from './globals.js';

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
    { title: "Role", field: "role", width: 140, headerFilter:"input"  },
    { title: "Username", field: "username", headerFilter:"input"},
    { title: "Active", field: "active", width: 150, headerFilter:"input"  },
    { title: "Email", field: "email", width: 140, headerFilter:"input"  },
    { title: "Email verified", field: "verified", width: 200, headerFilter:"input"  },
    { title: "First name", field: "first", width: 150, headerFilter:"input" },
    { title: "Last name", field: "last", width: 140, headerFilter:"input"  },
];

export default class Admin extends React.Component {
    resp = "";

    state = {
        users: [],
        response: "",
        admin: false,
        role: ""
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
        }).then(response => {
            console.log("Response", response);
            console.log("Status", response.status);
            let responseOK = response.data && response.status === 200;
            if (responseOK) {
                this.setState({
                    admin: true
                });
            } else {
                console.log("Else");
            }
        }).catch(error => {
            //
        })
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
        console.log("Results",results);
        if(results && results[0]) { 
            return results.map((result, idx) =>{
                let doc = result;
                let newObject = {
                    id: doc[0],
                    username: doc[1], 
                    active: doc[2], 
                    email: doc[3], 
                    verified: doc[4], 
                    first: doc[5], 
                    last: doc[6], 
                    role: doc[7]
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

    setVerify = (_userId, status) => {
        const approveUrl = new URL('/user/setUserVerified', Globals.currentHost);
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
    }

    verify = (status) => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = 0; i < selectedData.length; i++) {
            this.setVerify(selectedData[i].id, status);
        }
        setTimeout(() => {
            this.getUsers();
            document.body.style.cursor = 'default';
            this.resp = "";
        }, 1000);
    }
    
    setRole = (_userId) => {
        console.log("Firing for ID",_userId);
        const approveUrl = new URL('/user/setUserRole', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('userId', _userId);
        dataForm.append('role',this.state.role);

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
    }

    role = () => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = 0; i < selectedData.length; i++) {
            this.setRole(selectedData[i].id);
        }
        setTimeout(() => {
            this.getUsers();
            document.body.style.cursor = 'default';
            this.resp = "";
        }, 1000);
    }

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }
    
    render() {

        if(this.state.admin) {
            return (
                <div id="approve">
                    <div className="instructions"><span className="bold">
                        Instructions: 
                        Hold shift and drag rows to select/deselect multiple users, or click row to select/deselect.
                        Table will update after clicking approve or deactivate button.
                    </span></div>
                    <br />
                    <br />
                    <ReactTabulator
                        ref={this.my_table}
                        data={this.state.users}
                        columns={columns}
                        options={options}
                        pageLoaded={this.onPageLoaded}
                    />
                    <br />
                    
                    <div>
                        <button type="button" className="button" onClick={() => this.role()}>
                            Set role to:
                        </button>
    
                        <input type="text" onInput={this.onChange} name="role" />
                    </div>
                    
                    <div>
                        <button type="button" className="button" onClick={() => this.verify(true)}>
                            Verify user(s)
                        </button>
    
                        <button type="button" className="button"onClick={() => this.verify(false)}>
                            Unverify user(s)
                        </button>
                    </div>
    
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
        } else {
            return <div id="approve">401</div>
        }

        
    }

    componentDidMount = () => {
        try {
            this.checkAdmin();
            this.getUsers();
        } catch(e) {
            console.error(e);
        }
    }
}