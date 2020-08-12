import React from 'react';

import axios from 'axios';
import Globals from './globals.js';

// TODO: delete button and confirmation box
// TODO: Determine whether documenttext or nepafile by existence of plaintext/plaintext key in cell object prop
class DeleteFileLink extends React.Component {

    // constructor(props) {
    //     super(props);
    // }

    deleteRecord = () => {
        console.log("Apparently this is just firing");
        // console.log(this.props.cell._cell.row.data.id); // ID
        // console.log(!this.props.cell._cell.row.data.folder); // If no folder, have to assume documenttext
        let deleteUrl = Globals.currentHost;
        const idToDelete = this.props.cell._cell.row.data.id;
        if(!this.props.cell._cell.row.data.folder) {
            deleteUrl += "admin/delete_text";
            // Delete DocumentText by ID
            console.log("No folder: DocumentText, not NEPAFile record");
        } else {
            deleteUrl += "admin/delete_nepa_file";
            // Delete NEPAFile by ID
        }
            
			//Send the AJAX call to the server
			axios({
                url: deleteUrl,
				method: 'POST', 
				data: idToDelete,
				headers:{
					'Content-Type': 'application/json; charset=utf-8'
				}
			}).then(response => {
				let responseOK = response && response.status === 200;
				if (responseOK) {
					return response.data;
				} else {
                    console.log(response.status);
					return null;
				}
			}).then(parsedJson => { // can be empty if nothing found
				if(parsedJson){
                    this.setState({
                        result: parsedJson
                    });
                } else { // 404?

				}
			}).catch(error => {
                console.log(error);
            });
    }

    render(){
        console.log(this.props.cell._cell.row.data);
        return(
            <button onClick={this.deleteRecord}>Delete this</button>
        );
    }
}

export default DeleteFileLink;