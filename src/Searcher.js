import React from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';

const _ = require('lodash');

class Searcher extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            searchMode: 'natural',
            booleanOption: "all",
            booleanTitle: '',
            naturalTitle: '',
            titleAll: '',
            titleExact: '',
            titleAny: '',
            titleNone: '',
            startPublish: '',
            endPublish: '',
            startComment: '',
            endComment: '',
            agency: [],
            state: [],
            typeAll: true,
            typeFinal: false,
            typeDraft: false,
            typeOther: false,
            needsComments: false,
            needsDocument: false,
            searcherClassName: 'display-none',
            advancedClassName: 'display-none',
            searchModeName: 'Advanced search',
            iconClassName: 'icon icon--effect',
            limit: '',
            collapsibleText: '+ Advanced Options',
		};
        this.debouncedSearch = _.debounce(this.props.search, 300);
        this.collapsibles = this.collapsibles.bind(this);
        this.alphabetOnly = this.alphaNumeric.bind(this);
        this.process = this.process.bind(this);
	}
    
    /**
     * Event handlers
     */
    // TODO: moment.js?

    /** Return trimmed alphanumeric (plus " and *) string with most basic special characters turned into whitespace*/
    alphaNumeric(value) {
        // Special characters (may need to be escaped in regex): [ ] \ ^ $ . | ? * - + ( )
        // Allow * for partial word search
        let sanitized = value.replace(/[[\]\\\-?{}|().,~`!@#$%^&/:;<>'=+]/g, " "); // Replace special characters with spaces
        let ex = /[a-zA-Z0-9\s*"]+/g.exec(sanitized.trim());
        // console.log(ex);
        // console.log(sanitized);
        if(ex){
            return (ex.toString().trim());
        } else {
            return "";
        }
    }

    /** Return whitespace-normalized string with optional prepended character per word in given text. */
    process(character, text) {        
        if(text && text.length > 0){
            var processArray = text.split(/[\s]+/);
            // console.log(processArray);
            processArray = processArray.map(function(word) {
                return character + word.trim();
            });
            return processArray.join(' ');
        } else {
            return '';
        }
    }
    /**  Determines which boolean title field to use and then searches.  Natural title manages already itself (if not in boolean mode, natural title is used). */
    forceSearch() {  
        let searchTerm = "";
        if(this.state.booleanOption==="any") {
            searchTerm = this.state.titleAny;
        } else if(this.state.booleanOption==="all") {
            searchTerm = this.state.titleAll;
        } else if(this.state.booleanOption==="exact") {
            searchTerm = this.state.titleExact;
        }
        this.setState( 
            { 
                booleanTitle: searchTerm + " " + this.state.titleNone,
            }, () => { 
                this.debouncedSearch(this.state);
        });
    }


    /** Capture enter key to prevent default behavior of form submit, force a new search (refresh results) */
    onKeyUpNatural = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.setState({
                searchMode: 'natural'
            }, () => {
                this.forceSearch();
            });
        }
    }

    onKeyUpBoolean = (evt) => {        
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.setState({
                searchMode: 'boolean'
            }, () => {
                this.forceSearch();
            });
        }
        // console.log(this.state.booleanTitle);
        // console.log(this.state.naturalTitle);
    }

    onIconNaturalClick = (evt) => {
        this.setState({ iconClassName: 'icon icon--click', searchMode: 'natural' });
        
        this.forceSearch();
    }
    onIconBooleanClick = (evt) => {
        this.setState({ iconClassName: 'icon icon--click', searchMode: 'boolean' });
        
        this.forceSearch();
    }
    iconCleaning = (evt) => {
        this.setState({ iconClassName: 'icon' });
    }

    onRadioChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    validated = (term) => {
        
        term = term.trim();
        console.log(term);
        if(term && /[a-zA-Z0-9\s]+/g.exec(term) === null){
            console.log("Invalid search query " + term);
            return false;
        }

        return true;
    }

    onInputTitleAll = (evt) => {
        var alphabetized = this.alphaNumeric(evt.target.value);
        alphabetized = this.process("+", alphabetized);

        let searchTerm = "";
        searchTerm = alphabetized;

        // searchTerm += this.state.titleAny;
        // searchTerm += " " + alphabetized;
        // searchTerm += " " + this.state.titleExact;
        searchTerm += " " + this.state.titleNone;

        this.setState( 
        { 
            titleAll: alphabetized,
            searchMode: 'boolean',
            booleanTitle: searchTerm,
        }, () => { 
            this.debouncedSearch(this.state);
        });

    }

    // onInputTitleExact = (evt) => {
    //     var alphabetized = this.alphaNumeric(evt.target.value);
    //     alphabetized = this.process("", alphabetized);

    //     if(evt.target.value){
    //         alphabetized = "+\"" + alphabetized + "\"";
    //     } else {
    //         // do nothing
    //     }
        
    //     let searchTerm = "";
    //     // searchTerm += this.state.titleAny;
    //     // searchTerm += " " + this.state.titleAll;
    //     searchTerm += " " + alphabetized;
    //     searchTerm += " " + this.state.titleNone;

    //     this.setState( 
    //     { 
    //         titleExact: alphabetized,
    //         searchMode: 'boolean',
    //         booleanTitle: searchTerm,
    //     }, () => { 
    //         this.debouncedSearch(this.state);
    //     });
    // }

    onInputTitleAny = (evt) => {
        var alphabetized = this.alphaNumeric(evt.target.value);
        alphabetized = this.process("", alphabetized);

        let searchTerm = "";
        searchTerm += alphabetized;
        // searchTerm += " " + this.state.titleAll;
        // searchTerm += " " + this.state.titleExact;
        searchTerm += " " + this.state.titleNone;

        this.setState( 
        { 
            titleAny: alphabetized,
            searchMode: 'boolean',
            booleanTitle: searchTerm,
        }, () => { 
            this.debouncedSearch(this.state);
        });
    }
    
    onInputTitleNone = (evt) => {
        var alphabetized = this.alphaNumeric(evt.target.value);
        alphabetized = this.process("-", alphabetized);

        let searchTerm = "";
        
        if(this.state.booleanOption==="any"){
            searchTerm = this.state.titleAny;
        } else if(this.state.booleanOption==="all"){
            searchTerm = this.state.titleAll;
        } else if(this.state.booleanOption==="exact"){
            searchTerm = this.state.titleExact;
        }

        // searchTerm += this.state.titleAny;
        // searchTerm += " " + this.state.titleAll;
        // searchTerm += " " + this.state.titleExact;
        searchTerm += " " + alphabetized;
        
        this.setState( 
        { 
            titleNone: alphabetized,
            searchMode: 'boolean',
            booleanTitle: searchTerm,
        }, () => { 
            this.debouncedSearch(this.state);
        });
    }


	onInput = (evt) => {
        // const name = evt.target.name;
        // const value = evt.target.value;

        // this.setState( prevState =>
        // { 
        //     const updatedInputs = prevState.inputs;
        //     updatedInputs[name] = value;
        //     return {
        //         inputs: updatedInputs
        //     }
        // }, () =>{
        //     this.debouncedSearch(this.state.inputs);
        // });

		//get the evt.target.name (defined by name= in input)
		//and use it to target the key on our `state` object with the same name, using bracket syntax
		this.setState( 
		{ 
            [evt.target.name]: evt.target.value,
		}, () => { // callback ensures state is set before state is used for search
            this.debouncedSearch(this.state);
			// console.log("Searcher state");
			// console.log(this.state);
        });
    }

    onInputNatural = (evt) => {
		this.setState( 
		{ 
            [evt.target.name]: evt.target.value,
            searchMode: 'natural'
		}, () => { // callback ensures state is set before state is used for search
            this.debouncedSearch(this.state);
        });
    }

	onAgencyChange = (evt) => {
		var agencyLabels = [];
		for(var i = 0; i < evt.length; i++){
			agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi,""));
        }
        // this.setState(prevState => {
        //     let inputs = { ...prevState.inputs };  // creating copy of state variable inputs
        //     inputs.agency = agencyLabels;                     // update the name property, assign a new value                 
        //     return { inputs };                                 // return new object inputs object
        // }, () =>{
        //     this.debouncedSearch(this.state.inputs);
        // });
        this.setState( 
		{ 
			agency: agencyLabels
		}, () => { 
			this.debouncedSearch(this.state);
		});
    }
	onLocationChange = (evt) => {
		var stateValues = [];
		for(var i = 0; i < evt.length; i++){
			stateValues.push(evt[i].value);
		}
        this.setState( 
		{ 
			state: stateValues
		}, () => { 
			this.debouncedSearch(this.state);
		});
    }
    
    onTypeChecked = (evt) => {
        if(evt.target.name==="typeAll" && evt.target.checked) { // All: Check all, uncheck others
            this.setState({
                typeAll: true,
                typeFinal: false,
                typeDraft: false,
                typeOther: false
            }, () => { this.debouncedSearch(this.state); });
        } else { // Not all: Check target, uncheck all
            this.setState({ 
                [evt.target.name]: evt.target.checked,
                typeAll: false
            }, () => { this.debouncedSearch(this.state); });
        }
    }

	onChecked = (evt) => {
	    this.setState( { [evt.target.name]: evt.target.checked}, () => { this.debouncedSearch(this.state); });
    }
    
    onStartDateChange = (date) => { 
        this.setState( { startPublish: date}, () => { this.debouncedSearch(this.state); }); 
    }
    onEndDateChange = (date) => { 
        this.setState( { endPublish: date}, () => { this.debouncedSearch(this.state); }); 
    }
    onStartCommentChange = (date) => { 
        this.setState( { startComment: date}, () => { this.debouncedSearch(this.state); }); 
    }
    onEndCommentChange = (date) => { 
        this.setState( { endComment: date}, () => { this.debouncedSearch(this.state); }); 
    }

    searchModeClick = (evt) => {
        if(this.state.searchModeName === 'Advanced search'){
            this.setState ({
                searchModeName: 'Basic search',
                searchMode: 'boolean',
				advancedClassName: 'searchContainer'
            });
        } else {
            this.setState ({
                searchModeName: 'Advanced search',
                searchMode: 'natural',
				advancedClassName: 'display-none'
            });
        }
    }
    
    // Can either just make the form a div or use this to prevent Submit default behavior
	submitHandler(e) { e.preventDefault(); }

	// TODO: Animation?
	collapsibles(){
		if(this.state.searcherClassName===''){
			this.setState({
				searcherClassName: 'display-none',
				collapsibleText: "+ Advanced Options"
			});
		} else {
			this.setState({
				searcherClassName: '',
				collapsibleText: "- Advanced Options"
			});
		}
    }
    

    render () {

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

        // console.log("Searcher");
	    // TODO: At some point, the database could give us the agency options.
        const agencyOptions = [	{ value: 'ACHP', label: 'Advisory Council on Historic Preservation (ACHP)' },{ value: 'USAID', label: 'Agency for International Development (USAID)' },{ value: 'ARS', label: 'Agriculture Research Service (ARS)' },{ value: 'APHIS', label: 'Animal and Plant Health Inspection Service (APHIS)' },{ value: 'AFRH', label: 'Armed Forces Retirement Home (AFRH)' },{ value: 'BPA', label: 'Bonneville Power Administration (BPA)' },{ value: 'BIA', label: 'Bureau of Indian Affairs (BIA)' },{ value: 'BLM', label: 'Bureau of Land Management (BLM)' },{ value: 'USBM', label: 'Bureau of Mines (USBM)' },{ value: 'BOEM', label: 'Bureau of Ocean Energy Management (BOEM)' },{ value: 'BOP', label: 'Bureau of Prisons (BOP)' },{ value: 'BR', label: 'Bureau of Reclamation (BR)' },{ value: 'Caltrans', label: 'California Department of Transportation (Caltrans)' },{ value: 'CHSRA', label: 'California High-Speed Rail Authority (CHSRA)' },{ value: 'CIA', label: 'Central Intelligence Agency (CIA)' },{ value: 'NYCOMB', label: 'City of New York, Office of Management and Budget (NYCOMB)' },{ value: 'CDBG', label: 'Community Development Block Grant (CDBG)' },{ value: 'CTDOH', label: 'Connecticut Department of Housing (CTDOH)' },{ value: 'BRAC', label: 'Defense Base Closure and Realignment Commission (BRAC)' },{ value: 'DLA', label: 'Defense Logistics Agency (DLA)' },{ value: 'DNA', label: 'Defense Nuclear Agency (DNA)' },{ value: 'DNFSB', label: 'Defense Nuclear Fac. Safety Board (DNFSB)' },{ value: 'DSA', label: 'Defense Supply Agency (DSA)' },{ value: 'DRB', label: 'Delaware River Basin Commission (DRB)' },{ value: 'DC', label: 'Denali Commission (DC)' },{ value: 'USDA', label: 'Department of Agriculture (USDA)' },{ value: 'DOC', label: 'Department of Commerce (DOC)' },{ value: 'DOD', label: 'Department of Defense (DOD)' },{ value: 'DOE', label: 'Department of Energy (DOE)' },{ value: 'HHS', label: 'Department of Health and Human Services (HHS)' },{ value: 'DHS', label: 'Department of Homeland Security (DHS)' },{ value: 'HUD', label: 'Department of Housing and Urban Development (HUD)' },{ value: 'DOJ', label: 'Department of Justice (DOJ)' },{ value: 'DOL', label: 'Department of Labor (DOL)' },{ value: 'DOS', label: 'Department of State (DOS)' },{ value: 'DOT', label: 'Department of Transportation (DOT)' },{ value: 'TREAS', label: 'Department of Treasury (TREAS)' },{ value: 'VA', label: 'Department of Veteran Affairs (VA)' },{ value: 'DOI', label: 'Department of the Interior (DOI)' },{ value: 'DEA', label: 'Drug Enforcement Administration (DEA)' },{ value: 'EDA', label: 'Economic Development Administration (EDA)' },{ value: 'ERA', label: 'Energy Regulatory Administration (ERA)' },{ value: 'ERDA', label: 'Energy Research and Development Administration (ERDA)' },{ value: 'EPA', label: 'Environmental Protection Agency (EPA)' },{ value: 'FSA', label: 'Farm Service Agency (FSA)' },{ value: 'FHA', label: 'Farmers Home Administration (FHA)' },{ value: 'FAA', label: 'Federal Aviation Administration (FAA)' },{ value: 'FCC', label: 'Federal Communications Commission (FCC)' },{ value: 'FEMA', label: 'Federal Emergency Management Agency (FEMA)' },{ value: 'FEA', label: 'Federal Energy Administration (FEA)' },{ value: 'FERC', label: 'Federal Energy Regulatory Commission (FERC)' },{ value: 'FHWA', label: 'Federal Highway Administration (FHWA)' },{ value: 'FMC', label: 'Federal Maritime Commission (FMC)' },{ value: 'FMSHRC', label: 'Federal Mine Safety and Health Review Commission (FMSHRC)' },{ value: 'FMCSA', label: 'Federal Motor Carrier Safety Administration (FMCSA)' },{ value: 'FPC', label: 'Federal Power Commission (FPC)' },{ value: 'FRA', label: 'Federal Railroad Administration (FRA)' },{ value: 'FRBSF', label: 'Federal Reserve Bank of San Francisco (FRBSF)' },{ value: 'FTA', label: 'Federal Transit Administration (FTA)' },{ value: 'USFWS', label: 'Fish and Wildlife Service (USFWS)' },{ value: 'FDOT', label: 'Florida Department of Transportation (FDOT)' },{ value: 'FDA', label: 'Food and Drug Administration (FDA)' },{ value: 'USFS', label: 'Forest Service (USFS)' },{ value: 'GSA', label: 'General Services Administration (GSA)' },{ value: 'USGS', label: 'Geological Survey (USGS)' },{ value: 'GLB', label: 'Great Lakes Basin Commission (GLB)' },{ value: 'IHS', label: 'Indian Health Service (IHS)' },{ value: 'IRS', label: 'Internal Revenue Service (IRS)' },{ value: 'IBWC', label: 'International Boundary and Water Commission (IBWC)' },{ value: 'ICC', label: 'Interstate Commerce Commission (ICC)' },{ value: 'JCS', label: 'Joint Chiefs of Staff (JCS)' },{ value: 'MARAD', label: 'Maritime Administration (MARAD)' },{ value: 'MTB', label: 'Materials Transportation Bureau (MTB)' },{ value: 'MSHA', label: 'Mine Safety and Health Administration (MSHA)' },{ value: 'MMS', label: 'Minerals Management Service (MMS)' },{ value: 'MESA', label: 'Mining Enforcement and Safety (MESA)' },{ value: 'MRB', label: 'Missouri River Basin Commission (MRB)' },{ value: 'NASA', label: 'National Aeronautics and Space Administration (NASA)' },{ value: 'NCPC', label: 'National Capital Planning Commission (NCPC)' },{ value: 'NGA', label: 'National Geospatial-Intelligence Agency (NGA)' },{ value: 'NHTSA', label: 'National Highway Traffic Safety Administration (NHTSA)' },{ value: 'NIGC', label: 'National Indian Gaming Commission (NIGC)' },{ value: 'NIH', label: 'National Institute of Health (NIH)' },{ value: 'NMFS', label: 'National Marine Fisheries Service (NMFS)' },{ value: 'NNSA', label: 'National Nuclear Security Administration (NNSA)' },{ value: 'NOAA', label: 'National Oceanic and Atmospheric Administration (NOAA)' },{ value: 'NPS', label: 'National Park Service (NPS)' },{ value: 'NSF', label: 'National Science Foundation (NSF)' },{ value: 'NSA', label: 'National Security Agency (NSA)' },{ value: 'NTSB', label: 'National Transportation Safety Board (NTSB)' },{ value: 'NRCS', label: 'Natural Resource Conservation Service (NRCS)' },{ value: 'NER', label: 'New England River Basin Commission (NER)' },{ value: 'NJDEP', label: 'New Jersey Department of Environmental Protection (NJDEP)' },{ value: 'NRC', label: 'Nuclear Regulatory Commission (NRC)' },{ value: 'OCR', label: 'Office of Coal Research (OCR)' },{ value: 'OSM', label: 'Office of Surface Mining (OSM)' },{ value: 'OBR', label: 'Ohio River Basin Commission (OBR)' },{ value: 'RSPA', label: 'Research and Special Programs (RSPA)' },{ value: 'REA', label: 'Rural Electrification Administration (REA)' },{ value: 'RUS', label: 'Rural Utilities Service (RUS)' },{ value: 'SEC', label: 'Security and Exchange Commission (SEC)' },{ value: 'SBA', label: 'Small Business Administration (SBA)' },{ value: 'SCS', label: 'Soil Conservation Service (SCS)' },{ value: 'SRB', label: 'Souris-Red-Rainy River Basin Commission (SRB)' },{ value: 'STB', label: 'Surface Transportation Board (STB)' },{ value: 'SRC', label: 'Susquehanna River Basin Commission (SRC)' },{ value: 'TVA', label: 'Tennessee Valley Authority (TVA)' },{ value: 'TxDOT', label: 'Texas Department of Transportation (TxDOT)' },{ value: 'TPT', label: 'The Presidio Trust (TPT)' },{ value: 'TDA', label: 'Trade and Development Agency (TDA)' },{ value: 'USACE', label: 'U.S. Army Corps of Engineers (USACE)' },{ value: 'USCG', label: 'U.S. Coast Guard (USCG)' },{ value: 'CBP', label: 'U.S. Customs and Border Protection (CBP)' },{ value: 'RRB', label: 'U.S. Railroad Retirement Board (RRB)' },{ value: 'USAF', label: 'United States Air Force (USAF)' },{ value: 'USA', label: 'United States Army (USA)' },{ value: 'USMC', label: 'United States Marine Corps (USMC)' },{ value: 'USN', label: 'United States Navy (USN)' },{ value: 'USPS', label: 'United States Postal Service (USPS)' },{ value: 'USTR', label: 'United States Trade Representative (USTR)' },{ value: 'UMR', label: 'Upper Mississippi Basin Commission (UMR)' },{ value: 'UMTA', label: 'Urban Mass Transportation Administration (UMTA)' },{ value: 'UDOT', label: 'Utah Department of Transportation (UDOT)' },{ value: 'WAPA', label: 'Western Area Power Administration (WAPA)' }
        ];
                
	    // TODO: At some point, the database could be giving us these also.
        const stateOptions = [ { value: 'AK', label: 'Alaska' },{ value: 'AL', label: 'Alabama' },{ value: 'AQ', label: 'Antarctica' },{ value: 'AR', label: 'Arkansas' },{ value: 'AS', label: 'American Samoa' },{ value: 'AZ', label: 'Arizona' },{ value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },{ value: 'CT', label: 'Connecticut' },{ value: 'DC', label: 'District of Columbia' },{ value: 'DE', label: 'Delaware' },{ value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },{ value: 'GU', label: 'Guam' },{ value: 'HI', label: 'Hawaii' },{ value: 'IA', label: 'Iowa' },{ value: 'ID', label: 'Idaho' },{ value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'KS', label: 'Kansas' },{ value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },{ value: 'MA', label: 'Massachusetts' },{ value: 'MD', label: 'Maryland' },{ value: 'ME', label: 'Maine' },{ value: 'MI', label: 'Michigan' },{ value: 'MN', label: 'Minnesota' },{ value: 'MO', label: 'Missouri' },{ value: 'MS', label: 'Mississippi' },{ value: 'MT', label: 'Montana' },{ value: 'Multi', label: 'Multiple' },{ value: 'NAT', label: 'National' },{ value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },{ value: 'NE', label: 'Nebraska' },{ value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },{ value: 'NM', label: 'New Mexico' },{ value: 'NV', label: 'Nevada' },{ value: 'NY', label: 'New York' },{ value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },{ value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },{ value: 'PRO', label: 'Programmatic' },{ value: 'PR', label: 'Puerto Rico' },{ value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },{ value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },{ value: 'TT', label: 'Trust Territory of the Pacific Islands' },{ value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },{ value: 'VA', label: 'Virginia' },{ value: 'VI', label: 'Virgin Islands' },{ value: 'VT', label: 'Vermont' },{ value: 'WA', label: 'Washington' },{ value: 'WI', label: 'Wisconsin' },{ value: 'WV', label: 'West Virginia' },{ value: 'WY', label: 'Wyoming' }
        ];

        return (
            <div>
                <div>
                    <div className="content" onSubmit={this.submitHandler}>
                        <h1 className="title">NEPAccess</h1>
                        <h2 className="tagline">Find NEPA documents by searching for keywords in title, as well as by agencies, states, and more</h2>
                        
                        <div>
                            <label className="search-label" htmlFor="searchMode"><span className="no-select">Search by keywords within titles: </span>
                                {/* <Tooltip title="Natural language mode:  Search results are returned in order of relevance according to rarity of the words given, relative to all records in the database">
                                    <label className="inline highlight"><input type="radio" name="searchMode" value="natural" onChange={this.onRadioChange} 
                                    defaultChecked />Default</label>
                                </Tooltip>
                                <Tooltip title="Boolean mode: Search results are either found or not found, using more specific options.">
                                    <label className="inline highlight"><input type="radio" name="searchMode" value="boolean" onChange={this.onRadioChange} 
                                    />Advanced</label>
                                </Tooltip> */}
                                <span hidden={this.state.searchMode==="natural"} className="animation2" >
                                    <label className="inline highlight no-select"><input type="radio" className="animation2 boolean-radio" name="booleanOption" value="all" onChange={this.onRadioChange} 
                                    defaultChecked />All</label>
                                    {/* <label className="inline highlight no-select"><input type="radio" className="animation2 boolean-radio" name="booleanOption" value="exact" onChange={this.onRadioChange} 
                                    />Exact phrase</label> */}
                                    <label className="inline highlight no-select"><input type="radio" className="animation2 boolean-radio" name="booleanOption" value="any" onChange={this.onRadioChange} 
                                    />Any</label>
                                </span>
                            </label>
                        </div>

                        <div hidden={this.state.searchModeName==='Basic search'}>
                            <input id="searchTitle" className="search" type="search" name="naturalTitle" placeholder="Leave blank to include all titles" autoFocus onInput={this.onInputNatural} onKeyUp={this.onKeyUpNatural}/>
                            <Tooltip title="Natural language mode search.  Search by words in title as they are typed.  Surround with &quot;double quotes&quot; to match exact phrases.  Exact spelling only, case insensitive.  Pressing enter will refresh the search.  Results sorted by relevance.  Extremely common words present in most records (of, the, etc.) will return zero results.">
                                <label className="tooltip-icon">?</label>
                            </Tooltip>
                            {/* <svg id="x" onClick={this.onIconClick} onAnimationEnd={this.iconCleaning} viewBox="0 0 20 20">
                                <path></path>
                            </svg> */}
                            <svg id="search-glass" className={this.state.iconClassName} onClick={this.onIconNaturalClick} onAnimationEnd={this.iconCleaning} viewBox="0 0 20 20">
							    <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
						    </svg>
                            <label id="search-mode" className="inline" onClick={this.searchModeClick}>
                                {this.state.searchModeName}
                            </label>
                        </div>

                        <div hidden={this.state.searchModeName==='Advanced search'}>
                            <div hidden={this.state.booleanOption!=="all"}>
                                <div>
                                    <input id="searchTitleAll" className="search boolean" type="search" name="titleAll" 
                                        onInput={this.onInputTitleAll} onKeyUp={this.onKeyUpBoolean} 
                                        placeholder="Example: alaska* &quot;beaufort sea&quot;" />
                                    <Tooltip title="Boolean mode search.  Use * for partial words.  Surround with &quot;double quotes&quot; to match exact phrases.  Inclusion of extremely common words (of, the, etc.) or words smaller than three letters will return zero results.">
                                        <label className="tooltip-icon">?</label>
                                    </Tooltip>
                                    <svg id="search-glass" className={this.state.iconClassName} onClick={this.onIconBooleanClick} onAnimationEnd={this.iconCleaning} viewBox="0 0 20 20">
                                        <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
                                    </svg>
                                    
                                    <label id="search-mode" className="inline" onClick={this.searchModeClick}>
                                        {this.state.searchModeName}
                                    </label>
                                </div>
                            </div>
                            {/* <div hidden={this.state.booleanOption!=="exact"}>
                                <div>
                                    <input id="searchTitleExact" className="search boolean" type="search"name="titleExact" placeholder=""
                                        onInput={this.onInputTitleExact} onKeyUp={this.onKeyUpBoolean} />
                                    <Tooltip title="Exact phrase matches only">
                                        <label className="tooltip-icon">?</label>
                                    </Tooltip>
                                    <svg id="search-glass" className={this.state.iconClassName} onClick={this.onIconBooleanClick} onAnimationEnd={this.iconCleaning} viewBox="0 0 20 20">
							            <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
						            </svg>
                                    <label id="search-mode" className="inline" onClick={this.searchModeClick}>
                                        {this.state.searchModeName}
                                    </label>
                                </div>
                            </div> */}
                            <div hidden={this.state.booleanOption!=="any"}>
                                <div>
                                    <input id="searchTitleAny" className="search boolean" type="search" name="titleAny" placeholder=""
                                        onInput={this.onInputTitleAny} onKeyUp={this.onKeyUpBoolean} />
                                    <Tooltip title="Boolean mode search.  Use * for partial words. &quot;Exact phrases&quot; are supported">
                                        <label className="tooltip-icon">?</label>
                                    </Tooltip>
                                    <svg id="search-glass" className={this.state.iconClassName} onClick={this.onIconBooleanClick} onAnimationEnd={this.iconCleaning} viewBox="0 0 20 20">
							            <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
						            </svg>
                                    <label id="search-mode" className="inline" onClick={this.searchModeClick}>
                                        {this.state.searchModeName}
                                    </label>
                                </div>
                            </div>

                            <div className="inline center">
                                <label className="none-label inline" htmlFor="searchTitleNone">Can't have any of these words: 
                                </label>
                                <input id="searchTitleNone" className="searchSecondary animation1" type="search" name="titleNone" placeholder="Type to exclude words..."
                                    onInput={this.onInputTitleNone} onKeyUp={this.onKeyUpBoolean} />
                                <Tooltip title="Excludes results containing any of these words.  Surround with &quot;double quotes&quot; to match exact phrases.  NOTE: If the all/any field is empty, this will return no results.">
                                    <label className="tooltip-icon">?</label>
                                </Tooltip>
                            </div>
                        </div>

                        <table className="searchContainer"><tbody>
                            <tr>
                                <td>
                                    <label className="table">Publication date</label>
                                </td>
                                <td>
                                    {/* <Tooltip title="Search by publishing metadata after this date.  Leave blank to include all"> */}
                                        <DatePicker
                                            selected={this.state.startPublish} onChange={this.onStartDateChange} 
                                            dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                                            className="date" 
                                        />
                                    {/* </Tooltip> */}
                                    &nbsp;to&nbsp;
                                    {/* <Tooltip title="Search by publishing metadata before this date.  Leave blank to include all"> */}
                                        <DatePicker
                                            selected={this.state.endPublish} onChange={this.onEndDateChange}
                                            dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                                            className="date" 
                                        />
                                    {/* </Tooltip> */}
                                </td>
                                
                                <td>
                                    <label className="table" htmlFor="searchAgency">Agencies</label>
                                </td>
                                <td>
                                    {/* <Tooltip title="Search by specific agencies or departments.  Leave blank to include all"> */}
                                        <Select id="searchAgency" className="multi" classNamePrefix="react-select" isMulti name="agency" isSearchable isClearable 
                                            styles={customStyles}
                                            options={agencyOptions} 
                                            onChange={this.onAgencyChange} 
                                            placeholder="Click here to select from dropdown and/or type to search..." 
                                            // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                                            // menuIsOpen={true}
                                        />
                                    {/* </Tooltip> */}
                                </td>

                            </tr>
                            <tr>
                                <td><label className="table">Comment date</label></td>
                                <td>
                                    {/* <Tooltip title="Exclude documents with comment metadata before this date.  Leave blank to include all"> */}
                                        <DatePicker
                                            selected={this.state.startComment} onChange={this.onStartCommentChange} 
                                            dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                                            className="date" 
                                        />
                                    {/* </Tooltip>  */}
                                    &nbsp;to&nbsp;
                                    {/* <Tooltip title="Exclude documents with comment metadata after this date.  Leave blank to include all"> */}
                                        <DatePicker
                                            selected={this.state.endComment} onChange={this.onEndCommentChange}
                                            dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                                            className="date" 
                                        />
                                    {/* </Tooltip> */}
                                </td>
                                
                                <td><label className="table" htmlFor="searchState">States</label></td>
                                <td>
                                    {/* <select multiple id="searchState">
                                        <option value="AK">Alaska</option><option value="AL">Alabama</option><option value="AQ">Antarctica</option><option value="AR">Arkansas</option><option value="AS">American Samoa</option><option value="AZ">Arizona</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DC">District of Columbia</option><option value="DE">Delaware</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="GU">Guam</option><option value="HI">Hawaii</option><option value="IA">Iowa</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="MA">Massachusetts</option><option value="MD">Maryland</option><option value="ME">Maine</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MO">Missouri</option><option value="MS">Mississippi</option><option value="MT">Montana</option><option value="NAT">National</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="NE">Nebraska</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NV">Nevada</option><option value="NY">New York</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="PR">Puerto Rico</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TT">Trust Territory of the Pacific Islands</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VA">Virginia</option><option value="VI">Virgin Islands</option><option value="VT">Vermont</option><option value="WA">Washington</option><option value="WI">Wisconsin</option><option value="WV">West Virginia</option><option value="WY">Wyoming</option>
                                    </select> */}
                                    {/* <Tooltip title="Search by states or territories in metadata.  Leave blank to include all"> */}
                                    <Select id="searchState" className="multi" classNamePrefix="react-select" isMulti name="state" isSearchable isClearable 
                                        styles={customStyles}
                                        options={stateOptions} 
                                        onChange={this.onLocationChange} 
                                        placeholder="Click here to select from dropdown and/or type to search..." 
                                     />
                                    {/* </Tooltip> */}
                                </td>
                            </tr>
                            <tr>
                                <td className='checkbox-list'>Version</td>
                                <td>
                                    <label className="inline highlight">
                                        <input type="checkbox" name="typeAll" checked={this.state.typeAll} onChange={this.onTypeChecked} />
                                        <span>All&nbsp;</span></label>
                                    <label className="inline highlight">
                                        <input type="checkbox" name="typeFinal" checked={this.state.typeFinal} onChange={this.onTypeChecked} />
                                        <span>Final&nbsp;</span></label>
                                    <label className="inline highlight">
                                        <input type="checkbox" name="typeDraft" checked={this.state.typeDraft} onChange={this.onTypeChecked} />
                                        <span>Draft&nbsp;</span></label>
                                    <label className="inline highlight">
                                        <input type="checkbox" name="typeOther" checked={this.state.typeOther} onChange={this.onTypeChecked} />
                                        <span>Other&nbsp;</span></label>
                                </td>
                            
                            <td className='checkbox-list'>Downloads</td>
                                <td>
                                    {/* <Tooltip title="Exclude records without comment downloads"> */}
                                    <label className="inline highlight">
                                        <input type="checkbox" name="needsComments" checked={this.state.needsComments} onChange={this.onChecked} />
                                        <span>Must have comment file(s)</span>
                                    </label>
                                    {/* </Tooltip> */}
                                </td>
                            </tr>
                            <tr>
                                <td><label>Return</label>
                                </td>
                                <td>
                                    <input id="searchLimit" type="number" step="100" min="0" max="100000" 
                                    placeholder="1000" name="limit" onInput={this.onInput} /> records at most
                                </td>
                                <td></td>
                                <td>
                                    {/* <Tooltip title="Exclude records without document downloads"> */}
                                    <label className="inline highlight">
                                        <input type="checkbox" name="needsDocument" onChange={this.onChecked} />
                                        <span>Must have document file(s)</span>
                                    </label>
                                    {/* </Tooltip> */}
                                </td>
                            </tr>
                        </tbody></table>
                        
                        {/* <Tooltip title="Click to hide/show advanced search options">
                            <button className="collapsible" onClick={this.collapsibles}>{this.state.collapsibleText}</button>
                        </Tooltip> */}
                        {/* <table id="advanced" className={this.state.searcherClassName}><tbody>
                            

                            <tr><td><label>Version:
                                    <label className="inline highlight">
                                        <input type="checkbox" name="typeAll" checked={this.state.typeAll} onChange={this.onTypeChecked} />
                                        <span>All&nbsp;</span></label>
                                    <label className="inline highlight">
                                        <input type="checkbox" name="typeFinal" checked={this.state.typeFinal} onChange={this.onTypeChecked} />
                                        <span>Final&nbsp;</span></label>
                                    <label className="inline highlight">
                                        <input type="checkbox" name="typeDraft" checked={this.state.typeDraft} onChange={this.onTypeChecked} />
                                        <span>Draft&nbsp;</span></label>
                                    <label className="inline highlight">
                                        <input type="checkbox" name="typeOther" checked={this.state.typeOther} onChange={this.onTypeChecked} />
                                        <span>Other&nbsp;</span></label></label></td>
                            </tr>

                            <tr><td>
                                <Tooltip title="Exclude records without comment downloads">
                                <label className="checkbox">
                                    <input type="checkbox" name="needsComments" checked={this.state.needsComments} onChange={this.onChecked} />
                                    <span>Must have comment file(s)</span>
                                </label>
                                </Tooltip></td></tr>
                                <tr><td>
                                <Tooltip title="Exclude records without document downloads">
                                <label className="checkbox">
                                    <input type="checkbox" name="needsDocument" onChange={this.onChecked} />
                                    <span>Must have document file(s)</span>
                                </label>
                                </Tooltip></td></tr>

                                <tr><td><label>
                                    Return &nbsp;
                                    <input id="searchLimit" type="number" step="100" min="0" max="100000" 
                                    placeholder="1000" name="limit" onInput={this.onInput} /> records at most
                                </label></td></tr>
                        </tbody></table> */}
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Searcher;