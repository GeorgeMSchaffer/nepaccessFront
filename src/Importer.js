import React, {Component} from 'react';

import Dropzone from 'react-dropzone';

import Select from 'react-select';
import Creatable from 'react-select/creatable';
import DatePicker from "react-datepicker";

import { CSVReader } from 'react-papaparse';

import axios from 'axios';
import Globals from './globals';

import './importer.css';

// TODO: Tell backend to give express server ID as folder for single record imports and make sure that it's linked up correctly
// (Because we can't just dump everything in base folder and hope there are no collisions in the future)

/** DONE: 
 * * Add support for multiple files and also for a .csv which would be processed and should probably require:
    * - links between metadata and files (require filenames; handle linking up, loose/missing files in Spring and other components)
    * - title, federal_register_date, document, state, agency (we should be able to design system to handle them in any order)
 * * multiple file upload functionality for a single record
 **/
// TODO: Test single, multi file record import; test csv upload; build logic for bulk import and then test that
// TODO: Fix error handling to ensure we see an error if something breaks
// TODO: Finally, set up for live
// file: null would just become files: [] and files: evt.target.files instead of files[0]?

// TODO: Full CSV export for EISDoc table

class Importer extends Component {

    constructor(props) {
        super(props);

        this.onDrop = (dropped) => {
            this.setState({
                files: dropped,
                dragClass: ''
            }, ()=> {
                this.setState({
                    baseDirectory: this.getDirectoryName()
                });
                console.log(this.state.files);
                console.log("Base directory should be " + this.getDirectoryName());
            });
        };

        this.onDragEnter = (e) => {
            this.setState({
                dragClass: 'over'
            });
        }
    
        this.onDragLeave = (e) => {
            this.setState({
                dragClass: ''
            });
        }

        this.state = { 
            networkError: '',
            successLabel: '',
            titleLabel: '',
            csvLabel: '',
            csvError: '',
            disabled: false,
            file: null,
            csv: null,
            canImportCSV: false,
            filename: '',
            doc: {
                title: '',
                federal_register_date: '',
                state: '',
                agency: '',
                document: '',
                commentsFilename: '',
                filename: '',
            },
            dragClass: '',
            delimiter: {value:"", label:"auto-detect"}, // auto-detect
            files: [],
            importOption: "csv",
            baseDirectory: ''
        };
        
        let checkUrl = new URL('user/checkCurator', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
          }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { // this probably isn't possible with current backend design (either 200 or error?)
                this.props.history.push('/');
            }
          }).catch(error => { // redirect
            this.props.history.push('/');
          })
    }

    /** Return the base directory of a folder drop to display to user */
    getDirectoryName = () => {
        //this logic works for both Edge and Chrome (10/30/2020), expected first folder format: /folder/
        let pathSegments = this.state.files[0].path.split('/');
        let baseFolder = "";
        if(pathSegments[1] && pathSegments[0].length === 0 && pathSegments[1].length > 0) {
            baseFolder = pathSegments[1];
        }
        return baseFolder;
    }

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
        
        // console.log(val);
        // console.log(act);

        let name = act.name;
        if(act.action === "create-option"){ // Custom value for document type support
            name = "document";
        }
        const value = val.value;
        
        // console.log(value);
        // console.log(name);

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

    onChangeDummy = () => {

    }

    onChange = (evt) => {
        if(evt && evt.target){
            // console.log(evt);
            // console.log(evt.target);
    
            const name = evt.target.name;
            const value = evt.target.value;
    
            this.setState( prevState =>
            { 
                const updatedDoc = prevState.doc;
                updatedDoc[name] = value;
                return {
                    doc: updatedDoc
                }
            });
        }
    }

    onFileChange = (evt) => {
        if(evt != null && evt.target != null && evt.target.files[0] != null){ // Ignore aborted events
            this.setState({ 
                /** TODO: Add this component to record details modal and we can save it for the ID or title of that, 
                  * creating a link between metadata, file data, otherwise can create a new record with a new unique title and potentially more metadata **/
                file: evt.target.files[0],
                filename: evt.target.files[0].name // includes extension
            });
        }
    }

    onKeyUp = (evt) => {
        if(evt.keyCode === 13){
            evt.preventDefault();
            this.importFile();
        }
    }
    
    // set booleanOpton to name of radio button clicked
    onRadioChange = (evt) => {
        // console.log("Radio", evt.target.value);
        this.setState({ [evt.target.name]: evt.target.value });
    }


    hasFiles = () => {
        let valid = true;
        let labelValue = "";

        if(this.state.files.length===0){ // No files
            valid = false;
            labelValue = "File(s) required";
        }
        
        this.setState({successLabel: labelValue});
        return valid;
    }


    validated = () => {
        let valid = true;
        let labelValue = "";

        if(!this.state.file && this.state.files.length===0){ // No file(s)
            valid = false;
            labelValue = "File is required";
        }

        if(this.state.doc.title.trim().length === 0){
            valid = false;
            this.setState({titleLabel: "Title required"});
        }
        if(this.state.doc.state.trim().length === 0){
            valid = false;
            this.setState({stateError: "State required"});
        } 
        if(this.state.doc.agency.trim().length === 0){
            valid = false;
            this.setState({agencyError: "Agency required"});
        } 
        // console.log("Date", this.state.doc.federal_register_date);
        if(!this.state.doc.federal_register_date || this.state.doc.federal_register_date.toString().trim().length === 0){
            valid = false;
            this.setState({dateError: "Date required"});
        } if (this.state.doc.document.trim().length === 0) {
            valid = false;
            this.setState({typeError: "Type required"});
        }

        if(labelValue.length===0 && valid === false){ // File, but invalid inputs
            labelValue = "Couldn't import: Please check inputs";
        }

        this.setState({successLabel: labelValue});
        return valid;
    }

    csvValidated = (csv) => {
        let result = false;
        if(csv[0]){
            let headers = csv[0];
            console.log("Headers", headers);
            // headers.forEach(header => console.log(header));
    
            // Check headers:
            // result = ( // TODO: Make sure these are standard, reasonable values to require based on current spreadsheets
            //     headers.includes('title') && headers.includes('federal_register_date') && headers.includes('agency') && headers.includes('state') 
            //     && headers.includes('document') 
            //     && headers.includes('filename')
            // );
            result = ('title' in headers && 'agency' in headers && 'federal_register_date' in headers 
                && 'state' in headers && 'document' in headers && 
                ('filename' in headers || 'EIS Identifier' in headers));
    
            if(!result){
                this.setState({
                    csvError: "Missing one or more headers (title, federal register date, agency, state, document, filename/EIS Identifier)"
                });
            }
        } else {
            this.setState({
                csvError: "No headers found or no data found"
            });
        }

        return result;
    }


    uploadFiles = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            networkError: '',
            titleLabel: '',
            agencyError: '',
            stateError: '',
            typeError: '',
            dateError: '',
            disabled: true 
        });
        
        let importUrl = new URL('file/uploadFiles', Globals.currentHost);

        let uploadFiles = new FormData();
        for(let i=0; i < this.state.files.length; i++){
            uploadFiles.append("files", renameFile(this.state.files[i], this.state.files[i].path));
        }
        uploadFiles.append("doc", JSON.stringify(this.state.doc));

        let networkString = '';
        let successString = '';

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFiles
        }).then(response => {
            let responseOK = response && response.status === 200;
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
                networkError: networkString,
                successLabel: successString,
                disabled: false
            });
    
            document.body.style.cursor = 'default'; 
        });


        function renameFile(originalFile, newName) {
            return new File([originalFile], newName, {
                type: originalFile.type,
                lastModified: originalFile.lastModified,
            });
        }
    }
    

    importFile = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            networkError: '',
            titleLabel: '',
            agencyError: '',
            stateError: '',
            typeError: '',
            dateError: '',
            disabled: true 
        });
        
        let importUrl = new URL('file/uploadFile', Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("file", this.state.file);
        uploadFile.append("doc", JSON.stringify(this.state.doc));
        
        // uploadFile.append('file', new Blob([this.state.file]) );
        // uploadFile.append('file', new Blob([this.state.file], { type: 'text/csv' }) );

        // console.log(this.state.doc);
        // console.log(this.state.file);

        // axios.post(importUrl, uploadFile, { 
        //     headers: { 'Content-Type': 'multipart/form-data' } 
        // });
        // return;

        let networkString = '';
        let successString = '';

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFile
        }).then(response => {
            let responseOK = response && response.status === 200;
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
                networkError: networkString,
                successLabel: successString,
                disabled: false
            });
    
            document.body.style.cursor = 'default'; 
        });

    }


    importCSVDummy = () => {
        let newCSV = [];
        for(let i = 0; i < this.state.csv.length; i++){
            let key, keys = Object.keys(this.state.csv[i]);
            let n = keys.length;
            let newObj={};
            while (n--) {
                let newKey = keys[n];
                key = keys[n];
                // Handle abnormal headers here
                if(key==="document_type"){ // actual column name
                    newKey="document";
                }
                if(key==="File name"){
                    newKey = "filename";
                }
                if(key==="register_date"){
                    newKey = "federal_register_date";
                }
                if(key==="comment_date"){
                    newKey = "epa_comment_letter_date";
                }
                if(key==="folder"){
                    newKey = "eis_identifier";
                }
                if(key==="web_link"){
                    newKey = "link";
                }

                // Spaces to underscores
                newObj[newKey.toLowerCase().replace(/ /g, "_")] = this.state.csv[i][key];

                // Try to separate by ;, move appropriate value to new comments_filename column
                if(newKey.toLowerCase()==="filename" && this.state.csv[i][key]) {
                    // "Filename" could be only comments, so reset it first
                    newObj["filename"] = "";
                    try {
                        let files = this.state.csv[i][key].split(';');
                        if(files && files.length > 0) {
                            files.forEach(filename => {
                                // If comment, send to comments_filename column
                                if(filename.includes("CommentLetters")) {
                                    newObj["comments_filename"] = filename;
                                }
                                // If EIS, replace with only EIS filename in filename column
                                else if(filename.includes("EisDocuments")) {
                                    newObj["filename"] = filename;
                                }
                            });
                        }
                    } catch(e) {
                        console.log("Filename parsing error",e);
                    }
                }
            }
            // console.log("object",newObj);
            if(!this.state.csv[i][key]) {
                // EOF?
            } else {
                // console.log("Key",this.state.csv[i][key]);
                // Normalize title spacing (lots of incoming data has this irregularity)
                newObj["title"] = newObj["title"].replace(/\s{2,}/g, ' ');
    
                newCSV[i] = newObj;
            }

        }

        if(!this.csvValidated(newCSV)) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            csvLabel: 'In progress...',
            csvError: '',
            disabled: true 
        });

        
        let importUrl = new URL('file/uploadCSV_dummy', Globals.currentHost);

        let uploadFile = new FormData();
        // uploadFile.append("csv", JSON.stringify(this.state.csv));
        uploadFile.append("csv", JSON.stringify(newCSV));
        
        // let importObject = {"UploadInputs": this.state.csv};
        // uploadFile.append("csv", JSON.stringify(importObject));

        // console.log(this.state.csv);
        // console.log(uploadFile.get("csv"));

        let networkString = '';
        let successString = '';
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
                results : resultString
            });
    
            document.body.style.cursor = 'default'; 
        });
    }

    importCSVTitles = () => {
        let newCSV = [];
        for(let i = 0; i < this.state.csv.length; i++){
            let key, keys = Object.keys(this.state.csv[i]);
            let n = keys.length;
            let newObj={};
            while (n--) {
                let newKey = keys[n];
                key = keys[n];

                // Spaces to underscores
                newObj[newKey.toLowerCase().replace(/ /g, "_")] = this.state.csv[i][key];
            }
            if(!this.state.csv[i][key]) {
                // EOF?
            } else {
                newObj["title"] = newObj["title"].replace(/\s{2,}/g, ' ');
    
                newCSV[i] = newObj;
            }

        }
        
        console.log("Headers", newCSV[0]);
        if(newCSV[0] && 'title' in newCSV[0]){
            // All good
        } else {
            return;
        }

        document.body.style.cursor = 'wait';
        this.setState({ 
            csvLabel: 'In progress...',
            csvError: '',
            disabled: true 
        });
        
        let importUrl = new URL('file/uploadCSV_titles', Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("csv", JSON.stringify(newCSV));

        let networkString = '';
        let successString = '';
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
                results : resultString
            });
    
            document.body.style.cursor = 'default'; 
        });
    }


    // Expect these headers:
    // Title, Document, EPA Comment Letter Date, Federal Register Date, Agency, State, EIS Identifier, Filename, Link
    // Latest .tsv (has to be converted manually) missing EIS Identifier and also includes:
    // Cooperating agencies, Edited by, Edited on
    // Also has "File name" instead of filename which includes up to two archives, one for EIS and
    // one for EPA comments, separated by ;
    // So this has to be programmatically moved to the comment filename column
    // Translate these into a standard before sending it on?
    // This should also work with .tsv
    importCSV = () => {
        let newCSV = [];
        for(let i = 0; i < this.state.csv.length; i++){
            let key, keys = Object.keys(this.state.csv[i]);
            let n = keys.length;
            let newObj={};
            while (n--) {
                let newKey = keys[n];
                key = keys[n];
                // Handle abnormal headers here
                if(key==="document_type"){ // actual column name
                    newKey="document";
                }
                if(key==="File name"){
                    newKey = "filename";
                }
                if(key==="register_date"){
                    newKey = "federal_register_date";
                }
                if(key==="comment_date"){
                    newKey = "epa_comment_letter_date";
                }
                if(key==="folder"){
                    newKey = "eis_identifier";
                }
                if(key==="web_link"){
                    newKey = "link";
                }

                // Spaces to underscores
                newObj[newKey.toLowerCase().replace(/ /g, "_")] = this.state.csv[i][key];

                // Try to separate by ;, move appropriate value to new comments_filename column
                if(newKey.toLowerCase()==="filename" && this.state.csv[i][key]) {
                    // "Filename" could be only comments, so reset it first
                    newObj["filename"] = "";
                    try {
                        let files = this.state.csv[i][key].split(';');
                        if(files && files.length > 0) {
                            files.forEach(filename => {
                                // If comment, send to comments_filename column
                                if(filename.includes("CommentLetters")) {
                                    newObj["comments_filename"] = filename;
                                }
                                // If EIS, replace with only EIS filename in filename column
                                else if(filename.includes("EisDocuments")) {
                                    newObj["filename"] = filename;
                                }
                            });
                        }
                    } catch(e) {
                        console.log("Filename parsing error",e);
                    }
                }
            }

            if(!this.state.csv[i][key]) {
                // EOF?
            } else {
                // Normalize title spacing (lots of incoming data has this irregularity)
                newObj["title"] = newObj["title"].replace(/\s{2,}/g, ' ');
    
                newCSV[i] = newObj;
            }

        }

        if(!this.csvValidated(newCSV)) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            csvLabel: 'In progress...',
            csvError: '',
            disabled: true 
        });

        
        let importUrl = new URL('file/uploadCSV', Globals.currentHost);

        let uploadFile = new FormData();
        // uploadFile.append("csv", JSON.stringify(this.state.csv));
        uploadFile.append("csv", JSON.stringify(newCSV));
        
        // let importObject = {"UploadInputs": this.state.csv};
        // uploadFile.append("csv", JSON.stringify(importObject));

        // console.log(this.state.csv);
        // console.log(uploadFile.get("csv"));

        let networkString = '';
        let successString = '';
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
                results : resultString
            });
    
            document.body.style.cursor = 'default'; 
        });
    }
    // TODO: Map array into new array of just data, without the name data?
    handleOnDrop = (evt) => {
        // console.log("Data:");
        // console.log(evt);
        // console.log(evt[0]);
        // console.log(evt[0].data);
        let newArray = [];
        for(let i = 0; i < evt.length; i++){
            newArray.push(evt[i].data);
        }
        // console.log(newArray);
        this.setState({ 
            csv: newArray
        }, () => {
            // console.log("Event:");
            // console.log(evt);
            this.setState({ canImportCSV: true });
        });
    }

    handleOnRemoveFile = (evt) => { this.setState({ csv: null, canImportCSV: false }); }

    handleOnError = (evt) => {
        // Note: Just because errors are generated does not necessarily mean that parsing failed.
    }


    dictateButtonStates = () => {
        // TODO: Decide here when called, to set the button states to disabled or not
    }

    bulkUpload = () => {
        if(!this.hasFiles()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            networkError: '',
            successLabel: 'Uploading...  (this tab must remain open to finish)',
            disabled: true 
        });
        
        let importUrl = new URL('file/uploadFilesBulk', Globals.currentHost);

        let uploadFiles = new FormData();
        for(let i=0; i < this.state.files.length; i++){
            uploadFiles.append("files", renameFile(this.state.files[i], this.state.files[i].path));
        }

        let networkString = '';
        let successString = 'Now importing files.  This could take some time.';

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFiles
        }).then(response => {
            console.log("Import response",response);
            let responseOK = response && response.status === 200;
            if (responseOK) {
                
                this.setState({importResults: response.data});

                return true;
            } else { 
                return false;
            }
        }).then(success => {
            if(success){
                successString = "Successfully imported.";
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
                networkError: networkString,
                successLabel: successString,
                disabled: false
            });
    
            document.body.style.cursor = 'default'; 
        });


        function renameFile(originalFile, newName) {
            return new File([originalFile], newName, {
                type: originalFile.type,
                lastModified: originalFile.lastModified,
            });
        }
    }
    

    showDate = () => {
        const setRegisterDate = (date) => {
            // console.log(date);
            this.setState( prevState =>
                { 
                    const updatedDoc = prevState.doc;
                    updatedDoc['federal_register_date'] = date;
                    return {
                        doc: updatedDoc
                    }
                }, () => {
                    // console.log(this.state.doc);
                }
            );
        }
        return (
            <DatePicker
                selected={this.state.doc.federal_register_date} 
                onChange={date => setRegisterDate(date)}
                name='federal_register_date'
                dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                className="date no-margin" 
            />
        )
    }




    /* constructs a simple directory view from a filesystem */
    // makedir = (entries) => {

    //     const systems = entries.map(entry => traverse(entry, {}));
    //     return Promise.all(systems);

    //     async function traverse(entry, fs) {
    //         if (entry.isDirectory) {
    //         fs[entry.name] = {};
    //         let dirReader = entry.createReader();
    //         await new Promise((res, rej) => {
    //             dirReader.readEntries(async entries => {
    //             for (let e of entries) {
    //                 await traverse(e, fs[entry.name]);
    //             }
    //             res();
    //             }, rej);
    //         });
    //         } else if (entry.isFile) {
    //         await new Promise((res, rej) => {
    //             entry.file(file => {
    //                 fs[entry.name] = file;
    //                 res();
    //             }, rej);
    //         });
    //         }
    //         return fs;
    //     }
    // }

    // readDropped = (dT) => {
    //     const entries = [...dT.items].map(item => {
    //         return item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
    //         })
    //         .filter(entry => entry);
    //     if (entries.length) {
    //         this.makedir(entries)
    //         .then(this.output)
    //         .catch(this.handleSecurityLimitation);
    //     } 
    //     else {
    //         this.notadir();
    //     }

    // }

    // notadir = () => {
    //     this.setState({
    //         logText:  "wasn't a directory, or webkitdirectory is not supported"
    //     });
    // }

    // dropzoneOndragover = e => {
    //     if(e){
    //         e.preventDefault();
    //         this.setState({ dropzoneClass: 'over' });
    //     }
    // }
    
    // dropZoneDragStart = e => { /** do nothing */ }

    // dropzoneOnDragExit = e => { 
    //     if(e){
    //         this.setState({ dropzoneClass: '' });
    //     }
    // }

    // dropzoneOnDrop = e => {
    //     if(e){
    //         e.preventDefault();
    //         this.setState({ dropzoneClass: '' });
    //         this.readDropped(e.dataTransfer);
    //     }
    // }

    // output = (system_trees) => {
    //     console.log(system_trees);

    //     this.setState({
    //         files: []
    //     }, () => {
    //         this.setState({
    //             logText: JSON.stringify(system_trees, checkFile, 2)
    //         });
    //         this.uploadFiles(system_trees);
    //     });
        

    //     function checkFile(key, value) {
    //         if (value instanceof File) {
    //             return '{[File] ' + value.name + ', ' + value.size + 'b}';
    //         } else {
    //             return value;
    //         }
    //     }
    // }  

    // handleSecurityLimitation = (error) => {
    //     console.error(error);
    // }


    render() {

        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
        ));
        
        const agencyOptions = [	{ value: 'ACHP', label: 'Advisory Council on Historic Preservation (ACHP)' },{ value: 'USAID', label: 'Agency for International Development (USAID)' },{ value: 'ARS', label: 'Agriculture Research Service (ARS)' },{ value: 'APHIS', label: 'Animal and Plant Health Inspection Service (APHIS)' },{ value: 'AFRH', label: 'Armed Forces Retirement Home (AFRH)' },{ value: 'BPA', label: 'Bonneville Power Administration (BPA)' },{ value: 'BIA', label: 'Bureau of Indian Affairs (BIA)' },{ value: 'BLM', label: 'Bureau of Land Management (BLM)' },{ value: 'USBM', label: 'Bureau of Mines (USBM)' },{ value: 'BOEM', label: 'Bureau of Ocean Energy Management (BOEM)' },{ value: 'BOP', label: 'Bureau of Prisons (BOP)' },{ value: 'BR', label: 'Bureau of Reclamation (BR)' },{ value: 'Caltrans', label: 'California Department of Transportation (Caltrans)' },{ value: 'CHSRA', label: 'California High-Speed Rail Authority (CHSRA)' },{ value: 'CIA', label: 'Central Intelligence Agency (CIA)' },{ value: 'NYCOMB', label: 'City of New York, Office of Management and Budget (NYCOMB)' },{ value: 'CDBG', label: 'Community Development Block Grant (CDBG)' },{ value: 'CTDOH', label: 'Connecticut Department of Housing (CTDOH)' },{ value: 'BRAC', label: 'Defense Base Closure and Realignment Commission (BRAC)' },{ value: 'DLA', label: 'Defense Logistics Agency (DLA)' },{ value: 'DNA', label: 'Defense Nuclear Agency (DNA)' },{ value: 'DNFSB', label: 'Defense Nuclear Fac. Safety Board (DNFSB)' },{ value: 'DSA', label: 'Defense Supply Agency (DSA)' },{ value: 'DRB', label: 'Delaware River Basin Commission (DRB)' },{ value: 'DC', label: 'Denali Commission (DC)' },{ value: 'USDA', label: 'Department of Agriculture (USDA)' },{ value: 'DOC', label: 'Department of Commerce (DOC)' },{ value: 'DOD', label: 'Department of Defense (DOD)' },{ value: 'DOE', label: 'Department of Energy (DOE)' },{ value: 'HHS', label: 'Department of Health and Human Services (HHS)' },{ value: 'DHS', label: 'Department of Homeland Security (DHS)' },{ value: 'HUD', label: 'Department of Housing and Urban Development (HUD)' },{ value: 'DOJ', label: 'Department of Justice (DOJ)' },{ value: 'DOL', label: 'Department of Labor (DOL)' },{ value: 'DOS', label: 'Department of State (DOS)' },{ value: 'DOT', label: 'Department of Transportation (DOT)' },{ value: 'TREAS', label: 'Department of Treasury (TREAS)' },{ value: 'VA', label: 'Department of Veteran Affairs (VA)' },{ value: 'DOI', label: 'Department of the Interior (DOI)' },{ value: 'DEA', label: 'Drug Enforcement Administration (DEA)' },{ value: 'EDA', label: 'Economic Development Administration (EDA)' },{ value: 'ERA', label: 'Energy Regulatory Administration (ERA)' },{ value: 'ERDA', label: 'Energy Research and Development Administration (ERDA)' },{ value: 'EPA', label: 'Environmental Protection Agency (EPA)' },{ value: 'FSA', label: 'Farm Service Agency (FSA)' },{ value: 'FHA', label: 'Farmers Home Administration (FHA)' },{ value: 'FAA', label: 'Federal Aviation Administration (FAA)' },{ value: 'FCC', label: 'Federal Communications Commission (FCC)' },{ value: 'FEMA', label: 'Federal Emergency Management Agency (FEMA)' },{ value: 'FEA', label: 'Federal Energy Administration (FEA)' },{ value: 'FERC', label: 'Federal Energy Regulatory Commission (FERC)' },{ value: 'FHWA', label: 'Federal Highway Administration (FHWA)' },{ value: 'FMC', label: 'Federal Maritime Commission (FMC)' },{ value: 'FMSHRC', label: 'Federal Mine Safety and Health Review Commission (FMSHRC)' },{ value: 'FMCSA', label: 'Federal Motor Carrier Safety Administration (FMCSA)' },{ value: 'FPC', label: 'Federal Power Commission (FPC)' },{ value: 'FRA', label: 'Federal Railroad Administration (FRA)' },{ value: 'FRBSF', label: 'Federal Reserve Bank of San Francisco (FRBSF)' },{ value: 'FTA', label: 'Federal Transit Administration (FTA)' },{ value: 'USFWS', label: 'Fish and Wildlife Service (USFWS)' },{ value: 'FDOT', label: 'Florida Department of Transportation (FDOT)' },{ value: 'FDA', label: 'Food and Drug Administration (FDA)' },{ value: 'USFS', label: 'Forest Service (USFS)' },{ value: 'GSA', label: 'General Services Administration (GSA)' },{ value: 'USGS', label: 'Geological Survey (USGS)' },{ value: 'GLB', label: 'Great Lakes Basin Commission (GLB)' },{ value: 'IHS', label: 'Indian Health Service (IHS)' },{ value: 'IRS', label: 'Internal Revenue Service (IRS)' },{ value: 'IBWC', label: 'International Boundary and Water Commission (IBWC)' },{ value: 'ICC', label: 'Interstate Commerce Commission (ICC)' },{ value: 'JCS', label: 'Joint Chiefs of Staff (JCS)' },{ value: 'MARAD', label: 'Maritime Administration (MARAD)' },{ value: 'MTB', label: 'Materials Transportation Bureau (MTB)' },{ value: 'MSHA', label: 'Mine Safety and Health Administration (MSHA)' },{ value: 'MMS', label: 'Minerals Management Service (MMS)' },{ value: 'MESA', label: 'Mining Enforcement and Safety (MESA)' },{ value: 'MRB', label: 'Missouri River Basin Commission (MRB)' },{ value: 'NASA', label: 'National Aeronautics and Space Administration (NASA)' },{ value: 'NCPC', label: 'National Capital Planning Commission (NCPC)' },{ value: 'NGA', label: 'National Geospatial-Intelligence Agency (NGA)' },{ value: 'NHTSA', label: 'National Highway Traffic Safety Administration (NHTSA)' },{ value: 'NIGC', label: 'National Indian Gaming Commission (NIGC)' },{ value: 'NIH', label: 'National Institute of Health (NIH)' },{ value: 'NMFS', label: 'National Marine Fisheries Service (NMFS)' },{ value: 'NNSA', label: 'National Nuclear Security Administration (NNSA)' },{ value: 'NOAA', label: 'National Oceanic and Atmospheric Administration (NOAA)' },{ value: 'NPS', label: 'National Park Service (NPS)' },{ value: 'NSF', label: 'National Science Foundation (NSF)' },{ value: 'NSA', label: 'National Security Agency (NSA)' },{ value: 'NTSB', label: 'National Transportation Safety Board (NTSB)' },{ value: 'NRCS', label: 'Natural Resource Conservation Service (NRCS)' },{ value: 'NER', label: 'New England River Basin Commission (NER)' },{ value: 'NJDEP', label: 'New Jersey Department of Environmental Protection (NJDEP)' },{ value: 'NRC', label: 'Nuclear Regulatory Commission (NRC)' },{ value: 'OCR', label: 'Office of Coal Research (OCR)' },{ value: 'OSM', label: 'Office of Surface Mining (OSM)' },{ value: 'OBR', label: 'Ohio River Basin Commission (OBR)' },{ value: 'RSPA', label: 'Research and Special Programs (RSPA)' },{ value: 'REA', label: 'Rural Electrification Administration (REA)' },{ value: 'RUS', label: 'Rural Utilities Service (RUS)' },{ value: 'SEC', label: 'Security and Exchange Commission (SEC)' },{ value: 'SBA', label: 'Small Business Administration (SBA)' },{ value: 'SCS', label: 'Soil Conservation Service (SCS)' },{ value: 'SRB', label: 'Souris-Red-Rainy River Basin Commission (SRB)' },{ value: 'STB', label: 'Surface Transportation Board (STB)' },{ value: 'SRC', label: 'Susquehanna River Basin Commission (SRC)' },{ value: 'TVA', label: 'Tennessee Valley Authority (TVA)' },{ value: 'TxDOT', label: 'Texas Department of Transportation (TxDOT)' },{ value: 'TPT', label: 'The Presidio Trust (TPT)' },{ value: 'TDA', label: 'Trade and Development Agency (TDA)' },{ value: 'USACE', label: 'U.S. Army Corps of Engineers (USACE)' },{ value: 'USCG', label: 'U.S. Coast Guard (USCG)' },{ value: 'CBP', label: 'U.S. Customs and Border Protection (CBP)' },{ value: 'RRB', label: 'U.S. Railroad Retirement Board (RRB)' },{ value: 'USAF', label: 'United States Air Force (USAF)' },{ value: 'USA', label: 'United States Army (USA)' },{ value: 'USMC', label: 'United States Marine Corps (USMC)' },{ value: 'USN', label: 'United States Navy (USN)' },{ value: 'USPS', label: 'United States Postal Service (USPS)' },{ value: 'USTR', label: 'United States Trade Representative (USTR)' },{ value: 'UMR', label: 'Upper Mississippi Basin Commission (UMR)' },{ value: 'UMTA', label: 'Urban Mass Transportation Administration (UMTA)' },{ value: 'UDOT', label: 'Utah Department of Transportation (UDOT)' },{ value: 'WAPA', label: 'Western Area Power Administration (WAPA)' }
        ];
                
        const stateOptions = [ { value: 'AK', label: 'Alaska' },{ value: 'AL', label: 'Alabama' },{ value: 'AQ', label: 'Antarctica' },{ value: 'AR', label: 'Arkansas' },{ value: 'AS', label: 'American Samoa' },{ value: 'AZ', label: 'Arizona' },{ value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },{ value: 'CT', label: 'Connecticut' },{ value: 'DC', label: 'District of Columbia' },{ value: 'DE', label: 'Delaware' },{ value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },{ value: 'GU', label: 'Guam' },{ value: 'HI', label: 'Hawaii' },{ value: 'IA', label: 'Iowa' },{ value: 'ID', label: 'Idaho' },{ value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'KS', label: 'Kansas' },{ value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },{ value: 'MA', label: 'Massachusetts' },{ value: 'MD', label: 'Maryland' },{ value: 'ME', label: 'Maine' },{ value: 'MI', label: 'Michigan' },{ value: 'MN', label: 'Minnesota' },{ value: 'MO', label: 'Missouri' },{ value: 'MS', label: 'Mississippi' },{ value: 'MT', label: 'Montana' },{ value: 'Multi', label: 'Multiple' },{ value: 'NAT', label: 'National' },{ value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },{ value: 'NE', label: 'Nebraska' },{ value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },{ value: 'NM', label: 'New Mexico' },{ value: 'NV', label: 'Nevada' },{ value: 'NY', label: 'New York' },{ value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },{ value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },{ value: 'PRO', label: 'Programmatic' },{ value: 'PR', label: 'Puerto Rico' },{ value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },{ value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },{ value: 'TT', label: 'Trust Territory of the Pacific Islands' },{ value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },{ value: 'VA', label: 'Virginia' },{ value: 'VI', label: 'Virgin Islands' },{ value: 'VT', label: 'Vermont' },{ value: 'WA', label: 'Washington' },{ value: 'WI', label: 'Wisconsin' },{ value: 'WV', label: 'West Virginia' },{ value: 'WY', label: 'Wyoming' }
        ];

        const typeOptions = [ { value: 'Final', label: 'Final' },{value: 'Draft', label: 'Draft'} 
        ];

        const delimiterOptions = [{value:"", label:"auto-detect"}, {value:",", label:","}, {value:"\t", label:"tab"}
        ];

        const customStyles = {
            option: (styles, state) => ({
                 ...styles,
                borderBottom: '1px dotted',
	            backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                    backgroundColor: 'lightgreen'
                },
                // ':active': {
                //     ...styles[':active'],
                //     backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                //   },
                //   padding: 20,
            }),
            control: (styles) => ({
                ...styles,
                backgroundColor: 'white',
            })
        }

        return (
            <div className="form content">
                
                <div className="note">
                    <p>Import New Data with File(s)</p>
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>
                
                


                <div className="import-meta">

                    <span className="advanced-radio" >
                        <label className="flex-center no-select cursor-pointer">
                            <input type="radio" className="cursor-pointer" name="importOption" value="csv" onChange={this.onRadioChange} 
                            defaultChecked />
                            CSV
                        </label>
                        <label className="flex-center no-select cursor-pointer">
                            <input type="radio" className="cursor-pointer" name="importOption" value="bulk" onChange={this.onRadioChange} 
                            />
                            Bulk file import (for adding and linking files to already-imported CSV)
                        </label>
                        <label className="flex-center no-select cursor-pointer">
                            <input type="radio" className="cursor-pointer" name="importOption" value="single" onChange={this.onRadioChange} 
                            />
                            Single document
                        </label>
                    </span>

                    <hr />

                    <div className="importFile" hidden={this.state.importOption !== "csv"}>
                        <h2>Instructions:</h2>
                        <h3>One CSV at a time supported.  
                            Header names must be exact.  
                            "EIS Identifier" must represent a foldername that will be uploaded with files in it.  This foldername must be unique system-wide.  
                            If separated into subfolders by document type (which is required if you are linking multiple records to the same EIS Identifier, presumably because they are part of the same process), then the "Document" field must be exactly the same as the subfolder name.  </h3>
                        <h3>Example: If you are going to upload NSF/NSF_00001/Final/file.pdf, then the corresponding CSV line must say Final under the Document header, and NSF_00001 for the EIS Identifier.  
                            When uploading, use bulk file import and drag the entire NSF/ base folder in.  
                            Otherwise, there will be incorrect search results and wrong/unavailable files listed for download.  
                            </h3>
                        <h3>The system detects matches by title, register date and document type.  
                            Existing metadata with no files will be updated if it's a match.  
                            Existing metadata with an existing filename will be skipped if it's a match.  
                            In this situation, when you do the bulk upload, the files for that record will be skipped, because if we already have the documents the system assumes incoming data is duplicate data.  
                            This is to prevent converting and storing duplicate document texts associated with one record.  
                            If you're sure you want to update existing metadata with an existing filename, then use the Force Update header and put Yes.
                            Valid, non-duplicate data will become new metadata records.
                            </h3>
                        <h3>Required headers: Federal Register Date, Document, EIS Identifier (or: Filename), Title</h3>
                        <h3>Optional headers: Agency, State, Link, Notes, Comments Filename, EPA Comment Letter Date, Provenance, Force Update</h3>
                        <h1>Import CSV/TSV:</h1>
                        <label className="advanced-label">Delimiter to use (default auto-detect) </label>
                        <Creatable id="delimiter" className="multi inline-block" classNamePrefix="react-select" name="delimiter" isSearchable isClearable 
                                        styles={customStyles}
                                        options={delimiterOptions}
                                        selected={this.state.delimiter}
                                        onChange={this.onDelimiterChange} 
                                        placeholder="Type or select delimiter" 
                                    />
                        <CSVReader
                            onDrop={this.handleOnDrop}
                            onError={this.handleOnError}
                            style={{}}
                            config={{
                                header:true,
                                delimiter: this.state.delimiter.value
                            }}
                            addRemoveButton
                            onRemoveFile={this.handleOnRemoveFile}
                        >
                            <span>Drop CSV file here or click to upload.</span>
                        </CSVReader>
                        <button type="button" className="button" id="submitCSVDummy" disabled={!this.state.canImportCSV || this.state.disabled} onClick={this.importCSVDummy}>
                            Test Import (Would-be results are returned, but nothing is added to database)
                        </button>
                        <button type="button" className="button" id="submitCSVTitles" disabled={!this.state.canImportCSV || this.state.disabled} onClick={this.importCSVTitles}>
                            (Only works for admin) Import from Buomsoo (curated dates, summaries, coop. agencies, matches on title only, update-only: no new records created)
                        </button>
                        <button type="button" className="button" id="submitCSV" disabled={!this.state.canImportCSV || this.state.disabled} onClick={this.importCSV}>
                            Import CSV/TSV
                        </button>

                        <h3 className="infoLabel">
                            {"CSV upload status: " + this.state.csvLabel}
                        </h3>
                        <label className="loginErrorLabel">
                            {this.state.csvError}
                        </label>
                        
                        <div className="importFile" hidden={this.state.importOption!=="csv"}>
                            <h1>Results from CSV import:</h1>
                            <textarea value={this.state.results} />
                        </div>
                        

                        
                    </div>

                    <div hidden={this.state.importOption !== "single"}>
                        <h1>
                            Import single record:
                        </h1>
                        
                        <div className="center title-container">
                            <div id="fake-search-box-import" className="inline-block">
                                <label className="loginErrorLabel">
                                    {this.state.titleLabel}
                                </label>
                                <input className="search-box" 
                                    name="title" 
                                    placeholder="Title" 
                                    value={this.state.doc.title}
                                    autoFocus 
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                    

                        <table id="advanced-search-box" className="import-table"><tbody>
                            <tr>
                                <td>
                                    <label className="advanced-label" htmlFor="agency">Lead agency</label>
                                    <Select id="searchAgency" className="multi inline-block" classNamePrefix="react-select" name='agency' isSearchable isClearable 
                                        styles={customStyles}
                                        options={agencyOptions} 
                                        selected={this.state.doc.agency}
                                        onChange={this.onSelect} 
                                        placeholder="Type or select lead agency" 
                                        // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                                        // menuIsOpen={true}
                                    />
                                    <label className="loginErrorLabel">{this.state.agencyError}</label>
                                </td>
                                <td>
                                    <label className="advanced-label" htmlFor="state">State</label>
                                    <Select id="searchState" className="multi inline-block" classNamePrefix="react-select" name="state" isSearchable isClearable 
                                        styles={customStyles}
                                        options={stateOptions} 
                                        selected={this.state.doc.state}
                                        onChange={this.onSelect} 
                                        placeholder="Type or select state" 
                                    />
                                    <label className="loginErrorLabel">{this.state.stateError}</label>
                                </td>
                                
                                <td>
                                    {/**TODO: Grab all types from db? */}
                                    <label className="block advanced-label">Document type</label>
                                    {/** Creatable allows custom value, vs. Select */}
                                    <Creatable id="searchType" className="multi inline-block" classNamePrefix="react-select" name="document" isSearchable isClearable 
                                        styles={customStyles}
                                        options={typeOptions} 
                                        selected={this.state.doc.document}
                                        onChange={this.onSelect} 
                                        placeholder="Type or select document type" 
                                    />
                                    <label className="loginErrorLabel">{this.state.typeError}</label>
                                </td>

                            </tr>

                            <tr>
                                <td>
                                    <label className="advanced-label" htmlFor="federal_register_date">Date</label>
                                    <div id="date">
                                        {this.showDate()}
                                        <label className="loginErrorLabel">{this.state.dateError}</label>
                                    </div>
                                </td>
                            </tr>
                        </tbody></table>
                    
                
                        <div className="importFile">
                            <h2>
                                Option 1: Import with single file
                            </h2>
                            <div>
                                <label className="infoLabel">
                                    Note: Full text search may only function with .zip or .pdf uploads
                                </label>
                                <input title="Test" type="file" id="file" className="form-control" name="file" disabled={this.state.disabled} onChange={this.onFileChange} />
                            </div>
                        </div>
                        
                        <div className="importFile">
                            <button type="button" className="button" id="submitImport" disabled={this.state.disabled} onClick={this.importFile}>
                                Import Single Record With File
                            </button>
                        </div>
                    </div>
                            
                    
                    
                    <div className="importFile" hidden={this.state.importOption==="csv"}>
                        <div hidden={this.state.importOption !=="bulk"}>
                            <h2>Instructions:</h2>
                            <h3>Tested on Chrome and Edge, in Windows.  Results on other OSes/browsers is unpredictable.  Size cap unknown (2GB?  Probably 8GB at most)</h3>
                            <h3>Import one or more directories, or import loose archives if appropriate.</h3>
                            <h3>If you have a structure like NSF/NSF_00001/..., you can drag the entire NSF folder in, or you can drag one or more identifying folders in (e.g. NSF_00001, NSF_00002, ...).  
                                If you're dragging the identifying folders in and not their base agency folder, then the folder must start with the base folder name followed by an underscore.  
                                So if you drag in EPA_5555, the system will still put the files in EPA/EPA_5555/.  </h3>
                            <h3>The system will check to see if each file has been converted to text and added to the database for the associated record before.  
                                If so, it's regarded as a duplicate and skipped.  
                                If there is no association found between the folder name and an existing EIS Identifier in the metadata, it's skipped.  
                                If there is a subfolder for document type like with EPA_5000/Final/..., the system will try to match the files with a metadata record with EIS Identifier EPA_5000 and document type Final.  
                                </h3>
                            <h3>The more new files being uploaded, the longer it will take.  The system also takes a bit to extract from archives, convert PDFs to text, add to database and index that text.</h3>

                            <h1>Bulk import:</h1>
                        </div>
                        <h2 hidden={this.state.importOption !== "single"}>Option 2: Import with multiple files</h2> 
                        

                        <Dropzone onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} >
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div className={this.state.dragClass} {...getRootProps({id: 'dropzone'})}>
                                        <input {...getInputProps()} />
                                        <p>Drag and drop file(s) or directory here</p>
                                    </div>
                                    <aside className="dropzone-aside">
                                        <h4>First folder found:</h4>
                                        <ul>{this.state.baseDirectory}</ul>
                                        <h4>Files:</h4>
                                        <ul>{files}</ul>
                                    </aside>
                                </section>
                            )}
                        </Dropzone>
                        
                        <button hidden={this.state.importOption !== "single"} type="button" className="button" id="submit" 
                                disabled={this.state.disabled} onClick={this.uploadFiles}>
                            Import Single Record with Multiple Files
                        </button>
                        <button hidden={this.state.importOption !== "bulk"} type="button" className="button" id="submitBulk" 
                                disabled={this.state.disabled} onClick={this.bulkUpload}>
                            Import Directories with Files to Link with Existing Metadata
                        </button>
                        
                        <h3 className="infoLabel green">
                            {"Import status shown here: " + this.state.successLabel}
                        </h3>

                        <textarea hidden={this.state.importOption !== "bulk"}
                            value={this.state.importResults} onChange={this.onChangeDummy}>
                        </textarea>
                    </div>
                </div>
                <hr />
            </div>
        )
    }

    componentDidUpate() {
    }
    componentDidMount() {
        // console.log(this.state.importOption);
    }
}

export default Importer;