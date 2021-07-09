import React from 'react';

import axios from 'axios';

import Globals from '../globals.js';

import { ReactTabulator } from 'react-tabulator';

const options = {
    // maxHeight: "100%",           // for limiting table height
    selectable:1,                   // limit 1 selectable
    selectableRollingSelection:false, // disable rolling selection
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

export default class DetailsRestore extends React.Component {

    state = {
        data: [],
        columns: [],

        server_response: "",

        admin: false,
        busy: false
    }

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }


    checkCurator = () => {
        let checkUrl = new URL('user/checkCurator', Globals.currentHost);

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


    get = (getRoute) => {
        this.setState({ busy: true });

        let getUrl = Globals.currentHost + getRoute;
        
        axios.get(getUrl, {
            params: {
                id: this.props.id
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
                    data: parsedJson,
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


    updateTable = () => {
        try {
            // seems necessary when using dynamic columns
            this.my_table.current.table.setColumns(this.state.columns);

            // this.my_table.current.table.replaceData(this.state.data);
        } catch (e) {
            console.error(e);
        }
    }


    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }


    // Simply restore all changes in given selection (technically supports multiple selections)
    restoreSelection = () => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = selectedData.length - 1; i >= 0; i--) {
            console.log(i);
            console.log(selectedData[i]);
            if(selectedData[i] && typeof(selectedData[i] != 'undefined')) {
                this.restoreOneByID(selectedData[i].id);
            }
        }
        document.body.style.cursor = 'default';
    }

    restoreOneByID = (updateLogId) => {
        const postUrl = new URL('update_log/restore', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('id', updateLogId);

        axios({
            url: postUrl,
            method: 'POST',
            data: dataForm
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                server_response: rsp 
            }, () => {
                this.props.repopulate(); // refresh record from db so we can see the changes
                this.get("update_log/find_all_by_id"); // refresh logs so we can see the new log created
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { // redirect
            console.error(error);
        })
    }



    render() {

        if(this.state.admin) {
            return (
                <div className="content padding-all">
                    <h4>Restore this record's metadata to any available selectable row.</h4>

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

                    <span>Warning: The "Restore" button will in fact change the database contents.</span>

                    <br />

                    <div className="padding-all border-red">
                        <button type="button" onClick={() => this.restoreSelection()}>
                            Restore to selection
                        </button>
                    </div>

                    <br />
                    <label>Server response</label>
                    <div>
                        <textarea readOnly value={this.state.server_response} />
                    </div>
                    
                </div>
            );
        } else {
            return <div className="content">401</div>;
        }
        
    }

    componentDidMount = () => {
        this.checkCurator();
        this.get("update_log/find_all_by_id");
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