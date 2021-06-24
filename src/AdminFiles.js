import React from 'react';
import axios from 'axios';
import Globals from './globals.js';
import './adminFiles.css';


export default class AdminFiles extends React.Component {
    

    constructor(props) {
        super(props);

        this.state = {
            files: [{}],
            networkError: "",
            networkStatus: "",
            goToId: 1
        }
        
        let checkUrl = new URL('user/checkCurator', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { // impossible? (either 200 or error?)
                this.props.history.push('/');
            }
        }).catch(error => { // redirect
            this.props.history.push('/');
        })
    }




    reCheck = () => {
        this.setState({
            networkStatus: "Checking for new files..."
        });
        
        let checkUrl = new URL('file/filesizes_missing', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'GET'
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { 
                this.setState({
                    networkError: response.status.toString()
                })
            } else {
                this.setState({
                    networkError: "",
                    networkStatus: "OK: Files re-checked"
                }, () => {
                    this.getMissingFiles();
                })
            }
        }).catch(error => { 
            this.setState({
                networkError: error.toString()
            })
        })
    }

    getMissingFiles = () => {
        this.setState({
            networkStatus: "Getting missing files..."
        });
        let checkUrl = new URL('file/missing_files', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'GET'
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { 
                this.setState({
                    networkError: response.status.toString(),
                    networkStatus: "Error? Status not 200"
                })
            } else {
                let firstId = 1;
                if(response.data && response.data[0] && response.data[0][0]) { 
                    firstId = response.data[0][0];
                }

                this.setState({
                    networkError: "",
                    networkStatus: "OK: File list returned; ~" + response.data.length + " files missing.",
                    files: response.data.join('\n'),
                    goToId: firstId
                });
            }
        }).catch(error => { 
            this.setState({
                networkError: error.toString(),
                networkStatus: "Error"
            });
        })
    }

    copyResults = () => {
        const el = this.textArea
        el.select()
        document.execCommand("copy")
    }


    goToRecord = () => {
        this.props.history.push('/record-details?id=' + this.state.goToId);
    }

    onChangeDummy = () => {
        // do nothing
    }
    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    render() {
        return (<>
            <div className="content">
                <div className="note">
                    Missing Files
                </div>
                <div id="admin-files-content">
                    
                    
                    <label className="networkErrorLabel">
                        {this.state.networkError}
                    </label>

                    <div>
                        <label id="admin-files-button-label" className="block">
                            Click button if the automated system missed files:
                        </label>
                        <button id="admin-files-button"
                                className="button"
                                disabled={this.state.networkStatus==="Checking for new files..."}
                                onClick={this.reCheck}>
                            Re-check missing files manually
                        </button>
                    </div>

                    <div id="admin-files-section1">
                        
                        <label className="networkLabel">
                            {this.state.networkStatus}
                        </label>

                        <button id="admin-files-copy" className="button"
                                onClick={this.copyResults}>Copy results to clipboard</button>
                        
                    </div>
                    <div>
                        <a target="_blank" href={"https://www.nepaccess.org/record-details?id="+this.state.goToId}>Go to record:</a>
                        <input name="goToId" value={this.state.goToId} onChange={this.onChange} />
                    </div><div>
                        <label className="block bold" htmlFor="fileList">Files: ID,Filename,folder,type</label>
                        <textarea 
                                ref={(textarea) => this.textArea = textarea}
                                id="fileList" value={this.state.files} onChange={this.onChangeDummy} />
                    </div>
                    
                <p>This tool is just looking for filenames that don't appear to exist, 
                    or folders that don't exist/don't have files in the expected subfolder.  
                    Specifically: It's checking for file sizes saved in the database, but these can be missed by the importer. 
                    So, the re-check button asks the file server again manually.</p>
                </div>
            </div>
        </>);
    }




    componentDidMount() {
        this.getMissingFiles();
    }
}