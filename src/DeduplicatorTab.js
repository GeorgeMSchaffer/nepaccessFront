import React from 'react';

import axios from 'axios';

import DetailsUpdate from './Details/DetailsUpdate.js';
import DetailsFileResults from './Details/DetailsFileResults.js';

import './index.css';

import Globals from './globals.js';

const _ = require('lodash');

export default class DeduplicatorTab extends React.Component {

    _internal = null;

	constructor(props){
		super(props);
        this.state = {
            details: {
                
            },
            networkError: '',
            exists: true
        };
    }


    getNepaFileResults = () => {
        let populateUrl = Globals.currentHost + "file/nepafiles";
            
        //Send the AJAX call to the server
        axios.get(populateUrl, {
            params: {
                id: this.props.id
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { // can be empty if nothing found
            // console.log("Parsed", parsedJson);
            if(parsedJson){
                this.setState({
                    nepaResults: parsedJson,
                }, () => {
                    // if(!this.state.nepaResults || !this.state.nepaResults[0]){
                        this.getDocumentTextResults();
                    // }
                });
            } else { // null/404
                
            }
        }).catch(error => {
            
        });
        
    }
    
    getDocumentTextResults = () => {
        let populateUrl = Globals.currentHost + "file/doc_texts";
            
        //Send the AJAX call to the server
        axios.get(populateUrl, {
            params: {
                id: this.props.id
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { // can be empty if nothing found
            if(parsedJson){
                this.setState({
                    textResults: parsedJson,
                });
            } else { // 404
                
            }
        }).catch(error => {
            
        });
    }


    populate = () => {
        let populateUrl = Globals.currentHost + "test/get_by_id";
            
        //Send the AJAX call to the server
        axios.get(populateUrl, {
            params: {
                id: this._internal
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                this.setState({
                    details: response.data,
                });
            } else { // 404
                this.setState({
                    networkError: "No record found (try a different ID)",
                    exists: false
                });
            }
        }).catch(error => {
            this.setState({
                networkError: 'Server is down or you may need to login again.'
            });
        });
    }


    showView = () => {
        return (
            this.showUpdate()
        );
    }

    showUpdate = () => {
        if(this.props.id) {
            return (
                <>
                    {this.showTitle()}
                    <h2 className="title-color">Record ID: {this.props.id}</h2>
                    <DetailsUpdate record={this.state.details} id={this._internal} />
                    <DetailsFileResults results={this.state.nepaResults} headerText="Downloadable file records" />
                    <DetailsFileResults results={this.state.textResults} headerText="Texts" />
                </>
            );
        }
    }

    showTitle = () => {
        if(this.state.details) {
            return (
                <span className="bold">{this.state.details.title}</span>
            );
        }
    }


    render () {
        if(!this.state.exists) {
            return(
                <div className="deduplicator-tab">
                    <label className="warning block">{this.state.networkError}</label>
                </div>
            )
        } else {
            return (
                <div className="deduplicator-tab">
                    <label className="warning block">{this.state.networkError}</label>
                    {this.showView()}
                </div>
            );
        }
    }


	componentDidMount() {
        if(this.props.id && this.props.id !== this._internal) {
            this._internal = this.props.id;

            this.populate();
            this.getNepaFileResults();
        }
	}

    componentDidUpdate() {
        if(this.props.id && this.props.id !== this._internal) {
            this._internal = this.props.id;

            this.populate();
            this.getNepaFileResults();
        }
    }


}