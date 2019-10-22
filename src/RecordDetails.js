import React from 'react';
import ReactModal from 'react-modal';

import DownloadFile from './DownloadFile.js';
// -1. User clicks Record
// -2. Modal opens, shows Record metadata from props
// 3. ID of record or foreign process ID is sent to backend with getRecordDetails(this.props.ID) and message becomes "Loading related documents..."
// 4. Table of title/type/% match/download for related records, message becomes "Related documents:"
// 5. Slider/1-100 textbox for % match (will have to re-request from database with new percentage, debounced)
// 0%+ match would return all records, and that would be silly, need to restrict on backend also
// 6. Good place to put curation options for authorized users
// i.e. alter metadata, import new relations (maybe do this elsewhere), verify/unlink existing relations...  
// and the database updates to reflect it after they confirm changes

export default class RecordDetails extends React.Component {

    // Receives needed props from React-Tabular instance in SearchResults.js
	constructor(props){
		super(props);
        this.state = {
            message: "Related documents:",
            show: false
        };
    }
    
    showModal = (e) => { this.setState({ show: true }); }
    hideModal = (e) => { this.setState({ show: false }); }

    Build = () => {
    
        return (
            <div onClick={e => {
                this.showModal();
            }}>
                {this.props.cell._cell.row.data.title}
            </div>
        );
    }

    // TODO: Include a download link?
    /** Return all metadata, not just what search table shows (right now table has all, though)*/
    showDetails = () => {
        const cellData = this.props.cell._cell.row.data;
        if(cellData) {
            return Object.keys(cellData).map( ((key, i) => {
                if(key !== 'filename' && key !== 'commentsFilename') {
                    return <p key={i} className='modal-line'><span className='modal-title'>{key}:</span> {cellData[key]}</p>;
                } else if(key==='filename') {
                    return <p key={i} className='modal-line'><span className='modal-title'>{key}:</span> <DownloadFile downloadType="EIS" filename={cellData[key]}/> {cellData[key]}</p>;
                } else if(key==='commentsFilename') {
                    return <p key={i} className='modal-line'><span className='modal-title'>{key}:</span> <DownloadFile downloadType="Comments" filename={cellData[key]}/> {cellData[key]}</p>;
                } else {
                    return "";
                }
            }));
        }
    }

    showDocuments = () => {
        // TODO
    }

    render () {
        if(!this.state.show){
            return this.Build();
        } 
        // else {
        //     const cellData = this.props.cell._cell.row.data;
        //     for(var key in cellData) {
        //         if(cellData.hasOwnProperty(key)) {
        //             console.log(key, cellData[key]);
        //         }
        //     }
        // }

        if (typeof(window) !== 'undefined') {
            ReactModal.setAppElement('body');
        }

        // TODO: Get related files from database, display here in interactive table with % slider
        // Should make title a link to make it clear it can be clicked
        return (
            <div>
                {this.Build()}
                <ReactModal 
                    isOpen={this.state.show}
                    parentSelector={() => document.body}
                    // ariaHideApp={false}
                >
                    <button className='button' onClick={this.hideModal}>Close Details View</button>
                    <h2>Record details:</h2>
                    {this.showDetails()}
                    <h2>{this.state.message}</h2>
                    {this.showDocuments()}
                </ReactModal>
            </div>
        );
    }
}