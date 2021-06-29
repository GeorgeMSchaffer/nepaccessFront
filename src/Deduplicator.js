import React from 'react';
import axios from 'axios';

import Globals from './globals.js';

import DeduplicatorTab from './DeduplicatorTab.js';

export default class Deduplicator extends React.Component {
    resp = "";

    state = {
        response: "",
        admin: false,
        id1: "",
        id2: ""
    }

    constructor(props) {
        super(props);
    }

    checkCurator = () => {
        let checkUrl = new URL('user/checkCurator', Globals.currentHost);
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

    get = () => {
        // TODO
    }

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => {
            this.get();
        });
    }
    
    
    render() {

        if(this.state.admin) {
            return (
                <div id="approve">
                    <div className="instructions"><span className="bold">
                        Instructions: Enter two record IDs to compare, then edit, save changes, or delete records, as needed.
                    </span></div>
                    
                    <div className="inline">
                        Left: <input type="text" onInput={this.onChange} onChange={this.onChange} name="id1" value={this.state.id1}/>
                    </div>
                    <div className="inline padding">
                        Right: <input type="text" onInput={this.onChange} onChange={this.onChange} name="id2" value={this.state.id2}/>
                    </div>

                    <div className="deduplicator">
                        <DeduplicatorTab id={this.state.id1}></DeduplicatorTab>
                        <DeduplicatorTab id={this.state.id2}></DeduplicatorTab>
                    </div>
                </div>
            );
        } else {
            return <div className="content">401</div>
        }

        
    }

    componentDidMount = () => {
        try {
            this.checkCurator();
        } catch(e) {
            console.error(e);
        }
    }
}