import React from 'react';
import axios from 'axios';

import Globals from './globals.js';

import './aboutNepa.css';
import './aboutHelp.css';

export default class AboutHelpContents extends React.Component {

    constructor() {
        super();
        this.state = {
            finalCount: null,
            draftCount: null,
            finalCountDownloadable: null,
            draftCountDownloadable: null,
            textCount: null,
            earliestYear: null,
            latestYear: null
        }
        
        this.getDraftCount();
        this.getFinalCount();
        this.getDraftCountDownloadable();
        this.getFinalCountDownloadable();
        this.get("stats/text_count","textCount");
        this.get("stats/earliest_year","earliestYear");
        this.get("stats/latest_year","latestYear");
    }
    
    getFinalCount = () => {
        let getUrl = Globals.currentHost + "stats/final_count";
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            console.log(parsedJson);
            if(parsedJson){
                this.setState({
                    finalCount: parsedJson
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
    }
    getFinalCountDownloadable = () => {
        let getUrl = Globals.currentHost + "stats/final_count_downloadable";
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            console.log(parsedJson);
            if(parsedJson){
                this.setState({
                    finalCountDownloadable: parsedJson
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
    }
    getDraftCount = () => {
        let getUrl = Globals.currentHost + "stats/draft_count";
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            console.log(parsedJson);
            if(parsedJson){
                this.setState({
                    draftCount: parsedJson
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
    }
    getDraftCountDownloadable = () => {
        let getUrl = Globals.currentHost + "stats/draft_count_downloadable";
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            console.log(parsedJson);
            if(parsedJson){
                this.setState({
                    draftCountDownloadable: parsedJson
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
    }
    
    get = (endPath,stateField) => {
        let getUrl = Globals.currentHost + endPath;
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            console.log(parsedJson);
            if(parsedJson){
                this.setState({
                    [stateField]: parsedJson
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
    }
    
    render () {
        return (
            <div>
                <div className="spacer"> </div>

                <div id="about-nepa-content">

                    <h1 className="about-nepa-title">
                        What the database contains
                    </h1>
                    
                    <h2>
                        Environmental Impact Statements
                    </h2>
                    

                    <div><p>
                        <span className="dynamic-stat">Blue</span>: Dynamic (retrieved on demand from database)
                    </p></div>
                    
                    <div>
                        NEPAccess contains all (or almost all) records from environmental impact statements (EIS) created between 1987-2020. There are downloadable PDF files for EIS’s from <span className="dynamic-stat">{this.state.earliestYear}</span>-<span className="dynamic-stat">{this.state.latestYear}</span>. 
                    </div>
                    
                    <div><p>
                        This includes <span className="dynamic-stat">{this.state.draftCount}</span> draft and <span className="dynamic-stat">{this.state.finalCount}</span> final documents. 
                        Of these, <span className="dynamic-stat">{this.state.draftCountDownloadable}</span> draft and <span className="dynamic-stat">{this.state.finalCountDownloadable}</span> final EISs are in a format that supports full-text searching and downloading.
                        </p><p>NEPAccess is a work in progress—as time goes on, other documents related to the National Environmental Policy Act of 1969 (NEPA) will be added.  Total searchable texts (each one representing a .pdf): <span className="dynamic-stat">{this.state.textCount}</span>.
                    </p></div>

                    {/* <h2>
                        Downloadable Files
                    </h2>

                    <div>
                        There are currently 1513 downloadable EIS archives available. Because EIS’s are often split into multiple files, the downloaded archive may contain more than one PDF.
                    </div> */}

                    <div>
                        Efforts to compile a complete set of documents are ongoing.
                    </div>

                </div>
            </div>
        );
    }

    componentDidMount() {
    }
}