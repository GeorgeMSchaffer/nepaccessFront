import React from 'react';

class SearchResults extends React.Component {

	// TODO: At some point, the database should probably be giving us the headers to use.

	render() {
		console.log("SearchResults");
		const results = this.props.results;
		return (
			<table>
				<thead><tr>
				<th>Title</th>
				<th>Agency</th>
				<th>Comments date</th>
				<th>Register date</th>
				<th>State</th>
				<th>Document type</th>
				</tr></thead>
				<tbody>
					{results.map((result, idx) =>
						<tr key={idx}>
							<td><a href={result.documents} className='detailLink' id={`eis${result.id}`}>{result.title}</a></td>
							<td>{result.agency}</td>
							<td>{result.commentDate}</td>
							<td>{result.registerDate}</td>
							<td>{result.state}</td>
							<td>{result.documentType}</td>
						</tr>
					)}
				</tbody>
			</table>
		)
	}
}

export default SearchResults;