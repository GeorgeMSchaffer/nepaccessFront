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
            networkStatus: ""
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
                this.setState({
                    networkError: "",
                    networkStatus: "OK: File list returned; ~" + response.data.length + " files missing.",
                    files: response.data.join('\n')
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



    onChange = () => {
        // do nothing
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
                        <label className="block bold" htmlFor="fileList">Files: Filename,folder,type</label>
                        <textarea 
                                ref={(textarea) => this.textArea = textarea}
                                id="fileList" value={this.state.files} onChange={this.onChange} />
                    </div>
                </div>
            </div>
        </>);
    }




    componentDidMount() {
        this.getMissingFiles();
    }
}