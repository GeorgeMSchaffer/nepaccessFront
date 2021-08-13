import React from 'react';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';

import axios from 'axios';
import Globals from './globals.js';

import './excel.css';

export default class Excel extends React.Component {

    state = {
        rows: [],
        cols: [],

        busy: false,
        admin: false
    }

    get = (getRoute) => {
        this.setState({ busy: true });

        let getUrl = Globals.currentHost + getRoute;
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return JSON.parse(response.data.json)
            }
        }).then(parsedJson => { 
            console.log(parsedJson);
            if(parsedJson.rows && parsedJson.cols){
                this.setState({
                    cols: parsedJson.cols,
                    rows: parsedJson.rows,
                    busy: false
                });
            } else {
                // TODO
                this.setState({
                    busy: false
                });
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ busy: false });
        });
    }
    
    post = (_postUrl, _data) => {
        const postUrl = new URL(_postUrl, Globals.currentHost);
        axios({
            url: postUrl,
            method: 'POST',
            data: _data
        }).then(_response => {
            const rsp = JSON.stringify(_response.data);
            this.setState({
                server_response: rsp 
            }, () => {
                console.log("JSON response", this.state.server_response);
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { // redirect
            console.error(error);
        })
    }

    fileHandler = (event) => {
        let fileObj = event.target.files[0];
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            console.log(resp);
            resp.rows = this.convertDecimalsInRowsToPercents(resp.rows);
            if(err) {
                console.log(err);            
            }
            else {
                this.post("reports/excel_post",resp);
            }
        });               
    }
    convertDecimalsInRowsToPercents = (rows) => {
        rows.map(items => {
            for(let i = 2; i < items.length; i++) {
                if( items[i] && (items[i] - Math.floor(items[i]) !== 0) ) {
                    // convert to percentile and also use .floor to round out decimals
                    let newItem = (Math.floor(items[i]*10000) / 100) + "%";
                    items[i] = newItem;
                }
            }
            return items;
        });

        return rows;
    }

    renderAdminControl = () => {
        if(this.state.admin) {
            return <input type="file" onChange={this.fileHandler.bind(this)} style={{"padding":"10px"}} />;
        }
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

    render() {
        return (
            <div className="content padding-all">
                <div className="loader-holder" hidden={!this.state.busy}>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>

                {this.renderAdminControl()}

                <OutTable 
                    data={this.state.rows} 
                    columns={this.state.cols} 
                    tableClassName="ExcelTable" 
                    tableHeaderRowClass="heading" />

            </div>
        );
    }

    componentDidMount = () => {
        this.get("reports/excel_get");
        this.checkAdmin();
    }
    
    componentDidUpdate() {
    }
}