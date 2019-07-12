import React from 'react';
import axios from 'axios';
import './login.css';

class Generate extends React.Component {
    state = {
        csvArray: []
    }

    constructor(props){
        super(props);
        this.generate = this.generate.bind(this);
        this.csvChange = this.csvChange.bind(this);

        // If there's no reason for user to be here, redirect them
        var token = localStorage.JWT;
		if(token){
			axios.defaults.headers.common['Authorization'] = token;
		} 
        axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';

        let checkUrl = new URL('http://localhost:8080/user/checkAdmin');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            checkUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/user/checkAdmin');
        }

        console.log("Test");
        axios({
            url: checkUrl,
            method: 'POST'
          }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) {
                this.props.history.push('/');
            }
          }).catch(error => {
            this.props.history.push('/');
          })

    }

    csvChange(event){
        let text = event.target.value;
        const jsonArray = csvToJSON(text);
        this.setState({csvArray: jsonArray});
    }

    generate(){
        var token = localStorage.JWT;
		if(token){
			axios.defaults.headers.common['Authorization'] = token;
		} 
        axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';

        let generateUrl = new URL('http://localhost:8080/user/generate');
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            generateUrl = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/user/generate');
        }

        console.log(this.state.csvArray);

        axios({
            url: generateUrl,
            method: 'POST',
            data: this.state.csvArray
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
            <button className="button" onClick={this.generate}>Generate accounts</button>
        </div>
        )
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