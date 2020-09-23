import React from 'react';

export default class CardDetailsLink extends React.Component {

    render () {
        return (
            <div className="card_title table-row">
                <span className="cardHeader">Title:</span>
                <a className="link" target="_blank" rel="noopener noreferrer" href={`./recordDetailsTab?id=${this.props.id}`}>
                    {this.props.title}
                </a>
            </div>
        );
    }

}