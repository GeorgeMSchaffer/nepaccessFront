import React from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

const _ = require('lodash');

class Searcher extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            title: '',
            startPublish: '',
            endPublish: '',
            agency: [],
            state: [],
            needsComments: false
		};
        this.debouncedSearch = _.debounce(this.props.search, 300);
		this.onKeyUp = this.onKeyUp.bind(this);
	}
    
    /**
     * Event handlers
     */
    // TODO: moment.js?

	onKeyUp = (evt) => {
		// get the evt.target.name (defined by name= in input)
		// and use it to target the key on our `state` object with the same name, using bracket syntax
		this.setState( 
		{ 
			[evt.target.name]: evt.target.value
		}, () => { // callback ensures state is set before state is used for search
			this.debouncedSearch(this.state);
			// console.log("Searcher state");
			// console.log(this.state);
		});
    }
	onAgencyChange = (evt) => {
        this.setState( 
		{ 
			agency: evt
		}, () => { 
			this.debouncedSearch(this.state);
		});
    }
	onStateChange = (evt) => {
        this.setState( 
		{ 
			agency: evt
		}, () => { 
			// this.debouncedSearch(this.state);
		});
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
    
    // Can either just make the form a div or use this to prevent Submit default behavior
	submitHandler(e) { e.preventDefault(); }

    render () {
        console.log("Searcher render");

	    // TODO: At some point, the database could give us the agency options.
        const agencyOptions = [	{ value: 'ACHP', label: 'Advisory Council on Historic Preservation (ACHP)' },{ value: 'USAID', label: 'Agency for International Development (USAID)' },{ value: 'ARS', label: 'Agriculture Research Service (ARS)' },{ value: 'APHIS', label: 'Animal and Plant Health Inspection Service (APHIS)' },{ value: 'AFRH', label: 'Armed Forces Retirement Home (AFRH)' },{ value: 'BPA', label: 'Bonneville Power Administration (BPA)' },{ value: 'BIA', label: 'Bureau of Indian Affairs (BIA)' },{ value: 'BLM', label: 'Bureau of Land Management (BLM)' },{ value: 'USBM', label: 'Bureau of Mines (USBM)' },{ value: 'BOEM', label: 'Bureau of Ocean Energy Management (BOEM)' },{ value: 'BOP', label: 'Bureau of Prisons (BOP)' },{ value: 'BR', label: 'Bureau of Reclamation (BR)' },{ value: 'Caltrans', label: 'California Department of Transportation (Caltrans)' },{ value: 'CHSRA', label: 'California High-Speed Rail Authority (CHSRA)' },{ value: 'CIA', label: 'Central Intelligence Agency (CIA)' },{ value: 'NYCOMB', label: 'City of New York, Office of Management and Budget (NYCOMB)' },{ value: 'CDBG', label: 'Community Development Block Grant (CDBG)' },{ value: 'CTDOH', label: 'Connecticut Department of Housing (CTDOH)' },{ value: 'BRAC', label: 'Defense Base Closure and Realignment Commission (BRAC)' },{ value: 'DLA', label: 'Defense Logistics Agency (DLA)' },{ value: 'DNA', label: 'Defense Nuclear Agency (DNA)' },{ value: 'DNFSB', label: 'Defense Nuclear Fac. Safety Board (DNFSB)' },{ value: 'DSA', label: 'Defense Supply Agency (DSA)' },{ value: 'DRB', label: 'Delaware River Basin Commission (DRB)' },{ value: 'DC', label: 'Denali Commission (DC)' },{ value: 'USDA', label: 'Department of Agriculture (USDA)' },{ value: 'DOC', label: 'Department of Commerce (DOC)' },{ value: 'DOD', label: 'Department of Defense (DOD)' },{ value: 'DOE', label: 'Department of Energy (DOE)' },{ value: 'HHS', label: 'Department of Health and Human Services (HHS)' },{ value: 'DHS', label: 'Department of Homeland Security (DHS)' },{ value: 'HUD', label: 'Department of Housing and Urban Development (HUD)' },{ value: 'DOJ', label: 'Department of Justice (DOJ)' },{ value: 'DOL', label: 'Department of Labor (DOL)' },{ value: 'DOS', label: 'Department of State (DOS)' },{ value: 'DOT', label: 'Department of Transportation (DOT)' },{ value: 'TREAS', label: 'Department of Treasury (TREAS)' },{ value: 'VA', label: 'Department of Veteran Affairs (VA)' },{ value: 'DOI', label: 'Department of the Interior (DOI)' },{ value: 'DEA', label: 'Drug Enforcement Administration (DEA)' },{ value: 'EDA', label: 'Economic Development Administration (EDA)' },{ value: 'ERA', label: 'Energy Regulatory Administration (ERA)' },{ value: 'ERDA', label: 'Energy Research and Development Administration (ERDA)' },{ value: 'EPA', label: 'Environmental Protection Agency (EPA)' },{ value: 'FSA', label: 'Farm Service Agency (FSA)' },{ value: 'FHA', label: 'Farmers Home Administration (FHA)' },{ value: 'FAA', label: 'Federal Aviation Administration (FAA)' },{ value: 'FCC', label: 'Federal Communications Commission (FCC)' },{ value: 'FEMA', label: 'Federal Emergency Management Agency (FEMA)' },{ value: 'FEA', label: 'Federal Energy Administration (FEA)' },{ value: 'FERC', label: 'Federal Energy Regulatory Commission (FERC)' },{ value: 'FHWA', label: 'Federal Highway Administration (FHWA)' },{ value: 'FMC', label: 'Federal Maritime Commission (FMC)' },{ value: 'FMSHRC', label: 'Federal Mine Safety and Health Review Commission (FMSHRC)' },{ value: 'FMCSA', label: 'Federal Motor Carrier Safety Administration (FMCSA)' },{ value: 'FPC', label: 'Federal Power Commission (FPC)' },{ value: 'FRA', label: 'Federal Railroad Administration (FRA)' },{ value: 'FRBSF', label: 'Federal Reserve Bank of San Francisco (FRBSF)' },{ value: 'FTA', label: 'Federal Transit Administration (FTA)' },{ value: 'USFWS', label: 'Fish and Wildlife Service (USFWS)' },{ value: 'FDOT', label: 'Florida Department of Transportation (FDOT)' },{ value: 'FDA', label: 'Food and Drug Administration (FDA)' },{ value: 'USFS', label: 'Forest Service (USFS)' },{ value: 'GSA', label: 'General Services Administration (GSA)' },{ value: 'USGS', label: 'Geological Survey (USGS)' },{ value: 'GLB', label: 'Great Lakes Basin Commission (GLB)' },{ value: 'IHS', label: 'Indian Health Service (IHS)' },{ value: 'IRS', label: 'Internal Revenue Service (IRS)' },{ value: 'IBWC', label: 'International Boundary and Water Commission (IBWC)' },{ value: 'ICC', label: 'Interstate Commerce Commission (ICC)' },{ value: 'JCS', label: 'Joint Chiefs of Staff (JCS)' },{ value: 'MARAD', label: 'Maritime Administration (MARAD)' },{ value: 'MTB', label: 'Materials Transportation Bureau (MTB)' },{ value: 'MSHA', label: 'Mine Safety and Health Administration (MSHA)' },{ value: 'MMS', label: 'Minerals Management Service (MMS)' },{ value: 'MESA', label: 'Mining Enforcement and Safety (MESA)' },{ value: 'MRB', label: 'Missouri River Basin Commission (MRB)' },{ value: 'NASA', label: 'National Aeronautics and Space Administration (NASA)' },{ value: 'NCPC', label: 'National Capital Planning Commission (NCPC)' },{ value: 'NGA', label: 'National Geospatial-Intelligence Agency (NGA)' },{ value: 'NHTSA', label: 'National Highway Traffic Safety Administration (NHTSA)' },{ value: 'NIGC', label: 'National Indian Gaming Commission (NIGC)' },{ value: 'NIH', label: 'National Institute of Health (NIH)' },{ value: 'NMFS', label: 'National Marine Fisheries Service (NMFS)' },{ value: 'NNSA', label: 'National Nuclear Security Administration (NNSA)' },{ value: 'NOAA', label: 'National Oceanic and Atmospheric Administration (NOAA)' },{ value: 'NPS', label: 'National Park Service (NPS)' },{ value: 'NSF', label: 'National Science Foundation (NSF)' },{ value: 'NSA', label: 'National Security Agency (NSA)' },{ value: 'NTSB', label: 'National Transportation Safety Board (NTSB)' },{ value: 'NRCS', label: 'Natural Resource Conservation Service (NRCS)' },{ value: 'NER', label: 'New England River Basin Commission (NER)' },{ value: 'NJDEP', label: 'New Jersey Department of Environmental Protection (NJDEP)' },{ value: 'NRC', label: 'Nuclear Regulatory Commission (NRC)' },{ value: 'OCR', label: 'Office of Coal Research (OCR)' },{ value: 'OSM', label: 'Office of Surface Mining (OSM)' },{ value: 'OBR', label: 'Ohio River Basin Commission (OBR)' },{ value: 'RSPA', label: 'Research and Special Programs (RSPA)' },{ value: 'REA', label: 'Rural Electrification Administration (REA)' },{ value: 'RUS', label: 'Rural Utilities Service (RUS)' },{ value: 'SEC', label: 'Security and Exchange Commission (SEC)' },{ value: 'SBA', label: 'Small Business Administration (SBA)' },{ value: 'SCS', label: 'Soil Conservation Service (SCS)' },{ value: 'SRB', label: 'Souris-Red-Rainy River Basin Commission (SRB)' },{ value: 'STB', label: 'Surface Transportation Board (STB)' },{ value: 'SRC', label: 'Susquehanna River Basin Commission (SRC)' },{ value: 'TVA', label: 'Tennessee Valley Authority (TVA)' },{ value: 'TxDOT', label: 'Texas Department of Transportation (TxDOT)' },{ value: 'TPT', label: 'The Presidio Trust (TPT)' },{ value: 'TDA', label: 'Trade and Development Agency (TDA)' },{ value: 'USACE', label: 'U.S. Army Corps of Engineers (USACE)' },{ value: 'USCG', label: 'U.S. Coast Guard (USCG)' },{ value: 'CBP', label: 'U.S. Customs and Border Protection (CBP)' },{ value: 'RRB', label: 'U.S. Railroad Retirement Board (RRB)' },{ value: 'USAF', label: 'United States Air Force (USAF)' },{ value: 'USA', label: 'United States Army (USA)' },{ value: 'USMC', label: 'United States Marine Corps (USMC)' },{ value: 'USN', label: 'United States Navy (USN)' },{ value: 'USPS', label: 'United States Postal Service (USPS)' },{ value: 'USTR', label: 'United States Trade Representative (USTR)' },{ value: 'UMR', label: 'Upper Mississippi Basin Commission (UMR)' },{ value: 'UMTA', label: 'Urban Mass Transportation Administration (UMTA)' },{ value: 'UDOT', label: 'Utah Department of Transportation (UDOT)' },{ value: 'WAPA', label: 'Western Area Power Administration (WAPA)' }
        ];
                
	    // TODO: At some point, the database could could be giving us these also.
        const stateOptions = [ { value: 'AK', label: 'Alaska' },{ value: 'AL', label: 'Alabama' },{ value: 'AQ', label: 'Antarctica' },{ value: 'AR', label: 'Arkansas' },{ value: 'AS', label: 'American Samoa' },{ value: 'AZ', label: 'Arizona' },{ value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },{ value: 'CT', label: 'Connecticut' },{ value: 'DC', label: 'District of Columbia' },{ value: 'DE', label: 'Delaware' },{ value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },{ value: 'GU', label: 'Guam' },{ value: 'HI', label: 'Hawaii' },{ value: 'IA', label: 'Iowa' },{ value: 'ID', label: 'Idaho' },{ value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'KS', label: 'Kansas' },{ value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },{ value: 'MA', label: 'Massachusetts' },{ value: 'MD', label: 'Maryland' },{ value: 'ME', label: 'Maine' },{ value: 'MI', label: 'Michigan' },{ value: 'MN', label: 'Minnesota' },{ value: 'MO', label: 'Missouri' },{ value: 'MS', label: 'Mississippi' },{ value: 'MT', label: 'Montana' },{ value: 'NAT', label: 'National' },{ value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },{ value: 'NE', label: 'Nebraska' },{ value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },{ value: 'NM', label: 'New Mexico' },{ value: 'NV', label: 'Nevada' },{ value: 'NY', label: 'New York' },{ value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },{ value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },{ value: 'PR', label: 'Puerto Rico' },{ value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },{ value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },{ value: 'TT', label: 'Trust Territory of the Pacific Islands' },{ value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },{ value: 'VA', label: 'Virginia' },{ value: 'VI', label: 'Virgin Islands' },{ value: 'VT', label: 'Vermont' },{ value: 'WA', label: 'Washington' },{ value: 'WI', label: 'Wisconsin' },{ value: 'WV', label: 'West Virginia' },{ value: 'WY', label: 'Wyoming' }
        ];

        return (
			<form className="content dark" onSubmit={this.submitHandler}>
				<label htmlFor="searchTitle">Search by title</label>
				<input id="searchTitle" type="search" size="50" name="title" autoFocus 
				placeholder="Leave blank to include all titles" onKeyUp={this.onKeyUp} />
				<label>Publication date</label>
				{/* <input className="date" type="date" name="startPublish" onChange={this.onKeyUp}/> to <input className="endDate date" type="date" name="endPublish" onChange={this.onKeyUp}/> */}
				<DatePicker
                    selected={this.state.startPublish} 
                    onChange={this.onStartDateChange} 
                    dateFormat="yyyy-MM-dd" 
                    className="date" 
                /> to <DatePicker
                    selected={this.state.endPublish}
                    onChange={this.onEndDateChange}
                    dateFormat="yyyy-MM-dd" 
                    className="date" 
                />
                <div>
				<label htmlFor="searchAgency">Agencies</label>
				{/* <select multiple id="searchAgency">
					<option value="ACHP">Advisory Council on Historic Preservation (ACHP)</option><option value="USAID">Agency for International Development (USAID)</option><option value="ARS">Agriculture Research Service (ARS)</option><option value="APHIS">Animal and Plant Health Inspection Service (APHIS)</option><option value="AFRH">Armed Forces Retirement Home (AFRH)</option><option value="BPA">Bonneville Power Administration (BPA)</option><option value="BIA">Bureau of Indian Affairs (BIA)</option><option value="BLM">Bureau of Land Management (BLM)</option><option value="USBM">Bureau of Mines (USBM)</option><option value="BOEM">Bureau of Ocean Energy Management (BOEM)</option><option value="BOP">Bureau of Prisons (BOP)</option><option value="BR">Bureau of Reclamation (BR)</option><option value="Caltrans">California Department of Transportation (Caltrans)</option><option value="CHSRA">California High-Speed Rail Authority (CHSRA)</option><option value="CIA">Central Intelligence Agency (CIA)</option><option value="NYCOMB">City of New York, Office of Management and Budget (NYCOMB)</option><option value="CDBG">Community Development Block Grant (CDBG)</option><option value="CTDOH">Connecticut Department of Housing (CTDOH)</option><option value="BRAC">Defense Base Closure and Realignment Commission (BRAC)</option><option value="DLA">Defense Logistics Agency (DLA)</option><option value="DNA">Defense Nuclear Agency (DNA)</option><option value="DNFSB">Defense Nuclear Fac. Safety Board (DNFSB)</option><option value="DSA">Defense Supply Agency (DSA)</option><option value="DRB">Delaware River Basin Commission (DRB)</option><option value="DC">Denali Commission (DC)</option><option value="USDA">Department of Agriculture (USDA)</option><option value="DOC">Department of Commerce (DOC)</option><option value="DOD">Department of Defense (DOD)</option><option value="DOE">Department of Energy (DOE)</option><option value="HHS">Department of Health and Human Services (HHS)</option><option value="DHS">Department of Homeland Security (DHS)</option><option value="HUD">Department of Housing and Urban Development (HUD)</option><option value="DOJ">Department of Justice (DOJ)</option><option value="DOL">Department of Labor (DOL)</option><option value="DOS">Department of State (DOS)</option><option value="DOT">Department of Transportation (DOT)</option><option value="TREAS">Department of Treasury (TREAS)</option><option value="VA">Department of Veteran Affairs (VA)</option><option value="DOI">Department of the Interior (DOI)</option><option value="DEA">Drug Enforcement Administration (DEA)</option><option value="EDA">Economic Development Administration (EDA)</option><option value="ERA">Energy Regulatory Administration (ERA)</option><option value="ERDA">Energy Research and Development Administration (ERDA)</option><option value="EPA">Environmental Protection Agency (EPA)</option><option value="FSA">Farm Service Agency (FSA)</option><option value="FHA">Farmers Home Administration (FHA)</option><option value="FAA">Federal Aviation Administration (FAA)</option><option value="FCC">Federal Communications Commission (FCC)</option><option value="FEMA">Federal Emergency Management Agency (FEMA)</option><option value="FEA">Federal Energy Administration (FEA)</option><option value="FERC">Federal Energy Regulatory Commission (FERC)</option><option value="FHWA">Federal Highway Administration (FHWA)</option><option value="FMC">Federal Maritime Commission (FMC)</option><option value="FMSHRC">Federal Mine Safety and Health Review Commission (FMSHRC)</option><option value="FMCSA">Federal Motor Carrier Safety Administration (FMCSA)</option><option value="FPC">Federal Power Commission (FPC)</option><option value="FRA">Federal Railroad Administration (FRA)</option><option value="FRBSF">Federal Reserve Bank of San Francisco (FRBSF)</option><option value="FTA">Federal Transit Administration (FTA)</option><option value="USFWS">Fish and Wildlife Service (USFWS)</option><option value="FDOT">Florida Department of Transportation (FDOT)</option><option value="FDA">Food and Drug Administration (FDA)</option><option value="USFS">Forest Service (USFS)</option><option value="GSA">General Services Administration (GSA)</option><option value="USGS">Geological Survey (USGS)</option><option value="GLB">Great Lakes Basin Commission (GLB)</option><option value="IHS">Indian Health Service (IHS)</option><option value="IRS">Internal Revenue Service (IRS)</option><option value="IBWC">International Boundary and Water Commission (IBWC)</option><option value="ICC">Interstate Commerce Commission (ICC)</option><option value="JCS">Joint Chiefs of Staff (JCS)</option><option value="MARAD">Maritime Administration (MARAD)</option><option value="MTB">Materials Transportation Bureau (MTB)</option><option value="MSHA">Mine Safety and Health Administration (MSHA)</option><option value="MMS">Minerals Management Service (MMS)</option><option value="MESA">Mining Enforcement and Safety (MESA)</option><option value="MRB">Missouri River Basin Commission (MRB)</option><option value="NASA">National Aeronautics and Space Administration (NASA)</option><option value="NCPC">National Capital Planning Commission (NCPC)</option><option value="NGA">National Geospatial-Intelligence Agency (NGA)</option><option value="NHTSA">National Highway Traffic Safety Administration (NHTSA)</option><option value="NIGC">National Indian Gaming Commission (NIGC)</option><option value="NIH">National Institute of Health (NIH)</option><option value="NMFS">National Marine Fisheries Service (NMFS)</option><option value="NNSA">National Nuclear Security Administration (NNSA)</option><option value="NOAA">National Oceanic and Atmospheric Administration (NOAA)</option><option value="NPS">National Park Service (NPS)</option><option value="NSF">National Science Foundation (NSF)</option><option value="NSA">National Security Agency (NSA)</option><option value="NTSB">National Transportation Safety Board (NTSB)</option><option value="NRCS">Natural Resource Conservation Service (NRCS)</option><option value="NER">New England River Basin Commission (NER)</option><option value="NJDEP">New Jersey Department of Environmental Protection (NJDEP)</option><option value="NRC">Nuclear Regulatory Commission (NRC)</option><option value="OCR">Office of Coal Research (OCR)</option><option value="OSM">Office of Surface Mining (OSM)</option><option value="OBR">Ohio River Basin Commission (OBR)</option><option value="RSPA">Research and Special Programs (RSPA)</option><option value="REA">Rural Electrification Administration (REA)</option><option value="RUS">Rural Utilities Service (RUS)</option><option value="SEC">Security and Exchange Commission (SEC)</option><option value="SBA">Small Business Administration (SBA)</option><option value="SCS">Soil Conservation Service (SCS)</option><option value="SRB">Souris-Red-Rainy River Basin Commission (SRB)</option><option value="STB">Surface Transportation Board (STB)</option><option value="SRC">Susquehanna River Basin Commission (SRC)</option><option value="TVA">Tennessee Valley Authority (TVA)</option><option value="TxDOT">Texas Department of Transportation (TxDOT)</option><option value="TPT">The Presidio Trust (TPT)</option><option value="TDA">Trade and Development Agency (TDA)</option><option value="USACE">U.S. Army Corps of Engineers (USACE)</option><option value="USCG">U.S. Coast Guard (USCG)</option><option value="CBP">U.S. Customs and Border Protection (CBP)</option><option value="RRB">U.S. Railroad Retirement Board (RRB)</option><option value="USAF">United States Air Force (USAF)</option><option value="USA">United States Army (USA)</option><option value="USMC">United States Marine Corps (USMC)</option><option value="USN">United States Navy (USN)</option><option value="USPS">United States Postal Service (USPS)</option><option value="USTR">United States Trade Representative (USTR)</option><option value="UMR">Upper Mississippi Basin Commission (UMR)</option><option value="UMTA">Urban Mass Transportation Administration (UMTA)</option><option value="UDOT">Utah Department of Transportation (UDOT)</option><option value="WAPA">Western Area Power Administration (WAPA)</option>
				</select> */}
                <Select id="searchAgency" className="multi" isMulti name="agency" isSearchable isClearable 
                    options={agencyOptions} 
                    onChange={this.onAgencyChange} 
                    placeholder="Search all" 
                />
				</div>
				<div>
				<label htmlFor="searchState">States</label>
				{/* <select multiple id="searchState">
					<option value="AK">Alaska</option><option value="AL">Alabama</option><option value="AQ">Antarctica</option><option value="AR">Arkansas</option><option value="AS">American Samoa</option><option value="AZ">Arizona</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DC">District of Columbia</option><option value="DE">Delaware</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="GU">Guam</option><option value="HI">Hawaii</option><option value="IA">Iowa</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="MA">Massachusetts</option><option value="MD">Maryland</option><option value="ME">Maine</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MO">Missouri</option><option value="MS">Mississippi</option><option value="MT">Montana</option><option value="NAT">National</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="NE">Nebraska</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NV">Nevada</option><option value="NY">New York</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="PR">Puerto Rico</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TT">Trust Territory of the Pacific Islands</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VA">Virginia</option><option value="VI">Virgin Islands</option><option value="VT">Vermont</option><option value="WA">Washington</option><option value="WI">Wisconsin</option><option value="WV">West Virginia</option><option value="WY">Wyoming</option>
				</select> */}
                <Select id="searchState" className="multi" isMulti name="state" isSearchable isClearable 
                    options={stateOptions} 
                    onChange={this.onStateChange} 
                    placeholder="Search all" 
                />
				</div>
                <div>
                    <label>
                        Must have comments
                    </label>
                    <input type="checkbox" name="needsComments" onChange={this.onChecked} />
                </div>
				<br />
			</form>
        )
    }

	// Onload
    componentDidMount(){
        // Date placeholders (workaround for react-datepicker)
        if(document.querySelectorAll('.date')[0]){
            document.querySelectorAll('.date')[0].placeholder = 'YYYY-MM-DD';
            document.querySelectorAll('.date')[1].placeholder = 'YYYY-MM-DD';
        }
     }
}

export default Searcher;