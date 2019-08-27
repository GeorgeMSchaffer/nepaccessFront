import React from 'react';
import axios from 'axios';
import './login.css';
import Globals from './globals.js';

class Generate extends React.Component {
    state = {
        users: [], // Naming should mirror Generate POJO on backend
        shouldSend: false
    }

    constructor(props){
        super(props);
        this.generate = this.generate.bind(this);
        this.csvChange = this.csvChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);

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
            <button className="button" onClick={this.test}>Test file download stream</button>
        </div>
        )
    }

    // TODO: Move to special testing/admin only page
    test = () => { // TODO: All of this
      // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      // axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
      axios.get('http://mis-jvinalappl1.microage.arizona.edu/downloadFile',{
        params: {
          filename: 'test'
        }
      })
      .then(response => {
        console.log(response);
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