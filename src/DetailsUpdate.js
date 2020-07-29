import React from 'react';

import DatePicker from "react-datepicker";

import "./details.css";

// TODO: Add in save

class DetailsUpdate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            record: {}
        };
        // console.log("Constructor", this.props.record);
    }

    updateRecord = () => {
        // TODO
        console.log("Record updated");
    }

    // inferior to onInput but react complains if there's no onChange handler
    onChange = (evt) => {}

    onInput = (evt) => {
        if(evt && evt.target){
            let targetName = evt.target.name;
            let targetValue = evt.target.value;
            this.setState(prevState => {
                let record = { ...prevState.record };  // shallow copy of state variable
                record[targetName] = targetValue;                     // update the name property, assign a new value                 
                return { record };                                 // return new state object
            }, () =>{
                // TODO: Validate inputs
            });
        }
    }
    
    onDateChange = (evt) => {
        console.log("Old date", this.state.record.registerDate);
        this.setState(prevState => {
            let record = { ...prevState.record };  // shallow copy of state variable
            record.registerDate = evt;                     // update the name property, assign a new value                 
            return { record };                                 // return new state object
        }, () =>{
            console.log("Date changed", this.state.record.registerDate);
        });
    }

    // Deep clone to state from props to populate inputs (options are either this or a backend call)
    setupInputs = () => {
        if(this.props && this.props.record && !this.state.record.registerDate) { // Props populated yet?  Record still unpopulated?
            // console.log("props", this.props.record);
            // let startState = { ...this.props.record}; /// shallow clone, would be fine today but maybe not tomorrow
            let startState = JSON.parse(JSON.stringify(this.props.record)); // Deep clone (new array/object properties cloned from props object are fully disconnected)

            // Handle date
            if(typeof(startState.registerDate) === "string"){
                startState.registerDate = new Date(startState.registerDate);
            }

            // populate state
            this.setState({
                record: startState
            })
        }
    }

	render() {
        try {
            return (
                <div className="update">
                    <hr />
                    <label className="update">Federal Register Date</label>
                    <DatePicker
                        selected={this.state.record.registerDate} 
                        onChange={this.onDateChange} 
                        dateFormat="yyyy/MM/dd" placeholderText="YYYY/MM/DD"
                        className="date block" 
                    />
                    <label className="update">Agency</label>
                    <input type="text" name="agency" value={"" + this.state.record.agency} onInput={this.onInput} onChange={this.onChange}></input>
                    {/* <input type="text" value={"" + this.state.record.commentDate} onInput={this.onInput} onChange={this.onChange}></input> */}
                    <label className="update">Comments filename</label>
                    <input type="text" name="commentsFilename" value={"" + this.state.record.commentsFilename} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Document type</label>
                    <input type="text" name="documentType" value={"" + this.state.record.documentType} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Filename</label>
                    <input type="text" name="filename" value={"" + this.state.record.filename} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Folder</label>
                    <input type="text" name="folder" value={"" + this.state.record.folder} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Link</label>
                    <input type="text" name="link" value={"" + this.state.record.link} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Notes</label>
                    <input type="text" name="notes" value={"" + this.state.record.notes} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">State</label>
                    <input type="text" name="state" value={"" + this.state.record.state} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Title</label>
                    <input type="text" name="title" value={"" + this.state.record.title} onInput={this.onInput} onChange={this.onChange}></input>
                </div>
            );
        }
        catch (e) {
            return (
                <div>
                    Unknown error; please try refreshing or try again later.
                </div>
            )
        }
    }
    
    componentDidMount() {
        this.setupInputs();
        console.log("Mounted", this.state.record)
    }
    componentDidUpdate() {
        console.log("Updated", this.state.record);
    }
}

export default DetailsUpdate;