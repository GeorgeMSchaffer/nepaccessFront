import React, {Component} from 'react';

import Dropzone from 'react-dropzone';

import axios from 'axios';
import Globals from './globals';

let reader;

/** Handle .geojson and prepare it in a way that Java will appreciate, then send it to backend and show the results to user */
export default class ImporterAlignment extends Component {


    constructor(props) {
        super(props);

        this.state = { 
            totalSize: 0,
            alignment: [],

            networkError: '',
            successLabel: "Not ready",
            failLabel: '',
            results: "",

            dragClass: '',
            files: [],
            
            disabled: false,
            busy: false,
        };
    }


    onDrop = (dropped) => {

        const setText = (text) => {

            let _alignment = [];
            let json = JSON.parse(text);

            // console.log("Text",text);
            // console.log("JSON",json);
            // console.log("Length", Object.keys(json).length);

            this.setState({
                alignment: json,
                successLabel: "Ready"
            });
        }

        reader.onload = function(e) {
            let text = e.target.result;

            setText(text);
        };

        this.setState({
            files: dropped,
            dragClass: '',
            totalSize: 0
        }, ()=> {
            console.log("Files", this.state.files);

            this.state.files.forEach((file)=> {
                console.log("File", file);

                reader.readAsText(file);
            });
        }, () => {

            let _totalSize = 0;
            for(let i = 0; i < this.state.files.length; i++) {
                _totalSize += this.state.files[i].size;
            }

            this.setState({
                totalSize: _totalSize,
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

    validated = () => {
        let valid = true;
        let labelValue = "";

        if(!this.state.alignment || this.state.alignment.length===0){ // No file(s)
            valid = false;
            labelValue = "File is required";
        }

        this.setState({failLabel: labelValue});
        return valid;
    }

    uploadAll = () => {
        const importUrl = new URL('file/import_json_alignment', Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("alignment", JSON.stringify(this.state.alignment));

        let resultString = "";

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFile
        }).then(response => {
            let responseOK = response && response.status === 200;

            if(response.data) {
                let responseArray = response.data;
                responseArray.forEach(element => {
                    resultString += element + "\n";
                });
            } else {
                resultString += "No response data\n";
                responseOK = false;
            }
            
            if (responseOK) {
                return true;
            } else { 
                return false;
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 500) {
                    resultString += "\n::Internal server error.::";
                } else if (error.response.status === 404) {
                    resultString += "\n::Not found.::";
                } 
            } else {
                resultString += "\n::Server may be down (no response), please try again later.::";
            }
            console.error('error message ', error);

            return false;
        }).finally(e => { 
            this.setState({
                results : this.state.results.concat(resultString)
            });
        });

        // Finish
        this.setState({
            successLabel: 'Done',
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
                    Import New Alignment JSON Data
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>

                <div className="import-meta">
                    
                    <div className="importFile">
                        <div>
                            <h2>Instructions:</h2>
                            <h3>Drop .json file in box and click import to add alignment data to database.</h3>
                            <hr />
                        </div>

                        <Dropzone 
                            multiple={false} // Note: If we want to support multiple json files, this should be true
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
                                        <h4>Total size (rounded to MB):</h4>
                                        <ul>{Math.round(this.state.totalSize / 1024 / 1024)} MB</ul>
                                    </aside>
                                </section>
                            )}
                        </Dropzone>

                        
                        {/* <button type="button" className="button" id="submitBulk" 
                                disabled={this.state.disabled} onClick={this.uploadStart}>
                            Import All In Sequence
                        </button> */}
                        <button type="button" className="button" id="submitBulk" 
                                disabled={this.state.disabled} onClick={this.uploadAll}>
                            Import All At Once
                        </button>
                        <label className="errorLabel">{this.state.failLabel}</label>
                        
                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <h3 className="infoLabel green">
                            {"Import status: " + this.state.successLabel}
                        </h3>
                        
                        <label>
                            <b>Server response:</b>
                        </label>
                        <textarea onChange={this.onChangeDummy}
                            value={this.state.results}>
                        </textarea>


                        <button type="button" className="button" id="getMatches" 
                                disabled={true} 
                                onClick={() => {}} >
                            (in progress) Download .tsv of likely process matches
                        </button>


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