import React from 'react';
import axios from 'axios';
import './login.css';
import Globals from './globals.js';

class Generate extends React.Component {
    state = {
        users: [], // Naming should mirror Generate POJO on backend
        shouldSend: false,
        textId: 22
    }

    constructor(props){
        super(props);
        this.generate = this.generate.bind(this);
        this.csvChange = this.csvChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.test = this.test.bind(this);

        // If there's no reason for user to be here, redirect them
        let checkUrl = new URL('user/checkAdmin', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
          }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { // this probably isn't possible with current backend design
                this.props.history.push('/');
            }
          }).catch(error => { // redirect
            this.props.history.push('/');
          })

    }

    csvChange(event){
        let text = event.target.value;
        const jsonArray = csvToJSON(text);
        this.setState({users: jsonArray});
    }

    handleChange(event){
        let val = event.target.value;
        this.setState({
          textId: val
        });
    }

    handleRadioChange(event){
      let sendStatus = false;
      if(event.target.value === "send" && event.target.checked){
        sendStatus = true;
      }
      this.setState({
        shouldSend: sendStatus
      }, () =>{
        console.log(this.state.shouldSend);
      });
    }

    generate(){
        let generateUrl = new URL('user/generate', Globals.currentHost);
        console.log(this.state);

        axios({
            url: generateUrl,
            method: 'POST',
            data: this.state
          }).then(response => {
            console.log(response)
          }).catch(error => {
            console.log(error);
          })
    }

    render(){
      // If there's no reason for user to be here, redirect them
      // let flag = false;
      // let checkUrl = new URL('user/checkAdmin', Globals.currentHost);
      // axios({
      //     url: checkUrl,
      //     method: 'POST'
      //   }).then(response => {
      //     console.log("Response", response);
      //     console.log("Status", response.status);
      //     let responseOK = response.data && response.status === 200;
      //     if (responseOK) {
      //       flag = true;
      //     } else {
      //       console.log("Else");
      //       return "";
      //     }
      //   }).catch(error => {
      //     return "";
      //   })
      //   if(!flag){
      //     return "";
      //   } else {
          return (
            <div id="main">
                <textarea cols='60' rows='20' name="csvText" onChange={this.csvChange} />
                <ul>
                  <li>
                    <label>
                      <input type="radio"
                      value="send"
                      checked={this.state.shouldSend}
                      onChange={this.handleRadioChange}></input>
                      Send an email to each user with credentials
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio"
                      value="noSend"
                      checked={!this.state.shouldSend}
                      onChange={this.handleRadioChange}></input>
                      Do not send an email to each user with credentials
                    </label>
                  </li>
                </ul>
                <br /><br />
                <button className="button" onClick={this.generate}>Generate accounts</button>
                
                <br /><br /><br />
                <button className="button" onClick={() => this.test('EisDocuments-89324.zip')}>Test file download stream</button>
                <br /><br /><br />
                <input type="text" value={this.state.textId} onChange={this.handleChange}></input><button className="button" onClick={() => this.getText(this.state.textId)}>Get DocumentText by ID</button>
                <br /><br /><br />
                <button className="button" onClick={() => this.testBulkImport()}>Test bulk import</button>
                <br /><br /><br />
                <button className="button" onClick={() => this.testBulkIndex()}>Test bulk index</button>
            </div>
          )
        // }
    }

    getText(textId) {
      console.log("Activating text test for " + Globals.currentHost);

      axios.get((Globals.currentHost + 'text/get_by_id'),{
        params: {
          id: textId
        }
      })
      .then((response) => {
        // verified = response && response.status === 200;
        console.log(response);
      })
      .catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
        console.log(err);
      });
    }
    

    testBulkImport() {
      console.log("Activating test for " + Globals.currentHost);

      axios.get((Globals.currentHost + 'file/bulk'),{
        responseType: 'blob'
      })
      .then((response) => {
        console.log("Activating bulk import");
        console.log(response);
        // verified = response && response.status === 200;
      })
      .catch((err) => { // This will show exceptions, will also fire if server down
        console.log(err);
      });
      
    }

    testBulkIndex() {

      console.log("Activating test for " + Globals.currentHost);

      axios.get((Globals.currentHost + 'text/sync'),{
        responseType: 'blob'
      })
      .then((response) => {
        console.log("Activating bulk index");
        console.log(response);
        // verified = response && response.status === 200;
      })
      .catch((err) => { 
        console.log(err);
      });

    }

    
    test(_filename) {
      console.log("Activating test for " + Globals.currentHost);
      const FileDownload = require('js-file-download');

      axios.get((Globals.currentHost + 'file/downloadFile'),{
        params: {
          filename: _filename
        },
        responseType: 'blob'
      })
      .then((response) => {
        console.log("Activating FileDownload");
        FileDownload(response.data, _filename);
        // verified = response && response.status === 200;
      })
      .catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
        console.log(err);
      });
      
    }

}

export default Generate;

//var csv is the CSV text with headers
function csvToJSON(csv){

    console.log(csv);

    var lines=csv.split(/\r?\n/);
  
    var result = [];
  
    var headers=lines[0].split(",");
    // .match(/("[^"]+"|[^,]+)/g);
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
        // .match(/("[^"]+"|[^,]+)/g);
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    
    return result; //JavaScript object
    // return JSON.stringify(result); //JSON (you don't want this with axios, you might with fetch)
  }