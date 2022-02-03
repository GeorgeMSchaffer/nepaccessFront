import React, {Component} from 'react';

import Dropzone from 'react-dropzone';

import axios from 'axios';
import Globals from './globals';

let reader;

/** Handle .geojson and prepare it in a way that Java will appreciate, then send it to backend and show the results to user */
export default class ImporterGeo extends Component {


    constructor(props) {
        super(props);

        this.state = { 
            totalSize: 0,
            texts: [],
            geojson: [],

            networkError: '',
            successLabel: '',
            failLabel: '',
            results: "",

            dragClass: '',
            files: [],
            
            disabled: false,
            busy: false,
        };
    }


    onDrop = (dropped) => {
        
        // TODO: If we want to support multiple geojson files, we need to save a collection of feature collections instead
        // of exactly one feature collection.  This would probably return the geojson instead of setting state and the parent
        // calling this would run it in a loop and then save the whole collection of collections to state instead.

        // TODO: Let's just send each feature individually, and then file size isn't really a problem.  
        // Server messages will then be added on demand.
        const setText = (text) => {
            let _texts = [];
            let _geojson = [];
            let json = JSON.parse(text);
            console.log("JSON first feature in feature collection",json.features[0]);
            // _texts.push(text);
            _texts.push(JSON.stringify(json.features[0]));

            // Here's where we actually set up the data for import

            json.features.forEach(feature => {
                _geojson.push({
                    'feature':JSON.stringify(feature), 
                    'geo_id':feature.properties.GEOID, 
                    'name':feature.properties.NAME,
                    'state_id':feature.STATEFP
                });
            });

            // console.log(_geojson);

            this.setState({
                texts: _texts,
                geojson: _geojson
            }, () => {
                // console.log("Texts",this.state.texts);
            })
        }

        reader.onload = function(e) {
            let text = e.target.result;
            console.log("Contents", text);

            setText(text);
        };

        this.setState({
            files: dropped,
            texts: [],
            dragClass: '',
            totalSize: 0
        }, ()=> {
            console.log(this.state.files);

            this.state.files.forEach((file)=> {
                console.log("File", file);

                reader.readAsText(file);
            });
        }, () => {

            console.log("Done");

            let _totalSize = 0;
            for(let i = 0; i < this.state.files.length; i++) {
                _totalSize += this.state.files[i].size;
            }

            this.setState({
                totalSize: _totalSize,
            }, () => {
                console.log(this.state.texts);
            });
        });
    };

    onDragEnter = (e) => {
        this.setState({
            dragClass: 'over'
        });
    }

    onDragLeave = (e) => {
        this.setState({
            dragClass: ''
        });
    }

    onChangeDummy = () => {}

    /** Validation */

    validated = () => {
        let valid = true;
        let labelValue = "";

        if(!this.state.geojson || this.state.geojson.length===0){ // No file(s)
            valid = false;
            labelValue = "File is required";
        }

        this.setState({failLabel: labelValue});
        return valid;
    }

    geoUploadOne = (importUrl, formData, i) => {
        let resultString = "Item " + i + ": ";

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: formData
        }).then(response => {
            let responseOK = response && response.status === 200;

            let responseArray = response.data;
            responseArray.forEach(element => {
                resultString += element + "\n";
            });
            
            if (responseOK) {
                return true;
            } else { 
                return false;
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 500) {
                    resultString += "::Internal server error.::";
                } else if (error.response.status === 404) {
                    resultString += "::Not found.::";
                } 
            } else {
                resultString += "::Server may be down (no response), please try again later.::";
            }
            console.error('error message ', error);
            return false;
        }).finally(e => {
            this.setState({
                results : this.state.results.concat(resultString)
            });
        });
    }

    geoUpload = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            successLabel: 'In progress...',
            failLabel: '',
            results: "",
            disabled: true,
            busy: true
        });

        let importUrl = new URL('geojson/import_geo_one', Globals.currentHost);

        const geoData = this.state.geojson;

        for(let i = 0; i < geoData.length; i++) {
            let uploadFile = new FormData();
            uploadFile.append("geo", JSON.stringify(geoData[i]));

            this.geoUploadOne(importUrl,uploadFile,i);
        }

        this.setState({
            disabled: false,
            busy: false
        });

        document.body.style.cursor = 'default'; 
    }

    checkFileAPI = () => {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            reader = new FileReader();

            return true; 
        } else {
            alert('The File APIs are not fully supported by your browser. Fallback required.');
            
            return false;
        }
    }


    render() {

        if(!Globals.curatorOrHigher()) {
            return <div className="content">
                401 Unauthorized (not admin or try logging in again?)
            </div>;
        }

        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
        ));

        return (
            <div className="form content">
                
                <div className="note">
                    Import New GeoJSON
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>

                <div className="import-meta">
                    
                    <div className="importFile">
                        <div>
                            <h2>Instructions:</h2>
                            <h3>Drop .geojson in box and click import if it looks valid.</h3>
                            <hr />
                        </div>

                        <Dropzone 
                            multiple={false} // TODO: If we want to support multiple geojson files, this should be true
                            onDrop={this.onDrop} 
                            onDragEnter={this.onDragEnter} 
                            onDragLeave={this.onDragLeave} >
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div className={this.state.dragClass} {...getRootProps({id: 'dropzone'})}>
                                        <input {...getInputProps()} />
                                        <span className="drag-inner-text">
                                            Drag and drop ONE file here, or click this box to use file explorer
                                        </span>
                                    </div>
                                    <aside className="dropzone-aside">
                                        <h4>File list:</h4>
                                        <ul>{files}</ul>
                                        {/* <h4>Total size (rounded to MB):</h4>
                                        <ul>{Math.round(this.state.totalSize / 1024 / 1024)} MB</ul> */}
                                    </aside>
                                </section>
                            )}
                        </Dropzone>

                        
                        <button type="button" className="button" id="submitBulk" 
                                disabled={this.state.disabled} onClick={this.geoUpload}>
                            Import
                        </button>
                        <label className="errorLabel">{this.state.failLabel}</label>
                        
                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <h3 className="infoLabel green">
                            {"Import status: " + this.state.successLabel}
                        </h3>
                        
                        <label>
                            <b>Contents sample (first feature detected):</b>
                        </label>
                        <textarea onChange={this.onChangeDummy}
                            value={this.state.texts}>
                        </textarea>
                        
                        <label>
                            <b>Server response:</b>
                        </label>
                        <textarea onChange={this.onChangeDummy}
                            value={this.state.results}>
                        </textarea>

                    </div>
                </div>
                <hr />
            </div>
        );
    }

    componentDidMount() {
        this.checkFileAPI();
    }
}