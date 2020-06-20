import React from 'react';

import Select from 'react-select';
import DatePicker from "react-datepicker";

import { CSVReader } from 'react-papaparse';

import axios from 'axios';
import Globals from './globals';

/** TODO: Add support for multiple files and also for a .csv which would be processed and should probably require:
 * - links between metadata and files (require filenames; handle linking up, loose/missing files in Spring and other components)
 * - title, register_date, document_type, state, agency (we should be able to design system to handle them in any order)
 **/
// also need multiple file upload functionality for a single record
// file: null would just become files: [] and files: evt.target.files instead of files[0]?

// TODO: Full CSV export for EISDoc table

class Importer extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            networkError: '',
            successLabel: '',
            titleLabel: '',
            disabled: false,
            file: null,
            csv: null,
            canImportCSV: false,
            filename: '',
            doc: {
                title: '',
                publishDate: '',
                state: '',
                agency: '',
                type: '',
                commentsFilename: '',
                filename: '',
            }
        };
        
        let checkUrl = new URL('user/checkCurator', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
          }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { // this probably isn't possible with current backend design (either 200 or error?)
                this.props.history.push('/');
            }
          }).catch(error => { // redirect
            this.props.history.push('/');
          })
    }

    onSelect = (val, act) => {
        // console.log(val);
        // console.log(act);

        const name = act.name;
        const value = val.value;
        
        // console.log(value);
        // console.log(name);

        this.setState( prevState =>
        { 
            const updatedDoc = prevState.doc;
            updatedDoc[name] = value;
            return {
                doc: updatedDoc
            }
        }, () => {
            // console.log(this.state.doc);
        });

    }

    onChange = (evt) => {
        if(evt && evt.target){
            // console.log(evt);
            // console.log(evt.target);
    
            const name = evt.target.name;
            const value = evt.target.value;
    
            this.setState( prevState =>
            { 
                const updatedDoc = prevState.doc;
                updatedDoc[name] = value;
                return {
                    doc: updatedDoc
                }
            });
        }
    }

    onFileChange = (evt) => {
        if(evt != null && evt.target != null && evt.target.files[0] != null){ // Ignore aborted events
            this.setState({ 
                /** TODO: Add this component to record details modal and we can save it for the ID or title of that, 
                  * creating a link between metadata, file data, otherwise can create a new record with a new unique title and potentially more metadata **/
                file: evt.target.files[0],
                filename: evt.target.files[0].name // includes extension
            });
        }
    }

    onKeyUp = (evt) => {
        if(evt.keyCode === 13){
            evt.preventDefault();
            this.importFile();
        }
    }


    validated = () => {
        let valid = true;
        let labelValue = "";

        if(!this.state.file){
            valid = false;
            labelValue = "No file";
        }

        if(this.state.doc.title.trim().length === 0){
            valid = false;
            this.setState({titleLabel: "Title required"});
        }
        if(this.state.doc.state.trim().length === 0){
            valid = false;
            this.setState({stateError: "State required"});
        } 
        if(this.state.doc.agency.trim().length === 0){
            valid = false;
            this.setState({agencyError: "Agency required"});
        } 
        if(this.state.doc.publishDate.trim().length === 0){
            valid = false;
            this.setState({dateError: "Date required"});
        } if (this.state.doc.type.trim().length === 0) {
            valid = false;
            this.setState({typeError: "Type required"});
        }

        if(labelValue.length===0 && valid === false){ // File, but invalid inputs
            labelValue = "Couldn't import: Please check inputs";
        }

        this.setState({successLabel: labelValue});
        return valid;
    }

    csvValidated = () => {
        let result = false;
        if(this.state.csv[0] && this.state.csv[0].data){
            let headers = this.state.csv[0].data;
            // console.log(this.state.csv[0]);
            headers.forEach(header => console.log(header));
    
            // Check headers:
            result = ( // TODO: Make sure these are standard, reasonable values to require based on current spreadsheets
                ('title' in headers) && ('register_date' in headers) && ('agency' in headers) && ('state' in headers) && ('document_type' in headers) 
                && ('filename' in headers)
            );
    
            if(!result){
                this.setState({
                    csvError: "Missing one or more CSV headers (title, register_date, agency, state, document_type)"
                });
            }
        } else {
            this.setState({
                csvError: "No headers found or no data found"
            });
        }

        return result;
    }
    

    importFile = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            networkError: '',
            titleLabel: '',
            agencyError: '',
            stateError: '',
            typeError: '',
            dateError: '',
            disabled: true 
        });
        
        let importUrl = new URL('file/uploadFile', Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("file", this.state.file);
        uploadFile.append("doc", JSON.stringify(this.state.doc));
        
        // uploadFile.append('file', new Blob([this.state.file]) );
        // uploadFile.append('file', new Blob([this.state.file], { type: 'text/csv' }) );

        console.log(this.state.doc);
        console.log(this.state.file);

        // axios.post(importUrl, uploadFile, { 
        //     headers: { 'Content-Type': 'multipart/form-data' } 
        // });
        // return;

        let networkString = '';
        let successString = '';

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFile
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return true;
            } else { 
                return false;
            }
        }).then(success => {
            if(success){
                successString = "Success.";
            } else {
                successString = "Failed to import."; // Server down?
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 500) {
                    networkString = "Internal server error.";
                } else if (error.response.status === 404) {
                    networkString = "Not found.";
                } 
            } else {
                networkString = "Server may be down (no response), please try again later.";
            }
            successString = "Couldn't import.";
            console.error('error message ', error);
        }).finally(e => {
            this.setState({
                networkError: networkString,
                successLabel: successString,
                disabled: false
            });
    
            document.body.style.cursor = 'default'; 
        });

    }

    importCSV = () => {
        console.log("Click");
        if(!this.csvValidated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            csvLabel: '',
            csvError: '',
            disabled: true 
        });
        
        let importUrl = new URL('file/uploadCSV', Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("csv", JSON.stringify(this.state.csv));

        console.log(this.state.csv);

        let networkString = '';
        let successString = '';

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFile
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return true;
            } else { 
                return false;
            }
        }).then(success => {
            if(success){
                successString = "Success.";
            } else {
                successString = "Failed to import."; // Server down?
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 500) {
                    networkString = "Internal server error.";
                } else if (error.response.status === 404) {
                    networkString = "Not found.";
                } 
            } else {
                networkString = "Server may be down (no response), please try again later.";
            }
            successString = "Couldn't import.";
            console.error('error message ', error);
        }).finally(e => {
            this.setState({
                csvError: networkString,
                csvLabel: successString,
                disabled: false
            });
    
            document.body.style.cursor = 'default'; 
        });
    }

    handleOnDrop = (evt) => {
        this.setState({ 
            csv: evt
        }, () => {
            console.log(evt);
            this.setState({ canImportCSV: true });
        });
    }

    handleOnRemoveFile = (evt) => { this.setState({ csv: null, canImportCSV: false }); }

    handleOnError = (evt) => {
        // TODO
        // Note: Just because errors are generated does not necessarily mean that parsing failed.
    }
    
    

    showDate = () => {
        const setPublishDate = (date) => {
            // console.log(date);
            this.setState( prevState =>
                { 
                    const updatedDoc = prevState.doc;
                    updatedDoc['publishDate'] = date;
                    return {
                        doc: updatedDoc
                    }
                }, () => {
                    // console.log(this.state.doc);
                }
            );
        }
        return (
            <DatePicker
                selected={this.state.doc.publishDate} 
                onChange={date => setPublishDate(date)}
                name='publishDate'
                dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                className="date no-margin" 
            />
        )
    }

    render() {
        
        const agencyOptions = [	{ value: 'ACHP', label: 'Advisory Council on Historic Preservation (ACHP)' },{ value: 'USAID', label: 'Agency for International Development (USAID)' },{ value: 'ARS', label: 'Agriculture Research Service (ARS)' },{ value: 'APHIS', label: 'Animal and Plant Health Inspection Service (APHIS)' },{ value: 'AFRH', label: 'Armed Forces Retirement Home (AFRH)' },{ value: 'BPA', label: 'Bonneville Power Administration (BPA)' },{ value: 'BIA', label: 'Bureau of Indian Affairs (BIA)' },{ value: 'BLM', label: 'Bureau of Land Management (BLM)' },{ value: 'USBM', label: 'Bureau of Mines (USBM)' },{ value: 'BOEM', label: 'Bureau of Ocean Energy Management (BOEM)' },{ value: 'BOP', label: 'Bureau of Prisons (BOP)' },{ value: 'BR', label: 'Bureau of Reclamation (BR)' },{ value: 'Caltrans', label: 'California Department of Transportation (Caltrans)' },{ value: 'CHSRA', label: 'California High-Speed Rail Authority (CHSRA)' },{ value: 'CIA', label: 'Central Intelligence Agency (CIA)' },{ value: 'NYCOMB', label: 'City of New York, Office of Management and Budget (NYCOMB)' },{ value: 'CDBG', label: 'Community Development Block Grant (CDBG)' },{ value: 'CTDOH', label: 'Connecticut Department of Housing (CTDOH)' },{ value: 'BRAC', label: 'Defense Base Closure and Realignment Commission (BRAC)' },{ value: 'DLA', label: 'Defense Logistics Agency (DLA)' },{ value: 'DNA', label: 'Defense Nuclear Agency (DNA)' },{ value: 'DNFSB', label: 'Defense Nuclear Fac. Safety Board (DNFSB)' },{ value: 'DSA', label: 'Defense Supply Agency (DSA)' },{ value: 'DRB', label: 'Delaware River Basin Commission (DRB)' },{ value: 'DC', label: 'Denali Commission (DC)' },{ value: 'USDA', label: 'Department of Agriculture (USDA)' },{ value: 'DOC', label: 'Department of Commerce (DOC)' },{ value: 'DOD', label: 'Department of Defense (DOD)' },{ value: 'DOE', label: 'Department of Energy (DOE)' },{ value: 'HHS', label: 'Department of Health and Human Services (HHS)' },{ value: 'DHS', label: 'Department of Homeland Security (DHS)' },{ value: 'HUD', label: 'Department of Housing and Urban Development (HUD)' },{ value: 'DOJ', label: 'Department of Justice (DOJ)' },{ value: 'DOL', label: 'Department of Labor (DOL)' },{ value: 'DOS', label: 'Department of State (DOS)' },{ value: 'DOT', label: 'Department of Transportation (DOT)' },{ value: 'TREAS', label: 'Department of Treasury (TREAS)' },{ value: 'VA', label: 'Department of Veteran Affairs (VA)' },{ value: 'DOI', label: 'Department of the Interior (DOI)' },{ value: 'DEA', label: 'Drug Enforcement Administration (DEA)' },{ value: 'EDA', label: 'Economic Development Administration (EDA)' },{ value: 'ERA', label: 'Energy Regulatory Administration (ERA)' },{ value: 'ERDA', label: 'Energy Research and Development Administration (ERDA)' },{ value: 'EPA', label: 'Environmental Protection Agency (EPA)' },{ value: 'FSA', label: 'Farm Service Agency (FSA)' },{ value: 'FHA', label: 'Farmers Home Administration (FHA)' },{ value: 'FAA', label: 'Federal Aviation Administration (FAA)' },{ value: 'FCC', label: 'Federal Communications Commission (FCC)' },{ value: 'FEMA', label: 'Federal Emergency Management Agency (FEMA)' },{ value: 'FEA', label: 'Federal Energy Administration (FEA)' },{ value: 'FERC', label: 'Federal Energy Regulatory Commission (FERC)' },{ value: 'FHWA', label: 'Federal Highway Administration (FHWA)' },{ value: 'FMC', label: 'Federal Maritime Commission (FMC)' },{ value: 'FMSHRC', label: 'Federal Mine Safety and Health Review Commission (FMSHRC)' },{ value: 'FMCSA', label: 'Federal Motor Carrier Safety Administration (FMCSA)' },{ value: 'FPC', label: 'Federal Power Commission (FPC)' },{ value: 'FRA', label: 'Federal Railroad Administration (FRA)' },{ value: 'FRBSF', label: 'Federal Reserve Bank of San Francisco (FRBSF)' },{ value: 'FTA', label: 'Federal Transit Administration (FTA)' },{ value: 'USFWS', label: 'Fish and Wildlife Service (USFWS)' },{ value: 'FDOT', label: 'Florida Department of Transportation (FDOT)' },{ value: 'FDA', label: 'Food and Drug Administration (FDA)' },{ value: 'USFS', label: 'Forest Service (USFS)' },{ value: 'GSA', label: 'General Services Administration (GSA)' },{ value: 'USGS', label: 'Geological Survey (USGS)' },{ value: 'GLB', label: 'Great Lakes Basin Commission (GLB)' },{ value: 'IHS', label: 'Indian Health Service (IHS)' },{ value: 'IRS', label: 'Internal Revenue Service (IRS)' },{ value: 'IBWC', label: 'International Boundary and Water Commission (IBWC)' },{ value: 'ICC', label: 'Interstate Commerce Commission (ICC)' },{ value: 'JCS', label: 'Joint Chiefs of Staff (JCS)' },{ value: 'MARAD', label: 'Maritime Administration (MARAD)' },{ value: 'MTB', label: 'Materials Transportation Bureau (MTB)' },{ value: 'MSHA', label: 'Mine Safety and Health Administration (MSHA)' },{ value: 'MMS', label: 'Minerals Management Service (MMS)' },{ value: 'MESA', label: 'Mining Enforcement and Safety (MESA)' },{ value: 'MRB', label: 'Missouri River Basin Commission (MRB)' },{ value: 'NASA', label: 'National Aeronautics and Space Administration (NASA)' },{ value: 'NCPC', label: 'National Capital Planning Commission (NCPC)' },{ value: 'NGA', label: 'National Geospatial-Intelligence Agency (NGA)' },{ value: 'NHTSA', label: 'National Highway Traffic Safety Administration (NHTSA)' },{ value: 'NIGC', label: 'National Indian Gaming Commission (NIGC)' },{ value: 'NIH', label: 'National Institute of Health (NIH)' },{ value: 'NMFS', label: 'National Marine Fisheries Service (NMFS)' },{ value: 'NNSA', label: 'National Nuclear Security Administration (NNSA)' },{ value: 'NOAA', label: 'National Oceanic and Atmospheric Administration (NOAA)' },{ value: 'NPS', label: 'National Park Service (NPS)' },{ value: 'NSF', label: 'National Science Foundation (NSF)' },{ value: 'NSA', label: 'National Security Agency (NSA)' },{ value: 'NTSB', label: 'National Transportation Safety Board (NTSB)' },{ value: 'NRCS', label: 'Natural Resource Conservation Service (NRCS)' },{ value: 'NER', label: 'New England River Basin Commission (NER)' },{ value: 'NJDEP', label: 'New Jersey Department of Environmental Protection (NJDEP)' },{ value: 'NRC', label: 'Nuclear Regulatory Commission (NRC)' },{ value: 'OCR', label: 'Office of Coal Research (OCR)' },{ value: 'OSM', label: 'Office of Surface Mining (OSM)' },{ value: 'OBR', label: 'Ohio River Basin Commission (OBR)' },{ value: 'RSPA', label: 'Research and Special Programs (RSPA)' },{ value: 'REA', label: 'Rural Electrification Administration (REA)' },{ value: 'RUS', label: 'Rural Utilities Service (RUS)' },{ value: 'SEC', label: 'Security and Exchange Commission (SEC)' },{ value: 'SBA', label: 'Small Business Administration (SBA)' },{ value: 'SCS', label: 'Soil Conservation Service (SCS)' },{ value: 'SRB', label: 'Souris-Red-Rainy River Basin Commission (SRB)' },{ value: 'STB', label: 'Surface Transportation Board (STB)' },{ value: 'SRC', label: 'Susquehanna River Basin Commission (SRC)' },{ value: 'TVA', label: 'Tennessee Valley Authority (TVA)' },{ value: 'TxDOT', label: 'Texas Department of Transportation (TxDOT)' },{ value: 'TPT', label: 'The Presidio Trust (TPT)' },{ value: 'TDA', label: 'Trade and Development Agency (TDA)' },{ value: 'USACE', label: 'U.S. Army Corps of Engineers (USACE)' },{ value: 'USCG', label: 'U.S. Coast Guard (USCG)' },{ value: 'CBP', label: 'U.S. Customs and Border Protection (CBP)' },{ value: 'RRB', label: 'U.S. Railroad Retirement Board (RRB)' },{ value: 'USAF', label: 'United States Air Force (USAF)' },{ value: 'USA', label: 'United States Army (USA)' },{ value: 'USMC', label: 'United States Marine Corps (USMC)' },{ value: 'USN', label: 'United States Navy (USN)' },{ value: 'USPS', label: 'United States Postal Service (USPS)' },{ value: 'USTR', label: 'United States Trade Representative (USTR)' },{ value: 'UMR', label: 'Upper Mississippi Basin Commission (UMR)' },{ value: 'UMTA', label: 'Urban Mass Transportation Administration (UMTA)' },{ value: 'UDOT', label: 'Utah Department of Transportation (UDOT)' },{ value: 'WAPA', label: 'Western Area Power Administration (WAPA)' }
        ];
                
        const stateOptions = [ { value: 'AK', label: 'Alaska' },{ value: 'AL', label: 'Alabama' },{ value: 'AQ', label: 'Antarctica' },{ value: 'AR', label: 'Arkansas' },{ value: 'AS', label: 'American Samoa' },{ value: 'AZ', label: 'Arizona' },{ value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },{ value: 'CT', label: 'Connecticut' },{ value: 'DC', label: 'District of Columbia' },{ value: 'DE', label: 'Delaware' },{ value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },{ value: 'GU', label: 'Guam' },{ value: 'HI', label: 'Hawaii' },{ value: 'IA', label: 'Iowa' },{ value: 'ID', label: 'Idaho' },{ value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'KS', label: 'Kansas' },{ value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },{ value: 'MA', label: 'Massachusetts' },{ value: 'MD', label: 'Maryland' },{ value: 'ME', label: 'Maine' },{ value: 'MI', label: 'Michigan' },{ value: 'MN', label: 'Minnesota' },{ value: 'MO', label: 'Missouri' },{ value: 'MS', label: 'Mississippi' },{ value: 'MT', label: 'Montana' },{ value: 'Multi', label: 'Multiple' },{ value: 'NAT', label: 'National' },{ value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },{ value: 'NE', label: 'Nebraska' },{ value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },{ value: 'NM', label: 'New Mexico' },{ value: 'NV', label: 'Nevada' },{ value: 'NY', label: 'New York' },{ value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },{ value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },{ value: 'PRO', label: 'Programmatic' },{ value: 'PR', label: 'Puerto Rico' },{ value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },{ value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },{ value: 'TT', label: 'Trust Territory of the Pacific Islands' },{ value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },{ value: 'VA', label: 'Virginia' },{ value: 'VI', label: 'Virgin Islands' },{ value: 'VT', label: 'Vermont' },{ value: 'WA', label: 'Washington' },{ value: 'WI', label: 'Wisconsin' },{ value: 'WV', label: 'West Virginia' },{ value: 'WY', label: 'Wyoming' }
        ];

        const typeOptions = [ { value: 'Final', label: 'Final' },{value: 'Draft', label: 'Draft'} 
        ];

        const customStyles = {
            option: (styles, state) => ({
                 ...styles,
                borderBottom: '1px dotted',
	            backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                    backgroundColor: 'lightgreen'
                },
                // ':active': {
                //     ...styles[':active'],
                //     backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                //   },
                //   padding: 20,
            }),
            control: (styles) => ({
                ...styles,
                backgroundColor: 'white',
            })
        }

        return (
            <div className="form">

                <div className="note">
                    <p>Import Data</p>
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>
                
                

                <div className="form-content">
                    <div className="importFile">
                        <label className="infoLabel">Import CSV:</label>
                        <CSVReader
                            onDrop={this.handleOnDrop}
                            onError={this.handleOnError}
                            style={{}}
                            config={{}}
                            addRemoveButton
                            onRemoveFile={this.handleOnRemoveFile}
                        >
                            <span>Drop CSV file here or click to upload.</span>
                        </CSVReader>
                        <button type="button" className="button" id="submit" disabled={!this.state.canImportCSV || this.state.disabled} onClick={this.importCSV}>
                            Import CSV
                        </button>
                    </div>

                    <label className="infoLabel">
                        {this.state.csvLabel}
                    </label>
                    <label className="loginErrorLabel">{this.state.csvError}</label>
                    <hr />

                    <div className="importFile">
                        <div>
                            <label className="infoLabel">Note: Full text search may only function with .zip or .pdf uploads</label>
                            <input title="Test" type="file" id="file" className="form-control" name="file" disabled={this.state.disabled} onChange={this.onFileChange} />
                        </div>
                        {/** TODO: bulk file import */}
                        <button type="button" className="button" id="submit" disabled={this.state.disabled} onClick={this.importFile}>
                            Import Single Record
                        </button>
                    </div>
                    

                    <label className="infoLabel">
                        {this.state.successLabel}
                    </label>
                    
                    <label className="loginErrorLabel">{this.state.titleLabel}</label>
                    <div className="center">
                        <div id="fake-search-box-import" className="inline-block">
                            <input className="search-box" 
                                name="title" 
                                placeholder="Title" 
                                value={this.state.doc.title}
                                autoFocus 
                                onChange={this.onChange}
                            />
                        </div>
                    </div>

                    <table id="advanced-search-box" className="import-table"><tbody>
                        <tr>
                            <td>
                                <label className="advanced-label" htmlFor="agency">Lead agency</label>
                                <Select id="searchAgency" className="multi inline-block" classNamePrefix="react-select" name='agency' isSearchable isClearable 
                                    styles={customStyles}
                                    options={agencyOptions} 
                                    selected={this.state.doc.agency}
                                    onChange={this.onSelect} 
                                    placeholder="Type or select lead agency" 
                                    // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                                    // menuIsOpen={true}
                                />
                                <label className="loginErrorLabel">{this.state.agencyError}</label>
                            </td>
                            <td>
                                <label className="advanced-label" htmlFor="state">State</label>
                                <Select id="searchState" className="multi inline-block" classNamePrefix="react-select" name="state" isSearchable isClearable 
                                    styles={customStyles}
                                    options={stateOptions} 
                                    selected={this.state.doc.state}
                                    onChange={this.onSelect} 
                                    placeholder="Type or select state" 
                                />
                                <label className="loginErrorLabel">{this.state.stateError}</label>
                            </td>
                            
                            <td>
                                {/**TODO: Grab all types from db?  Allow custom?*/}
                                <label className="block advanced-label">Document type</label>
                                <Select id="searchState" className="multi inline-block" classNamePrefix="react-select" name="type" isSearchable isClearable 
                                    styles={customStyles}
                                    options={typeOptions} 
                                    selected={this.state.doc.type}
                                    onChange={this.onSelect} 
                                    placeholder="Type or select document type" 
                                />
                                <label className="loginErrorLabel">{this.state.typeError}</label>
                            </td>

                        </tr>

                        <tr>
                            <td>
                                <label className="advanced-label" htmlFor="publishDate">Date</label>
                                <div id="date">
                                    {this.showDate()}
                                    <label className="loginErrorLabel">{this.state.dateError}</label>
                                </div>
                            </td>
                        </tr>
                    </tbody></table>
                    
                </div>
                <hr />
            </div>
        )
    }

    componentDidUpate() {

    }
}

export default Importer;