import React, {Component} from 'react';

import Creatable from 'react-select/creatable';

import { CSVReader } from 'react-papaparse';

import axios from 'axios';
import Globals from './globals';

const customStyles = {
    option: (styles, state) => ({
         ...styles,
        borderBottom: '1px dotted',
        backgroundColor: 'white',
        color: 'black',
        '&:hover': {
            backgroundColor: 'lightgreen'
        },
    }),
    control: (styles) => ({
        ...styles,
        backgroundColor: 'white',
    })
}

const delimiterOptions = [{value:"", label:"auto-detect"}, {value:",", label:","}, {value:"\t", label:"tab"}
];

/** 
 * Goal is to support uploading: 
 * - .tsv/.csv with ID links between metadata OR process records, and geojson records 
 * (meta id linked to one or more custom-defined geojson ids)
 **/
export default class ImporterGeoLinks extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            networkError: '',
            successLabel: '',
            csvLabel    : '',
            csvError    : '',
            disabled    : false,
            csv         : null,
            canImportCSV: false,
            busy        : false,
            delimiter   : {value:"", label:"auto-detect"}, // auto-detect

            reportBusy  : false,
            headers     : '',
        };
    }

    
    /** Validation */ 

    // no requirements; let backend deal with invalid data
    autoValidate = (csv) => {
        return true;
    }
    

    /** Event handlers */

    onDelimiterChange = (val, act) => {
        if(!val || !act){
            return;
        }
        
        this.setState({
            delimiter: val
        });
    }

    onSelect = (val, act) => {
        if(!val || !act){
            return;
        }

        let name = act.name;
        if(act.action === "create-option"){ // Custom value for document type support
            name = "document";
        }
        const value = val.value;

        this.setState( prevState =>
        { 
            const updatedDoc = prevState.doc;
            updatedDoc[name] = value;
            return {
                doc: updatedDoc
            }
        }, () => {
            // console.log(this.state.doc);
        });

    }

    handleOnDrop = (evt) => {

        let resultString = "Lines processed: " + evt.length + "\n";

        let newArray = [];
        for(let i = 0; i < evt.length; i++){
            if(evt[i].errors && evt[i].errors.length > 0) {
                resultString += "Error on line " + (i + 1) + " (this line was skipped): ";
                for(let j = 0; j < evt[i].errors.length; j++) {
                    resultString += evt[i].errors[j].message + "\n";
                }
            } else {
                newArray.push(evt[i].data);
            }
        }

        this.setState({ 
            csv       : newArray,
            otherError: resultString,
            headers   : Globals.getKeys(evt[0].data).toString().replaceAll(',',', ')
        }, () => {
            this.setState({ canImportCSV: true });
        });
    }

    handleOnRemoveFile = (evt) => { this.setState({ csv: null, canImportCSV: false }); }

    // Note: Just because errors are generated does not necessarily mean that parsing failed.
    handleOnError = (evt) => {}


    /** Import logic */

    // given row, try to return row with corrected headers, formatted to be ready for the backend
    translateRow(importRow) {
        // console.log("Row in",importRow);

        let key, keys = Object.keys(importRow);
        // console.log("Headers",keys);

        let n = keys.length;
        let newObj={};

        while (n--) {
            // Spaces to underscores, lowercase
            let newKey = keys[n].toLocaleLowerCase().replace(/ /g, "_").trim();
            // Keep original key we'll need for copying the value
            key = keys[n];

            // standardize anything anticipated to be wrong
            if(newKey=== "id" || newKey=== "metaid") {
                newKey = "meta_id";
            }
            if(newKey=== "processid") {
                newKey = "process_id";
            }
            if(newKey=== "geoid") {
                newKey = "geo_id";
            }
            
            newObj[newKey] = importRow[key];
        }

        // console.log("New row",newObj);
        return newObj;
    }


    /** Expects .tsv or .csv
    * */
    importCSVHandler = (validation, urlToUse) => {
        let newCSV = [];
        for(let i = 0; i < this.state.csv.length; i++){
            let keys = Object.keys(this.state.csv[i]);

            if(!this.state.csv[i][keys[0]]) {
                // EOF?
            } else {
                newCSV[i] = this.translateRow(this.state.csv[i]);
            }

        }

        if(!validation(newCSV)) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            csvLabel: 'In progress...',
            csvError: '',
            disabled: true,
            busy    : true
        });

        
        let importUrl = new URL(urlToUse, Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("geoLinks", JSON.stringify(newCSV));

        let networkString = '';
        let successString = '';
        let resultString  = "";

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFile
        }).then(response => {
            let responseOK = response && response.status === 200;
            // console.log(response);

            let responseArray = response.data;
            responseArray.forEach(element => {
                resultString += element + "\n";
            });
            
            if (responseOK) {
                return true;
            } else { 
                return false;
            }
        }).then(success => {
            if(success){
                successString = "Success.";
            } else {
                successString = "Failed to import."; // Server down?
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 500) {
                    networkString = "Internal server error.";
                } else if (error.response.status === 404) {
                    networkString = "Not found.";
                } 
            } else {
                networkString = "Server may be down (no response), please try again later.";
            }
            successString = "Couldn't import.";
            console.error('error message ', error);
        }).finally(e => {
            this.setState({
                csvError: networkString,
                csvLabel: successString,
                disabled: false,
                results : resultString,
                busy    : false
            });
    
            document.body.style.cursor = 'default'; 
        });
    }
    

    render() {

        if(!Globals.curatorOrHigher()) {
            return <div className="content">
                401 Unauthorized (not admin or try logging in again?)
            </div>;
        }

        return (
            <div className="form content">
                
                <div className="note">
                    Import GeoJSON ID Linking Data
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>

                <div className="loader-holder" hidden={!this.state.reportBusy}>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
                

                <div className="import-meta">

                    <div className="importFile">
                        <h2>Instructions:</h2>
                        <h3>One .tsv or .csv file at a time supported.</h3>
                        <h3>Support for ; delimited list of geoIDs.</h3>
                        <h3>Header names case insensitive but otherwise must be exact.</h3>
                        <h3>Required headers: id; geo_id.  (id is for the metadata record ID)</h3>
                        <h3>Optional headers: process_id</h3>

                        <hr />

                        <h1>Import spreadsheet:</h1>
                        <label className="advanced-label">Delimiter to use (default auto-detect) </label>
                        <Creatable  id="delimiter" name="delimiter" 
                                    className="multi inline-block" classNamePrefix="react-select"  
                                    isSearchable isClearable 
                                    styles      = {customStyles}
                                    options     = {delimiterOptions}
                                    selected    = {this.state.delimiter}
                                    onChange    = {this.onDelimiterChange} 
                                    placeholder = "Type or select delimiter" 
                        />
                        <CSVReader
                            onDrop  = {this.handleOnDrop}
                            onError = {this.handleOnError}
                            style   = {{}}
                            config  = {{
                                header   : true,
                                delimiter: this.state.delimiter.value
                            }}
                            addRemoveButton
                            onRemoveFile = {this.handleOnRemoveFile}
                        >
                            <span>Drop .csv or .tsv file here or click to upload.</span>
                        </CSVReader>
                        

                        <label className="bold">Headers: {this.state.headers}</label>

                        <hr />
                        
                        <div>
                            <label>Errors or other messages below:</label>
                            <textarea className="errors" value={this.state.otherError} />
                        </div>

                        <button type="button" className="button" id="submitCSVGeoLinks" 
                                disabled = {!this.state.canImportCSV || this.state.disabled} 
                                onClick  = {() => this.importCSVHandler(this.autoValidate,'geojson/import_geo_links')}
                        >
                            Import Meta/GeoJSON link data (sets custom geo ID link by meta ID)
                        </button>

                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <h3 className="infoLabel">
                            {"CSV upload status: " + this.state.csvLabel}
                        </h3>
                        <label className="loginErrorLabel">
                            {this.state.csvError}
                        </label>
                        
                        <div className="importFile">
                            <h1>Results from CSV import:</h1>
                            <textarea value={this.state.results} />
                        </div>
                        
                    </div>
                </div>

            </div>
        );
    }

}