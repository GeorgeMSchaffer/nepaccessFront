import axios from 'axios';

const finalTypeLabels = ["Final",
    "Second Final",
    "Revised Final",
    "Final Revised",
    "Final Supplement",
    "Final Supplemental",
    "Second Final Supplemental",
    "Third Final Supplemental"];
const finalTypeLabelsLower = ["final",
    "second final",
    "revised final",
    "final revised",
    "final supplement",
    "final supplemental",
    "second final supplemental",
    "third final supplemental"];
const draftTypeLabels = ["Draft",
    "Second Draft",
    "Revised Draft",
    "Draft Revised",
    "Draft Supplement",
    "Draft Supplemental",
    "Second Draft Supplemental",
    "Third Draft Supplemental"];
const draftTypeLabelsLower = ["draft",
    "second draft",
    "revised draft",
    "draft revised",
    "draft supplement",
    "draft supplemental",
    "second draft supplemental",
    "third draft supplemental"];

const Globals = {
    currentHost: new URL('https://mis-jvinalappl1.microagelab.arizona.edu:8080/'),

    listeners: {},

    registerListener(key, listenerFunction) {
        const entries = this.listeners[key] || [];
        this.listeners[key] = entries; // assign if first time
    
        entries.push(listenerFunction)
    },
    
    emitEvent(key, eventObject) {
        const entries = this.listeners[key] || [];
        entries.forEach(listener => {
            listener(eventObject)
        });
    },

    /** Returns ?q= value, or '' if no value, or null if no ?q param at all */
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    
    // Set up globals like axios default headers and base URL
    setUp() {
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu' || window.location.hostname === 'www.nepaccess.org') {
            this.currentHost = new URL(window.location.protocol + 'mis-jvinalappl1.microagelab.arizona.edu:8080/');
        } else {
            this.currentHost = new URL(window.location.protocol + window.location.hostname + ':8080/');
        } 
        // else if(window.location.hostname) {
        //     this.currentHost = new URL('https://' + window.location.hostname + ':8080/');
        // }
        
        axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers.common['X-Content-Type-Options'] = 'no-sniff';
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                
        let token = localStorage.JWT;
        if(token){
            axios.defaults.headers.common['Authorization'] = token; // Change to defaults works everywhere
        } // No token is fine, they will just be redirected to login on app init
    },

    signIn() {
        let token = localStorage.JWT;
        if(token){
            axios.defaults.headers.common['Authorization'] = token;
        } 
    },
    

    signOut() {
        localStorage.removeItem("JWT");
        localStorage.removeItem("role");
        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem("username");
        localStorage.removeItem("admin");
        localStorage.removeItem("curator");
        localStorage.removeItem("approver");
    },

    approverOrHigher() {
        return (localStorage.role && localStorage.role !== 'user')
    },
    curatorOrHigher() {
        return (localStorage.role && (localStorage.role === 'curator' || localStorage.role === 'admin'))
    },

    isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    },

    /** Return search options that are all default except use the incoming title.  Options based on what Spring DAL uses. */
    convertToSimpleSearch(searcherState){

        return {
            titleRaw: searcherState.titleRaw,
			startPublish: '',
			endPublish: '',
			startComment: '',
			endComment: '',
			state: [],
            agency: [],
            typeAll: true,
            typeFinal: false,
            typeDraft: false,
            typeOther: false,
			needsComments: false,
			needsDocument: false,
            limit: searcherState.limit,
            offset: searcherState.offset // definitely need to keep these
		};
    },

    // Date parsing with hyphens forces current timezone, whereas alternate separators like / result in using utc/gmt which means a correct year/month/date item
    // whereas hyphens cause you to potentially be off by an entire day
    // everything after the actual 10-character Date e.g. T07:00:00.000Z breaks everything and has to be stripped off
    getCorrectDate(sDate){
        let oddity = sDate.replace(/-/g,'/').substr(0, 10);
        return new Date(oddity);
    },
    
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    },

    validPassword(pass) {
        let passwordPattern = /[ -~]/;
        return  ( pass && passwordPattern.test(pass) && pass.length >= 4 && pass.length <= 50 );
    },

    colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray",
        '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray",
        '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray",
        '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray",
        '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray"
    ],

    getErrorMessage(error) {
        let message = "Sorry, the server encountered an unexpected error.";

        if(error && error.response && error.response.status){

            const _status = error.response.status;

            if(_status === 400) {
                message = "400 Bad request";
            }
            else if(_status === 401) {
                message = "401 Unauthorized";
            }
            else if(_status === 403) {
                message = "Please log in again (user session may have expired).";
            }
            else if(_status === 404) {
                message = "404 Not Found";
            }
            else if(_status === 408) {
                message = "408 Request Timed Out";
            }
        } else {
            message = "Server appears to be down right now, please try again later."
        }

        return message;
    },

    errorMessage: {
        default: "Server may be updating, please try again in a minute.",
        auth: "Please log in again (auth token expires every 10 days).",
    },

    // note on fixing delimiters for multiple values:
    // regex for fixing space-only delimited: find ([\s][A-Z]{2}) ([A-Z]{2}[\s]) replacing with ($1);($2) 
    // repeatedly until 0 occurrences replaced. 
    // then replace " - " with ";".
    // then we can standardize everything by turning ',' into ';' and turning ';[ ]*' into just ';' to remove every single useless space

    agencies: [	{ value: 'ACHP', label: 'Advisory Council on Historic Preservation (ACHP)' },{ value: 'USAID', label: 'Agency for International Development (USAID)' },{ value: 'ARS', label: 'Agriculture Research Service (ARS)' },{ value: 'APHIS', label: 'Animal and Plant Health Inspection Service (APHIS)' },{ value: 'AFRH', label: 'Armed Forces Retirement Home (AFRH)' },{ value: 'BPA', label: 'Bonneville Power Administration (BPA)' },{ value: 'BIA', label: 'Bureau of Indian Affairs (BIA)' },{ value: 'BLM', label: 'Bureau of Land Management (BLM)' },{ value: 'USBM', label: 'Bureau of Mines (USBM)' },{ value: 'BOEM', label: 'Bureau of Ocean Energy Management (BOEM)' },{ value: 'BOP', label: 'Bureau of Prisons (BOP)' },{ value: 'BR', label: 'Bureau of Reclamation (BR)' },{ value: 'Caltrans', label: 'California Department of Transportation (Caltrans)' },{ value: 'CHSRA', label: 'California High-Speed Rail Authority (CHSRA)' },{ value: 'CIA', label: 'Central Intelligence Agency (CIA)' },{ value: 'NYCOMB', label: 'City of New York, Office of Management and Budget (NYCOMB)' },{ value: 'CDBG', label: 'Community Development Block Grant (CDBG)' },{ value: 'CTDOH', label: 'Connecticut Department of Housing (CTDOH)' },{ value: 'BRAC', label: 'Defense Base Closure and Realignment Commission (BRAC)' },{ value: 'DLA', label: 'Defense Logistics Agency (DLA)' },{ value: 'DNA', label: 'Defense Nuclear Agency (DNA)' },{ value: 'DNFSB', label: 'Defense Nuclear Fac. Safety Board (DNFSB)' },{ value: 'DSA', label: 'Defense Supply Agency (DSA)' },{ value: 'DRB', label: 'Delaware River Basin Commission (DRB)' },{ value: 'DC', label: 'Denali Commission (DC)' },{ value: 'USDA', label: 'Department of Agriculture (USDA)' },{ value: 'DOC', label: 'Department of Commerce (DOC)' },{ value: 'DOD', label: 'Department of Defense (DOD)' },{ value: 'DOE', label: 'Department of Energy (DOE)' },{ value: 'HHS', label: 'Department of Health and Human Services (HHS)' },{ value: 'DHS', label: 'Department of Homeland Security (DHS)' },{ value: 'HUD', label: 'Department of Housing and Urban Development (HUD)' },{ value: 'DOJ', label: 'Department of Justice (DOJ)' },{ value: 'DOL', label: 'Department of Labor (DOL)' },{ value: 'DOS', label: 'Department of State (DOS)' },{ value: 'DOT', label: 'Department of Transportation (DOT)' },{ value: 'TREAS', label: 'Department of Treasury (TREAS)' },{ value: 'VA', label: 'Department of Veteran Affairs (VA)' },{ value: 'DOI', label: 'Department of the Interior (DOI)' },{ value: 'DEA', label: 'Drug Enforcement Administration (DEA)' },{ value: 'EDA', label: 'Economic Development Administration (EDA)' },{ value: 'ERA', label: 'Energy Regulatory Administration (ERA)' },{ value: 'ERDA', label: 'Energy Research and Development Administration (ERDA)' },{ value: 'EPA', label: 'Environmental Protection Agency (EPA)' },{ value: 'FSA', label: 'Farm Service Agency (FSA)' },{ value: 'FHA', label: 'Farmers Home Administration (FHA)' },{ value: 'FAA', label: 'Federal Aviation Administration (FAA)' },{ value: 'FCC', label: 'Federal Communications Commission (FCC)' },{ value: 'FEMA', label: 'Federal Emergency Management Agency (FEMA)' },{ value: 'FEA', label: 'Federal Energy Administration (FEA)' },{ value: 'FERC', label: 'Federal Energy Regulatory Commission (FERC)' },{ value: 'FHWA', label: 'Federal Highway Administration (FHWA)' },{ value: 'FMC', label: 'Federal Maritime Commission (FMC)' },{ value: 'FMSHRC', label: 'Federal Mine Safety and Health Review Commission (FMSHRC)' },{ value: 'FMCSA', label: 'Federal Motor Carrier Safety Administration (FMCSA)' },{ value: 'FPC', label: 'Federal Power Commission (FPC)' },{ value: 'FRA', label: 'Federal Railroad Administration (FRA)' },{ value: 'FRBSF', label: 'Federal Reserve Bank of San Francisco (FRBSF)' },{ value: 'FTA', label: 'Federal Transit Administration (FTA)' },{ value: 'USFWS', label: 'Fish and Wildlife Service (USFWS)' },{ value: 'FDOT', label: 'Florida Department of Transportation (FDOT)' },{ value: 'FDA', label: 'Food and Drug Administration (FDA)' },{ value: 'USFS', label: 'Forest Service (USFS)' },{ value: 'GSA', label: 'General Services Administration (GSA)' },{ value: 'USGS', label: 'Geological Survey (USGS)' },{ value: 'GLB', label: 'Great Lakes Basin Commission (GLB)' },{ value: 'IHS', label: 'Indian Health Service (IHS)' },{ value: 'IRS', label: 'Internal Revenue Service (IRS)' },{ value: 'IBWC', label: 'International Boundary and Water Commission (IBWC)' },{ value: 'ICC', label: 'Interstate Commerce Commission (ICC)' },{ value: 'JCS', label: 'Joint Chiefs of Staff (JCS)' },{ value: 'MARAD', label: 'Maritime Administration (MARAD)' },{ value: 'MTB', label: 'Materials Transportation Bureau (MTB)' },{ value: 'MSHA', label: 'Mine Safety and Health Administration (MSHA)' },{ value: 'MMS', label: 'Minerals Management Service (MMS)' },{ value: 'MESA', label: 'Mining Enforcement and Safety (MESA)' },{ value: 'MRB', label: 'Missouri River Basin Commission (MRB)' },{ value: 'NASA', label: 'National Aeronautics and Space Administration (NASA)' },{ value: 'NCPC', label: 'National Capital Planning Commission (NCPC)' },{ value: 'NGA', label: 'National Geospatial-Intelligence Agency (NGA)' },{ value: 'NHTSA', label: 'National Highway Traffic Safety Administration (NHTSA)' },{ value: 'NIGC', label: 'National Indian Gaming Commission (NIGC)' },{ value: 'NIH', label: 'National Institute of Health (NIH)' },{ value: 'NMFS', label: 'National Marine Fisheries Service (NMFS)' },{ value: 'NNSA', label: 'National Nuclear Security Administration (NNSA)' },{ value: 'NOAA', label: 'National Oceanic and Atmospheric Administration (NOAA)' },{ value: 'NPS', label: 'National Park Service (NPS)' },{ value: 'NSF', label: 'National Science Foundation (NSF)' },{ value: 'NSA', label: 'National Security Agency (NSA)' },{ value: 'NTSB', label: 'National Transportation Safety Board (NTSB)' },{ value: 'NRCS', label: 'Natural Resource Conservation Service (NRCS)' },{ value: 'NER', label: 'New England River Basin Commission (NER)' },{ value: 'NJDEP', label: 'New Jersey Department of Environmental Protection (NJDEP)' },{ value: 'NRC', label: 'Nuclear Regulatory Commission (NRC)' },{ value: 'OCR', label: 'Office of Coal Research (OCR)' },{ value: 'OSM', label: 'Office of Surface Mining (OSM)' },{ value: 'OBR', label: 'Ohio River Basin Commission (OBR)' },{ value: 'RSPA', label: 'Research and Special Programs (RSPA)' },{ value: 'REA', label: 'Rural Electrification Administration (REA)' },{ value: 'RUS', label: 'Rural Utilities Service (RUS)' },{ value: 'SEC', label: 'Security and Exchange Commission (SEC)' },{ value: 'SBA', label: 'Small Business Administration (SBA)' },{ value: 'SCS', label: 'Soil Conservation Service (SCS)' },{ value: 'SRB', label: 'Souris-Red-Rainy River Basin Commission (SRB)' },{ value: 'STB', label: 'Surface Transportation Board (STB)' },{ value: 'SRC', label: 'Susquehanna River Basin Commission (SRC)' },{ value: 'TVA', label: 'Tennessee Valley Authority (TVA)' },{ value: 'TxDOT', label: 'Texas Department of Transportation (TxDOT)' },{ value: 'TPT', label: 'The Presidio Trust (TPT)' },{ value: 'TDA', label: 'Trade and Development Agency (TDA)' },{ value: 'USACE', label: 'U.S. Army Corps of Engineers (USACE)' },{ value: 'USCG', label: 'U.S. Coast Guard (USCG)' },{ value: 'CBP', label: 'U.S. Customs and Border Protection (CBP)' },{ value: 'RRB', label: 'U.S. Railroad Retirement Board (RRB)' },{ value: 'USAF', label: 'United States Air Force (USAF)' },{ value: 'USA', label: 'United States Army (USA)' },{ value: 'USMC', label: 'United States Marine Corps (USMC)' },{ value: 'USN', label: 'United States Navy (USN)' },{ value: 'USPS', label: 'United States Postal Service (USPS)' },{ value: 'USTR', label: 'United States Trade Representative (USTR)' },{ value: 'UMR', label: 'Upper Mississippi Basin Commission (UMR)' },{ value: 'UMTA', label: 'Urban Mass Transportation Administration (UMTA)' },{ value: 'UDOT', label: 'Utah Department of Transportation (UDOT)' },{ value: 'WAPA', label: 'Western Area Power Administration (WAPA)' }
    ],

    /** New water bodies:
        // Great Lakes
        // Gulf of Mexico
        // Caribbean Sea
        // Pacific Ocean
        // Atlantic Ocean
        // Indian Ocean
        // Mediterranean Sea
        // Philippine Sea
        
        
        // New land bodies:
        // Commonwealth of the Northern Mariana Islands (CNMI)
        // U.S. Pacific Remote Island Areas (PRIA)
        // Canada
        // Mexico
        // Caribbean States */
    locations: [ { value: 'AK', label: 'Alaska' },{ value: 'AL', label: 'Alabama' },{ value: 'AQ', label: 'Antarctica' },{ value: 'AR', label: 'Arkansas' },{ value: 'AS', label: 'American Samoa' },{ value: 'AZ', label: 'Arizona' },{ value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },{ value: 'CT', label: 'Connecticut' },{ value: 'DC', label: 'District of Columbia' },{ value: 'DE', label: 'Delaware' },{ value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },{ value: 'GU', label: 'Guam' },{ value: 'HI', label: 'Hawaii' },{ value: 'IA', label: 'Iowa' },{ value: 'ID', label: 'Idaho' },{ value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'KS', label: 'Kansas' },{ value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },{ value: 'MA', label: 'Massachusetts' },{ value: 'MD', label: 'Maryland' },{ value: 'ME', label: 'Maine' },{ value: 'MI', label: 'Michigan' },{ value: 'MN', label: 'Minnesota' },{ value: 'MO', label: 'Missouri' },{ value: 'MS', label: 'Mississippi' },{ value: 'MT', label: 'Montana' },{ value: 'Multi', label: 'Multiple' },{ value: 'National', label: 'National' },{ value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },{ value: 'NE', label: 'Nebraska' },{ value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },{ value: 'NM', label: 'New Mexico' },{ value: 'NV', label: 'Nevada' },{ value: 'NY', label: 'New York' },{ value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },{ value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },{ value: 'PRO', label: 'Programmatic' },{ value: 'PR', label: 'Puerto Rico' },{ value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },{ value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },{ value: 'TT', label: 'Trust Territory of the Pacific Islands' },{ value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },{ value: 'VA', label: 'Virginia' },{ value: 'VI', label: 'Virgin Islands' },{ value: 'VT', label: 'Vermont' },{ value: 'WA', label: 'Washington' },{ value: 'WI', label: 'Wisconsin' },{ value: 'WV', label: 'West Virginia' },
        { value: 'WY', label: 'Wyoming' }
        ,{ value: 'Great Lakes', label: 'Great Lakes' }
        ,{ value: 'Gulf of Mexico', label: 'Gulf of Mexico' }
        ,{ value: 'Caribbean Sea', label: 'Caribbean Sea' }
        ,{ value: 'Pacific Ocean', label: 'Pacific Ocean' }
        ,{ value: 'Atlantic Ocean', label: 'Atlantic Ocean' }
        ,{ value: 'Indian Ocean', label: 'Indian Ocean' }
        ,{ value: 'Mediterranean Sea', label: 'Mediterranean Sea' }
        ,{ value: 'Philippine Sea', label: 'Philippine Sea' }
        ,{ value: 'Commonwealth of the Northern Mariana Islands', label: 'Commonwealth of the Northern Mariana Islands' }
        ,{ value: 'U.S. Pacific Remote Island Areas', label: 'U.S. Pacific Remote Island Areas' }
        ,{ value: 'Canada', label: 'Canada' }
        ,{ value: 'Mexico', label: 'Mexico' }
        ,{ value: 'Caribbean States', label: 'Caribbean States' }
    ],

    /** given a list of ;-delimited states in a string, return those delimited items which are NOT in this.locations.
    /* Presumably this list can then be used to bulk change unwanted items, or add wanted items to this.locations */
    locationTester: (states) => {
        let locationValues = this.locations.map(location => {
            return location.value;
        })
        let theSet = new Set();
        let garbage = new Set();

        states.forEach(state => {
            let innerStates = state.split(";");
            innerStates.forEach(innerState => {
                theSet.add(innerState);
            });
        }, () => {
            theSet.forEach(value => {
                if(!(value in locationValues)) {
                    garbage.add(value);
                }
            })
        });

        return garbage;
    },

    /** format incoming json data as tab-separated values to prep .tsv download, without double quotes.  
     * Undefined behavior if data has tabs in it already. */
    jsonToTSV: (data) => {
        const items = data;
        // const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        const tsv = [
        header.join('\t'), // header row first
        // JSON.stringify results in 1. double quotes around all fields and 2. some weird unnecessary escaping
        // (this isn't inherently a problem, but easily confuses Excel)
        // ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join('\t'))
        ...items.map(row => header.map(fieldName => (row[fieldName])).join('\t'))
        ].join('\r\n')
        
        return tsv;
    },

    isFinalType: (type) => {
        let result = false;
        if(type && finalTypeLabelsLower.indexOf(type.toLowerCase()) >= 0) {
            result = true;
        }

        return result;
    },

    isDraftType: (type) => {
        let result = false;
        if(type && draftTypeLabelsLower.indexOf(type.toLowerCase()) >= 0) {
            result = true;
        }

        return result;
    },

    doFilter: (searcherState, searchResults, preFilterCount, legacyStyle) => {

        let filtered = {isFiltered: false, textToUse: "", filteredResults: []};
        
        let isFiltered = false;

        // Deep clone results
        let filteredResults = JSON.parse(JSON.stringify(searchResults));
        
        if(searcherState.agency && searcherState.agency.length > 0){
            isFiltered = true;
            filteredResults = filteredResults.filter(matchesArray("agency", searcherState.agency));
        }
        if(searcherState.cooperatingAgency && searcherState.cooperatingAgency.length > 0){
            isFiltered = true;
            if(legacyStyle) {
                filteredResults = filteredResults.filter(arrayMatchesArrayNotSpacedOld("cooperatingAgency", searcherState.cooperatingAgency));
            } else {
                filteredResults = filteredResults.filter(arrayMatchesArrayNotSpaced("cooperatingAgency", searcherState.cooperatingAgency));
            }
        }
        if(searcherState.state && searcherState.state.length > 0){
            isFiltered = true;
            filteredResults = filteredResults.filter(arrayMatchesArray("state", searcherState.state));
        }
        if(searcherState.startPublish){
            isFiltered = true;
            let formattedDate = Globals.formatDate(searcherState.startPublish);
            if(legacyStyle) {
                filteredResults = filteredResults.filter(matchesStartDateOld(formattedDate));
            } else {
                filteredResults = filteredResults.filter(matchesStartDate(formattedDate));
            }
        }
        if(searcherState.endPublish){
            isFiltered = true;
            let formattedDate = Globals.formatDate(searcherState.endPublish);
            if(legacyStyle) {
                filteredResults = filteredResults.filter(matchesEndDateOld(formattedDate));
            } else {
                filteredResults = filteredResults.filter(matchesEndDate(formattedDate));
            }
        }
        if(searcherState.typeFinal || searcherState.typeDraft || searcherState.typeEA 
            || searcherState.typeNOI || searcherState.typeROD || searcherState.typeScoping){
            isFiltered = true;
            if(legacyStyle) {
                filteredResults = filteredResults.filter(matchesTypeOld(
                    searcherState.typeFinal, 
                    searcherState.typeDraft,
                    searcherState.typeEA,
                    searcherState.typeNOI,
                    searcherState.typeROD,
                    searcherState.typeScoping));
            } else {
                filteredResults = filteredResults.filter(matchesType(
                    searcherState.typeFinal, 
                    searcherState.typeDraft,
                    searcherState.typeEA,
                    searcherState.typeNOI,
                    searcherState.typeROD,
                    searcherState.typeScoping));
            }
        }
        if(searcherState.needsDocument) {
            isFiltered = true;
            if(legacyStyle) {
                filteredResults = filteredResults.filter(hasDocumentOld)
            } else {
                filteredResults = filteredResults.filter(hasDocument)
            }
        }
        
        let textToUse = filteredResults.length + " Results"; // unfiltered: "Results"
        if(filteredResults.length === 1) {
            textToUse = filteredResults.length + " Result";
        }
        if(isFiltered) { // filtered: "Matches"
            textToUse = filteredResults.length + " Matches (narrowed down from " + preFilterCount + " Results)";
            if(filteredResults.length === 1) {
                textToUse = filteredResults.length + " Match (narrowed down from " + preFilterCount + " Results)";
                if(preFilterCount === 1) {
                    textToUse = filteredResults.length + " Match (narrowed down from " + preFilterCount + " Result)";
                }
            }
        }

        filtered.textToUse = textToUse;
        filtered.filteredResults = filteredResults;
        filtered.isFiltered = isFiltered;

        return filtered;
    },
    /** Settings for multiple admin tables */
    tabulatorOptions: { 
        selectable:true,                   // true===multiselect (1 for single select)
        layoutColumnsOnNewData:true,
        tooltips:true,
        // responsiveLayout:"collapse",    // specifying this at all enables responsive layout (deals with horizontal overflow)
        // responsiveLayoutCollapseUseFormatters:false,
        pagination:"local",
        paginationSize:10,
        paginationSizeSelector:[10, 25, 50, 100], 
        movableColumns:true,
        resizableRows:true,
        resizableColumns:true,
        layout:"fitColumns",
        invalidOptionWarnings:false,       // spams pointless warnings without this
        // http://tabulator.info/docs/4.9/callbacks#column 
        columnResized:function(col) {
            // col.updateDefinition({width:col._column.width}); // needed if widths not all explicitly defined
            col._column.table.redraw(); // important for dynamic columns, prevents vertical scrollbar
        },
        // columnVisibilityChanged:function(col,vis){
        //     col.updateDefinition({visible:vis}); // needed if widths not all explicitly defined
        // },
    },
    anEnum: Object.freeze({"test":1, "test2":2, "test3":3})

    
}

    /** Filters */




    // Process oriented version of the hasDocument filter.
    const hasDocument = (item) => {
        let hasDocument = false;
        item.records.some(function(el) {
            if(el.size && el.size > 200) {
                hasDocument = true;
                return true;
            }
            return false;
        })
        return hasDocument;
    }
    const hasDocumentOld = (item) => {
        return (item.size && item.size > 200);
    }

    const matchesArray = (field, val) => {
        return function (a) {
            let returnValue = false;
            val.forEach(item =>{
                if (a[field] === item) {
                    returnValue = true;
                }
            });
            return returnValue;
        };
    }

    /** Special logic for ;-delimited states from Buomsoo, Alex/Natasha/... */
    const arrayMatchesArray = (field, val) => {
        return function (a) {
            // console.log(a);
            let returnValue = false;
            val.forEach(item =>{
                if(a[field]){
                    let _vals = a[field].split(/[;,]+/); // e.g. AK;AL or AK,AL
                    for(let i = 0; i < _vals.length; i++) {
                        if (_vals[i].trim() === item.trim()) {
                            returnValue = true; // if we hit ANY of them, then true
                        }
                    }
                }
            });
            return returnValue;
        };
    }


    /** Special logic for ; or , delimited cooperating agencies from Buomsoo */
    const arrayMatchesArrayNotSpaced = (field, val) => {
        return function (a) {
            // console.log(a);
            let returnValue = false;
            val.forEach(item =>{
                for(let i = 0; i < a.records.length; i++) {
                    if(a.records[i][field]){
                        let _vals = a.records[i][field].split(/[;,]+/); // AK;AL or AK, AL
                        for(let j = 0; j < _vals.length; j++) {
                            if (_vals[j].trim() === item.trim()) {
                                returnValue = true; // if we hit ANY of them, then true
                            }
                        }
                    }
                }
            });
            return returnValue;
        };
    }
    const arrayMatchesArrayNotSpacedOld = (field, val) => {
        return function (a) {
            let returnValue = false;
            val.forEach(item =>{
                if(a[field]){
                    let _vals = a[field].split(/[;,]+/); // AK;AL or AK, AL
                    for(let i = 0; i < _vals.length; i++) {
                        if (_vals[i].trim() === item.trim()) {
                            returnValue = true; // if we hit ANY of them, then true
                        }
                    }
                }
            });
            return returnValue;
        };
    }

    const matchesStartDate = (val) => {
        return function (a) {
            let returnValue = false;

            a.records.some(item => {
                // console.log(item.registerDate, val, item["registerDate"] >= val);
                if(item["registerDate"] >= val) {
                    returnValue = true;
                    return true;
                }
                return false;
            });
            
            return returnValue;
        };
    }
    const matchesEndDate = (val) => {
        return function (a) {
            let returnValue = false;

            a.records.some(item => {
                // console.log(item.registerDate, val, item["registerDate"] <= val);
                if(item["registerDate"] <= val) {
                    returnValue = true;
                    return true;
                }
                return false;
            });
            
            return returnValue;
        };
    }

    const matchesStartDateOld = (val) => {
        return function (a) {
            return (a["registerDate"] >= val);
        };
    }
    const matchesEndDateOld = (val) => {
        return function (a) {
            return (a["registerDate"] <= val); // should this be inclusive? <= or <
        };
    }
    /** Removes records that don't match */
    const matchesType = (matchFinal, matchDraft, matchEA, matchNOI, matchROD, matchScoping) => {
        return function (a) {
            // Keep list of indeces to splice afterward, to exclude them from filtered results.
            let recordsToSplice = [];
            let filterResult = false;
            for(let i = 0; i < a.records.length; i++) {
                let standingResult = false;
                const type = a.records[i].documentType.toLowerCase();
                if(matchFinal && Globals.isFinalType(type)) {
                    filterResult = true;
                    standingResult = true;
                }
                if(matchDraft && Globals.isDraftType(type)) {
                    filterResult = true;
                    standingResult = true;
                }
                if( ( (type === "ea") && matchEA ) || 
                    ( (type === "noi") && matchNOI ) || 
                    ( (type === "rod") && matchROD ) || 
                    ( (type === "scoping report") && matchScoping ))
                {
                    filterResult = true;
                    standingResult = true;
                }

                // No match for records[i]; mark it for deletion after loop is done
                // (splicing now would rearrange the array and break this loop logic)
                if(!standingResult) {
                    recordsToSplice.push(i);
                }
            }

            // Remove marked records from filtered results
            for(let i = recordsToSplice.length - 1; i >= 0; i--) {
                if (recordsToSplice[i] > -1) {
                    a.records.splice(recordsToSplice[i], 1);
                }
            }

            return filterResult;
        };
    }
    const matchesTypeOld = (matchFinal, matchDraft, matchEA, matchNOI, matchROD, matchScoping) => {
        return function (a) {
            return (
                (Globals.isFinalType(a["documentType"]) && matchFinal) || 
                (Globals.isDraftType(a["documentType"]) && matchDraft) || 
                ((
                    (a["documentType"] === "EA") 
                ) && matchEA) || 
                ((
                    (a["documentType"] === "NOI") 
                ) && matchNOI) || 
                ((
                    (a["documentType"] === "ROD") 
                ) && matchROD) || 
                ((
                    (a["documentType"] === "Scoping Report") 
                ) && matchScoping)
            );
        };
    }

export default Globals;