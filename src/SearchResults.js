import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_midnight.css'; // theme
import { ReactTabulator } from 'react-tabulator';

class SearchResults extends React.Component {

	// TODO: At some point, the database should probably be giving us the headers to use.

	render() {
        console.log("SearchResults");
        
        
        const columns = [
            { title: "Title", field: "title", width: 750 },
            { title: "Agency", field: "agency" },
            { title: "Comment date", field: "commentDate" },
            { title: "Register date", field: "registerDate" },
            { title: "State", field: "state", width: 80 },
            { title: "Version", field: "documentType" }
        ];
        const results = this.props.results;

        var data = results.map((result, idx) =>{
            var newObject = {title: result.title, agency: result.agency, commentDate: result.commentDate, 
            registerDate: result.registerDate, state: result.state, documentType: result.documentType};
            return newObject;
        });
        var options = {
        tooltips:true,
        responsiveLayout:"collapse",  //collapse columns that dont fit on the table
        pagination:"local",       //paginate the data
        paginationSize:"25",       //allow 25 rows per page of data
        movableColumns:true,      //allow column order to be changed
        resizableRows:true,       //allow row order to be changed
        layout:"fitColumns"
        };

		// const results = this.props.results;
		return (
			// <table>
			// 	<thead><tr>
			// 	<th>Title</th>
			// 	<th>Agency</th>
			// 	<th>Comments date</th>
			// 	<th>Register date</th>
			// 	<th>State</th>
			// 	<th>Version</th>
			// 	</tr></thead>
			// 	<tbody>
			// 		{results.map((result, idx) =>
			// 			<tr key={idx}>
			// 				{/* <td><a href={result.documents} className='detailLink' id={`eis${result.id}`}>{result.title}</a></td> */}
			// 				<td>{result.title}</td>
            //                 <td>{result.agency}</td>
			// 				<td>{result.commentDate}</td>
			// 				<td>{result.registerDate}</td>
			// 				<td>{result.state}</td>
			// 				<td>{result.documentType}</td>
			// 			</tr>
			// 		)}
			// 	</tbody>
            // </table>
              <ReactTabulator
                data={data}
                columns={columns}
                options={options}
                />
		)
	}
}

export default SearchResults;