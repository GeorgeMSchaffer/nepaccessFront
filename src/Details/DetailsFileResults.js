import React from 'react';

import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";

import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import DeleteFileLink from './DeleteFileLink.js';


// TODO: delete button and confirmation box
// Results component expects NEPAFile list if available, else DocumentTexts only (meaning the files were derived from an archive)
class DetailsFileResults extends React.Component {

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }

    setupData = (results) => {
        console.log("Results", results);
        if(results && results[0] && results[0].folder) { // NEPAFiles should have Folders, necessarily
            return results.map((result, idx) =>{
                let doc = result;
                let newObject = {documentId: doc.eisdoc.id, id: doc.id, 
                    relativePath: doc.relativePath, folder: doc.folder, filename: doc.filename, 
                    documentType: doc.documentType
                };
                return newObject;
            });
        } else if (results && results[0] && results[0].plaintext) { // DocumentText
            return results.map((result, idx) =>{
                let doc = result;
                let newObject = {documentId: doc.eisdoc.id, id: doc.id, 
                    filename: doc.filename
                };
                return newObject;
            });
        } else { // ??
            return [];
        }
    }

    // TODO: Have both if possible and clearly denote which is which

    // For NEPAFiles
    setupColumns = () => {
            return [
                { title: "Document ID", field: "documentId" },
                { title: "Filename", field: "filename", width: 200, headerFilter:"input" },
                { title: "Folder", field: "folder", width: 150, headerFilter:"input" },
                { title: "Path", field: "relativePath", width: 200, headerFilter:"input" },
                { title: "Version", field: "documentType", width: 114, headerFilter:"input" },
                { title: "Delete", field: "id", formatter:
                    function(cell, formatterParams, onRendered) {
                            return "<span>Test</span>"
                    }
                }
            ];
    }

    // For DocumentTexts
    setupColumnsText = () => {
        return [
            { title: "ID", field: "id", width: 60 },
            { title: "Filename", field: "filename", headerFilter:"input" },
            { title: "Document ID", width: 200, field: "documentId" },
            // { title: "Delete", field: "id", formatter:
            //     function(cell, formatterParams, onRendered) {
            //         console.log(cell._cell.value); // id
            //         return "<button></button>";
            //     }
            // },
            { title: "Delete", field: "id", formatter: reactFormatter(<DeleteFileLink />)}
        ];
    }

	render() {

        const results = this.props.results;

        if(results && results.length > 0) {
            // console.log("Results", results);
        }
        else {
            return (
                <div id="search-results">
                <h2 id="results-label">{this.props.resultsText}</h2></div>
            );
        }
        
        try {
            let data = this.setupData(results);
            let columns = this.setupColumns();
            if(!data[0].folder){
                columns = this.setupColumnsText();
            }

            var options = {
                layoutColumnsOnNewData: true,
                tooltips:false,
                responsiveLayout:"collapse",  //collapse columns that dont fit on the table
                responsiveLayoutCollapseUseFormatters:false,
                pagination:"local",       //paginate the data
                paginationSize:10,       //allow 10 rows per page of data
                paginationSizeSelector:[10, 25, 50],
                movableColumns:true,      //allow column order to be changed
                resizableRows:true,       //allow row order to be changed
                layout:"fitColumns",
                invalidOptionWarnings:false, // spams warnings without this
                footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
            };

            return (
                <div id="search-results">
                    <h2 id="results-label">Files</h2>
                    <div className="tabulator-holder">
                        <ReactTabulator
                            ref={this.my_table}
                            data={data}
                            columns={columns}
                            options={options}
                        />
                    </div>
                </div>
            );
        }
        catch (e) {
            if(e instanceof TypeError){
                // expected problem with Tabulator trying to render new results before it switches to new column definitions
            } else {
                console.log(e.toString());
            }
            return (
                <div>
                    <h2 id="results-label">Files</h2>
                </div>
            )
        }
    }

    componentDidMount() {
    }
    
    componentDidUpdate() {
        /** setTimeout with 0ms activates at the end of the Event Loop, redrawing the table and thus fixing the text wrapping.
         * Does not work when simply fired on componentDidUpdate().
         */
        if(this.my_table && this.my_table.current){
            const tbltr = this.my_table.current;
            setTimeout(function() {
                tbltr.table.redraw(true);
            },0)
        }
    }
}

export default DetailsFileResults;