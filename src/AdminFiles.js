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
                    networkStatus: "OK: File list returned",
                    files: response.data.map(parseResult)
                });
            }
        }).catch(error => { 
            this.setState({
                networkError: error.toString(),
                networkStatus: "Error"
            });
        })
    }

    render() {
        return (<>
            <div id="admin-files-content">
                
                <div className="note">
                    <p>Missing Files</p>
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>

                <div>
                    <label className="block">
                        Use button if you believe the automated system missed existing files:
                    </label>
                    <button disabled={this.state.networkStatus==="Checking for new files..."}
                            onClick={this.reCheck}>
                        Re-check missing files manually (takes longer the more files are missing)
                    </button>
                </div>

                <label className="networkLabel">
                    {this.state.networkStatus}
                </label>
                
                <div>
                    <textarea id="fileList" value={this.state.files} />
                </div>
            </div>
        </>);
    }

    componentDidMount() {
        this.getMissingFiles();
    }
}

function parseResult(value) {
    return value + "\n";
}