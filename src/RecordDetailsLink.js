import React from 'react';

export default class RecordDetailsLink extends React.Component {

    render () {
        return (
            <a className="link" target="_blank" rel="noopener noreferrer" href={`./record-details?id=${this.props.cell._cell.row.data.id}`}>
                {this.props.cell._cell.row.data.title}
            </a>
        );
    }

}