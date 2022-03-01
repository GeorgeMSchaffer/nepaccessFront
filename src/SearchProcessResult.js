import React from 'react';

import './User/login.css';
import Globals from './globals.js';
import DownloadFile from './DownloadFile.js';

// TODO: Filtering results etc. rerenders and loses track of downloads

export default class SearchProcessResult extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
            fileProgressValue: null,
            downloadText: 'Download',
            downloadClass: 'bold',
            commentProgressValue: null,
            commentDownloadText: 'Download',
            commentDownloadClass: 'download'
        };
    }

    hidden = (id) => {
        return this.props.hidden(id);
    }

    /** TODO: Issue is this isn't perfectly responsive because the timing is variable and if we scroll too early,
     * then the scroll gets ruined.  250ms is okay, but theoretically there should be a better way.
     * Experimenting with passing offset along this.props.hideText and use that to set a global variable in the parent.
     * Then the parent scrolls to that offset on table redraw, since parent can easily track that event.
     */
    /** Hide and scroll to element (because rerendering likely lost view of it) */
    hide = (e, id) => {
        const offs = e.nativeEvent.pageY - (window.innerHeight / 2);
        this.props.hideText(id,offs);

        // Using parent for scroll, for now
        // this.scrollTo(offs);
    }
    scrollTo = (offs) => {
        setTimeout(function() {
            window.scrollTo(0,offs);
        }, 250);
    }

    showTitle = () => {
        if (this.props) {
            let _href = `./process-details?id=${this.props.cell._cell.row.data.processId}`;
            if(!this.props.cell._cell.row.data.isProcess) {
                _href = `./record-details?id=${this.props.cell._cell.row.data.processId}`
            }
            return (
                <span className="table-row">
                    <span className="cardHeader">Title:
                        <a className="link" target="_blank" rel="noopener noreferrer" 
                                href={_href}>
                            {this.props.cell._cell.row.data.title} 
                        </a>
                    </span>
                </span>
            );
        }
    }

    showAgency = () => {
        return (
            <div><span className="cardHeader">Agency:
                <span>{this.props.cell._cell.row.data.agency}</span></span>
            </div>
        );
    }
    showState = () => {
        if(this.props && this.props.cell._cell.row.data.state){
            return (
                <div><span className="cardHeader">State:
                    <span>{this.props.cell._cell.row.data.state.replaceAll(";","; ")}</span></span>
                </div>
            );
        } else {
            return (
                <div>
                    <span className="cardHeader">State: <span></span></span>
                </div>
            );
        }
    }
    showCounty = () => {
        if(this.props && this.props.cell._cell.row.data.county){
            const countyDisplay = this.props.cell._cell.row.data.county.replaceAll(";","; ");
            return (
                <div><span className="cardHeader">County:
                    <span>{countyDisplay}</span></span>
                </div>
            );
        } else {
            return <></>;
        }
    }
    
    /** Used by showText(). 
     * Takes: record ID,filename,text,index; 
     * Returns: HTML for React incl. DownloadFile (which handles logging downloads)
     */
    showFragment = (_id,_filename,text,index) => {
        if(text) {
            return (
                <span className="fragment-container" key={ index }>
                    <span className="cardHeader bold filename-inner" key={ `${index}-2` }>
                        <DownloadFile key={_filename} downloadType="nepafile" 
                            recordId={_id}
                            id={_id}
                            filename={_filename}
                            results={true} />
                    </span>

                    <span className="card-highlight fragment" key={ `${index}-3` }
                            dangerouslySetInnerHTML={{
                                __html:text
                            }}>
                    </span>
                </span>
            );
        } else {
            return (
                <span className="fragment-container" key={ index }>
                    <span className="cardHeader bold filename-inner" key={ `${index}-2` }>
                        <DownloadFile key={_filename} downloadType="nepafile" 
                            recordId={_id}
                            id={_id}
                            filename={_filename}
                            results={true} />
                    </span>
                </span>
            );
        }

    }
    /** Used by showRecord(). 
     * Returns HTML for downloadable filenames each with highlight(s) as highlights are populated; show more/less buttons */ 
    showText = (record) => {
        if(record && record.name){
            let filenames = record.name.split(">");
            // Note: texts should be an array already
            let texts = record.plaintext;
            let combined = filenames.map(function (value, index){
                return [value, texts[index]]
            });

            let _id = record.id; 
            if(!this.props.show) {
                return (
                    <div className="margins">
                        (all text snippets hidden)
                    </div>
                );
            } else if(!this.hidden(record.id)) {
                if(combined.length > 1) {

                    return (<>
                        {this.showFragment(_id,combined[0][0],combined[0][1],0)}
    
                        <div className="margins">
                            <div>
                                <span className="hide-button" onClick={(e) => this.hide(e, record.id)}>
                                    Show more text snippets ({combined.length - 1}) ↴
                                </span>
                            </div>
                        </div>
                    </>);
                } else {
                    return this.showFragment(_id,combined[0][0],combined[0][1],0);
                }
            } else if(record.folder) {
                return (
                    <div>
                        {combined.map((combo, index) => {
                            if(index === 0) {
                                return (<>
                                    {this.showFragment(_id,combo[0],combo[1],index)}
                                    <div className="margins">
                                        <span className="hide-button" onClick={(e) => this.hide(e,record.id)}>
                                            Show fewer text snippets
                                        </span>
                                    </div>
                                    </>
                                );
                            } else {
                                return this.showFragment(_id,combo[0],combo[1],index);
                            }
                        })}
                    </div>
                );
            } else { // Folders are basically a given now, so this should be unused legacy code.
                return (
                    <div>
                        <div className="wide-flex">
                            <span className="hide-button" onClick={() => this.hide(record.id)}>Hide these text snippets</span>
                        </div>
                        {combined.map(function(combo, index){
                            return (
                                <span className="fragment-container" key={ index }>
                                    <span className="cardHeader bold filename-inner">
                                        {combo[0]}
                                    </span>
                                    
                                    
                                    <span className="card-highlight fragment" 
                                            dangerouslySetInnerHTML={{
                                                __html:combo[1]
                                            }}>
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                );
            }
            

        } else if(record && record.matchPercent) {
            return (
                <div className="fragment-container">
                    <div>
                        <span className="cardHeader"><span>
                            {"" + (record.matchPercent*100) + "% Match"}
                        </span></span>
                    </div>
                </div>
            );
        }
    }
    
    // Show download availability, filename, size, and download progress if downloading/downloaded
    showFileDownload = (record) => {
        if (record) {
            let size = 0;
            if(record.size && record.size > 0) {
                size = (Math.ceil((record.size / 1024) / 10.24)/100);
            }

            if(record.size && record.size > 200) {
                if(record.folder) {
                    return this.renderDownload(record.id,size,record.folder + "_" + record.documentType + ".zip",true,"Folder");
                } else if(record.filename) {
                    return this.renderDownload(record.id,size,record.filename,true,"EIS");
                }
            } else {
                return <div className="table-row"><span className="cardHeader filename missing">File(s) not yet available</span></div>;
            }
		}
		else {
			return "";
		}
    }


    showRecords = () => {
        if(this.props && this.props.cell._cell.row.data.records){
            const records = this.props.cell._cell.row.data.records;

            // Sort records by date instead of relevance
            // 1: Works without converting String to Date first thanks to YYYY-MM-DD format, until the year 10,000.
            // 2: Earliest dates at the top
            // DISABLED: This DOES change the results data, which messes up text snippet order.
            // I'd really like a better solution than deep cloning every single array, though.  Why is .sort modifying state
            // in-place?
            // const newRecords = records
            // Deep clone
            const newRecords = JSON.parse(JSON.stringify(records))
            .sort(
                (b,a) => {
                    if (b.registerDate > a.registerDate) {
                      return 1;
                    }
                    if (b.registerDate < a.registerDate) {
                      return -1;
                    }
                    return 0;
                })
            .map(record => {
                return this.showRecord(record);
            });

            return newRecords;
        }
    }
    
    showRecord = (record) => {
        return (<div key={record.relevance} className="record">
            <div className="record-line">
                <span className="record-field regular">
                    {this.showRecordLink(record.id, record.documentType)}
                </span>
                <span className="record-field">{record.registerDate}</span>
                {this.showFileDownload(record)}
            </div>
            {this.showText(record)}
        </div>)
    }
    showRecordLink = (id,type) => {
        if(Globals.approverOrHigher()) {
            return <a className="link" target="_blank" rel="noopener noreferrer" href={`./record-details?id=${id}`}>
                {this.showDocumentType(type)}
            </a>;
        } else {
            return <span className="record-type-header">
                {this.showDocumentType(type)}
            </span>;
        }
    }
    showDocumentType = (docType) => {
        if(docType.toLowerCase() === "rod") {
            return "Record of Decision (ROD)";
        } else if(Globals.isFinalType(docType) || Globals.isDraftType(docType)) {
            return docType + " Environmental Impact Statement"; 
        } else {
            return docType;
        }
    }

    renderDownload = (_id,_size,_filename,_results, _downloadType) => {
        return (<DownloadFile key={_id} downloadType={_downloadType}
                        recordId={_id}
                        id={_id}
                        size={_size}
                        filename={_filename}
                        innerText={_filename}
                        results={_results} />);
    }



	render() {
        return (
            <div className="table-holder">
                <div className="">
                    <div className="table-like">
                        <div className="table-row cardTitle">
                            {this.showTitle()}
                        </div>
                        <div className="table-meta">
                            {this.showAgency()}
                            {this.showState()}
                            {this.showCounty()}
                        </div>
                    </div>
                    <div className="records">
                        {this.showRecords()}
                    </div>
                </div>
            </div>
        );
    }
}