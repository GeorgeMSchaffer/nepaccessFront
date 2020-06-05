import React from 'react';
import axios from 'axios';
import Globals from './globals';

class Importer extends React.Component {


    constructor(props) {
        super(props);
        this.state = { 
            networkError: '',
            successLabel: '',
            disabled: false,
            file: null,
            title: '',
            filename: ''
        };
    }
    
    
    // onChange = (evt) => {
    //     const name = evt.target.name;
    //     const value = evt.target.value;

    //     this.setState( prevState =>
    //     { 
    //         const updatedEmail = prevState.resetEmail;
    //         updatedEmail[name] = value;
    //         return {
    //             resetEmail: updatedEmail
    //         }
    //     });
    // }

    onFileChange = (evt) => {
        this.setState({ 
            title: '', /** TODO: Add this component to record details modal and we can save it for the ID or title of that, 
                        creating a link between metadata, file data, otherwise can create a new record with a new unique title and potentially more metadata **/
            file: evt.target.files[0],
            filename: evt.target.files[0].name // includes extension
        });
    }

    onKeyUp = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.importFile();
        }
    }

    validated = () => {
        let valid = false;
        let labelValue = "";

        if(!this.state.file){
            labelValue = "No file";
        } else {
            valid = true;
        }

        this.setState({successLabel: labelValue});
        return valid;
    }
    

    importFile = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait'; // TODO: Not the best way to do this in React, use componentWillUpdate()?
        this.setState({ 
            networkError: '',
             disabled: true 
        });
        
        let importUrl = new URL('file/import', Globals.currentHost);

        let uploadFile = new FormData();

        uploadFile.append("title", this.state.title);
        uploadFile.append("file", this.state.file);
        uploadFile.append("filename", this.state.filename);

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
    
            document.body.style.cursor = 'default'; // TODO: Better to do this in React, use componentDidUpdate()?
        });

    }


    render() {
        return (
            <div className="container login-form">

                <div className="form">

                    <div className="note">
                        <p>Import Data</p>
                    </div>
                    
                    <label className="loginErrorLabel">
                        {this.state.networkError}
                    </label>

                    <div className="form-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="file" id="file" className="form-control" name="file" disabled={this.state.disabled} autoFocus onChange={this.onFileChange} />
                                </div>
                            </div>
                        </div>

                        <button type="button" className="button" id="submit" disabled={this.state.disabled} onClick={this.importFile}>
                            Import
                        </button>

                        <label className="infoLabel">
                            {this.state.successLabel}
                        </label>
                    </div>

                </div>
            </div>
        )
    }

    componentDidUpate() {

    }
}

export default Importer;