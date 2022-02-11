import axios from 'axios';

// const finalTypeLabels = ["Final",
//     "Second Final",
//     "Revised Final",
//     "Final Revised",
//     "Final Supplement",
//     "Final Supplemental",
//     "Second Final Supplemental",
//     "Third Final Supplemental"];
const finalTypeLabelsLower = ["final",
    "second final",
    "revised final",
    "final revised",
    "final supplement",
    "final supplemental",
    "second final supplemental",
    "third final supplemental"];
// const draftTypeLabels = ["Draft",
//     "Second Draft",
//     "Revised Draft",
//     "Draft Revised",
//     "Draft Supplement",
//     "Draft Supplemental",
//     "Second Draft Supplemental",
//     "Third Draft Supplemental"];
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
        localStorage.clear();
        axios.defaults.headers.common['Authorization'] = null;
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

    /** array of 3220 distinct counties where value is string= [county name] 
     * and label is string= [state abbreviation]: [county name] */
    counties: [
        {
            "value": "Aleutians East",
            "label": "AK: Aleutians East"
        },
        {
            "value": "Aleutians West",
            "label": "AK: Aleutians West"
        },
        {
            "value": "Anchorage",
            "label": "AK: Anchorage"
        },
        {
            "value": "Bethel",
            "label": "AK: Bethel"
        },
        {
            "value": "Bristol Bay",
            "label": "AK: Bristol Bay"
        },
        {
            "value": "Denali",
            "label": "AK: Denali"
        },
        {
            "value": "Dillingham",
            "label": "AK: Dillingham"
        },
        {
            "value": "Fairbanks North Star",
            "label": "AK: Fairbanks North Star"
        },
        {
            "value": "Haines",
            "label": "AK: Haines"
        },
        {
            "value": "Hoonah-Angoon",
            "label": "AK: Hoonah-Angoon"
        },
        {
            "value": "Juneau",
            "label": "AK: Juneau"
        },
        {
            "value": "Kenai Peninsula",
            "label": "AK: Kenai Peninsula"
        },
        {
            "value": "Ketchikan Gateway",
            "label": "AK: Ketchikan Gateway"
        },
        {
            "value": "Kodiak Island",
            "label": "AK: Kodiak Island"
        },
        {
            "value": "Kusilvak",
            "label": "AK: Kusilvak"
        },
        {
            "value": "Lake and Peninsula",
            "label": "AK: Lake and Peninsula"
        },
        {
            "value": "Matanuska-Susitna",
            "label": "AK: Matanuska-Susitna"
        },
        {
            "value": "Nome",
            "label": "AK: Nome"
        },
        {
            "value": "North Slope",
            "label": "AK: North Slope"
        },
        {
            "value": "Northwest Arctic",
            "label": "AK: Northwest Arctic"
        },
        {
            "value": "Petersburg",
            "label": "AK: Petersburg"
        },
        {
            "value": "Prince of Wales-Hyder",
            "label": "AK: Prince of Wales-Hyder"
        },
        {
            "value": "Sitka",
            "label": "AK: Sitka"
        },
        {
            "value": "Skagway",
            "label": "AK: Skagway"
        },
        {
            "value": "Southeast Fairbanks",
            "label": "AK: Southeast Fairbanks"
        },
        {
            "value": "Valdez-Cordova",
            "label": "AK: Valdez-Cordova"
        },
        {
            "value": "Wrangell",
            "label": "AK: Wrangell"
        },
        {
            "value": "Yakutat",
            "label": "AK: Yakutat"
        },
        {
            "value": "Yukon-Koyukuk",
            "label": "AK: Yukon-Koyukuk"
        },
        {
            "value": "Autauga",
            "label": "AL: Autauga"
        },
        {
            "value": "Baldwin",
            "label": "AL: Baldwin"
        },
        {
            "value": "Barbour",
            "label": "AL: Barbour"
        },
        {
            "value": "Bibb",
            "label": "AL: Bibb"
        },
        {
            "value": "Blount",
            "label": "AL: Blount"
        },
        {
            "value": "Bullock",
            "label": "AL: Bullock"
        },
        {
            "value": "Butler",
            "label": "AL: Butler"
        },
        {
            "value": "Calhoun",
            "label": "AL: Calhoun"
        },
        {
            "value": "Chambers",
            "label": "AL: Chambers"
        },
        {
            "value": "Cherokee",
            "label": "AL: Cherokee"
        },
        {
            "value": "Chilton",
            "label": "AL: Chilton"
        },
        {
            "value": "Choctaw",
            "label": "AL: Choctaw"
        },
        {
            "value": "Clarke",
            "label": "AL: Clarke"
        },
        {
            "value": "Clay",
            "label": "AL: Clay"
        },
        {
            "value": "Cleburne",
            "label": "AL: Cleburne"
        },
        {
            "value": "Coffee",
            "label": "AL: Coffee"
        },
        {
            "value": "Colbert",
            "label": "AL: Colbert"
        },
        {
            "value": "Conecuh",
            "label": "AL: Conecuh"
        },
        {
            "value": "Coosa",
            "label": "AL: Coosa"
        },
        {
            "value": "Covington",
            "label": "AL: Covington"
        },
        {
            "value": "Crenshaw",
            "label": "AL: Crenshaw"
        },
        {
            "value": "Cullman",
            "label": "AL: Cullman"
        },
        {
            "value": "Dale",
            "label": "AL: Dale"
        },
        {
            "value": "Dallas",
            "label": "AL: Dallas"
        },
        {
            "value": "DeKalb",
            "label": "AL: DeKalb"
        },
        {
            "value": "Elmore",
            "label": "AL: Elmore"
        },
        {
            "value": "Escambia",
            "label": "AL: Escambia"
        },
        {
            "value": "Etowah",
            "label": "AL: Etowah"
        },
        {
            "value": "Fayette",
            "label": "AL: Fayette"
        },
        {
            "value": "Franklin",
            "label": "AL: Franklin"
        },
        {
            "value": "Geneva",
            "label": "AL: Geneva"
        },
        {
            "value": "Greene",
            "label": "AL: Greene"
        },
        {
            "value": "Hale",
            "label": "AL: Hale"
        },
        {
            "value": "Henry",
            "label": "AL: Henry"
        },
        {
            "value": "Houston",
            "label": "AL: Houston"
        },
        {
            "value": "Jackson",
            "label": "AL: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "AL: Jefferson"
        },
        {
            "value": "Lamar",
            "label": "AL: Lamar"
        },
        {
            "value": "Lauderdale",
            "label": "AL: Lauderdale"
        },
        {
            "value": "Lawrence",
            "label": "AL: Lawrence"
        },
        {
            "value": "Lee",
            "label": "AL: Lee"
        },
        {
            "value": "Limestone",
            "label": "AL: Limestone"
        },
        {
            "value": "Lowndes",
            "label": "AL: Lowndes"
        },
        {
            "value": "Macon",
            "label": "AL: Macon"
        },
        {
            "value": "Madison",
            "label": "AL: Madison"
        },
        {
            "value": "Marengo",
            "label": "AL: Marengo"
        },
        {
            "value": "Marion",
            "label": "AL: Marion"
        },
        {
            "value": "Marshall",
            "label": "AL: Marshall"
        },
        {
            "value": "Mobile",
            "label": "AL: Mobile"
        },
        {
            "value": "Monroe",
            "label": "AL: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "AL: Montgomery"
        },
        {
            "value": "Morgan",
            "label": "AL: Morgan"
        },
        {
            "value": "Perry",
            "label": "AL: Perry"
        },
        {
            "value": "Pickens",
            "label": "AL: Pickens"
        },
        {
            "value": "Pike",
            "label": "AL: Pike"
        },
        {
            "value": "Randolph",
            "label": "AL: Randolph"
        },
        {
            "value": "Russell",
            "label": "AL: Russell"
        },
        {
            "value": "Shelby",
            "label": "AL: Shelby"
        },
        {
            "value": "St. Clair",
            "label": "AL: St. Clair"
        },
        {
            "value": "Sumter",
            "label": "AL: Sumter"
        },
        {
            "value": "Talladega",
            "label": "AL: Talladega"
        },
        {
            "value": "Tallapoosa",
            "label": "AL: Tallapoosa"
        },
        {
            "value": "Tuscaloosa",
            "label": "AL: Tuscaloosa"
        },
        {
            "value": "Walker",
            "label": "AL: Walker"
        },
        {
            "value": "Washington",
            "label": "AL: Washington"
        },
        {
            "value": "Wilcox",
            "label": "AL: Wilcox"
        },
        {
            "value": "Winston",
            "label": "AL: Winston"
        },
        {
            "value": "Arkansas",
            "label": "AR: Arkansas"
        },
        {
            "value": "Ashley",
            "label": "AR: Ashley"
        },
        {
            "value": "Baxter",
            "label": "AR: Baxter"
        },
        {
            "value": "Benton",
            "label": "AR: Benton"
        },
        {
            "value": "Boone",
            "label": "AR: Boone"
        },
        {
            "value": "Bradley",
            "label": "AR: Bradley"
        },
        {
            "value": "Calhoun",
            "label": "AR: Calhoun"
        },
        {
            "value": "Carroll",
            "label": "AR: Carroll"
        },
        {
            "value": "Chicot",
            "label": "AR: Chicot"
        },
        {
            "value": "Clark",
            "label": "AR: Clark"
        },
        {
            "value": "Clay",
            "label": "AR: Clay"
        },
        {
            "value": "Cleburne",
            "label": "AR: Cleburne"
        },
        {
            "value": "Cleveland",
            "label": "AR: Cleveland"
        },
        {
            "value": "Columbia",
            "label": "AR: Columbia"
        },
        {
            "value": "Conway",
            "label": "AR: Conway"
        },
        {
            "value": "Craighead",
            "label": "AR: Craighead"
        },
        {
            "value": "Crawford",
            "label": "AR: Crawford"
        },
        {
            "value": "Crittenden",
            "label": "AR: Crittenden"
        },
        {
            "value": "Cross",
            "label": "AR: Cross"
        },
        {
            "value": "Dallas",
            "label": "AR: Dallas"
        },
        {
            "value": "Desha",
            "label": "AR: Desha"
        },
        {
            "value": "Drew",
            "label": "AR: Drew"
        },
        {
            "value": "Faulkner",
            "label": "AR: Faulkner"
        },
        {
            "value": "Franklin",
            "label": "AR: Franklin"
        },
        {
            "value": "Fulton",
            "label": "AR: Fulton"
        },
        {
            "value": "Garland",
            "label": "AR: Garland"
        },
        {
            "value": "Grant",
            "label": "AR: Grant"
        },
        {
            "value": "Greene",
            "label": "AR: Greene"
        },
        {
            "value": "Hempstead",
            "label": "AR: Hempstead"
        },
        {
            "value": "Hot Spring",
            "label": "AR: Hot Spring"
        },
        {
            "value": "Howard",
            "label": "AR: Howard"
        },
        {
            "value": "Independence",
            "label": "AR: Independence"
        },
        {
            "value": "Izard",
            "label": "AR: Izard"
        },
        {
            "value": "Jackson",
            "label": "AR: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "AR: Jefferson"
        },
        {
            "value": "Johnson",
            "label": "AR: Johnson"
        },
        {
            "value": "Lafayette",
            "label": "AR: Lafayette"
        },
        {
            "value": "Lawrence",
            "label": "AR: Lawrence"
        },
        {
            "value": "Lee",
            "label": "AR: Lee"
        },
        {
            "value": "Lincoln",
            "label": "AR: Lincoln"
        },
        {
            "value": "Little River",
            "label": "AR: Little River"
        },
        {
            "value": "Logan",
            "label": "AR: Logan"
        },
        {
            "value": "Lonoke",
            "label": "AR: Lonoke"
        },
        {
            "value": "Madison",
            "label": "AR: Madison"
        },
        {
            "value": "Marion",
            "label": "AR: Marion"
        },
        {
            "value": "Miller",
            "label": "AR: Miller"
        },
        {
            "value": "Mississippi",
            "label": "AR: Mississippi"
        },
        {
            "value": "Monroe",
            "label": "AR: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "AR: Montgomery"
        },
        {
            "value": "Nevada",
            "label": "AR: Nevada"
        },
        {
            "value": "Newton",
            "label": "AR: Newton"
        },
        {
            "value": "Ouachita",
            "label": "AR: Ouachita"
        },
        {
            "value": "Perry",
            "label": "AR: Perry"
        },
        {
            "value": "Phillips",
            "label": "AR: Phillips"
        },
        {
            "value": "Pike",
            "label": "AR: Pike"
        },
        {
            "value": "Poinsett",
            "label": "AR: Poinsett"
        },
        {
            "value": "Polk",
            "label": "AR: Polk"
        },
        {
            "value": "Pope",
            "label": "AR: Pope"
        },
        {
            "value": "Prairie",
            "label": "AR: Prairie"
        },
        {
            "value": "Pulaski",
            "label": "AR: Pulaski"
        },
        {
            "value": "Randolph",
            "label": "AR: Randolph"
        },
        {
            "value": "Saline",
            "label": "AR: Saline"
        },
        {
            "value": "Scott",
            "label": "AR: Scott"
        },
        {
            "value": "Searcy",
            "label": "AR: Searcy"
        },
        {
            "value": "Sebastian",
            "label": "AR: Sebastian"
        },
        {
            "value": "Sevier",
            "label": "AR: Sevier"
        },
        {
            "value": "Sharp",
            "label": "AR: Sharp"
        },
        {
            "value": "St. Francis",
            "label": "AR: St. Francis"
        },
        {
            "value": "Stone",
            "label": "AR: Stone"
        },
        {
            "value": "Union",
            "label": "AR: Union"
        },
        {
            "value": "Van Buren",
            "label": "AR: Van Buren"
        },
        {
            "value": "Washington",
            "label": "AR: Washington"
        },
        {
            "value": "White",
            "label": "AR: White"
        },
        {
            "value": "Woodruff",
            "label": "AR: Woodruff"
        },
        {
            "value": "Yell",
            "label": "AR: Yell"
        },
        {
            "value": "Apache",
            "label": "AZ: Apache"
        },
        {
            "value": "Cochise",
            "label": "AZ: Cochise"
        },
        {
            "value": "Coconino",
            "label": "AZ: Coconino"
        },
        {
            "value": "Gila",
            "label": "AZ: Gila"
        },
        {
            "value": "Graham",
            "label": "AZ: Graham"
        },
        {
            "value": "Greenlee",
            "label": "AZ: Greenlee"
        },
        {
            "value": "La Paz",
            "label": "AZ: La Paz"
        },
        {
            "value": "Maricopa",
            "label": "AZ: Maricopa"
        },
        {
            "value": "Mohave",
            "label": "AZ: Mohave"
        },
        {
            "value": "Navajo",
            "label": "AZ: Navajo"
        },
        {
            "value": "Pima",
            "label": "AZ: Pima"
        },
        {
            "value": "Pinal",
            "label": "AZ: Pinal"
        },
        {
            "value": "Santa Cruz",
            "label": "AZ: Santa Cruz"
        },
        {
            "value": "Yavapai",
            "label": "AZ: Yavapai"
        },
        {
            "value": "Yuma",
            "label": "AZ: Yuma"
        },
        {
            "value": "Alameda",
            "label": "CA: Alameda"
        },
        {
            "value": "Alpine",
            "label": "CA: Alpine"
        },
        {
            "value": "Amador",
            "label": "CA: Amador"
        },
        {
            "value": "Butte",
            "label": "CA: Butte"
        },
        {
            "value": "Calaveras",
            "label": "CA: Calaveras"
        },
        {
            "value": "Colusa",
            "label": "CA: Colusa"
        },
        {
            "value": "Contra Costa",
            "label": "CA: Contra Costa"
        },
        {
            "value": "Del Norte",
            "label": "CA: Del Norte"
        },
        {
            "value": "El Dorado",
            "label": "CA: El Dorado"
        },
        {
            "value": "Fresno",
            "label": "CA: Fresno"
        },
        {
            "value": "Glenn",
            "label": "CA: Glenn"
        },
        {
            "value": "Humboldt",
            "label": "CA: Humboldt"
        },
        {
            "value": "Imperial",
            "label": "CA: Imperial"
        },
        {
            "value": "Inyo",
            "label": "CA: Inyo"
        },
        {
            "value": "Kern",
            "label": "CA: Kern"
        },
        {
            "value": "Kings",
            "label": "CA: Kings"
        },
        {
            "value": "Lake",
            "label": "CA: Lake"
        },
        {
            "value": "Lassen",
            "label": "CA: Lassen"
        },
        {
            "value": "Los Angeles",
            "label": "CA: Los Angeles"
        },
        {
            "value": "Madera",
            "label": "CA: Madera"
        },
        {
            "value": "Marin",
            "label": "CA: Marin"
        },
        {
            "value": "Mariposa",
            "label": "CA: Mariposa"
        },
        {
            "value": "Mendocino",
            "label": "CA: Mendocino"
        },
        {
            "value": "Merced",
            "label": "CA: Merced"
        },
        {
            "value": "Modoc",
            "label": "CA: Modoc"
        },
        {
            "value": "Mono",
            "label": "CA: Mono"
        },
        {
            "value": "Monterey",
            "label": "CA: Monterey"
        },
        {
            "value": "Napa",
            "label": "CA: Napa"
        },
        {
            "value": "Nevada",
            "label": "CA: Nevada"
        },
        {
            "value": "Orange",
            "label": "CA: Orange"
        },
        {
            "value": "Placer",
            "label": "CA: Placer"
        },
        {
            "value": "Plumas",
            "label": "CA: Plumas"
        },
        {
            "value": "Riverside",
            "label": "CA: Riverside"
        },
        {
            "value": "Sacramento",
            "label": "CA: Sacramento"
        },
        {
            "value": "San Benito",
            "label": "CA: San Benito"
        },
        {
            "value": "San Bernardino",
            "label": "CA: San Bernardino"
        },
        {
            "value": "San Diego",
            "label": "CA: San Diego"
        },
        {
            "value": "San Francisco",
            "label": "CA: San Francisco"
        },
        {
            "value": "San Joaquin",
            "label": "CA: San Joaquin"
        },
        {
            "value": "San Luis Obispo",
            "label": "CA: San Luis Obispo"
        },
        {
            "value": "San Mateo",
            "label": "CA: San Mateo"
        },
        {
            "value": "Santa Barbara",
            "label": "CA: Santa Barbara"
        },
        {
            "value": "Santa Clara",
            "label": "CA: Santa Clara"
        },
        {
            "value": "Santa Cruz",
            "label": "CA: Santa Cruz"
        },
        {
            "value": "Shasta",
            "label": "CA: Shasta"
        },
        {
            "value": "Sierra",
            "label": "CA: Sierra"
        },
        {
            "value": "Siskiyou",
            "label": "CA: Siskiyou"
        },
        {
            "value": "Solano",
            "label": "CA: Solano"
        },
        {
            "value": "Sonoma",
            "label": "CA: Sonoma"
        },
        {
            "value": "Stanislaus",
            "label": "CA: Stanislaus"
        },
        {
            "value": "Sutter",
            "label": "CA: Sutter"
        },
        {
            "value": "Tehama",
            "label": "CA: Tehama"
        },
        {
            "value": "Trinity",
            "label": "CA: Trinity"
        },
        {
            "value": "Tulare",
            "label": "CA: Tulare"
        },
        {
            "value": "Tuolumne",
            "label": "CA: Tuolumne"
        },
        {
            "value": "Ventura",
            "label": "CA: Ventura"
        },
        {
            "value": "Yolo",
            "label": "CA: Yolo"
        },
        {
            "value": "Yuba",
            "label": "CA: Yuba"
        },
        {
            "value": "Adams",
            "label": "CO: Adams"
        },
        {
            "value": "Alamosa",
            "label": "CO: Alamosa"
        },
        {
            "value": "Arapahoe",
            "label": "CO: Arapahoe"
        },
        {
            "value": "Archuleta",
            "label": "CO: Archuleta"
        },
        {
            "value": "Baca",
            "label": "CO: Baca"
        },
        {
            "value": "Bent",
            "label": "CO: Bent"
        },
        {
            "value": "Boulder",
            "label": "CO: Boulder"
        },
        {
            "value": "Broomfield",
            "label": "CO: Broomfield"
        },
        {
            "value": "Chaffee",
            "label": "CO: Chaffee"
        },
        {
            "value": "Cheyenne",
            "label": "CO: Cheyenne"
        },
        {
            "value": "Clear Creek",
            "label": "CO: Clear Creek"
        },
        {
            "value": "Conejos",
            "label": "CO: Conejos"
        },
        {
            "value": "Costilla",
            "label": "CO: Costilla"
        },
        {
            "value": "Crowley",
            "label": "CO: Crowley"
        },
        {
            "value": "Custer",
            "label": "CO: Custer"
        },
        {
            "value": "Delta",
            "label": "CO: Delta"
        },
        {
            "value": "Denver",
            "label": "CO: Denver"
        },
        {
            "value": "Dolores",
            "label": "CO: Dolores"
        },
        {
            "value": "Douglas",
            "label": "CO: Douglas"
        },
        {
            "value": "Eagle",
            "label": "CO: Eagle"
        },
        {
            "value": "El Paso",
            "label": "CO: El Paso"
        },
        {
            "value": "Elbert",
            "label": "CO: Elbert"
        },
        {
            "value": "Fremont",
            "label": "CO: Fremont"
        },
        {
            "value": "Garfield",
            "label": "CO: Garfield"
        },
        {
            "value": "Gilpin",
            "label": "CO: Gilpin"
        },
        {
            "value": "Grand",
            "label": "CO: Grand"
        },
        {
            "value": "Gunnison",
            "label": "CO: Gunnison"
        },
        {
            "value": "Hinsdale",
            "label": "CO: Hinsdale"
        },
        {
            "value": "Huerfano",
            "label": "CO: Huerfano"
        },
        {
            "value": "Jackson",
            "label": "CO: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "CO: Jefferson"
        },
        {
            "value": "Kiowa",
            "label": "CO: Kiowa"
        },
        {
            "value": "Kit Carson",
            "label": "CO: Kit Carson"
        },
        {
            "value": "La Plata",
            "label": "CO: La Plata"
        },
        {
            "value": "Lake",
            "label": "CO: Lake"
        },
        {
            "value": "Larimer",
            "label": "CO: Larimer"
        },
        {
            "value": "Las Animas",
            "label": "CO: Las Animas"
        },
        {
            "value": "Lincoln",
            "label": "CO: Lincoln"
        },
        {
            "value": "Logan",
            "label": "CO: Logan"
        },
        {
            "value": "Mesa",
            "label": "CO: Mesa"
        },
        {
            "value": "Mineral",
            "label": "CO: Mineral"
        },
        {
            "value": "Moffat",
            "label": "CO: Moffat"
        },
        {
            "value": "Montezuma",
            "label": "CO: Montezuma"
        },
        {
            "value": "Montrose",
            "label": "CO: Montrose"
        },
        {
            "value": "Morgan",
            "label": "CO: Morgan"
        },
        {
            "value": "Otero",
            "label": "CO: Otero"
        },
        {
            "value": "Ouray",
            "label": "CO: Ouray"
        },
        {
            "value": "Park",
            "label": "CO: Park"
        },
        {
            "value": "Phillips",
            "label": "CO: Phillips"
        },
        {
            "value": "Pitkin",
            "label": "CO: Pitkin"
        },
        {
            "value": "Prowers",
            "label": "CO: Prowers"
        },
        {
            "value": "Pueblo",
            "label": "CO: Pueblo"
        },
        {
            "value": "Rio Blanco",
            "label": "CO: Rio Blanco"
        },
        {
            "value": "Rio Grande",
            "label": "CO: Rio Grande"
        },
        {
            "value": "Routt",
            "label": "CO: Routt"
        },
        {
            "value": "Saguache",
            "label": "CO: Saguache"
        },
        {
            "value": "San Juan",
            "label": "CO: San Juan"
        },
        {
            "value": "San Miguel",
            "label": "CO: San Miguel"
        },
        {
            "value": "Sedgwick",
            "label": "CO: Sedgwick"
        },
        {
            "value": "Summit",
            "label": "CO: Summit"
        },
        {
            "value": "Teller",
            "label": "CO: Teller"
        },
        {
            "value": "Washington",
            "label": "CO: Washington"
        },
        {
            "value": "Weld",
            "label": "CO: Weld"
        },
        {
            "value": "Yuma",
            "label": "CO: Yuma"
        },
        {
            "value": "Fairfield",
            "label": "CT: Fairfield"
        },
        {
            "value": "Hartford",
            "label": "CT: Hartford"
        },
        {
            "value": "Litchfield",
            "label": "CT: Litchfield"
        },
        {
            "value": "Middlesex",
            "label": "CT: Middlesex"
        },
        {
            "value": "New Haven",
            "label": "CT: New Haven"
        },
        {
            "value": "New London",
            "label": "CT: New London"
        },
        {
            "value": "Tolland",
            "label": "CT: Tolland"
        },
        {
            "value": "Windham",
            "label": "CT: Windham"
        },
        {
            "value": "District of Columbia",
            "label": "DC: District of Columbia"
        },
        {
            "value": "Kent",
            "label": "DE: Kent"
        },
        {
            "value": "New Castle",
            "label": "DE: New Castle"
        },
        {
            "value": "Sussex",
            "label": "DE: Sussex"
        },
        {
            "value": "Alachua",
            "label": "FL: Alachua"
        },
        {
            "value": "Baker",
            "label": "FL: Baker"
        },
        {
            "value": "Bay",
            "label": "FL: Bay"
        },
        {
            "value": "Bradford",
            "label": "FL: Bradford"
        },
        {
            "value": "Brevard",
            "label": "FL: Brevard"
        },
        {
            "value": "Broward",
            "label": "FL: Broward"
        },
        {
            "value": "Calhoun",
            "label": "FL: Calhoun"
        },
        {
            "value": "Charlotte",
            "label": "FL: Charlotte"
        },
        {
            "value": "Citrus",
            "label": "FL: Citrus"
        },
        {
            "value": "Clay",
            "label": "FL: Clay"
        },
        {
            "value": "Collier",
            "label": "FL: Collier"
        },
        {
            "value": "Columbia",
            "label": "FL: Columbia"
        },
        {
            "value": "DeSoto",
            "label": "FL: DeSoto"
        },
        {
            "value": "Dixie",
            "label": "FL: Dixie"
        },
        {
            "value": "Duval",
            "label": "FL: Duval"
        },
        {
            "value": "Escambia",
            "label": "FL: Escambia"
        },
        {
            "value": "Flagler",
            "label": "FL: Flagler"
        },
        {
            "value": "Franklin",
            "label": "FL: Franklin"
        },
        {
            "value": "Gadsden",
            "label": "FL: Gadsden"
        },
        {
            "value": "Gilchrist",
            "label": "FL: Gilchrist"
        },
        {
            "value": "Glades",
            "label": "FL: Glades"
        },
        {
            "value": "Gulf",
            "label": "FL: Gulf"
        },
        {
            "value": "Hamilton",
            "label": "FL: Hamilton"
        },
        {
            "value": "Hardee",
            "label": "FL: Hardee"
        },
        {
            "value": "Hendry",
            "label": "FL: Hendry"
        },
        {
            "value": "Hernando",
            "label": "FL: Hernando"
        },
        {
            "value": "Highlands",
            "label": "FL: Highlands"
        },
        {
            "value": "Hillsborough",
            "label": "FL: Hillsborough"
        },
        {
            "value": "Holmes",
            "label": "FL: Holmes"
        },
        {
            "value": "Indian River",
            "label": "FL: Indian River"
        },
        {
            "value": "Jackson",
            "label": "FL: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "FL: Jefferson"
        },
        {
            "value": "Lafayette",
            "label": "FL: Lafayette"
        },
        {
            "value": "Lake",
            "label": "FL: Lake"
        },
        {
            "value": "Lee",
            "label": "FL: Lee"
        },
        {
            "value": "Leon",
            "label": "FL: Leon"
        },
        {
            "value": "Levy",
            "label": "FL: Levy"
        },
        {
            "value": "Liberty",
            "label": "FL: Liberty"
        },
        {
            "value": "Madison",
            "label": "FL: Madison"
        },
        {
            "value": "Manatee",
            "label": "FL: Manatee"
        },
        {
            "value": "Marion",
            "label": "FL: Marion"
        },
        {
            "value": "Martin",
            "label": "FL: Martin"
        },
        {
            "value": "Miami-Dade",
            "label": "FL: Miami-Dade"
        },
        {
            "value": "Monroe",
            "label": "FL: Monroe"
        },
        {
            "value": "Nassau",
            "label": "FL: Nassau"
        },
        {
            "value": "Okaloosa",
            "label": "FL: Okaloosa"
        },
        {
            "value": "Okeechobee",
            "label": "FL: Okeechobee"
        },
        {
            "value": "Orange",
            "label": "FL: Orange"
        },
        {
            "value": "Osceola",
            "label": "FL: Osceola"
        },
        {
            "value": "Palm Beach",
            "label": "FL: Palm Beach"
        },
        {
            "value": "Pasco",
            "label": "FL: Pasco"
        },
        {
            "value": "Pinellas",
            "label": "FL: Pinellas"
        },
        {
            "value": "Polk",
            "label": "FL: Polk"
        },
        {
            "value": "Putnam",
            "label": "FL: Putnam"
        },
        {
            "value": "Santa Rosa",
            "label": "FL: Santa Rosa"
        },
        {
            "value": "Sarasota",
            "label": "FL: Sarasota"
        },
        {
            "value": "Seminole",
            "label": "FL: Seminole"
        },
        {
            "value": "St. Johns",
            "label": "FL: St. Johns"
        },
        {
            "value": "St. Lucie",
            "label": "FL: St. Lucie"
        },
        {
            "value": "Sumter",
            "label": "FL: Sumter"
        },
        {
            "value": "Suwannee",
            "label": "FL: Suwannee"
        },
        {
            "value": "Taylor",
            "label": "FL: Taylor"
        },
        {
            "value": "Union",
            "label": "FL: Union"
        },
        {
            "value": "Volusia",
            "label": "FL: Volusia"
        },
        {
            "value": "Wakulla",
            "label": "FL: Wakulla"
        },
        {
            "value": "Walton",
            "label": "FL: Walton"
        },
        {
            "value": "Washington",
            "label": "FL: Washington"
        },
        {
            "value": "Appling",
            "label": "GA: Appling"
        },
        {
            "value": "Atkinson",
            "label": "GA: Atkinson"
        },
        {
            "value": "Bacon",
            "label": "GA: Bacon"
        },
        {
            "value": "Baker",
            "label": "GA: Baker"
        },
        {
            "value": "Baldwin",
            "label": "GA: Baldwin"
        },
        {
            "value": "Banks",
            "label": "GA: Banks"
        },
        {
            "value": "Barrow",
            "label": "GA: Barrow"
        },
        {
            "value": "Bartow",
            "label": "GA: Bartow"
        },
        {
            "value": "Ben Hill",
            "label": "GA: Ben Hill"
        },
        {
            "value": "Berrien",
            "label": "GA: Berrien"
        },
        {
            "value": "Bibb",
            "label": "GA: Bibb"
        },
        {
            "value": "Bleckley",
            "label": "GA: Bleckley"
        },
        {
            "value": "Brantley",
            "label": "GA: Brantley"
        },
        {
            "value": "Brooks",
            "label": "GA: Brooks"
        },
        {
            "value": "Bryan",
            "label": "GA: Bryan"
        },
        {
            "value": "Bulloch",
            "label": "GA: Bulloch"
        },
        {
            "value": "Burke",
            "label": "GA: Burke"
        },
        {
            "value": "Butts",
            "label": "GA: Butts"
        },
        {
            "value": "Calhoun",
            "label": "GA: Calhoun"
        },
        {
            "value": "Camden",
            "label": "GA: Camden"
        },
        {
            "value": "Candler",
            "label": "GA: Candler"
        },
        {
            "value": "Carroll",
            "label": "GA: Carroll"
        },
        {
            "value": "Catoosa",
            "label": "GA: Catoosa"
        },
        {
            "value": "Charlton",
            "label": "GA: Charlton"
        },
        {
            "value": "Chatham",
            "label": "GA: Chatham"
        },
        {
            "value": "Chattahoochee",
            "label": "GA: Chattahoochee"
        },
        {
            "value": "Chattooga",
            "label": "GA: Chattooga"
        },
        {
            "value": "Cherokee",
            "label": "GA: Cherokee"
        },
        {
            "value": "Clarke",
            "label": "GA: Clarke"
        },
        {
            "value": "Clay",
            "label": "GA: Clay"
        },
        {
            "value": "Clayton",
            "label": "GA: Clayton"
        },
        {
            "value": "Clinch",
            "label": "GA: Clinch"
        },
        {
            "value": "Cobb",
            "label": "GA: Cobb"
        },
        {
            "value": "Coffee",
            "label": "GA: Coffee"
        },
        {
            "value": "Colquitt",
            "label": "GA: Colquitt"
        },
        {
            "value": "Columbia",
            "label": "GA: Columbia"
        },
        {
            "value": "Cook",
            "label": "GA: Cook"
        },
        {
            "value": "Coweta",
            "label": "GA: Coweta"
        },
        {
            "value": "Crawford",
            "label": "GA: Crawford"
        },
        {
            "value": "Crisp",
            "label": "GA: Crisp"
        },
        {
            "value": "Dade",
            "label": "GA: Dade"
        },
        {
            "value": "Dawson",
            "label": "GA: Dawson"
        },
        {
            "value": "Decatur",
            "label": "GA: Decatur"
        },
        {
            "value": "DeKalb",
            "label": "GA: DeKalb"
        },
        {
            "value": "Dodge",
            "label": "GA: Dodge"
        },
        {
            "value": "Dooly",
            "label": "GA: Dooly"
        },
        {
            "value": "Dougherty",
            "label": "GA: Dougherty"
        },
        {
            "value": "Douglas",
            "label": "GA: Douglas"
        },
        {
            "value": "Early",
            "label": "GA: Early"
        },
        {
            "value": "Echols",
            "label": "GA: Echols"
        },
        {
            "value": "Effingham",
            "label": "GA: Effingham"
        },
        {
            "value": "Elbert",
            "label": "GA: Elbert"
        },
        {
            "value": "Emanuel",
            "label": "GA: Emanuel"
        },
        {
            "value": "Evans",
            "label": "GA: Evans"
        },
        {
            "value": "Fannin",
            "label": "GA: Fannin"
        },
        {
            "value": "Fayette",
            "label": "GA: Fayette"
        },
        {
            "value": "Floyd",
            "label": "GA: Floyd"
        },
        {
            "value": "Forsyth",
            "label": "GA: Forsyth"
        },
        {
            "value": "Franklin",
            "label": "GA: Franklin"
        },
        {
            "value": "Fulton",
            "label": "GA: Fulton"
        },
        {
            "value": "Gilmer",
            "label": "GA: Gilmer"
        },
        {
            "value": "Glascock",
            "label": "GA: Glascock"
        },
        {
            "value": "Glynn",
            "label": "GA: Glynn"
        },
        {
            "value": "Gordon",
            "label": "GA: Gordon"
        },
        {
            "value": "Grady",
            "label": "GA: Grady"
        },
        {
            "value": "Greene",
            "label": "GA: Greene"
        },
        {
            "value": "Gwinnett",
            "label": "GA: Gwinnett"
        },
        {
            "value": "Habersham",
            "label": "GA: Habersham"
        },
        {
            "value": "Hall",
            "label": "GA: Hall"
        },
        {
            "value": "Hancock",
            "label": "GA: Hancock"
        },
        {
            "value": "Haralson",
            "label": "GA: Haralson"
        },
        {
            "value": "Harris",
            "label": "GA: Harris"
        },
        {
            "value": "Hart",
            "label": "GA: Hart"
        },
        {
            "value": "Heard",
            "label": "GA: Heard"
        },
        {
            "value": "Henry",
            "label": "GA: Henry"
        },
        {
            "value": "Houston",
            "label": "GA: Houston"
        },
        {
            "value": "Irwin",
            "label": "GA: Irwin"
        },
        {
            "value": "Jackson",
            "label": "GA: Jackson"
        },
        {
            "value": "Jasper",
            "label": "GA: Jasper"
        },
        {
            "value": "Jeff Davis",
            "label": "GA: Jeff Davis"
        },
        {
            "value": "Jefferson",
            "label": "GA: Jefferson"
        },
        {
            "value": "Jenkins",
            "label": "GA: Jenkins"
        },
        {
            "value": "Johnson",
            "label": "GA: Johnson"
        },
        {
            "value": "Jones",
            "label": "GA: Jones"
        },
        {
            "value": "Lamar",
            "label": "GA: Lamar"
        },
        {
            "value": "Lanier",
            "label": "GA: Lanier"
        },
        {
            "value": "Laurens",
            "label": "GA: Laurens"
        },
        {
            "value": "Lee",
            "label": "GA: Lee"
        },
        {
            "value": "Liberty",
            "label": "GA: Liberty"
        },
        {
            "value": "Lincoln",
            "label": "GA: Lincoln"
        },
        {
            "value": "Long",
            "label": "GA: Long"
        },
        {
            "value": "Lowndes",
            "label": "GA: Lowndes"
        },
        {
            "value": "Lumpkin",
            "label": "GA: Lumpkin"
        },
        {
            "value": "Macon",
            "label": "GA: Macon"
        },
        {
            "value": "Madison",
            "label": "GA: Madison"
        },
        {
            "value": "Marion",
            "label": "GA: Marion"
        },
        {
            "value": "McDuffie",
            "label": "GA: McDuffie"
        },
        {
            "value": "McIntosh",
            "label": "GA: McIntosh"
        },
        {
            "value": "Meriwether",
            "label": "GA: Meriwether"
        },
        {
            "value": "Miller",
            "label": "GA: Miller"
        },
        {
            "value": "Mitchell",
            "label": "GA: Mitchell"
        },
        {
            "value": "Monroe",
            "label": "GA: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "GA: Montgomery"
        },
        {
            "value": "Morgan",
            "label": "GA: Morgan"
        },
        {
            "value": "Murray",
            "label": "GA: Murray"
        },
        {
            "value": "Muscogee",
            "label": "GA: Muscogee"
        },
        {
            "value": "Newton",
            "label": "GA: Newton"
        },
        {
            "value": "Oconee",
            "label": "GA: Oconee"
        },
        {
            "value": "Oglethorpe",
            "label": "GA: Oglethorpe"
        },
        {
            "value": "Paulding",
            "label": "GA: Paulding"
        },
        {
            "value": "Peach",
            "label": "GA: Peach"
        },
        {
            "value": "Pickens",
            "label": "GA: Pickens"
        },
        {
            "value": "Pierce",
            "label": "GA: Pierce"
        },
        {
            "value": "Pike",
            "label": "GA: Pike"
        },
        {
            "value": "Polk",
            "label": "GA: Polk"
        },
        {
            "value": "Pulaski",
            "label": "GA: Pulaski"
        },
        {
            "value": "Putnam",
            "label": "GA: Putnam"
        },
        {
            "value": "Quitman",
            "label": "GA: Quitman"
        },
        {
            "value": "Rabun",
            "label": "GA: Rabun"
        },
        {
            "value": "Randolph",
            "label": "GA: Randolph"
        },
        {
            "value": "Richmond",
            "label": "GA: Richmond"
        },
        {
            "value": "Rockdale",
            "label": "GA: Rockdale"
        },
        {
            "value": "Schley",
            "label": "GA: Schley"
        },
        {
            "value": "Screven",
            "label": "GA: Screven"
        },
        {
            "value": "Seminole",
            "label": "GA: Seminole"
        },
        {
            "value": "Spalding",
            "label": "GA: Spalding"
        },
        {
            "value": "Stephens",
            "label": "GA: Stephens"
        },
        {
            "value": "Stewart",
            "label": "GA: Stewart"
        },
        {
            "value": "Sumter",
            "label": "GA: Sumter"
        },
        {
            "value": "Talbot",
            "label": "GA: Talbot"
        },
        {
            "value": "Taliaferro",
            "label": "GA: Taliaferro"
        },
        {
            "value": "Tattnall",
            "label": "GA: Tattnall"
        },
        {
            "value": "Taylor",
            "label": "GA: Taylor"
        },
        {
            "value": "Telfair",
            "label": "GA: Telfair"
        },
        {
            "value": "Terrell",
            "label": "GA: Terrell"
        },
        {
            "value": "Thomas",
            "label": "GA: Thomas"
        },
        {
            "value": "Tift",
            "label": "GA: Tift"
        },
        {
            "value": "Toombs",
            "label": "GA: Toombs"
        },
        {
            "value": "Towns",
            "label": "GA: Towns"
        },
        {
            "value": "Treutlen",
            "label": "GA: Treutlen"
        },
        {
            "value": "Troup",
            "label": "GA: Troup"
        },
        {
            "value": "Turner",
            "label": "GA: Turner"
        },
        {
            "value": "Twiggs",
            "label": "GA: Twiggs"
        },
        {
            "value": "Union",
            "label": "GA: Union"
        },
        {
            "value": "Upson",
            "label": "GA: Upson"
        },
        {
            "value": "Walker",
            "label": "GA: Walker"
        },
        {
            "value": "Walton",
            "label": "GA: Walton"
        },
        {
            "value": "Ware",
            "label": "GA: Ware"
        },
        {
            "value": "Warren",
            "label": "GA: Warren"
        },
        {
            "value": "Washington",
            "label": "GA: Washington"
        },
        {
            "value": "Wayne",
            "label": "GA: Wayne"
        },
        {
            "value": "Webster",
            "label": "GA: Webster"
        },
        {
            "value": "Wheeler",
            "label": "GA: Wheeler"
        },
        {
            "value": "White",
            "label": "GA: White"
        },
        {
            "value": "Whitfield",
            "label": "GA: Whitfield"
        },
        {
            "value": "Wilcox",
            "label": "GA: Wilcox"
        },
        {
            "value": "Wilkes",
            "label": "GA: Wilkes"
        },
        {
            "value": "Wilkinson",
            "label": "GA: Wilkinson"
        },
        {
            "value": "Worth",
            "label": "GA: Worth"
        },
        {
            "value": "Hawaii",
            "label": "HI: Hawaii"
        },
        {
            "value": "Honolulu",
            "label": "HI: Honolulu"
        },
        {
            "value": "Kalawao",
            "label": "HI: Kalawao"
        },
        {
            "value": "Kauai",
            "label": "HI: Kauai"
        },
        {
            "value": "Maui",
            "label": "HI: Maui"
        },
        {
            "value": "Adair",
            "label": "IA: Adair"
        },
        {
            "value": "Adams",
            "label": "IA: Adams"
        },
        {
            "value": "Allamakee",
            "label": "IA: Allamakee"
        },
        {
            "value": "Appanoose",
            "label": "IA: Appanoose"
        },
        {
            "value": "Audubon",
            "label": "IA: Audubon"
        },
        {
            "value": "Benton",
            "label": "IA: Benton"
        },
        {
            "value": "Black Hawk",
            "label": "IA: Black Hawk"
        },
        {
            "value": "Boone",
            "label": "IA: Boone"
        },
        {
            "value": "Bremer",
            "label": "IA: Bremer"
        },
        {
            "value": "Buchanan",
            "label": "IA: Buchanan"
        },
        {
            "value": "Buena Vista",
            "label": "IA: Buena Vista"
        },
        {
            "value": "Butler",
            "label": "IA: Butler"
        },
        {
            "value": "Calhoun",
            "label": "IA: Calhoun"
        },
        {
            "value": "Carroll",
            "label": "IA: Carroll"
        },
        {
            "value": "Cass",
            "label": "IA: Cass"
        },
        {
            "value": "Cedar",
            "label": "IA: Cedar"
        },
        {
            "value": "Cerro Gordo",
            "label": "IA: Cerro Gordo"
        },
        {
            "value": "Cherokee",
            "label": "IA: Cherokee"
        },
        {
            "value": "Chickasaw",
            "label": "IA: Chickasaw"
        },
        {
            "value": "Clarke",
            "label": "IA: Clarke"
        },
        {
            "value": "Clay",
            "label": "IA: Clay"
        },
        {
            "value": "Clayton",
            "label": "IA: Clayton"
        },
        {
            "value": "Clinton",
            "label": "IA: Clinton"
        },
        {
            "value": "Crawford",
            "label": "IA: Crawford"
        },
        {
            "value": "Dallas",
            "label": "IA: Dallas"
        },
        {
            "value": "Davis",
            "label": "IA: Davis"
        },
        {
            "value": "Decatur",
            "label": "IA: Decatur"
        },
        {
            "value": "Delaware",
            "label": "IA: Delaware"
        },
        {
            "value": "Des Moines",
            "label": "IA: Des Moines"
        },
        {
            "value": "Dickinson",
            "label": "IA: Dickinson"
        },
        {
            "value": "Dubuque",
            "label": "IA: Dubuque"
        },
        {
            "value": "Emmet",
            "label": "IA: Emmet"
        },
        {
            "value": "Fayette",
            "label": "IA: Fayette"
        },
        {
            "value": "Floyd",
            "label": "IA: Floyd"
        },
        {
            "value": "Franklin",
            "label": "IA: Franklin"
        },
        {
            "value": "Fremont",
            "label": "IA: Fremont"
        },
        {
            "value": "Greene",
            "label": "IA: Greene"
        },
        {
            "value": "Grundy",
            "label": "IA: Grundy"
        },
        {
            "value": "Guthrie",
            "label": "IA: Guthrie"
        },
        {
            "value": "Hamilton",
            "label": "IA: Hamilton"
        },
        {
            "value": "Hancock",
            "label": "IA: Hancock"
        },
        {
            "value": "Hardin",
            "label": "IA: Hardin"
        },
        {
            "value": "Harrison",
            "label": "IA: Harrison"
        },
        {
            "value": "Henry",
            "label": "IA: Henry"
        },
        {
            "value": "Howard",
            "label": "IA: Howard"
        },
        {
            "value": "Humboldt",
            "label": "IA: Humboldt"
        },
        {
            "value": "Ida",
            "label": "IA: Ida"
        },
        {
            "value": "Iowa",
            "label": "IA: Iowa"
        },
        {
            "value": "Jackson",
            "label": "IA: Jackson"
        },
        {
            "value": "Jasper",
            "label": "IA: Jasper"
        },
        {
            "value": "Jefferson",
            "label": "IA: Jefferson"
        },
        {
            "value": "Johnson",
            "label": "IA: Johnson"
        },
        {
            "value": "Jones",
            "label": "IA: Jones"
        },
        {
            "value": "Keokuk",
            "label": "IA: Keokuk"
        },
        {
            "value": "Kossuth",
            "label": "IA: Kossuth"
        },
        {
            "value": "Lee",
            "label": "IA: Lee"
        },
        {
            "value": "Linn",
            "label": "IA: Linn"
        },
        {
            "value": "Louisa",
            "label": "IA: Louisa"
        },
        {
            "value": "Lucas",
            "label": "IA: Lucas"
        },
        {
            "value": "Lyon",
            "label": "IA: Lyon"
        },
        {
            "value": "Madison",
            "label": "IA: Madison"
        },
        {
            "value": "Mahaska",
            "label": "IA: Mahaska"
        },
        {
            "value": "Marion",
            "label": "IA: Marion"
        },
        {
            "value": "Marshall",
            "label": "IA: Marshall"
        },
        {
            "value": "Mills",
            "label": "IA: Mills"
        },
        {
            "value": "Mitchell",
            "label": "IA: Mitchell"
        },
        {
            "value": "Monona",
            "label": "IA: Monona"
        },
        {
            "value": "Monroe",
            "label": "IA: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "IA: Montgomery"
        },
        {
            "value": "Muscatine",
            "label": "IA: Muscatine"
        },
        {
            "value": "O'Brien",
            "label": "IA: O'Brien"
        },
        {
            "value": "Osceola",
            "label": "IA: Osceola"
        },
        {
            "value": "Page",
            "label": "IA: Page"
        },
        {
            "value": "Palo Alto",
            "label": "IA: Palo Alto"
        },
        {
            "value": "Plymouth",
            "label": "IA: Plymouth"
        },
        {
            "value": "Pocahontas",
            "label": "IA: Pocahontas"
        },
        {
            "value": "Polk",
            "label": "IA: Polk"
        },
        {
            "value": "Pottawattamie",
            "label": "IA: Pottawattamie"
        },
        {
            "value": "Poweshiek",
            "label": "IA: Poweshiek"
        },
        {
            "value": "Ringgold",
            "label": "IA: Ringgold"
        },
        {
            "value": "Sac",
            "label": "IA: Sac"
        },
        {
            "value": "Scott",
            "label": "IA: Scott"
        },
        {
            "value": "Shelby",
            "label": "IA: Shelby"
        },
        {
            "value": "Sioux",
            "label": "IA: Sioux"
        },
        {
            "value": "Story",
            "label": "IA: Story"
        },
        {
            "value": "Tama",
            "label": "IA: Tama"
        },
        {
            "value": "Taylor",
            "label": "IA: Taylor"
        },
        {
            "value": "Union",
            "label": "IA: Union"
        },
        {
            "value": "Van Buren",
            "label": "IA: Van Buren"
        },
        {
            "value": "Wapello",
            "label": "IA: Wapello"
        },
        {
            "value": "Warren",
            "label": "IA: Warren"
        },
        {
            "value": "Washington",
            "label": "IA: Washington"
        },
        {
            "value": "Wayne",
            "label": "IA: Wayne"
        },
        {
            "value": "Webster",
            "label": "IA: Webster"
        },
        {
            "value": "Winnebago",
            "label": "IA: Winnebago"
        },
        {
            "value": "Winneshiek",
            "label": "IA: Winneshiek"
        },
        {
            "value": "Woodbury",
            "label": "IA: Woodbury"
        },
        {
            "value": "Worth",
            "label": "IA: Worth"
        },
        {
            "value": "Wright",
            "label": "IA: Wright"
        },
        {
            "value": "Ada",
            "label": "ID: Ada"
        },
        {
            "value": "Adams",
            "label": "ID: Adams"
        },
        {
            "value": "Bannock",
            "label": "ID: Bannock"
        },
        {
            "value": "Bear Lake",
            "label": "ID: Bear Lake"
        },
        {
            "value": "Benewah",
            "label": "ID: Benewah"
        },
        {
            "value": "Bingham",
            "label": "ID: Bingham"
        },
        {
            "value": "Blaine",
            "label": "ID: Blaine"
        },
        {
            "value": "Boise",
            "label": "ID: Boise"
        },
        {
            "value": "Bonner",
            "label": "ID: Bonner"
        },
        {
            "value": "Bonneville",
            "label": "ID: Bonneville"
        },
        {
            "value": "Boundary",
            "label": "ID: Boundary"
        },
        {
            "value": "Butte",
            "label": "ID: Butte"
        },
        {
            "value": "Camas",
            "label": "ID: Camas"
        },
        {
            "value": "Canyon",
            "label": "ID: Canyon"
        },
        {
            "value": "Caribou",
            "label": "ID: Caribou"
        },
        {
            "value": "Cassia",
            "label": "ID: Cassia"
        },
        {
            "value": "Clark",
            "label": "ID: Clark"
        },
        {
            "value": "Clearwater",
            "label": "ID: Clearwater"
        },
        {
            "value": "Custer",
            "label": "ID: Custer"
        },
        {
            "value": "Elmore",
            "label": "ID: Elmore"
        },
        {
            "value": "Franklin",
            "label": "ID: Franklin"
        },
        {
            "value": "Fremont",
            "label": "ID: Fremont"
        },
        {
            "value": "Gem",
            "label": "ID: Gem"
        },
        {
            "value": "Gooding",
            "label": "ID: Gooding"
        },
        {
            "value": "Idaho",
            "label": "ID: Idaho"
        },
        {
            "value": "Jefferson",
            "label": "ID: Jefferson"
        },
        {
            "value": "Jerome",
            "label": "ID: Jerome"
        },
        {
            "value": "Kootenai",
            "label": "ID: Kootenai"
        },
        {
            "value": "Latah",
            "label": "ID: Latah"
        },
        {
            "value": "Lemhi",
            "label": "ID: Lemhi"
        },
        {
            "value": "Lewis",
            "label": "ID: Lewis"
        },
        {
            "value": "Lincoln",
            "label": "ID: Lincoln"
        },
        {
            "value": "Madison",
            "label": "ID: Madison"
        },
        {
            "value": "Minidoka",
            "label": "ID: Minidoka"
        },
        {
            "value": "Nez Perce",
            "label": "ID: Nez Perce"
        },
        {
            "value": "Oneida",
            "label": "ID: Oneida"
        },
        {
            "value": "Owyhee",
            "label": "ID: Owyhee"
        },
        {
            "value": "Payette",
            "label": "ID: Payette"
        },
        {
            "value": "Power",
            "label": "ID: Power"
        },
        {
            "value": "Shoshone",
            "label": "ID: Shoshone"
        },
        {
            "value": "Teton",
            "label": "ID: Teton"
        },
        {
            "value": "Twin Falls",
            "label": "ID: Twin Falls"
        },
        {
            "value": "Valley",
            "label": "ID: Valley"
        },
        {
            "value": "Washington",
            "label": "ID: Washington"
        },
        {
            "value": "Adams",
            "label": "IL: Adams"
        },
        {
            "value": "Alexander",
            "label": "IL: Alexander"
        },
        {
            "value": "Bond",
            "label": "IL: Bond"
        },
        {
            "value": "Boone",
            "label": "IL: Boone"
        },
        {
            "value": "Brown",
            "label": "IL: Brown"
        },
        {
            "value": "Bureau",
            "label": "IL: Bureau"
        },
        {
            "value": "Calhoun",
            "label": "IL: Calhoun"
        },
        {
            "value": "Carroll",
            "label": "IL: Carroll"
        },
        {
            "value": "Cass",
            "label": "IL: Cass"
        },
        {
            "value": "Champaign",
            "label": "IL: Champaign"
        },
        {
            "value": "Christian",
            "label": "IL: Christian"
        },
        {
            "value": "Clark",
            "label": "IL: Clark"
        },
        {
            "value": "Clay",
            "label": "IL: Clay"
        },
        {
            "value": "Clinton",
            "label": "IL: Clinton"
        },
        {
            "value": "Coles",
            "label": "IL: Coles"
        },
        {
            "value": "Cook",
            "label": "IL: Cook"
        },
        {
            "value": "Crawford",
            "label": "IL: Crawford"
        },
        {
            "value": "Cumberland",
            "label": "IL: Cumberland"
        },
        {
            "value": "De Witt",
            "label": "IL: De Witt"
        },
        {
            "value": "DeKalb",
            "label": "IL: DeKalb"
        },
        {
            "value": "Douglas",
            "label": "IL: Douglas"
        },
        {
            "value": "DuPage",
            "label": "IL: DuPage"
        },
        {
            "value": "Edgar",
            "label": "IL: Edgar"
        },
        {
            "value": "Edwards",
            "label": "IL: Edwards"
        },
        {
            "value": "Effingham",
            "label": "IL: Effingham"
        },
        {
            "value": "Fayette",
            "label": "IL: Fayette"
        },
        {
            "value": "Ford",
            "label": "IL: Ford"
        },
        {
            "value": "Franklin",
            "label": "IL: Franklin"
        },
        {
            "value": "Fulton",
            "label": "IL: Fulton"
        },
        {
            "value": "Gallatin",
            "label": "IL: Gallatin"
        },
        {
            "value": "Greene",
            "label": "IL: Greene"
        },
        {
            "value": "Grundy",
            "label": "IL: Grundy"
        },
        {
            "value": "Hamilton",
            "label": "IL: Hamilton"
        },
        {
            "value": "Hancock",
            "label": "IL: Hancock"
        },
        {
            "value": "Hardin",
            "label": "IL: Hardin"
        },
        {
            "value": "Henderson",
            "label": "IL: Henderson"
        },
        {
            "value": "Henry",
            "label": "IL: Henry"
        },
        {
            "value": "Iroquois",
            "label": "IL: Iroquois"
        },
        {
            "value": "Jackson",
            "label": "IL: Jackson"
        },
        {
            "value": "Jasper",
            "label": "IL: Jasper"
        },
        {
            "value": "Jefferson",
            "label": "IL: Jefferson"
        },
        {
            "value": "Jersey",
            "label": "IL: Jersey"
        },
        {
            "value": "Jo Daviess",
            "label": "IL: Jo Daviess"
        },
        {
            "value": "Johnson",
            "label": "IL: Johnson"
        },
        {
            "value": "Kane",
            "label": "IL: Kane"
        },
        {
            "value": "Kankakee",
            "label": "IL: Kankakee"
        },
        {
            "value": "Kendall",
            "label": "IL: Kendall"
        },
        {
            "value": "Knox",
            "label": "IL: Knox"
        },
        {
            "value": "Lake",
            "label": "IL: Lake"
        },
        {
            "value": "LaSalle",
            "label": "IL: LaSalle"
        },
        {
            "value": "Lawrence",
            "label": "IL: Lawrence"
        },
        {
            "value": "Lee",
            "label": "IL: Lee"
        },
        {
            "value": "Livingston",
            "label": "IL: Livingston"
        },
        {
            "value": "Logan",
            "label": "IL: Logan"
        },
        {
            "value": "Macon",
            "label": "IL: Macon"
        },
        {
            "value": "Macoupin",
            "label": "IL: Macoupin"
        },
        {
            "value": "Madison",
            "label": "IL: Madison"
        },
        {
            "value": "Marion",
            "label": "IL: Marion"
        },
        {
            "value": "Marshall",
            "label": "IL: Marshall"
        },
        {
            "value": "Mason",
            "label": "IL: Mason"
        },
        {
            "value": "Massac",
            "label": "IL: Massac"
        },
        {
            "value": "McDonough",
            "label": "IL: McDonough"
        },
        {
            "value": "McHenry",
            "label": "IL: McHenry"
        },
        {
            "value": "McLean",
            "label": "IL: McLean"
        },
        {
            "value": "Menard",
            "label": "IL: Menard"
        },
        {
            "value": "Mercer",
            "label": "IL: Mercer"
        },
        {
            "value": "Monroe",
            "label": "IL: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "IL: Montgomery"
        },
        {
            "value": "Morgan",
            "label": "IL: Morgan"
        },
        {
            "value": "Moultrie",
            "label": "IL: Moultrie"
        },
        {
            "value": "Ogle",
            "label": "IL: Ogle"
        },
        {
            "value": "Peoria",
            "label": "IL: Peoria"
        },
        {
            "value": "Perry",
            "label": "IL: Perry"
        },
        {
            "value": "Piatt",
            "label": "IL: Piatt"
        },
        {
            "value": "Pike",
            "label": "IL: Pike"
        },
        {
            "value": "Pope",
            "label": "IL: Pope"
        },
        {
            "value": "Pulaski",
            "label": "IL: Pulaski"
        },
        {
            "value": "Putnam",
            "label": "IL: Putnam"
        },
        {
            "value": "Randolph",
            "label": "IL: Randolph"
        },
        {
            "value": "Richland",
            "label": "IL: Richland"
        },
        {
            "value": "Rock Island",
            "label": "IL: Rock Island"
        },
        {
            "value": "Saline",
            "label": "IL: Saline"
        },
        {
            "value": "Sangamon",
            "label": "IL: Sangamon"
        },
        {
            "value": "Schuyler",
            "label": "IL: Schuyler"
        },
        {
            "value": "Scott",
            "label": "IL: Scott"
        },
        {
            "value": "Shelby",
            "label": "IL: Shelby"
        },
        {
            "value": "St. Clair",
            "label": "IL: St. Clair"
        },
        {
            "value": "Stark",
            "label": "IL: Stark"
        },
        {
            "value": "Stephenson",
            "label": "IL: Stephenson"
        },
        {
            "value": "Tazewell",
            "label": "IL: Tazewell"
        },
        {
            "value": "Union",
            "label": "IL: Union"
        },
        {
            "value": "Vermilion",
            "label": "IL: Vermilion"
        },
        {
            "value": "Wabash",
            "label": "IL: Wabash"
        },
        {
            "value": "Warren",
            "label": "IL: Warren"
        },
        {
            "value": "Washington",
            "label": "IL: Washington"
        },
        {
            "value": "Wayne",
            "label": "IL: Wayne"
        },
        {
            "value": "White",
            "label": "IL: White"
        },
        {
            "value": "Whiteside",
            "label": "IL: Whiteside"
        },
        {
            "value": "Will",
            "label": "IL: Will"
        },
        {
            "value": "Williamson",
            "label": "IL: Williamson"
        },
        {
            "value": "Winnebago",
            "label": "IL: Winnebago"
        },
        {
            "value": "Woodford",
            "label": "IL: Woodford"
        },
        {
            "value": "Adams",
            "label": "IN: Adams"
        },
        {
            "value": "Allen",
            "label": "IN: Allen"
        },
        {
            "value": "Bartholomew",
            "label": "IN: Bartholomew"
        },
        {
            "value": "Benton",
            "label": "IN: Benton"
        },
        {
            "value": "Blackford",
            "label": "IN: Blackford"
        },
        {
            "value": "Boone",
            "label": "IN: Boone"
        },
        {
            "value": "Brown",
            "label": "IN: Brown"
        },
        {
            "value": "Carroll",
            "label": "IN: Carroll"
        },
        {
            "value": "Cass",
            "label": "IN: Cass"
        },
        {
            "value": "Clark",
            "label": "IN: Clark"
        },
        {
            "value": "Clay",
            "label": "IN: Clay"
        },
        {
            "value": "Clinton",
            "label": "IN: Clinton"
        },
        {
            "value": "Crawford",
            "label": "IN: Crawford"
        },
        {
            "value": "Daviess",
            "label": "IN: Daviess"
        },
        {
            "value": "Dearborn",
            "label": "IN: Dearborn"
        },
        {
            "value": "Decatur",
            "label": "IN: Decatur"
        },
        {
            "value": "DeKalb",
            "label": "IN: DeKalb"
        },
        {
            "value": "Delaware",
            "label": "IN: Delaware"
        },
        {
            "value": "Dubois",
            "label": "IN: Dubois"
        },
        {
            "value": "Elkhart",
            "label": "IN: Elkhart"
        },
        {
            "value": "Fayette",
            "label": "IN: Fayette"
        },
        {
            "value": "Floyd",
            "label": "IN: Floyd"
        },
        {
            "value": "Fountain",
            "label": "IN: Fountain"
        },
        {
            "value": "Franklin",
            "label": "IN: Franklin"
        },
        {
            "value": "Fulton",
            "label": "IN: Fulton"
        },
        {
            "value": "Gibson",
            "label": "IN: Gibson"
        },
        {
            "value": "Grant",
            "label": "IN: Grant"
        },
        {
            "value": "Greene",
            "label": "IN: Greene"
        },
        {
            "value": "Hamilton",
            "label": "IN: Hamilton"
        },
        {
            "value": "Hancock",
            "label": "IN: Hancock"
        },
        {
            "value": "Harrison",
            "label": "IN: Harrison"
        },
        {
            "value": "Hendricks",
            "label": "IN: Hendricks"
        },
        {
            "value": "Henry",
            "label": "IN: Henry"
        },
        {
            "value": "Howard",
            "label": "IN: Howard"
        },
        {
            "value": "Huntington",
            "label": "IN: Huntington"
        },
        {
            "value": "Jackson",
            "label": "IN: Jackson"
        },
        {
            "value": "Jasper",
            "label": "IN: Jasper"
        },
        {
            "value": "Jay",
            "label": "IN: Jay"
        },
        {
            "value": "Jefferson",
            "label": "IN: Jefferson"
        },
        {
            "value": "Jennings",
            "label": "IN: Jennings"
        },
        {
            "value": "Johnson",
            "label": "IN: Johnson"
        },
        {
            "value": "Knox",
            "label": "IN: Knox"
        },
        {
            "value": "Kosciusko",
            "label": "IN: Kosciusko"
        },
        {
            "value": "LaGrange",
            "label": "IN: LaGrange"
        },
        {
            "value": "Lake",
            "label": "IN: Lake"
        },
        {
            "value": "LaPorte",
            "label": "IN: LaPorte"
        },
        {
            "value": "Lawrence",
            "label": "IN: Lawrence"
        },
        {
            "value": "Madison",
            "label": "IN: Madison"
        },
        {
            "value": "Marion",
            "label": "IN: Marion"
        },
        {
            "value": "Marshall",
            "label": "IN: Marshall"
        },
        {
            "value": "Martin",
            "label": "IN: Martin"
        },
        {
            "value": "Miami",
            "label": "IN: Miami"
        },
        {
            "value": "Monroe",
            "label": "IN: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "IN: Montgomery"
        },
        {
            "value": "Morgan",
            "label": "IN: Morgan"
        },
        {
            "value": "Newton",
            "label": "IN: Newton"
        },
        {
            "value": "Noble",
            "label": "IN: Noble"
        },
        {
            "value": "Ohio",
            "label": "IN: Ohio"
        },
        {
            "value": "Orange",
            "label": "IN: Orange"
        },
        {
            "value": "Owen",
            "label": "IN: Owen"
        },
        {
            "value": "Parke",
            "label": "IN: Parke"
        },
        {
            "value": "Perry",
            "label": "IN: Perry"
        },
        {
            "value": "Pike",
            "label": "IN: Pike"
        },
        {
            "value": "Porter",
            "label": "IN: Porter"
        },
        {
            "value": "Posey",
            "label": "IN: Posey"
        },
        {
            "value": "Pulaski",
            "label": "IN: Pulaski"
        },
        {
            "value": "Putnam",
            "label": "IN: Putnam"
        },
        {
            "value": "Randolph",
            "label": "IN: Randolph"
        },
        {
            "value": "Ripley",
            "label": "IN: Ripley"
        },
        {
            "value": "Rush",
            "label": "IN: Rush"
        },
        {
            "value": "Scott",
            "label": "IN: Scott"
        },
        {
            "value": "Shelby",
            "label": "IN: Shelby"
        },
        {
            "value": "Spencer",
            "label": "IN: Spencer"
        },
        {
            "value": "St. Joseph",
            "label": "IN: St. Joseph"
        },
        {
            "value": "Starke",
            "label": "IN: Starke"
        },
        {
            "value": "Steuben",
            "label": "IN: Steuben"
        },
        {
            "value": "Sullivan",
            "label": "IN: Sullivan"
        },
        {
            "value": "Switzerland",
            "label": "IN: Switzerland"
        },
        {
            "value": "Tippecanoe",
            "label": "IN: Tippecanoe"
        },
        {
            "value": "Tipton",
            "label": "IN: Tipton"
        },
        {
            "value": "Union",
            "label": "IN: Union"
        },
        {
            "value": "Vanderburgh",
            "label": "IN: Vanderburgh"
        },
        {
            "value": "Vermillion",
            "label": "IN: Vermillion"
        },
        {
            "value": "Vigo",
            "label": "IN: Vigo"
        },
        {
            "value": "Wabash",
            "label": "IN: Wabash"
        },
        {
            "value": "Warren",
            "label": "IN: Warren"
        },
        {
            "value": "Warrick",
            "label": "IN: Warrick"
        },
        {
            "value": "Washington",
            "label": "IN: Washington"
        },
        {
            "value": "Wayne",
            "label": "IN: Wayne"
        },
        {
            "value": "Wells",
            "label": "IN: Wells"
        },
        {
            "value": "White",
            "label": "IN: White"
        },
        {
            "value": "Whitley",
            "label": "IN: Whitley"
        },
        {
            "value": "Allen",
            "label": "KS: Allen"
        },
        {
            "value": "Anderson",
            "label": "KS: Anderson"
        },
        {
            "value": "Atchison",
            "label": "KS: Atchison"
        },
        {
            "value": "Barber",
            "label": "KS: Barber"
        },
        {
            "value": "Barton",
            "label": "KS: Barton"
        },
        {
            "value": "Bourbon",
            "label": "KS: Bourbon"
        },
        {
            "value": "Brown",
            "label": "KS: Brown"
        },
        {
            "value": "Butler",
            "label": "KS: Butler"
        },
        {
            "value": "Chase",
            "label": "KS: Chase"
        },
        {
            "value": "Chautauqua",
            "label": "KS: Chautauqua"
        },
        {
            "value": "Cherokee",
            "label": "KS: Cherokee"
        },
        {
            "value": "Cheyenne",
            "label": "KS: Cheyenne"
        },
        {
            "value": "Clark",
            "label": "KS: Clark"
        },
        {
            "value": "Clay",
            "label": "KS: Clay"
        },
        {
            "value": "Cloud",
            "label": "KS: Cloud"
        },
        {
            "value": "Coffey",
            "label": "KS: Coffey"
        },
        {
            "value": "Comanche",
            "label": "KS: Comanche"
        },
        {
            "value": "Cowley",
            "label": "KS: Cowley"
        },
        {
            "value": "Crawford",
            "label": "KS: Crawford"
        },
        {
            "value": "Decatur",
            "label": "KS: Decatur"
        },
        {
            "value": "Dickinson",
            "label": "KS: Dickinson"
        },
        {
            "value": "Doniphan",
            "label": "KS: Doniphan"
        },
        {
            "value": "Douglas",
            "label": "KS: Douglas"
        },
        {
            "value": "Edwards",
            "label": "KS: Edwards"
        },
        {
            "value": "Elk",
            "label": "KS: Elk"
        },
        {
            "value": "Ellis",
            "label": "KS: Ellis"
        },
        {
            "value": "Ellsworth",
            "label": "KS: Ellsworth"
        },
        {
            "value": "Finney",
            "label": "KS: Finney"
        },
        {
            "value": "Ford",
            "label": "KS: Ford"
        },
        {
            "value": "Franklin",
            "label": "KS: Franklin"
        },
        {
            "value": "Geary",
            "label": "KS: Geary"
        },
        {
            "value": "Gove",
            "label": "KS: Gove"
        },
        {
            "value": "Graham",
            "label": "KS: Graham"
        },
        {
            "value": "Grant",
            "label": "KS: Grant"
        },
        {
            "value": "Gray",
            "label": "KS: Gray"
        },
        {
            "value": "Greeley",
            "label": "KS: Greeley"
        },
        {
            "value": "Greenwood",
            "label": "KS: Greenwood"
        },
        {
            "value": "Hamilton",
            "label": "KS: Hamilton"
        },
        {
            "value": "Harper",
            "label": "KS: Harper"
        },
        {
            "value": "Harvey",
            "label": "KS: Harvey"
        },
        {
            "value": "Haskell",
            "label": "KS: Haskell"
        },
        {
            "value": "Hodgeman",
            "label": "KS: Hodgeman"
        },
        {
            "value": "Jackson",
            "label": "KS: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "KS: Jefferson"
        },
        {
            "value": "Jewell",
            "label": "KS: Jewell"
        },
        {
            "value": "Johnson",
            "label": "KS: Johnson"
        },
        {
            "value": "Kearny",
            "label": "KS: Kearny"
        },
        {
            "value": "Kingman",
            "label": "KS: Kingman"
        },
        {
            "value": "Kiowa",
            "label": "KS: Kiowa"
        },
        {
            "value": "Labette",
            "label": "KS: Labette"
        },
        {
            "value": "Lane",
            "label": "KS: Lane"
        },
        {
            "value": "Leavenworth",
            "label": "KS: Leavenworth"
        },
        {
            "value": "Lincoln",
            "label": "KS: Lincoln"
        },
        {
            "value": "Linn",
            "label": "KS: Linn"
        },
        {
            "value": "Logan",
            "label": "KS: Logan"
        },
        {
            "value": "Lyon",
            "label": "KS: Lyon"
        },
        {
            "value": "Marion",
            "label": "KS: Marion"
        },
        {
            "value": "Marshall",
            "label": "KS: Marshall"
        },
        {
            "value": "McPherson",
            "label": "KS: McPherson"
        },
        {
            "value": "Meade",
            "label": "KS: Meade"
        },
        {
            "value": "Miami",
            "label": "KS: Miami"
        },
        {
            "value": "Mitchell",
            "label": "KS: Mitchell"
        },
        {
            "value": "Montgomery",
            "label": "KS: Montgomery"
        },
        {
            "value": "Morris",
            "label": "KS: Morris"
        },
        {
            "value": "Morton",
            "label": "KS: Morton"
        },
        {
            "value": "Nemaha",
            "label": "KS: Nemaha"
        },
        {
            "value": "Neosho",
            "label": "KS: Neosho"
        },
        {
            "value": "Ness",
            "label": "KS: Ness"
        },
        {
            "value": "Norton",
            "label": "KS: Norton"
        },
        {
            "value": "Osage",
            "label": "KS: Osage"
        },
        {
            "value": "Osborne",
            "label": "KS: Osborne"
        },
        {
            "value": "Ottawa",
            "label": "KS: Ottawa"
        },
        {
            "value": "Pawnee",
            "label": "KS: Pawnee"
        },
        {
            "value": "Phillips",
            "label": "KS: Phillips"
        },
        {
            "value": "Pottawatomie",
            "label": "KS: Pottawatomie"
        },
        {
            "value": "Pratt",
            "label": "KS: Pratt"
        },
        {
            "value": "Rawlins",
            "label": "KS: Rawlins"
        },
        {
            "value": "Reno",
            "label": "KS: Reno"
        },
        {
            "value": "Republic",
            "label": "KS: Republic"
        },
        {
            "value": "Rice",
            "label": "KS: Rice"
        },
        {
            "value": "Riley",
            "label": "KS: Riley"
        },
        {
            "value": "Rooks",
            "label": "KS: Rooks"
        },
        {
            "value": "Rush",
            "label": "KS: Rush"
        },
        {
            "value": "Russell",
            "label": "KS: Russell"
        },
        {
            "value": "Saline",
            "label": "KS: Saline"
        },
        {
            "value": "Scott",
            "label": "KS: Scott"
        },
        {
            "value": "Sedgwick",
            "label": "KS: Sedgwick"
        },
        {
            "value": "Seward",
            "label": "KS: Seward"
        },
        {
            "value": "Shawnee",
            "label": "KS: Shawnee"
        },
        {
            "value": "Sheridan",
            "label": "KS: Sheridan"
        },
        {
            "value": "Sherman",
            "label": "KS: Sherman"
        },
        {
            "value": "Smith",
            "label": "KS: Smith"
        },
        {
            "value": "Stafford",
            "label": "KS: Stafford"
        },
        {
            "value": "Stanton",
            "label": "KS: Stanton"
        },
        {
            "value": "Stevens",
            "label": "KS: Stevens"
        },
        {
            "value": "Sumner",
            "label": "KS: Sumner"
        },
        {
            "value": "Thomas",
            "label": "KS: Thomas"
        },
        {
            "value": "Trego",
            "label": "KS: Trego"
        },
        {
            "value": "Wabaunsee",
            "label": "KS: Wabaunsee"
        },
        {
            "value": "Wallace",
            "label": "KS: Wallace"
        },
        {
            "value": "Washington",
            "label": "KS: Washington"
        },
        {
            "value": "Wichita",
            "label": "KS: Wichita"
        },
        {
            "value": "Wilson",
            "label": "KS: Wilson"
        },
        {
            "value": "Woodson",
            "label": "KS: Woodson"
        },
        {
            "value": "Wyandotte",
            "label": "KS: Wyandotte"
        },
        {
            "value": "Adair",
            "label": "KY: Adair"
        },
        {
            "value": "Allen",
            "label": "KY: Allen"
        },
        {
            "value": "Anderson",
            "label": "KY: Anderson"
        },
        {
            "value": "Ballard",
            "label": "KY: Ballard"
        },
        {
            "value": "Barren",
            "label": "KY: Barren"
        },
        {
            "value": "Bath",
            "label": "KY: Bath"
        },
        {
            "value": "Bell",
            "label": "KY: Bell"
        },
        {
            "value": "Boone",
            "label": "KY: Boone"
        },
        {
            "value": "Bourbon",
            "label": "KY: Bourbon"
        },
        {
            "value": "Boyd",
            "label": "KY: Boyd"
        },
        {
            "value": "Boyle",
            "label": "KY: Boyle"
        },
        {
            "value": "Bracken",
            "label": "KY: Bracken"
        },
        {
            "value": "Breathitt",
            "label": "KY: Breathitt"
        },
        {
            "value": "Breckinridge",
            "label": "KY: Breckinridge"
        },
        {
            "value": "Bullitt",
            "label": "KY: Bullitt"
        },
        {
            "value": "Butler",
            "label": "KY: Butler"
        },
        {
            "value": "Caldwell",
            "label": "KY: Caldwell"
        },
        {
            "value": "Calloway",
            "label": "KY: Calloway"
        },
        {
            "value": "Campbell",
            "label": "KY: Campbell"
        },
        {
            "value": "Carlisle",
            "label": "KY: Carlisle"
        },
        {
            "value": "Carroll",
            "label": "KY: Carroll"
        },
        {
            "value": "Carter",
            "label": "KY: Carter"
        },
        {
            "value": "Casey",
            "label": "KY: Casey"
        },
        {
            "value": "Christian",
            "label": "KY: Christian"
        },
        {
            "value": "Clark",
            "label": "KY: Clark"
        },
        {
            "value": "Clay",
            "label": "KY: Clay"
        },
        {
            "value": "Clinton",
            "label": "KY: Clinton"
        },
        {
            "value": "Crittenden",
            "label": "KY: Crittenden"
        },
        {
            "value": "Cumberland",
            "label": "KY: Cumberland"
        },
        {
            "value": "Daviess",
            "label": "KY: Daviess"
        },
        {
            "value": "Edmonson",
            "label": "KY: Edmonson"
        },
        {
            "value": "Elliott",
            "label": "KY: Elliott"
        },
        {
            "value": "Estill",
            "label": "KY: Estill"
        },
        {
            "value": "Fayette",
            "label": "KY: Fayette"
        },
        {
            "value": "Fleming",
            "label": "KY: Fleming"
        },
        {
            "value": "Floyd",
            "label": "KY: Floyd"
        },
        {
            "value": "Franklin",
            "label": "KY: Franklin"
        },
        {
            "value": "Fulton",
            "label": "KY: Fulton"
        },
        {
            "value": "Gallatin",
            "label": "KY: Gallatin"
        },
        {
            "value": "Garrard",
            "label": "KY: Garrard"
        },
        {
            "value": "Grant",
            "label": "KY: Grant"
        },
        {
            "value": "Graves",
            "label": "KY: Graves"
        },
        {
            "value": "Grayson",
            "label": "KY: Grayson"
        },
        {
            "value": "Green",
            "label": "KY: Green"
        },
        {
            "value": "Greenup",
            "label": "KY: Greenup"
        },
        {
            "value": "Hancock",
            "label": "KY: Hancock"
        },
        {
            "value": "Hardin",
            "label": "KY: Hardin"
        },
        {
            "value": "Harlan",
            "label": "KY: Harlan"
        },
        {
            "value": "Harrison",
            "label": "KY: Harrison"
        },
        {
            "value": "Hart",
            "label": "KY: Hart"
        },
        {
            "value": "Henderson",
            "label": "KY: Henderson"
        },
        {
            "value": "Henry",
            "label": "KY: Henry"
        },
        {
            "value": "Hickman",
            "label": "KY: Hickman"
        },
        {
            "value": "Hopkins",
            "label": "KY: Hopkins"
        },
        {
            "value": "Jackson",
            "label": "KY: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "KY: Jefferson"
        },
        {
            "value": "Jessamine",
            "label": "KY: Jessamine"
        },
        {
            "value": "Johnson",
            "label": "KY: Johnson"
        },
        {
            "value": "Kenton",
            "label": "KY: Kenton"
        },
        {
            "value": "Knott",
            "label": "KY: Knott"
        },
        {
            "value": "Knox",
            "label": "KY: Knox"
        },
        {
            "value": "Larue",
            "label": "KY: Larue"
        },
        {
            "value": "Laurel",
            "label": "KY: Laurel"
        },
        {
            "value": "Lawrence",
            "label": "KY: Lawrence"
        },
        {
            "value": "Lee",
            "label": "KY: Lee"
        },
        {
            "value": "Leslie",
            "label": "KY: Leslie"
        },
        {
            "value": "Letcher",
            "label": "KY: Letcher"
        },
        {
            "value": "Lewis",
            "label": "KY: Lewis"
        },
        {
            "value": "Lincoln",
            "label": "KY: Lincoln"
        },
        {
            "value": "Livingston",
            "label": "KY: Livingston"
        },
        {
            "value": "Logan",
            "label": "KY: Logan"
        },
        {
            "value": "Lyon",
            "label": "KY: Lyon"
        },
        {
            "value": "Madison",
            "label": "KY: Madison"
        },
        {
            "value": "Magoffin",
            "label": "KY: Magoffin"
        },
        {
            "value": "Marion",
            "label": "KY: Marion"
        },
        {
            "value": "Marshall",
            "label": "KY: Marshall"
        },
        {
            "value": "Martin",
            "label": "KY: Martin"
        },
        {
            "value": "Mason",
            "label": "KY: Mason"
        },
        {
            "value": "McCracken",
            "label": "KY: McCracken"
        },
        {
            "value": "McCreary",
            "label": "KY: McCreary"
        },
        {
            "value": "McLean",
            "label": "KY: McLean"
        },
        {
            "value": "Meade",
            "label": "KY: Meade"
        },
        {
            "value": "Menifee",
            "label": "KY: Menifee"
        },
        {
            "value": "Mercer",
            "label": "KY: Mercer"
        },
        {
            "value": "Metcalfe",
            "label": "KY: Metcalfe"
        },
        {
            "value": "Monroe",
            "label": "KY: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "KY: Montgomery"
        },
        {
            "value": "Morgan",
            "label": "KY: Morgan"
        },
        {
            "value": "Muhlenberg",
            "label": "KY: Muhlenberg"
        },
        {
            "value": "Nelson",
            "label": "KY: Nelson"
        },
        {
            "value": "Nicholas",
            "label": "KY: Nicholas"
        },
        {
            "value": "Ohio",
            "label": "KY: Ohio"
        },
        {
            "value": "Oldham",
            "label": "KY: Oldham"
        },
        {
            "value": "Owen",
            "label": "KY: Owen"
        },
        {
            "value": "Owsley",
            "label": "KY: Owsley"
        },
        {
            "value": "Pendleton",
            "label": "KY: Pendleton"
        },
        {
            "value": "Perry",
            "label": "KY: Perry"
        },
        {
            "value": "Pike",
            "label": "KY: Pike"
        },
        {
            "value": "Powell",
            "label": "KY: Powell"
        },
        {
            "value": "Pulaski",
            "label": "KY: Pulaski"
        },
        {
            "value": "Robertson",
            "label": "KY: Robertson"
        },
        {
            "value": "Rockcastle",
            "label": "KY: Rockcastle"
        },
        {
            "value": "Rowan",
            "label": "KY: Rowan"
        },
        {
            "value": "Russell",
            "label": "KY: Russell"
        },
        {
            "value": "Scott",
            "label": "KY: Scott"
        },
        {
            "value": "Shelby",
            "label": "KY: Shelby"
        },
        {
            "value": "Simpson",
            "label": "KY: Simpson"
        },
        {
            "value": "Spencer",
            "label": "KY: Spencer"
        },
        {
            "value": "Taylor",
            "label": "KY: Taylor"
        },
        {
            "value": "Todd",
            "label": "KY: Todd"
        },
        {
            "value": "Trigg",
            "label": "KY: Trigg"
        },
        {
            "value": "Trimble",
            "label": "KY: Trimble"
        },
        {
            "value": "Union",
            "label": "KY: Union"
        },
        {
            "value": "Warren",
            "label": "KY: Warren"
        },
        {
            "value": "Washington",
            "label": "KY: Washington"
        },
        {
            "value": "Wayne",
            "label": "KY: Wayne"
        },
        {
            "value": "Webster",
            "label": "KY: Webster"
        },
        {
            "value": "Whitley",
            "label": "KY: Whitley"
        },
        {
            "value": "Wolfe",
            "label": "KY: Wolfe"
        },
        {
            "value": "Woodford",
            "label": "KY: Woodford"
        },
        {
            "value": "Acadia",
            "label": "LA: Acadia"
        },
        {
            "value": "Allen",
            "label": "LA: Allen"
        },
        {
            "value": "Ascension",
            "label": "LA: Ascension"
        },
        {
            "value": "Assumption",
            "label": "LA: Assumption"
        },
        {
            "value": "Avoyelles",
            "label": "LA: Avoyelles"
        },
        {
            "value": "Beauregard",
            "label": "LA: Beauregard"
        },
        {
            "value": "Bienville",
            "label": "LA: Bienville"
        },
        {
            "value": "Bossier",
            "label": "LA: Bossier"
        },
        {
            "value": "Caddo",
            "label": "LA: Caddo"
        },
        {
            "value": "Calcasieu",
            "label": "LA: Calcasieu"
        },
        {
            "value": "Caldwell",
            "label": "LA: Caldwell"
        },
        {
            "value": "Cameron",
            "label": "LA: Cameron"
        },
        {
            "value": "Catahoula",
            "label": "LA: Catahoula"
        },
        {
            "value": "Claiborne",
            "label": "LA: Claiborne"
        },
        {
            "value": "Concordia",
            "label": "LA: Concordia"
        },
        {
            "value": "De Soto",
            "label": "LA: De Soto"
        },
        {
            "value": "East Baton Rouge",
            "label": "LA: East Baton Rouge"
        },
        {
            "value": "East Carroll",
            "label": "LA: East Carroll"
        },
        {
            "value": "East Feliciana",
            "label": "LA: East Feliciana"
        },
        {
            "value": "Evangeline",
            "label": "LA: Evangeline"
        },
        {
            "value": "Franklin",
            "label": "LA: Franklin"
        },
        {
            "value": "Grant",
            "label": "LA: Grant"
        },
        {
            "value": "Iberia",
            "label": "LA: Iberia"
        },
        {
            "value": "Iberville",
            "label": "LA: Iberville"
        },
        {
            "value": "Jackson",
            "label": "LA: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "LA: Jefferson"
        },
        {
            "value": "Jefferson Davis",
            "label": "LA: Jefferson Davis"
        },
        {
            "value": "Lafayette",
            "label": "LA: Lafayette"
        },
        {
            "value": "Lafourche",
            "label": "LA: Lafourche"
        },
        {
            "value": "LaSalle",
            "label": "LA: LaSalle"
        },
        {
            "value": "Lincoln",
            "label": "LA: Lincoln"
        },
        {
            "value": "Livingston",
            "label": "LA: Livingston"
        },
        {
            "value": "Madison",
            "label": "LA: Madison"
        },
        {
            "value": "Morehouse",
            "label": "LA: Morehouse"
        },
        {
            "value": "Natchitoches",
            "label": "LA: Natchitoches"
        },
        {
            "value": "Orleans",
            "label": "LA: Orleans"
        },
        {
            "value": "Ouachita",
            "label": "LA: Ouachita"
        },
        {
            "value": "Plaquemines",
            "label": "LA: Plaquemines"
        },
        {
            "value": "Pointe Coupee",
            "label": "LA: Pointe Coupee"
        },
        {
            "value": "Rapides",
            "label": "LA: Rapides"
        },
        {
            "value": "Red River",
            "label": "LA: Red River"
        },
        {
            "value": "Richland",
            "label": "LA: Richland"
        },
        {
            "value": "Sabine",
            "label": "LA: Sabine"
        },
        {
            "value": "St. Bernard",
            "label": "LA: St. Bernard"
        },
        {
            "value": "St. Charles",
            "label": "LA: St. Charles"
        },
        {
            "value": "St. Helena",
            "label": "LA: St. Helena"
        },
        {
            "value": "St. James",
            "label": "LA: St. James"
        },
        {
            "value": "St. John the Baptist",
            "label": "LA: St. John the Baptist"
        },
        {
            "value": "St. Landry",
            "label": "LA: St. Landry"
        },
        {
            "value": "St. Martin",
            "label": "LA: St. Martin"
        },
        {
            "value": "St. Mary",
            "label": "LA: St. Mary"
        },
        {
            "value": "St. Tammany",
            "label": "LA: St. Tammany"
        },
        {
            "value": "Tangipahoa",
            "label": "LA: Tangipahoa"
        },
        {
            "value": "Tensas",
            "label": "LA: Tensas"
        },
        {
            "value": "Terrebonne",
            "label": "LA: Terrebonne"
        },
        {
            "value": "Union",
            "label": "LA: Union"
        },
        {
            "value": "Vermilion",
            "label": "LA: Vermilion"
        },
        {
            "value": "Vernon",
            "label": "LA: Vernon"
        },
        {
            "value": "Washington",
            "label": "LA: Washington"
        },
        {
            "value": "Webster",
            "label": "LA: Webster"
        },
        {
            "value": "West Baton Rouge",
            "label": "LA: West Baton Rouge"
        },
        {
            "value": "West Carroll",
            "label": "LA: West Carroll"
        },
        {
            "value": "West Feliciana",
            "label": "LA: West Feliciana"
        },
        {
            "value": "Winn",
            "label": "LA: Winn"
        },
        {
            "value": "Barnstable",
            "label": "MA: Barnstable"
        },
        {
            "value": "Berkshire",
            "label": "MA: Berkshire"
        },
        {
            "value": "Bristol",
            "label": "MA: Bristol"
        },
        {
            "value": "Dukes",
            "label": "MA: Dukes"
        },
        {
            "value": "Essex",
            "label": "MA: Essex"
        },
        {
            "value": "Franklin",
            "label": "MA: Franklin"
        },
        {
            "value": "Hampden",
            "label": "MA: Hampden"
        },
        {
            "value": "Hampshire",
            "label": "MA: Hampshire"
        },
        {
            "value": "Middlesex",
            "label": "MA: Middlesex"
        },
        {
            "value": "Nantucket",
            "label": "MA: Nantucket"
        },
        {
            "value": "Norfolk",
            "label": "MA: Norfolk"
        },
        {
            "value": "Plymouth",
            "label": "MA: Plymouth"
        },
        {
            "value": "Suffolk",
            "label": "MA: Suffolk"
        },
        {
            "value": "Worcester",
            "label": "MA: Worcester"
        },
        {
            "value": "Allegany",
            "label": "MD: Allegany"
        },
        {
            "value": "Anne Arundel",
            "label": "MD: Anne Arundel"
        },
        {
            "value": "Baltimore",
            "label": "MD: Baltimore"
        },
        {
            "value": "Baltimore",
            "label": "MD: Baltimore"
        },
        {
            "value": "Calvert",
            "label": "MD: Calvert"
        },
        {
            "value": "Caroline",
            "label": "MD: Caroline"
        },
        {
            "value": "Carroll",
            "label": "MD: Carroll"
        },
        {
            "value": "Cecil",
            "label": "MD: Cecil"
        },
        {
            "value": "Charles",
            "label": "MD: Charles"
        },
        {
            "value": "Dorchester",
            "label": "MD: Dorchester"
        },
        {
            "value": "Frederick",
            "label": "MD: Frederick"
        },
        {
            "value": "Garrett",
            "label": "MD: Garrett"
        },
        {
            "value": "Harford",
            "label": "MD: Harford"
        },
        {
            "value": "Howard",
            "label": "MD: Howard"
        },
        {
            "value": "Kent",
            "label": "MD: Kent"
        },
        {
            "value": "Montgomery",
            "label": "MD: Montgomery"
        },
        {
            "value": "Prince George's",
            "label": "MD: Prince George's"
        },
        {
            "value": "Queen Anne's",
            "label": "MD: Queen Anne's"
        },
        {
            "value": "Somerset",
            "label": "MD: Somerset"
        },
        {
            "value": "St. Mary's",
            "label": "MD: St. Mary's"
        },
        {
            "value": "Talbot",
            "label": "MD: Talbot"
        },
        {
            "value": "Washington",
            "label": "MD: Washington"
        },
        {
            "value": "Wicomico",
            "label": "MD: Wicomico"
        },
        {
            "value": "Worcester",
            "label": "MD: Worcester"
        },
        {
            "value": "Androscoggin",
            "label": "ME: Androscoggin"
        },
        {
            "value": "Aroostook",
            "label": "ME: Aroostook"
        },
        {
            "value": "Cumberland",
            "label": "ME: Cumberland"
        },
        {
            "value": "Franklin",
            "label": "ME: Franklin"
        },
        {
            "value": "Hancock",
            "label": "ME: Hancock"
        },
        {
            "value": "Kennebec",
            "label": "ME: Kennebec"
        },
        {
            "value": "Knox",
            "label": "ME: Knox"
        },
        {
            "value": "Lincoln",
            "label": "ME: Lincoln"
        },
        {
            "value": "Oxford",
            "label": "ME: Oxford"
        },
        {
            "value": "Penobscot",
            "label": "ME: Penobscot"
        },
        {
            "value": "Piscataquis",
            "label": "ME: Piscataquis"
        },
        {
            "value": "Sagadahoc",
            "label": "ME: Sagadahoc"
        },
        {
            "value": "Somerset",
            "label": "ME: Somerset"
        },
        {
            "value": "Waldo",
            "label": "ME: Waldo"
        },
        {
            "value": "Washington",
            "label": "ME: Washington"
        },
        {
            "value": "York",
            "label": "ME: York"
        },
        {
            "value": "Alcona",
            "label": "MI: Alcona"
        },
        {
            "value": "Alger",
            "label": "MI: Alger"
        },
        {
            "value": "Allegan",
            "label": "MI: Allegan"
        },
        {
            "value": "Alpena",
            "label": "MI: Alpena"
        },
        {
            "value": "Antrim",
            "label": "MI: Antrim"
        },
        {
            "value": "Arenac",
            "label": "MI: Arenac"
        },
        {
            "value": "Baraga",
            "label": "MI: Baraga"
        },
        {
            "value": "Barry",
            "label": "MI: Barry"
        },
        {
            "value": "Bay",
            "label": "MI: Bay"
        },
        {
            "value": "Benzie",
            "label": "MI: Benzie"
        },
        {
            "value": "Berrien",
            "label": "MI: Berrien"
        },
        {
            "value": "Branch",
            "label": "MI: Branch"
        },
        {
            "value": "Calhoun",
            "label": "MI: Calhoun"
        },
        {
            "value": "Cass",
            "label": "MI: Cass"
        },
        {
            "value": "Charlevoix",
            "label": "MI: Charlevoix"
        },
        {
            "value": "Cheboygan",
            "label": "MI: Cheboygan"
        },
        {
            "value": "Chippewa",
            "label": "MI: Chippewa"
        },
        {
            "value": "Clare",
            "label": "MI: Clare"
        },
        {
            "value": "Clinton",
            "label": "MI: Clinton"
        },
        {
            "value": "Crawford",
            "label": "MI: Crawford"
        },
        {
            "value": "Delta",
            "label": "MI: Delta"
        },
        {
            "value": "Dickinson",
            "label": "MI: Dickinson"
        },
        {
            "value": "Eaton",
            "label": "MI: Eaton"
        },
        {
            "value": "Emmet",
            "label": "MI: Emmet"
        },
        {
            "value": "Genesee",
            "label": "MI: Genesee"
        },
        {
            "value": "Gladwin",
            "label": "MI: Gladwin"
        },
        {
            "value": "Gogebic",
            "label": "MI: Gogebic"
        },
        {
            "value": "Grand Traverse",
            "label": "MI: Grand Traverse"
        },
        {
            "value": "Gratiot",
            "label": "MI: Gratiot"
        },
        {
            "value": "Hillsdale",
            "label": "MI: Hillsdale"
        },
        {
            "value": "Houghton",
            "label": "MI: Houghton"
        },
        {
            "value": "Huron",
            "label": "MI: Huron"
        },
        {
            "value": "Ingham",
            "label": "MI: Ingham"
        },
        {
            "value": "Ionia",
            "label": "MI: Ionia"
        },
        {
            "value": "Iosco",
            "label": "MI: Iosco"
        },
        {
            "value": "Iron",
            "label": "MI: Iron"
        },
        {
            "value": "Isabella",
            "label": "MI: Isabella"
        },
        {
            "value": "Jackson",
            "label": "MI: Jackson"
        },
        {
            "value": "Kalamazoo",
            "label": "MI: Kalamazoo"
        },
        {
            "value": "Kalkaska",
            "label": "MI: Kalkaska"
        },
        {
            "value": "Kent",
            "label": "MI: Kent"
        },
        {
            "value": "Keweenaw",
            "label": "MI: Keweenaw"
        },
        {
            "value": "Lake",
            "label": "MI: Lake"
        },
        {
            "value": "Lapeer",
            "label": "MI: Lapeer"
        },
        {
            "value": "Leelanau",
            "label": "MI: Leelanau"
        },
        {
            "value": "Lenawee",
            "label": "MI: Lenawee"
        },
        {
            "value": "Livingston",
            "label": "MI: Livingston"
        },
        {
            "value": "Luce",
            "label": "MI: Luce"
        },
        {
            "value": "Mackinac",
            "label": "MI: Mackinac"
        },
        {
            "value": "Macomb",
            "label": "MI: Macomb"
        },
        {
            "value": "Manistee",
            "label": "MI: Manistee"
        },
        {
            "value": "Marquette",
            "label": "MI: Marquette"
        },
        {
            "value": "Mason",
            "label": "MI: Mason"
        },
        {
            "value": "Mecosta",
            "label": "MI: Mecosta"
        },
        {
            "value": "Menominee",
            "label": "MI: Menominee"
        },
        {
            "value": "Midland",
            "label": "MI: Midland"
        },
        {
            "value": "Missaukee",
            "label": "MI: Missaukee"
        },
        {
            "value": "Monroe",
            "label": "MI: Monroe"
        },
        {
            "value": "Montcalm",
            "label": "MI: Montcalm"
        },
        {
            "value": "Montmorency",
            "label": "MI: Montmorency"
        },
        {
            "value": "Muskegon",
            "label": "MI: Muskegon"
        },
        {
            "value": "Newaygo",
            "label": "MI: Newaygo"
        },
        {
            "value": "Oakland",
            "label": "MI: Oakland"
        },
        {
            "value": "Oceana",
            "label": "MI: Oceana"
        },
        {
            "value": "Ogemaw",
            "label": "MI: Ogemaw"
        },
        {
            "value": "Ontonagon",
            "label": "MI: Ontonagon"
        },
        {
            "value": "Osceola",
            "label": "MI: Osceola"
        },
        {
            "value": "Oscoda",
            "label": "MI: Oscoda"
        },
        {
            "value": "Otsego",
            "label": "MI: Otsego"
        },
        {
            "value": "Ottawa",
            "label": "MI: Ottawa"
        },
        {
            "value": "Presque Isle",
            "label": "MI: Presque Isle"
        },
        {
            "value": "Roscommon",
            "label": "MI: Roscommon"
        },
        {
            "value": "Saginaw",
            "label": "MI: Saginaw"
        },
        {
            "value": "Sanilac",
            "label": "MI: Sanilac"
        },
        {
            "value": "Schoolcraft",
            "label": "MI: Schoolcraft"
        },
        {
            "value": "Shiawassee",
            "label": "MI: Shiawassee"
        },
        {
            "value": "St. Clair",
            "label": "MI: St. Clair"
        },
        {
            "value": "St. Joseph",
            "label": "MI: St. Joseph"
        },
        {
            "value": "Tuscola",
            "label": "MI: Tuscola"
        },
        {
            "value": "Van Buren",
            "label": "MI: Van Buren"
        },
        {
            "value": "Washtenaw",
            "label": "MI: Washtenaw"
        },
        {
            "value": "Wayne",
            "label": "MI: Wayne"
        },
        {
            "value": "Wexford",
            "label": "MI: Wexford"
        },
        {
            "value": "Aitkin",
            "label": "MN: Aitkin"
        },
        {
            "value": "Anoka",
            "label": "MN: Anoka"
        },
        {
            "value": "Becker",
            "label": "MN: Becker"
        },
        {
            "value": "Beltrami",
            "label": "MN: Beltrami"
        },
        {
            "value": "Benton",
            "label": "MN: Benton"
        },
        {
            "value": "Big Stone",
            "label": "MN: Big Stone"
        },
        {
            "value": "Blue Earth",
            "label": "MN: Blue Earth"
        },
        {
            "value": "Brown",
            "label": "MN: Brown"
        },
        {
            "value": "Carlton",
            "label": "MN: Carlton"
        },
        {
            "value": "Carver",
            "label": "MN: Carver"
        },
        {
            "value": "Cass",
            "label": "MN: Cass"
        },
        {
            "value": "Chippewa",
            "label": "MN: Chippewa"
        },
        {
            "value": "Chisago",
            "label": "MN: Chisago"
        },
        {
            "value": "Clay",
            "label": "MN: Clay"
        },
        {
            "value": "Clearwater",
            "label": "MN: Clearwater"
        },
        {
            "value": "Cook",
            "label": "MN: Cook"
        },
        {
            "value": "Cottonwood",
            "label": "MN: Cottonwood"
        },
        {
            "value": "Crow Wing",
            "label": "MN: Crow Wing"
        },
        {
            "value": "Dakota",
            "label": "MN: Dakota"
        },
        {
            "value": "Dodge",
            "label": "MN: Dodge"
        },
        {
            "value": "Douglas",
            "label": "MN: Douglas"
        },
        {
            "value": "Faribault",
            "label": "MN: Faribault"
        },
        {
            "value": "Fillmore",
            "label": "MN: Fillmore"
        },
        {
            "value": "Freeborn",
            "label": "MN: Freeborn"
        },
        {
            "value": "Goodhue",
            "label": "MN: Goodhue"
        },
        {
            "value": "Grant",
            "label": "MN: Grant"
        },
        {
            "value": "Hennepin",
            "label": "MN: Hennepin"
        },
        {
            "value": "Houston",
            "label": "MN: Houston"
        },
        {
            "value": "Hubbard",
            "label": "MN: Hubbard"
        },
        {
            "value": "Isanti",
            "label": "MN: Isanti"
        },
        {
            "value": "Itasca",
            "label": "MN: Itasca"
        },
        {
            "value": "Jackson",
            "label": "MN: Jackson"
        },
        {
            "value": "Kanabec",
            "label": "MN: Kanabec"
        },
        {
            "value": "Kandiyohi",
            "label": "MN: Kandiyohi"
        },
        {
            "value": "Kittson",
            "label": "MN: Kittson"
        },
        {
            "value": "Koochiching",
            "label": "MN: Koochiching"
        },
        {
            "value": "Lac qui Parle",
            "label": "MN: Lac qui Parle"
        },
        {
            "value": "Lake",
            "label": "MN: Lake"
        },
        {
            "value": "Lake of the Woods",
            "label": "MN: Lake of the Woods"
        },
        {
            "value": "Le Sueur",
            "label": "MN: Le Sueur"
        },
        {
            "value": "Lincoln",
            "label": "MN: Lincoln"
        },
        {
            "value": "Lyon",
            "label": "MN: Lyon"
        },
        {
            "value": "Mahnomen",
            "label": "MN: Mahnomen"
        },
        {
            "value": "Marshall",
            "label": "MN: Marshall"
        },
        {
            "value": "Martin",
            "label": "MN: Martin"
        },
        {
            "value": "McLeod",
            "label": "MN: McLeod"
        },
        {
            "value": "Meeker",
            "label": "MN: Meeker"
        },
        {
            "value": "Mille Lacs",
            "label": "MN: Mille Lacs"
        },
        {
            "value": "Morrison",
            "label": "MN: Morrison"
        },
        {
            "value": "Mower",
            "label": "MN: Mower"
        },
        {
            "value": "Murray",
            "label": "MN: Murray"
        },
        {
            "value": "Nicollet",
            "label": "MN: Nicollet"
        },
        {
            "value": "Nobles",
            "label": "MN: Nobles"
        },
        {
            "value": "Norman",
            "label": "MN: Norman"
        },
        {
            "value": "Olmsted",
            "label": "MN: Olmsted"
        },
        {
            "value": "Otter Tail",
            "label": "MN: Otter Tail"
        },
        {
            "value": "Pennington",
            "label": "MN: Pennington"
        },
        {
            "value": "Pine",
            "label": "MN: Pine"
        },
        {
            "value": "Pipestone",
            "label": "MN: Pipestone"
        },
        {
            "value": "Polk",
            "label": "MN: Polk"
        },
        {
            "value": "Pope",
            "label": "MN: Pope"
        },
        {
            "value": "Ramsey",
            "label": "MN: Ramsey"
        },
        {
            "value": "Red Lake",
            "label": "MN: Red Lake"
        },
        {
            "value": "Redwood",
            "label": "MN: Redwood"
        },
        {
            "value": "Renville",
            "label": "MN: Renville"
        },
        {
            "value": "Rice",
            "label": "MN: Rice"
        },
        {
            "value": "Rock",
            "label": "MN: Rock"
        },
        {
            "value": "Roseau",
            "label": "MN: Roseau"
        },
        {
            "value": "Scott",
            "label": "MN: Scott"
        },
        {
            "value": "Sherburne",
            "label": "MN: Sherburne"
        },
        {
            "value": "Sibley",
            "label": "MN: Sibley"
        },
        {
            "value": "St. Louis",
            "label": "MN: St. Louis"
        },
        {
            "value": "Stearns",
            "label": "MN: Stearns"
        },
        {
            "value": "Steele",
            "label": "MN: Steele"
        },
        {
            "value": "Stevens",
            "label": "MN: Stevens"
        },
        {
            "value": "Swift",
            "label": "MN: Swift"
        },
        {
            "value": "Todd",
            "label": "MN: Todd"
        },
        {
            "value": "Traverse",
            "label": "MN: Traverse"
        },
        {
            "value": "Wabasha",
            "label": "MN: Wabasha"
        },
        {
            "value": "Wadena",
            "label": "MN: Wadena"
        },
        {
            "value": "Waseca",
            "label": "MN: Waseca"
        },
        {
            "value": "Washington",
            "label": "MN: Washington"
        },
        {
            "value": "Watonwan",
            "label": "MN: Watonwan"
        },
        {
            "value": "Wilkin",
            "label": "MN: Wilkin"
        },
        {
            "value": "Winona",
            "label": "MN: Winona"
        },
        {
            "value": "Wright",
            "label": "MN: Wright"
        },
        {
            "value": "Yellow Medicine",
            "label": "MN: Yellow Medicine"
        },
        {
            "value": "Adair",
            "label": "MO: Adair"
        },
        {
            "value": "Andrew",
            "label": "MO: Andrew"
        },
        {
            "value": "Atchison",
            "label": "MO: Atchison"
        },
        {
            "value": "Audrain",
            "label": "MO: Audrain"
        },
        {
            "value": "Barry",
            "label": "MO: Barry"
        },
        {
            "value": "Barton",
            "label": "MO: Barton"
        },
        {
            "value": "Bates",
            "label": "MO: Bates"
        },
        {
            "value": "Benton",
            "label": "MO: Benton"
        },
        {
            "value": "Bollinger",
            "label": "MO: Bollinger"
        },
        {
            "value": "Boone",
            "label": "MO: Boone"
        },
        {
            "value": "Buchanan",
            "label": "MO: Buchanan"
        },
        {
            "value": "Butler",
            "label": "MO: Butler"
        },
        {
            "value": "Caldwell",
            "label": "MO: Caldwell"
        },
        {
            "value": "Callaway",
            "label": "MO: Callaway"
        },
        {
            "value": "Camden",
            "label": "MO: Camden"
        },
        {
            "value": "Cape Girardeau",
            "label": "MO: Cape Girardeau"
        },
        {
            "value": "Carroll",
            "label": "MO: Carroll"
        },
        {
            "value": "Carter",
            "label": "MO: Carter"
        },
        {
            "value": "Cass",
            "label": "MO: Cass"
        },
        {
            "value": "Cedar",
            "label": "MO: Cedar"
        },
        {
            "value": "Chariton",
            "label": "MO: Chariton"
        },
        {
            "value": "Christian",
            "label": "MO: Christian"
        },
        {
            "value": "Clark",
            "label": "MO: Clark"
        },
        {
            "value": "Clay",
            "label": "MO: Clay"
        },
        {
            "value": "Clinton",
            "label": "MO: Clinton"
        },
        {
            "value": "Cole",
            "label": "MO: Cole"
        },
        {
            "value": "Cooper",
            "label": "MO: Cooper"
        },
        {
            "value": "Crawford",
            "label": "MO: Crawford"
        },
        {
            "value": "Dade",
            "label": "MO: Dade"
        },
        {
            "value": "Dallas",
            "label": "MO: Dallas"
        },
        {
            "value": "Daviess",
            "label": "MO: Daviess"
        },
        {
            "value": "DeKalb",
            "label": "MO: DeKalb"
        },
        {
            "value": "Dent",
            "label": "MO: Dent"
        },
        {
            "value": "Douglas",
            "label": "MO: Douglas"
        },
        {
            "value": "Dunklin",
            "label": "MO: Dunklin"
        },
        {
            "value": "Franklin",
            "label": "MO: Franklin"
        },
        {
            "value": "Gasconade",
            "label": "MO: Gasconade"
        },
        {
            "value": "Gentry",
            "label": "MO: Gentry"
        },
        {
            "value": "Greene",
            "label": "MO: Greene"
        },
        {
            "value": "Grundy",
            "label": "MO: Grundy"
        },
        {
            "value": "Harrison",
            "label": "MO: Harrison"
        },
        {
            "value": "Henry",
            "label": "MO: Henry"
        },
        {
            "value": "Hickory",
            "label": "MO: Hickory"
        },
        {
            "value": "Holt",
            "label": "MO: Holt"
        },
        {
            "value": "Howard",
            "label": "MO: Howard"
        },
        {
            "value": "Howell",
            "label": "MO: Howell"
        },
        {
            "value": "Iron",
            "label": "MO: Iron"
        },
        {
            "value": "Jackson",
            "label": "MO: Jackson"
        },
        {
            "value": "Jasper",
            "label": "MO: Jasper"
        },
        {
            "value": "Jefferson",
            "label": "MO: Jefferson"
        },
        {
            "value": "Johnson",
            "label": "MO: Johnson"
        },
        {
            "value": "Knox",
            "label": "MO: Knox"
        },
        {
            "value": "Laclede",
            "label": "MO: Laclede"
        },
        {
            "value": "Lafayette",
            "label": "MO: Lafayette"
        },
        {
            "value": "Lawrence",
            "label": "MO: Lawrence"
        },
        {
            "value": "Lewis",
            "label": "MO: Lewis"
        },
        {
            "value": "Lincoln",
            "label": "MO: Lincoln"
        },
        {
            "value": "Linn",
            "label": "MO: Linn"
        },
        {
            "value": "Livingston",
            "label": "MO: Livingston"
        },
        {
            "value": "Macon",
            "label": "MO: Macon"
        },
        {
            "value": "Madison",
            "label": "MO: Madison"
        },
        {
            "value": "Maries",
            "label": "MO: Maries"
        },
        {
            "value": "Marion",
            "label": "MO: Marion"
        },
        {
            "value": "McDonald",
            "label": "MO: McDonald"
        },
        {
            "value": "Mercer",
            "label": "MO: Mercer"
        },
        {
            "value": "Miller",
            "label": "MO: Miller"
        },
        {
            "value": "Mississippi",
            "label": "MO: Mississippi"
        },
        {
            "value": "Moniteau",
            "label": "MO: Moniteau"
        },
        {
            "value": "Monroe",
            "label": "MO: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "MO: Montgomery"
        },
        {
            "value": "Morgan",
            "label": "MO: Morgan"
        },
        {
            "value": "New Madrid",
            "label": "MO: New Madrid"
        },
        {
            "value": "Newton",
            "label": "MO: Newton"
        },
        {
            "value": "Nodaway",
            "label": "MO: Nodaway"
        },
        {
            "value": "Oregon",
            "label": "MO: Oregon"
        },
        {
            "value": "Osage",
            "label": "MO: Osage"
        },
        {
            "value": "Ozark",
            "label": "MO: Ozark"
        },
        {
            "value": "Pemiscot",
            "label": "MO: Pemiscot"
        },
        {
            "value": "Perry",
            "label": "MO: Perry"
        },
        {
            "value": "Pettis",
            "label": "MO: Pettis"
        },
        {
            "value": "Phelps",
            "label": "MO: Phelps"
        },
        {
            "value": "Pike",
            "label": "MO: Pike"
        },
        {
            "value": "Platte",
            "label": "MO: Platte"
        },
        {
            "value": "Polk",
            "label": "MO: Polk"
        },
        {
            "value": "Pulaski",
            "label": "MO: Pulaski"
        },
        {
            "value": "Putnam",
            "label": "MO: Putnam"
        },
        {
            "value": "Ralls",
            "label": "MO: Ralls"
        },
        {
            "value": "Randolph",
            "label": "MO: Randolph"
        },
        {
            "value": "Ray",
            "label": "MO: Ray"
        },
        {
            "value": "Reynolds",
            "label": "MO: Reynolds"
        },
        {
            "value": "Ripley",
            "label": "MO: Ripley"
        },
        {
            "value": "Saline",
            "label": "MO: Saline"
        },
        {
            "value": "Schuyler",
            "label": "MO: Schuyler"
        },
        {
            "value": "Scotland",
            "label": "MO: Scotland"
        },
        {
            "value": "Scott",
            "label": "MO: Scott"
        },
        {
            "value": "Shannon",
            "label": "MO: Shannon"
        },
        {
            "value": "Shelby",
            "label": "MO: Shelby"
        },
        {
            "value": "St. Charles",
            "label": "MO: St. Charles"
        },
        {
            "value": "St. Clair",
            "label": "MO: St. Clair"
        },
        {
            "value": "St. Francois",
            "label": "MO: St. Francois"
        },
        {
            "value": "St. Louis",
            "label": "MO: St. Louis"
        },
        {
            "value": "St. Louis",
            "label": "MO: St. Louis"
        },
        {
            "value": "Ste. Genevieve",
            "label": "MO: Ste. Genevieve"
        },
        {
            "value": "Stoddard",
            "label": "MO: Stoddard"
        },
        {
            "value": "Stone",
            "label": "MO: Stone"
        },
        {
            "value": "Sullivan",
            "label": "MO: Sullivan"
        },
        {
            "value": "Taney",
            "label": "MO: Taney"
        },
        {
            "value": "Texas",
            "label": "MO: Texas"
        },
        {
            "value": "Vernon",
            "label": "MO: Vernon"
        },
        {
            "value": "Warren",
            "label": "MO: Warren"
        },
        {
            "value": "Washington",
            "label": "MO: Washington"
        },
        {
            "value": "Wayne",
            "label": "MO: Wayne"
        },
        {
            "value": "Webster",
            "label": "MO: Webster"
        },
        {
            "value": "Worth",
            "label": "MO: Worth"
        },
        {
            "value": "Wright",
            "label": "MO: Wright"
        },
        {
            "value": "Adams",
            "label": "MS: Adams"
        },
        {
            "value": "Alcorn",
            "label": "MS: Alcorn"
        },
        {
            "value": "Amite",
            "label": "MS: Amite"
        },
        {
            "value": "Attala",
            "label": "MS: Attala"
        },
        {
            "value": "Benton",
            "label": "MS: Benton"
        },
        {
            "value": "Bolivar",
            "label": "MS: Bolivar"
        },
        {
            "value": "Calhoun",
            "label": "MS: Calhoun"
        },
        {
            "value": "Carroll",
            "label": "MS: Carroll"
        },
        {
            "value": "Chickasaw",
            "label": "MS: Chickasaw"
        },
        {
            "value": "Choctaw",
            "label": "MS: Choctaw"
        },
        {
            "value": "Claiborne",
            "label": "MS: Claiborne"
        },
        {
            "value": "Clarke",
            "label": "MS: Clarke"
        },
        {
            "value": "Clay",
            "label": "MS: Clay"
        },
        {
            "value": "Coahoma",
            "label": "MS: Coahoma"
        },
        {
            "value": "Copiah",
            "label": "MS: Copiah"
        },
        {
            "value": "Covington",
            "label": "MS: Covington"
        },
        {
            "value": "DeSoto",
            "label": "MS: DeSoto"
        },
        {
            "value": "Forrest",
            "label": "MS: Forrest"
        },
        {
            "value": "Franklin",
            "label": "MS: Franklin"
        },
        {
            "value": "George",
            "label": "MS: George"
        },
        {
            "value": "Greene",
            "label": "MS: Greene"
        },
        {
            "value": "Grenada",
            "label": "MS: Grenada"
        },
        {
            "value": "Hancock",
            "label": "MS: Hancock"
        },
        {
            "value": "Harrison",
            "label": "MS: Harrison"
        },
        {
            "value": "Hinds",
            "label": "MS: Hinds"
        },
        {
            "value": "Holmes",
            "label": "MS: Holmes"
        },
        {
            "value": "Humphreys",
            "label": "MS: Humphreys"
        },
        {
            "value": "Issaquena",
            "label": "MS: Issaquena"
        },
        {
            "value": "Itawamba",
            "label": "MS: Itawamba"
        },
        {
            "value": "Jackson",
            "label": "MS: Jackson"
        },
        {
            "value": "Jasper",
            "label": "MS: Jasper"
        },
        {
            "value": "Jefferson",
            "label": "MS: Jefferson"
        },
        {
            "value": "Jefferson Davis",
            "label": "MS: Jefferson Davis"
        },
        {
            "value": "Jones",
            "label": "MS: Jones"
        },
        {
            "value": "Kemper",
            "label": "MS: Kemper"
        },
        {
            "value": "Lafayette",
            "label": "MS: Lafayette"
        },
        {
            "value": "Lamar",
            "label": "MS: Lamar"
        },
        {
            "value": "Lauderdale",
            "label": "MS: Lauderdale"
        },
        {
            "value": "Lawrence",
            "label": "MS: Lawrence"
        },
        {
            "value": "Leake",
            "label": "MS: Leake"
        },
        {
            "value": "Lee",
            "label": "MS: Lee"
        },
        {
            "value": "Leflore",
            "label": "MS: Leflore"
        },
        {
            "value": "Lincoln",
            "label": "MS: Lincoln"
        },
        {
            "value": "Lowndes",
            "label": "MS: Lowndes"
        },
        {
            "value": "Madison",
            "label": "MS: Madison"
        },
        {
            "value": "Marion",
            "label": "MS: Marion"
        },
        {
            "value": "Marshall",
            "label": "MS: Marshall"
        },
        {
            "value": "Monroe",
            "label": "MS: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "MS: Montgomery"
        },
        {
            "value": "Neshoba",
            "label": "MS: Neshoba"
        },
        {
            "value": "Newton",
            "label": "MS: Newton"
        },
        {
            "value": "Noxubee",
            "label": "MS: Noxubee"
        },
        {
            "value": "Oktibbeha",
            "label": "MS: Oktibbeha"
        },
        {
            "value": "Panola",
            "label": "MS: Panola"
        },
        {
            "value": "Pearl River",
            "label": "MS: Pearl River"
        },
        {
            "value": "Perry",
            "label": "MS: Perry"
        },
        {
            "value": "Pike",
            "label": "MS: Pike"
        },
        {
            "value": "Pontotoc",
            "label": "MS: Pontotoc"
        },
        {
            "value": "Prentiss",
            "label": "MS: Prentiss"
        },
        {
            "value": "Quitman",
            "label": "MS: Quitman"
        },
        {
            "value": "Rankin",
            "label": "MS: Rankin"
        },
        {
            "value": "Scott",
            "label": "MS: Scott"
        },
        {
            "value": "Sharkey",
            "label": "MS: Sharkey"
        },
        {
            "value": "Simpson",
            "label": "MS: Simpson"
        },
        {
            "value": "Smith",
            "label": "MS: Smith"
        },
        {
            "value": "Stone",
            "label": "MS: Stone"
        },
        {
            "value": "Sunflower",
            "label": "MS: Sunflower"
        },
        {
            "value": "Tallahatchie",
            "label": "MS: Tallahatchie"
        },
        {
            "value": "Tate",
            "label": "MS: Tate"
        },
        {
            "value": "Tippah",
            "label": "MS: Tippah"
        },
        {
            "value": "Tishomingo",
            "label": "MS: Tishomingo"
        },
        {
            "value": "Tunica",
            "label": "MS: Tunica"
        },
        {
            "value": "Union",
            "label": "MS: Union"
        },
        {
            "value": "Walthall",
            "label": "MS: Walthall"
        },
        {
            "value": "Warren",
            "label": "MS: Warren"
        },
        {
            "value": "Washington",
            "label": "MS: Washington"
        },
        {
            "value": "Wayne",
            "label": "MS: Wayne"
        },
        {
            "value": "Webster",
            "label": "MS: Webster"
        },
        {
            "value": "Wilkinson",
            "label": "MS: Wilkinson"
        },
        {
            "value": "Winston",
            "label": "MS: Winston"
        },
        {
            "value": "Yalobusha",
            "label": "MS: Yalobusha"
        },
        {
            "value": "Yazoo",
            "label": "MS: Yazoo"
        },
        {
            "value": "Beaverhead",
            "label": "MT: Beaverhead"
        },
        {
            "value": "Big Horn",
            "label": "MT: Big Horn"
        },
        {
            "value": "Blaine",
            "label": "MT: Blaine"
        },
        {
            "value": "Broadwater",
            "label": "MT: Broadwater"
        },
        {
            "value": "Carbon",
            "label": "MT: Carbon"
        },
        {
            "value": "Carter",
            "label": "MT: Carter"
        },
        {
            "value": "Cascade",
            "label": "MT: Cascade"
        },
        {
            "value": "Chouteau",
            "label": "MT: Chouteau"
        },
        {
            "value": "Custer",
            "label": "MT: Custer"
        },
        {
            "value": "Daniels",
            "label": "MT: Daniels"
        },
        {
            "value": "Dawson",
            "label": "MT: Dawson"
        },
        {
            "value": "Deer Lodge",
            "label": "MT: Deer Lodge"
        },
        {
            "value": "Fallon",
            "label": "MT: Fallon"
        },
        {
            "value": "Fergus",
            "label": "MT: Fergus"
        },
        {
            "value": "Flathead",
            "label": "MT: Flathead"
        },
        {
            "value": "Gallatin",
            "label": "MT: Gallatin"
        },
        {
            "value": "Garfield",
            "label": "MT: Garfield"
        },
        {
            "value": "Glacier",
            "label": "MT: Glacier"
        },
        {
            "value": "Golden Valley",
            "label": "MT: Golden Valley"
        },
        {
            "value": "Granite",
            "label": "MT: Granite"
        },
        {
            "value": "Hill",
            "label": "MT: Hill"
        },
        {
            "value": "Jefferson",
            "label": "MT: Jefferson"
        },
        {
            "value": "Judith Basin",
            "label": "MT: Judith Basin"
        },
        {
            "value": "Lake",
            "label": "MT: Lake"
        },
        {
            "value": "Lewis and Clark",
            "label": "MT: Lewis and Clark"
        },
        {
            "value": "Liberty",
            "label": "MT: Liberty"
        },
        {
            "value": "Lincoln",
            "label": "MT: Lincoln"
        },
        {
            "value": "Madison",
            "label": "MT: Madison"
        },
        {
            "value": "McCone",
            "label": "MT: McCone"
        },
        {
            "value": "Meagher",
            "label": "MT: Meagher"
        },
        {
            "value": "Mineral",
            "label": "MT: Mineral"
        },
        {
            "value": "Missoula",
            "label": "MT: Missoula"
        },
        {
            "value": "Musselshell",
            "label": "MT: Musselshell"
        },
        {
            "value": "Park",
            "label": "MT: Park"
        },
        {
            "value": "Petroleum",
            "label": "MT: Petroleum"
        },
        {
            "value": "Phillips",
            "label": "MT: Phillips"
        },
        {
            "value": "Pondera",
            "label": "MT: Pondera"
        },
        {
            "value": "Powder River",
            "label": "MT: Powder River"
        },
        {
            "value": "Powell",
            "label": "MT: Powell"
        },
        {
            "value": "Prairie",
            "label": "MT: Prairie"
        },
        {
            "value": "Ravalli",
            "label": "MT: Ravalli"
        },
        {
            "value": "Richland",
            "label": "MT: Richland"
        },
        {
            "value": "Roosevelt",
            "label": "MT: Roosevelt"
        },
        {
            "value": "Rosebud",
            "label": "MT: Rosebud"
        },
        {
            "value": "Sanders",
            "label": "MT: Sanders"
        },
        {
            "value": "Sheridan",
            "label": "MT: Sheridan"
        },
        {
            "value": "Silver Bow",
            "label": "MT: Silver Bow"
        },
        {
            "value": "Stillwater",
            "label": "MT: Stillwater"
        },
        {
            "value": "Sweet Grass",
            "label": "MT: Sweet Grass"
        },
        {
            "value": "Teton",
            "label": "MT: Teton"
        },
        {
            "value": "Toole",
            "label": "MT: Toole"
        },
        {
            "value": "Treasure",
            "label": "MT: Treasure"
        },
        {
            "value": "Valley",
            "label": "MT: Valley"
        },
        {
            "value": "Wheatland",
            "label": "MT: Wheatland"
        },
        {
            "value": "Wibaux",
            "label": "MT: Wibaux"
        },
        {
            "value": "Yellowstone",
            "label": "MT: Yellowstone"
        },
        {
            "value": "Alamance",
            "label": "NC: Alamance"
        },
        {
            "value": "Alexander",
            "label": "NC: Alexander"
        },
        {
            "value": "Alleghany",
            "label": "NC: Alleghany"
        },
        {
            "value": "Anson",
            "label": "NC: Anson"
        },
        {
            "value": "Ashe",
            "label": "NC: Ashe"
        },
        {
            "value": "Avery",
            "label": "NC: Avery"
        },
        {
            "value": "Beaufort",
            "label": "NC: Beaufort"
        },
        {
            "value": "Bertie",
            "label": "NC: Bertie"
        },
        {
            "value": "Bladen",
            "label": "NC: Bladen"
        },
        {
            "value": "Brunswick",
            "label": "NC: Brunswick"
        },
        {
            "value": "Buncombe",
            "label": "NC: Buncombe"
        },
        {
            "value": "Burke",
            "label": "NC: Burke"
        },
        {
            "value": "Cabarrus",
            "label": "NC: Cabarrus"
        },
        {
            "value": "Caldwell",
            "label": "NC: Caldwell"
        },
        {
            "value": "Camden",
            "label": "NC: Camden"
        },
        {
            "value": "Carteret",
            "label": "NC: Carteret"
        },
        {
            "value": "Caswell",
            "label": "NC: Caswell"
        },
        {
            "value": "Catawba",
            "label": "NC: Catawba"
        },
        {
            "value": "Chatham",
            "label": "NC: Chatham"
        },
        {
            "value": "Cherokee",
            "label": "NC: Cherokee"
        },
        {
            "value": "Chowan",
            "label": "NC: Chowan"
        },
        {
            "value": "Clay",
            "label": "NC: Clay"
        },
        {
            "value": "Cleveland",
            "label": "NC: Cleveland"
        },
        {
            "value": "Columbus",
            "label": "NC: Columbus"
        },
        {
            "value": "Craven",
            "label": "NC: Craven"
        },
        {
            "value": "Cumberland",
            "label": "NC: Cumberland"
        },
        {
            "value": "Currituck",
            "label": "NC: Currituck"
        },
        {
            "value": "Dare",
            "label": "NC: Dare"
        },
        {
            "value": "Davidson",
            "label": "NC: Davidson"
        },
        {
            "value": "Davie",
            "label": "NC: Davie"
        },
        {
            "value": "Duplin",
            "label": "NC: Duplin"
        },
        {
            "value": "Durham",
            "label": "NC: Durham"
        },
        {
            "value": "Edgecombe",
            "label": "NC: Edgecombe"
        },
        {
            "value": "Forsyth",
            "label": "NC: Forsyth"
        },
        {
            "value": "Franklin",
            "label": "NC: Franklin"
        },
        {
            "value": "Gaston",
            "label": "NC: Gaston"
        },
        {
            "value": "Gates",
            "label": "NC: Gates"
        },
        {
            "value": "Graham",
            "label": "NC: Graham"
        },
        {
            "value": "Granville",
            "label": "NC: Granville"
        },
        {
            "value": "Greene",
            "label": "NC: Greene"
        },
        {
            "value": "Guilford",
            "label": "NC: Guilford"
        },
        {
            "value": "Halifax",
            "label": "NC: Halifax"
        },
        {
            "value": "Harnett",
            "label": "NC: Harnett"
        },
        {
            "value": "Haywood",
            "label": "NC: Haywood"
        },
        {
            "value": "Henderson",
            "label": "NC: Henderson"
        },
        {
            "value": "Hertford",
            "label": "NC: Hertford"
        },
        {
            "value": "Hoke",
            "label": "NC: Hoke"
        },
        {
            "value": "Hyde",
            "label": "NC: Hyde"
        },
        {
            "value": "Iredell",
            "label": "NC: Iredell"
        },
        {
            "value": "Jackson",
            "label": "NC: Jackson"
        },
        {
            "value": "Johnston",
            "label": "NC: Johnston"
        },
        {
            "value": "Jones",
            "label": "NC: Jones"
        },
        {
            "value": "Lee",
            "label": "NC: Lee"
        },
        {
            "value": "Lenoir",
            "label": "NC: Lenoir"
        },
        {
            "value": "Lincoln",
            "label": "NC: Lincoln"
        },
        {
            "value": "Macon",
            "label": "NC: Macon"
        },
        {
            "value": "Madison",
            "label": "NC: Madison"
        },
        {
            "value": "Martin",
            "label": "NC: Martin"
        },
        {
            "value": "McDowell",
            "label": "NC: McDowell"
        },
        {
            "value": "Mecklenburg",
            "label": "NC: Mecklenburg"
        },
        {
            "value": "Mitchell",
            "label": "NC: Mitchell"
        },
        {
            "value": "Montgomery",
            "label": "NC: Montgomery"
        },
        {
            "value": "Moore",
            "label": "NC: Moore"
        },
        {
            "value": "Nash",
            "label": "NC: Nash"
        },
        {
            "value": "New Hanover",
            "label": "NC: New Hanover"
        },
        {
            "value": "Northampton",
            "label": "NC: Northampton"
        },
        {
            "value": "Onslow",
            "label": "NC: Onslow"
        },
        {
            "value": "Orange",
            "label": "NC: Orange"
        },
        {
            "value": "Pamlico",
            "label": "NC: Pamlico"
        },
        {
            "value": "Pasquotank",
            "label": "NC: Pasquotank"
        },
        {
            "value": "Pender",
            "label": "NC: Pender"
        },
        {
            "value": "Perquimans",
            "label": "NC: Perquimans"
        },
        {
            "value": "Person",
            "label": "NC: Person"
        },
        {
            "value": "Pitt",
            "label": "NC: Pitt"
        },
        {
            "value": "Polk",
            "label": "NC: Polk"
        },
        {
            "value": "Randolph",
            "label": "NC: Randolph"
        },
        {
            "value": "Richmond",
            "label": "NC: Richmond"
        },
        {
            "value": "Robeson",
            "label": "NC: Robeson"
        },
        {
            "value": "Rockingham",
            "label": "NC: Rockingham"
        },
        {
            "value": "Rowan",
            "label": "NC: Rowan"
        },
        {
            "value": "Rutherford",
            "label": "NC: Rutherford"
        },
        {
            "value": "Sampson",
            "label": "NC: Sampson"
        },
        {
            "value": "Scotland",
            "label": "NC: Scotland"
        },
        {
            "value": "Stanly",
            "label": "NC: Stanly"
        },
        {
            "value": "Stokes",
            "label": "NC: Stokes"
        },
        {
            "value": "Surry",
            "label": "NC: Surry"
        },
        {
            "value": "Swain",
            "label": "NC: Swain"
        },
        {
            "value": "Transylvania",
            "label": "NC: Transylvania"
        },
        {
            "value": "Tyrrell",
            "label": "NC: Tyrrell"
        },
        {
            "value": "Union",
            "label": "NC: Union"
        },
        {
            "value": "Vance",
            "label": "NC: Vance"
        },
        {
            "value": "Wake",
            "label": "NC: Wake"
        },
        {
            "value": "Warren",
            "label": "NC: Warren"
        },
        {
            "value": "Washington",
            "label": "NC: Washington"
        },
        {
            "value": "Watauga",
            "label": "NC: Watauga"
        },
        {
            "value": "Wayne",
            "label": "NC: Wayne"
        },
        {
            "value": "Wilkes",
            "label": "NC: Wilkes"
        },
        {
            "value": "Wilson",
            "label": "NC: Wilson"
        },
        {
            "value": "Yadkin",
            "label": "NC: Yadkin"
        },
        {
            "value": "Yancey",
            "label": "NC: Yancey"
        },
        {
            "value": "Adams",
            "label": "ND: Adams"
        },
        {
            "value": "Barnes",
            "label": "ND: Barnes"
        },
        {
            "value": "Benson",
            "label": "ND: Benson"
        },
        {
            "value": "Billings",
            "label": "ND: Billings"
        },
        {
            "value": "Bottineau",
            "label": "ND: Bottineau"
        },
        {
            "value": "Bowman",
            "label": "ND: Bowman"
        },
        {
            "value": "Burke",
            "label": "ND: Burke"
        },
        {
            "value": "Burleigh",
            "label": "ND: Burleigh"
        },
        {
            "value": "Cass",
            "label": "ND: Cass"
        },
        {
            "value": "Cavalier",
            "label": "ND: Cavalier"
        },
        {
            "value": "Dickey",
            "label": "ND: Dickey"
        },
        {
            "value": "Divide",
            "label": "ND: Divide"
        },
        {
            "value": "Dunn",
            "label": "ND: Dunn"
        },
        {
            "value": "Eddy",
            "label": "ND: Eddy"
        },
        {
            "value": "Emmons",
            "label": "ND: Emmons"
        },
        {
            "value": "Foster",
            "label": "ND: Foster"
        },
        {
            "value": "Golden Valley",
            "label": "ND: Golden Valley"
        },
        {
            "value": "Grand Forks",
            "label": "ND: Grand Forks"
        },
        {
            "value": "Grant",
            "label": "ND: Grant"
        },
        {
            "value": "Griggs",
            "label": "ND: Griggs"
        },
        {
            "value": "Hettinger",
            "label": "ND: Hettinger"
        },
        {
            "value": "Kidder",
            "label": "ND: Kidder"
        },
        {
            "value": "LaMoure",
            "label": "ND: LaMoure"
        },
        {
            "value": "Logan",
            "label": "ND: Logan"
        },
        {
            "value": "McHenry",
            "label": "ND: McHenry"
        },
        {
            "value": "McIntosh",
            "label": "ND: McIntosh"
        },
        {
            "value": "McKenzie",
            "label": "ND: McKenzie"
        },
        {
            "value": "McLean",
            "label": "ND: McLean"
        },
        {
            "value": "Mercer",
            "label": "ND: Mercer"
        },
        {
            "value": "Morton",
            "label": "ND: Morton"
        },
        {
            "value": "Mountrail",
            "label": "ND: Mountrail"
        },
        {
            "value": "Nelson",
            "label": "ND: Nelson"
        },
        {
            "value": "Oliver",
            "label": "ND: Oliver"
        },
        {
            "value": "Pembina",
            "label": "ND: Pembina"
        },
        {
            "value": "Pierce",
            "label": "ND: Pierce"
        },
        {
            "value": "Ramsey",
            "label": "ND: Ramsey"
        },
        {
            "value": "Ransom",
            "label": "ND: Ransom"
        },
        {
            "value": "Renville",
            "label": "ND: Renville"
        },
        {
            "value": "Richland",
            "label": "ND: Richland"
        },
        {
            "value": "Rolette",
            "label": "ND: Rolette"
        },
        {
            "value": "Sargent",
            "label": "ND: Sargent"
        },
        {
            "value": "Sheridan",
            "label": "ND: Sheridan"
        },
        {
            "value": "Sioux",
            "label": "ND: Sioux"
        },
        {
            "value": "Slope",
            "label": "ND: Slope"
        },
        {
            "value": "Stark",
            "label": "ND: Stark"
        },
        {
            "value": "Steele",
            "label": "ND: Steele"
        },
        {
            "value": "Stutsman",
            "label": "ND: Stutsman"
        },
        {
            "value": "Towner",
            "label": "ND: Towner"
        },
        {
            "value": "Traill",
            "label": "ND: Traill"
        },
        {
            "value": "Walsh",
            "label": "ND: Walsh"
        },
        {
            "value": "Ward",
            "label": "ND: Ward"
        },
        {
            "value": "Wells",
            "label": "ND: Wells"
        },
        {
            "value": "Williams",
            "label": "ND: Williams"
        },
        {
            "value": "Adams",
            "label": "NE: Adams"
        },
        {
            "value": "Antelope",
            "label": "NE: Antelope"
        },
        {
            "value": "Arthur",
            "label": "NE: Arthur"
        },
        {
            "value": "Banner",
            "label": "NE: Banner"
        },
        {
            "value": "Blaine",
            "label": "NE: Blaine"
        },
        {
            "value": "Boone",
            "label": "NE: Boone"
        },
        {
            "value": "Box Butte",
            "label": "NE: Box Butte"
        },
        {
            "value": "Boyd",
            "label": "NE: Boyd"
        },
        {
            "value": "Brown",
            "label": "NE: Brown"
        },
        {
            "value": "Buffalo",
            "label": "NE: Buffalo"
        },
        {
            "value": "Burt",
            "label": "NE: Burt"
        },
        {
            "value": "Butler",
            "label": "NE: Butler"
        },
        {
            "value": "Cass",
            "label": "NE: Cass"
        },
        {
            "value": "Cedar",
            "label": "NE: Cedar"
        },
        {
            "value": "Chase",
            "label": "NE: Chase"
        },
        {
            "value": "Cherry",
            "label": "NE: Cherry"
        },
        {
            "value": "Cheyenne",
            "label": "NE: Cheyenne"
        },
        {
            "value": "Clay",
            "label": "NE: Clay"
        },
        {
            "value": "Colfax",
            "label": "NE: Colfax"
        },
        {
            "value": "Cuming",
            "label": "NE: Cuming"
        },
        {
            "value": "Custer",
            "label": "NE: Custer"
        },
        {
            "value": "Dakota",
            "label": "NE: Dakota"
        },
        {
            "value": "Dawes",
            "label": "NE: Dawes"
        },
        {
            "value": "Dawson",
            "label": "NE: Dawson"
        },
        {
            "value": "Deuel",
            "label": "NE: Deuel"
        },
        {
            "value": "Dixon",
            "label": "NE: Dixon"
        },
        {
            "value": "Dodge",
            "label": "NE: Dodge"
        },
        {
            "value": "Douglas",
            "label": "NE: Douglas"
        },
        {
            "value": "Dundy",
            "label": "NE: Dundy"
        },
        {
            "value": "Fillmore",
            "label": "NE: Fillmore"
        },
        {
            "value": "Franklin",
            "label": "NE: Franklin"
        },
        {
            "value": "Frontier",
            "label": "NE: Frontier"
        },
        {
            "value": "Furnas",
            "label": "NE: Furnas"
        },
        {
            "value": "Gage",
            "label": "NE: Gage"
        },
        {
            "value": "Garden",
            "label": "NE: Garden"
        },
        {
            "value": "Garfield",
            "label": "NE: Garfield"
        },
        {
            "value": "Gosper",
            "label": "NE: Gosper"
        },
        {
            "value": "Grant",
            "label": "NE: Grant"
        },
        {
            "value": "Greeley",
            "label": "NE: Greeley"
        },
        {
            "value": "Hall",
            "label": "NE: Hall"
        },
        {
            "value": "Hamilton",
            "label": "NE: Hamilton"
        },
        {
            "value": "Harlan",
            "label": "NE: Harlan"
        },
        {
            "value": "Hayes",
            "label": "NE: Hayes"
        },
        {
            "value": "Hitchcock",
            "label": "NE: Hitchcock"
        },
        {
            "value": "Holt",
            "label": "NE: Holt"
        },
        {
            "value": "Hooker",
            "label": "NE: Hooker"
        },
        {
            "value": "Howard",
            "label": "NE: Howard"
        },
        {
            "value": "Jefferson",
            "label": "NE: Jefferson"
        },
        {
            "value": "Johnson",
            "label": "NE: Johnson"
        },
        {
            "value": "Kearney",
            "label": "NE: Kearney"
        },
        {
            "value": "Keith",
            "label": "NE: Keith"
        },
        {
            "value": "Keya Paha",
            "label": "NE: Keya Paha"
        },
        {
            "value": "Kimball",
            "label": "NE: Kimball"
        },
        {
            "value": "Knox",
            "label": "NE: Knox"
        },
        {
            "value": "Lancaster",
            "label": "NE: Lancaster"
        },
        {
            "value": "Lincoln",
            "label": "NE: Lincoln"
        },
        {
            "value": "Logan",
            "label": "NE: Logan"
        },
        {
            "value": "Loup",
            "label": "NE: Loup"
        },
        {
            "value": "Madison",
            "label": "NE: Madison"
        },
        {
            "value": "McPherson",
            "label": "NE: McPherson"
        },
        {
            "value": "Merrick",
            "label": "NE: Merrick"
        },
        {
            "value": "Morrill",
            "label": "NE: Morrill"
        },
        {
            "value": "Nance",
            "label": "NE: Nance"
        },
        {
            "value": "Nemaha",
            "label": "NE: Nemaha"
        },
        {
            "value": "Nuckolls",
            "label": "NE: Nuckolls"
        },
        {
            "value": "Otoe",
            "label": "NE: Otoe"
        },
        {
            "value": "Pawnee",
            "label": "NE: Pawnee"
        },
        {
            "value": "Perkins",
            "label": "NE: Perkins"
        },
        {
            "value": "Phelps",
            "label": "NE: Phelps"
        },
        {
            "value": "Pierce",
            "label": "NE: Pierce"
        },
        {
            "value": "Platte",
            "label": "NE: Platte"
        },
        {
            "value": "Polk",
            "label": "NE: Polk"
        },
        {
            "value": "Red Willow",
            "label": "NE: Red Willow"
        },
        {
            "value": "Richardson",
            "label": "NE: Richardson"
        },
        {
            "value": "Rock",
            "label": "NE: Rock"
        },
        {
            "value": "Saline",
            "label": "NE: Saline"
        },
        {
            "value": "Sarpy",
            "label": "NE: Sarpy"
        },
        {
            "value": "Saunders",
            "label": "NE: Saunders"
        },
        {
            "value": "Scotts Bluff",
            "label": "NE: Scotts Bluff"
        },
        {
            "value": "Seward",
            "label": "NE: Seward"
        },
        {
            "value": "Sheridan",
            "label": "NE: Sheridan"
        },
        {
            "value": "Sherman",
            "label": "NE: Sherman"
        },
        {
            "value": "Sioux",
            "label": "NE: Sioux"
        },
        {
            "value": "Stanton",
            "label": "NE: Stanton"
        },
        {
            "value": "Thayer",
            "label": "NE: Thayer"
        },
        {
            "value": "Thomas",
            "label": "NE: Thomas"
        },
        {
            "value": "Thurston",
            "label": "NE: Thurston"
        },
        {
            "value": "Valley",
            "label": "NE: Valley"
        },
        {
            "value": "Washington",
            "label": "NE: Washington"
        },
        {
            "value": "Wayne",
            "label": "NE: Wayne"
        },
        {
            "value": "Webster",
            "label": "NE: Webster"
        },
        {
            "value": "Wheeler",
            "label": "NE: Wheeler"
        },
        {
            "value": "York",
            "label": "NE: York"
        },
        {
            "value": "Belknap",
            "label": "NH: Belknap"
        },
        {
            "value": "Carroll",
            "label": "NH: Carroll"
        },
        {
            "value": "Cheshire",
            "label": "NH: Cheshire"
        },
        {
            "value": "Coos",
            "label": "NH: Coos"
        },
        {
            "value": "Grafton",
            "label": "NH: Grafton"
        },
        {
            "value": "Hillsborough",
            "label": "NH: Hillsborough"
        },
        {
            "value": "Merrimack",
            "label": "NH: Merrimack"
        },
        {
            "value": "Rockingham",
            "label": "NH: Rockingham"
        },
        {
            "value": "Strafford",
            "label": "NH: Strafford"
        },
        {
            "value": "Sullivan",
            "label": "NH: Sullivan"
        },
        {
            "value": "Atlantic",
            "label": "NJ: Atlantic"
        },
        {
            "value": "Bergen",
            "label": "NJ: Bergen"
        },
        {
            "value": "Burlington",
            "label": "NJ: Burlington"
        },
        {
            "value": "Camden",
            "label": "NJ: Camden"
        },
        {
            "value": "Cape May",
            "label": "NJ: Cape May"
        },
        {
            "value": "Cumberland",
            "label": "NJ: Cumberland"
        },
        {
            "value": "Essex",
            "label": "NJ: Essex"
        },
        {
            "value": "Gloucester",
            "label": "NJ: Gloucester"
        },
        {
            "value": "Hudson",
            "label": "NJ: Hudson"
        },
        {
            "value": "Hunterdon",
            "label": "NJ: Hunterdon"
        },
        {
            "value": "Mercer",
            "label": "NJ: Mercer"
        },
        {
            "value": "Middlesex",
            "label": "NJ: Middlesex"
        },
        {
            "value": "Monmouth",
            "label": "NJ: Monmouth"
        },
        {
            "value": "Morris",
            "label": "NJ: Morris"
        },
        {
            "value": "Ocean",
            "label": "NJ: Ocean"
        },
        {
            "value": "Passaic",
            "label": "NJ: Passaic"
        },
        {
            "value": "Salem",
            "label": "NJ: Salem"
        },
        {
            "value": "Somerset",
            "label": "NJ: Somerset"
        },
        {
            "value": "Sussex",
            "label": "NJ: Sussex"
        },
        {
            "value": "Union",
            "label": "NJ: Union"
        },
        {
            "value": "Warren",
            "label": "NJ: Warren"
        },
        {
            "value": "Bernalillo",
            "label": "NM: Bernalillo"
        },
        {
            "value": "Catron",
            "label": "NM: Catron"
        },
        {
            "value": "Chaves",
            "label": "NM: Chaves"
        },
        {
            "value": "Cibola",
            "label": "NM: Cibola"
        },
        {
            "value": "Colfax",
            "label": "NM: Colfax"
        },
        {
            "value": "Curry",
            "label": "NM: Curry"
        },
        {
            "value": "De Baca",
            "label": "NM: De Baca"
        },
        {
            "value": "Doña Ana",
            "label": "NM: Doña Ana"
        },
        {
            "value": "Eddy",
            "label": "NM: Eddy"
        },
        {
            "value": "Grant",
            "label": "NM: Grant"
        },
        {
            "value": "Guadalupe",
            "label": "NM: Guadalupe"
        },
        {
            "value": "Harding",
            "label": "NM: Harding"
        },
        {
            "value": "Hidalgo",
            "label": "NM: Hidalgo"
        },
        {
            "value": "Lea",
            "label": "NM: Lea"
        },
        {
            "value": "Lincoln",
            "label": "NM: Lincoln"
        },
        {
            "value": "Los Alamos",
            "label": "NM: Los Alamos"
        },
        {
            "value": "Luna",
            "label": "NM: Luna"
        },
        {
            "value": "McKinley",
            "label": "NM: McKinley"
        },
        {
            "value": "Mora",
            "label": "NM: Mora"
        },
        {
            "value": "Otero",
            "label": "NM: Otero"
        },
        {
            "value": "Quay",
            "label": "NM: Quay"
        },
        {
            "value": "Rio Arriba",
            "label": "NM: Rio Arriba"
        },
        {
            "value": "Roosevelt",
            "label": "NM: Roosevelt"
        },
        {
            "value": "San Juan",
            "label": "NM: San Juan"
        },
        {
            "value": "San Miguel",
            "label": "NM: San Miguel"
        },
        {
            "value": "Sandoval",
            "label": "NM: Sandoval"
        },
        {
            "value": "Santa Fe",
            "label": "NM: Santa Fe"
        },
        {
            "value": "Sierra",
            "label": "NM: Sierra"
        },
        {
            "value": "Socorro",
            "label": "NM: Socorro"
        },
        {
            "value": "Taos",
            "label": "NM: Taos"
        },
        {
            "value": "Torrance",
            "label": "NM: Torrance"
        },
        {
            "value": "Union",
            "label": "NM: Union"
        },
        {
            "value": "Valencia",
            "label": "NM: Valencia"
        },
        {
            "value": "Carson City",
            "label": "NV: Carson City"
        },
        {
            "value": "Churchill",
            "label": "NV: Churchill"
        },
        {
            "value": "Clark",
            "label": "NV: Clark"
        },
        {
            "value": "Douglas",
            "label": "NV: Douglas"
        },
        {
            "value": "Elko",
            "label": "NV: Elko"
        },
        {
            "value": "Esmeralda",
            "label": "NV: Esmeralda"
        },
        {
            "value": "Eureka",
            "label": "NV: Eureka"
        },
        {
            "value": "Humboldt",
            "label": "NV: Humboldt"
        },
        {
            "value": "Lander",
            "label": "NV: Lander"
        },
        {
            "value": "Lincoln",
            "label": "NV: Lincoln"
        },
        {
            "value": "Lyon",
            "label": "NV: Lyon"
        },
        {
            "value": "Mineral",
            "label": "NV: Mineral"
        },
        {
            "value": "Nye",
            "label": "NV: Nye"
        },
        {
            "value": "Pershing",
            "label": "NV: Pershing"
        },
        {
            "value": "Storey",
            "label": "NV: Storey"
        },
        {
            "value": "Washoe",
            "label": "NV: Washoe"
        },
        {
            "value": "White Pine",
            "label": "NV: White Pine"
        },
        {
            "value": "Albany",
            "label": "NY: Albany"
        },
        {
            "value": "Allegany",
            "label": "NY: Allegany"
        },
        {
            "value": "Bronx",
            "label": "NY: Bronx"
        },
        {
            "value": "Broome",
            "label": "NY: Broome"
        },
        {
            "value": "Cattaraugus",
            "label": "NY: Cattaraugus"
        },
        {
            "value": "Cayuga",
            "label": "NY: Cayuga"
        },
        {
            "value": "Chautauqua",
            "label": "NY: Chautauqua"
        },
        {
            "value": "Chemung",
            "label": "NY: Chemung"
        },
        {
            "value": "Chenango",
            "label": "NY: Chenango"
        },
        {
            "value": "Clinton",
            "label": "NY: Clinton"
        },
        {
            "value": "Columbia",
            "label": "NY: Columbia"
        },
        {
            "value": "Cortland",
            "label": "NY: Cortland"
        },
        {
            "value": "Delaware",
            "label": "NY: Delaware"
        },
        {
            "value": "Dutchess",
            "label": "NY: Dutchess"
        },
        {
            "value": "Erie",
            "label": "NY: Erie"
        },
        {
            "value": "Essex",
            "label": "NY: Essex"
        },
        {
            "value": "Franklin",
            "label": "NY: Franklin"
        },
        {
            "value": "Fulton",
            "label": "NY: Fulton"
        },
        {
            "value": "Genesee",
            "label": "NY: Genesee"
        },
        {
            "value": "Greene",
            "label": "NY: Greene"
        },
        {
            "value": "Hamilton",
            "label": "NY: Hamilton"
        },
        {
            "value": "Herkimer",
            "label": "NY: Herkimer"
        },
        {
            "value": "Jefferson",
            "label": "NY: Jefferson"
        },
        {
            "value": "Kings",
            "label": "NY: Kings"
        },
        {
            "value": "Lewis",
            "label": "NY: Lewis"
        },
        {
            "value": "Livingston",
            "label": "NY: Livingston"
        },
        {
            "value": "Madison",
            "label": "NY: Madison"
        },
        {
            "value": "Monroe",
            "label": "NY: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "NY: Montgomery"
        },
        {
            "value": "Nassau",
            "label": "NY: Nassau"
        },
        {
            "value": "New York",
            "label": "NY: New York"
        },
        {
            "value": "Niagara",
            "label": "NY: Niagara"
        },
        {
            "value": "Oneida",
            "label": "NY: Oneida"
        },
        {
            "value": "Onondaga",
            "label": "NY: Onondaga"
        },
        {
            "value": "Ontario",
            "label": "NY: Ontario"
        },
        {
            "value": "Orange",
            "label": "NY: Orange"
        },
        {
            "value": "Orleans",
            "label": "NY: Orleans"
        },
        {
            "value": "Oswego",
            "label": "NY: Oswego"
        },
        {
            "value": "Otsego",
            "label": "NY: Otsego"
        },
        {
            "value": "Putnam",
            "label": "NY: Putnam"
        },
        {
            "value": "Queens",
            "label": "NY: Queens"
        },
        {
            "value": "Rensselaer",
            "label": "NY: Rensselaer"
        },
        {
            "value": "Richmond",
            "label": "NY: Richmond"
        },
        {
            "value": "Rockland",
            "label": "NY: Rockland"
        },
        {
            "value": "Saratoga",
            "label": "NY: Saratoga"
        },
        {
            "value": "Schenectady",
            "label": "NY: Schenectady"
        },
        {
            "value": "Schoharie",
            "label": "NY: Schoharie"
        },
        {
            "value": "Schuyler",
            "label": "NY: Schuyler"
        },
        {
            "value": "Seneca",
            "label": "NY: Seneca"
        },
        {
            "value": "St. Lawrence",
            "label": "NY: St. Lawrence"
        },
        {
            "value": "Steuben",
            "label": "NY: Steuben"
        },
        {
            "value": "Suffolk",
            "label": "NY: Suffolk"
        },
        {
            "value": "Sullivan",
            "label": "NY: Sullivan"
        },
        {
            "value": "Tioga",
            "label": "NY: Tioga"
        },
        {
            "value": "Tompkins",
            "label": "NY: Tompkins"
        },
        {
            "value": "Ulster",
            "label": "NY: Ulster"
        },
        {
            "value": "Warren",
            "label": "NY: Warren"
        },
        {
            "value": "Washington",
            "label": "NY: Washington"
        },
        {
            "value": "Wayne",
            "label": "NY: Wayne"
        },
        {
            "value": "Westchester",
            "label": "NY: Westchester"
        },
        {
            "value": "Wyoming",
            "label": "NY: Wyoming"
        },
        {
            "value": "Yates",
            "label": "NY: Yates"
        },
        {
            "value": "Adams",
            "label": "OH: Adams"
        },
        {
            "value": "Allen",
            "label": "OH: Allen"
        },
        {
            "value": "Ashland",
            "label": "OH: Ashland"
        },
        {
            "value": "Ashtabula",
            "label": "OH: Ashtabula"
        },
        {
            "value": "Athens",
            "label": "OH: Athens"
        },
        {
            "value": "Auglaize",
            "label": "OH: Auglaize"
        },
        {
            "value": "Belmont",
            "label": "OH: Belmont"
        },
        {
            "value": "Brown",
            "label": "OH: Brown"
        },
        {
            "value": "Butler",
            "label": "OH: Butler"
        },
        {
            "value": "Carroll",
            "label": "OH: Carroll"
        },
        {
            "value": "Champaign",
            "label": "OH: Champaign"
        },
        {
            "value": "Clark",
            "label": "OH: Clark"
        },
        {
            "value": "Clermont",
            "label": "OH: Clermont"
        },
        {
            "value": "Clinton",
            "label": "OH: Clinton"
        },
        {
            "value": "Columbiana",
            "label": "OH: Columbiana"
        },
        {
            "value": "Coshocton",
            "label": "OH: Coshocton"
        },
        {
            "value": "Crawford",
            "label": "OH: Crawford"
        },
        {
            "value": "Cuyahoga",
            "label": "OH: Cuyahoga"
        },
        {
            "value": "Darke",
            "label": "OH: Darke"
        },
        {
            "value": "Defiance",
            "label": "OH: Defiance"
        },
        {
            "value": "Delaware",
            "label": "OH: Delaware"
        },
        {
            "value": "Erie",
            "label": "OH: Erie"
        },
        {
            "value": "Fairfield",
            "label": "OH: Fairfield"
        },
        {
            "value": "Fayette",
            "label": "OH: Fayette"
        },
        {
            "value": "Franklin",
            "label": "OH: Franklin"
        },
        {
            "value": "Fulton",
            "label": "OH: Fulton"
        },
        {
            "value": "Gallia",
            "label": "OH: Gallia"
        },
        {
            "value": "Geauga",
            "label": "OH: Geauga"
        },
        {
            "value": "Greene",
            "label": "OH: Greene"
        },
        {
            "value": "Guernsey",
            "label": "OH: Guernsey"
        },
        {
            "value": "Hamilton",
            "label": "OH: Hamilton"
        },
        {
            "value": "Hancock",
            "label": "OH: Hancock"
        },
        {
            "value": "Hardin",
            "label": "OH: Hardin"
        },
        {
            "value": "Harrison",
            "label": "OH: Harrison"
        },
        {
            "value": "Henry",
            "label": "OH: Henry"
        },
        {
            "value": "Highland",
            "label": "OH: Highland"
        },
        {
            "value": "Hocking",
            "label": "OH: Hocking"
        },
        {
            "value": "Holmes",
            "label": "OH: Holmes"
        },
        {
            "value": "Huron",
            "label": "OH: Huron"
        },
        {
            "value": "Jackson",
            "label": "OH: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "OH: Jefferson"
        },
        {
            "value": "Knox",
            "label": "OH: Knox"
        },
        {
            "value": "Lake",
            "label": "OH: Lake"
        },
        {
            "value": "Lawrence",
            "label": "OH: Lawrence"
        },
        {
            "value": "Licking",
            "label": "OH: Licking"
        },
        {
            "value": "Logan",
            "label": "OH: Logan"
        },
        {
            "value": "Lorain",
            "label": "OH: Lorain"
        },
        {
            "value": "Lucas",
            "label": "OH: Lucas"
        },
        {
            "value": "Madison",
            "label": "OH: Madison"
        },
        {
            "value": "Mahoning",
            "label": "OH: Mahoning"
        },
        {
            "value": "Marion",
            "label": "OH: Marion"
        },
        {
            "value": "Medina",
            "label": "OH: Medina"
        },
        {
            "value": "Meigs",
            "label": "OH: Meigs"
        },
        {
            "value": "Mercer",
            "label": "OH: Mercer"
        },
        {
            "value": "Miami",
            "label": "OH: Miami"
        },
        {
            "value": "Monroe",
            "label": "OH: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "OH: Montgomery"
        },
        {
            "value": "Morgan",
            "label": "OH: Morgan"
        },
        {
            "value": "Morrow",
            "label": "OH: Morrow"
        },
        {
            "value": "Muskingum",
            "label": "OH: Muskingum"
        },
        {
            "value": "Noble",
            "label": "OH: Noble"
        },
        {
            "value": "Ottawa",
            "label": "OH: Ottawa"
        },
        {
            "value": "Paulding",
            "label": "OH: Paulding"
        },
        {
            "value": "Perry",
            "label": "OH: Perry"
        },
        {
            "value": "Pickaway",
            "label": "OH: Pickaway"
        },
        {
            "value": "Pike",
            "label": "OH: Pike"
        },
        {
            "value": "Portage",
            "label": "OH: Portage"
        },
        {
            "value": "Preble",
            "label": "OH: Preble"
        },
        {
            "value": "Putnam",
            "label": "OH: Putnam"
        },
        {
            "value": "Richland",
            "label": "OH: Richland"
        },
        {
            "value": "Ross",
            "label": "OH: Ross"
        },
        {
            "value": "Sandusky",
            "label": "OH: Sandusky"
        },
        {
            "value": "Scioto",
            "label": "OH: Scioto"
        },
        {
            "value": "Seneca",
            "label": "OH: Seneca"
        },
        {
            "value": "Shelby",
            "label": "OH: Shelby"
        },
        {
            "value": "Stark",
            "label": "OH: Stark"
        },
        {
            "value": "Summit",
            "label": "OH: Summit"
        },
        {
            "value": "Trumbull",
            "label": "OH: Trumbull"
        },
        {
            "value": "Tuscarawas",
            "label": "OH: Tuscarawas"
        },
        {
            "value": "Union",
            "label": "OH: Union"
        },
        {
            "value": "Van Wert",
            "label": "OH: Van Wert"
        },
        {
            "value": "Vinton",
            "label": "OH: Vinton"
        },
        {
            "value": "Warren",
            "label": "OH: Warren"
        },
        {
            "value": "Washington",
            "label": "OH: Washington"
        },
        {
            "value": "Wayne",
            "label": "OH: Wayne"
        },
        {
            "value": "Williams",
            "label": "OH: Williams"
        },
        {
            "value": "Wood",
            "label": "OH: Wood"
        },
        {
            "value": "Wyandot",
            "label": "OH: Wyandot"
        },
        {
            "value": "Adair",
            "label": "OK: Adair"
        },
        {
            "value": "Alfalfa",
            "label": "OK: Alfalfa"
        },
        {
            "value": "Atoka",
            "label": "OK: Atoka"
        },
        {
            "value": "Beaver",
            "label": "OK: Beaver"
        },
        {
            "value": "Beckham",
            "label": "OK: Beckham"
        },
        {
            "value": "Blaine",
            "label": "OK: Blaine"
        },
        {
            "value": "Bryan",
            "label": "OK: Bryan"
        },
        {
            "value": "Caddo",
            "label": "OK: Caddo"
        },
        {
            "value": "Canadian",
            "label": "OK: Canadian"
        },
        {
            "value": "Carter",
            "label": "OK: Carter"
        },
        {
            "value": "Cherokee",
            "label": "OK: Cherokee"
        },
        {
            "value": "Choctaw",
            "label": "OK: Choctaw"
        },
        {
            "value": "Cimarron",
            "label": "OK: Cimarron"
        },
        {
            "value": "Cleveland",
            "label": "OK: Cleveland"
        },
        {
            "value": "Coal",
            "label": "OK: Coal"
        },
        {
            "value": "Comanche",
            "label": "OK: Comanche"
        },
        {
            "value": "Cotton",
            "label": "OK: Cotton"
        },
        {
            "value": "Craig",
            "label": "OK: Craig"
        },
        {
            "value": "Creek",
            "label": "OK: Creek"
        },
        {
            "value": "Custer",
            "label": "OK: Custer"
        },
        {
            "value": "Delaware",
            "label": "OK: Delaware"
        },
        {
            "value": "Dewey",
            "label": "OK: Dewey"
        },
        {
            "value": "Ellis",
            "label": "OK: Ellis"
        },
        {
            "value": "Garfield",
            "label": "OK: Garfield"
        },
        {
            "value": "Garvin",
            "label": "OK: Garvin"
        },
        {
            "value": "Grady",
            "label": "OK: Grady"
        },
        {
            "value": "Grant",
            "label": "OK: Grant"
        },
        {
            "value": "Greer",
            "label": "OK: Greer"
        },
        {
            "value": "Harmon",
            "label": "OK: Harmon"
        },
        {
            "value": "Harper",
            "label": "OK: Harper"
        },
        {
            "value": "Haskell",
            "label": "OK: Haskell"
        },
        {
            "value": "Hughes",
            "label": "OK: Hughes"
        },
        {
            "value": "Jackson",
            "label": "OK: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "OK: Jefferson"
        },
        {
            "value": "Johnston",
            "label": "OK: Johnston"
        },
        {
            "value": "Kay",
            "label": "OK: Kay"
        },
        {
            "value": "Kingfisher",
            "label": "OK: Kingfisher"
        },
        {
            "value": "Kiowa",
            "label": "OK: Kiowa"
        },
        {
            "value": "Latimer",
            "label": "OK: Latimer"
        },
        {
            "value": "Le Flore",
            "label": "OK: Le Flore"
        },
        {
            "value": "Lincoln",
            "label": "OK: Lincoln"
        },
        {
            "value": "Logan",
            "label": "OK: Logan"
        },
        {
            "value": "Love",
            "label": "OK: Love"
        },
        {
            "value": "Major",
            "label": "OK: Major"
        },
        {
            "value": "Marshall",
            "label": "OK: Marshall"
        },
        {
            "value": "Mayes",
            "label": "OK: Mayes"
        },
        {
            "value": "McClain",
            "label": "OK: McClain"
        },
        {
            "value": "McCurtain",
            "label": "OK: McCurtain"
        },
        {
            "value": "McIntosh",
            "label": "OK: McIntosh"
        },
        {
            "value": "Murray",
            "label": "OK: Murray"
        },
        {
            "value": "Muskogee",
            "label": "OK: Muskogee"
        },
        {
            "value": "Noble",
            "label": "OK: Noble"
        },
        {
            "value": "Nowata",
            "label": "OK: Nowata"
        },
        {
            "value": "Okfuskee",
            "label": "OK: Okfuskee"
        },
        {
            "value": "Oklahoma",
            "label": "OK: Oklahoma"
        },
        {
            "value": "Okmulgee",
            "label": "OK: Okmulgee"
        },
        {
            "value": "Osage",
            "label": "OK: Osage"
        },
        {
            "value": "Ottawa",
            "label": "OK: Ottawa"
        },
        {
            "value": "Pawnee",
            "label": "OK: Pawnee"
        },
        {
            "value": "Payne",
            "label": "OK: Payne"
        },
        {
            "value": "Pittsburg",
            "label": "OK: Pittsburg"
        },
        {
            "value": "Pontotoc",
            "label": "OK: Pontotoc"
        },
        {
            "value": "Pottawatomie",
            "label": "OK: Pottawatomie"
        },
        {
            "value": "Pushmataha",
            "label": "OK: Pushmataha"
        },
        {
            "value": "Roger Mills",
            "label": "OK: Roger Mills"
        },
        {
            "value": "Rogers",
            "label": "OK: Rogers"
        },
        {
            "value": "Seminole",
            "label": "OK: Seminole"
        },
        {
            "value": "Sequoyah",
            "label": "OK: Sequoyah"
        },
        {
            "value": "Stephens",
            "label": "OK: Stephens"
        },
        {
            "value": "Texas",
            "label": "OK: Texas"
        },
        {
            "value": "Tillman",
            "label": "OK: Tillman"
        },
        {
            "value": "Tulsa",
            "label": "OK: Tulsa"
        },
        {
            "value": "Wagoner",
            "label": "OK: Wagoner"
        },
        {
            "value": "Washington",
            "label": "OK: Washington"
        },
        {
            "value": "Washita",
            "label": "OK: Washita"
        },
        {
            "value": "Woods",
            "label": "OK: Woods"
        },
        {
            "value": "Woodward",
            "label": "OK: Woodward"
        },
        {
            "value": "Baker",
            "label": "OR: Baker"
        },
        {
            "value": "Benton",
            "label": "OR: Benton"
        },
        {
            "value": "Clackamas",
            "label": "OR: Clackamas"
        },
        {
            "value": "Clatsop",
            "label": "OR: Clatsop"
        },
        {
            "value": "Columbia",
            "label": "OR: Columbia"
        },
        {
            "value": "Coos",
            "label": "OR: Coos"
        },
        {
            "value": "Crook",
            "label": "OR: Crook"
        },
        {
            "value": "Curry",
            "label": "OR: Curry"
        },
        {
            "value": "Deschutes",
            "label": "OR: Deschutes"
        },
        {
            "value": "Douglas",
            "label": "OR: Douglas"
        },
        {
            "value": "Gilliam",
            "label": "OR: Gilliam"
        },
        {
            "value": "Grant",
            "label": "OR: Grant"
        },
        {
            "value": "Harney",
            "label": "OR: Harney"
        },
        {
            "value": "Hood River",
            "label": "OR: Hood River"
        },
        {
            "value": "Jackson",
            "label": "OR: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "OR: Jefferson"
        },
        {
            "value": "Josephine",
            "label": "OR: Josephine"
        },
        {
            "value": "Klamath",
            "label": "OR: Klamath"
        },
        {
            "value": "Lake",
            "label": "OR: Lake"
        },
        {
            "value": "Lane",
            "label": "OR: Lane"
        },
        {
            "value": "Lincoln",
            "label": "OR: Lincoln"
        },
        {
            "value": "Linn",
            "label": "OR: Linn"
        },
        {
            "value": "Malheur",
            "label": "OR: Malheur"
        },
        {
            "value": "Marion",
            "label": "OR: Marion"
        },
        {
            "value": "Morrow",
            "label": "OR: Morrow"
        },
        {
            "value": "Multnomah",
            "label": "OR: Multnomah"
        },
        {
            "value": "Polk",
            "label": "OR: Polk"
        },
        {
            "value": "Sherman",
            "label": "OR: Sherman"
        },
        {
            "value": "Tillamook",
            "label": "OR: Tillamook"
        },
        {
            "value": "Umatilla",
            "label": "OR: Umatilla"
        },
        {
            "value": "Union",
            "label": "OR: Union"
        },
        {
            "value": "Wallowa",
            "label": "OR: Wallowa"
        },
        {
            "value": "Wasco",
            "label": "OR: Wasco"
        },
        {
            "value": "Washington",
            "label": "OR: Washington"
        },
        {
            "value": "Wheeler",
            "label": "OR: Wheeler"
        },
        {
            "value": "Yamhill",
            "label": "OR: Yamhill"
        },
        {
            "value": "Adams",
            "label": "PA: Adams"
        },
        {
            "value": "Allegheny",
            "label": "PA: Allegheny"
        },
        {
            "value": "Armstrong",
            "label": "PA: Armstrong"
        },
        {
            "value": "Beaver",
            "label": "PA: Beaver"
        },
        {
            "value": "Bedford",
            "label": "PA: Bedford"
        },
        {
            "value": "Berks",
            "label": "PA: Berks"
        },
        {
            "value": "Blair",
            "label": "PA: Blair"
        },
        {
            "value": "Bradford",
            "label": "PA: Bradford"
        },
        {
            "value": "Bucks",
            "label": "PA: Bucks"
        },
        {
            "value": "Butler",
            "label": "PA: Butler"
        },
        {
            "value": "Cambria",
            "label": "PA: Cambria"
        },
        {
            "value": "Cameron",
            "label": "PA: Cameron"
        },
        {
            "value": "Carbon",
            "label": "PA: Carbon"
        },
        {
            "value": "Centre",
            "label": "PA: Centre"
        },
        {
            "value": "Chester",
            "label": "PA: Chester"
        },
        {
            "value": "Clarion",
            "label": "PA: Clarion"
        },
        {
            "value": "Clearfield",
            "label": "PA: Clearfield"
        },
        {
            "value": "Clinton",
            "label": "PA: Clinton"
        },
        {
            "value": "Columbia",
            "label": "PA: Columbia"
        },
        {
            "value": "Crawford",
            "label": "PA: Crawford"
        },
        {
            "value": "Cumberland",
            "label": "PA: Cumberland"
        },
        {
            "value": "Dauphin",
            "label": "PA: Dauphin"
        },
        {
            "value": "Delaware",
            "label": "PA: Delaware"
        },
        {
            "value": "Elk",
            "label": "PA: Elk"
        },
        {
            "value": "Erie",
            "label": "PA: Erie"
        },
        {
            "value": "Fayette",
            "label": "PA: Fayette"
        },
        {
            "value": "Forest",
            "label": "PA: Forest"
        },
        {
            "value": "Franklin",
            "label": "PA: Franklin"
        },
        {
            "value": "Fulton",
            "label": "PA: Fulton"
        },
        {
            "value": "Greene",
            "label": "PA: Greene"
        },
        {
            "value": "Huntingdon",
            "label": "PA: Huntingdon"
        },
        {
            "value": "Indiana",
            "label": "PA: Indiana"
        },
        {
            "value": "Jefferson",
            "label": "PA: Jefferson"
        },
        {
            "value": "Juniata",
            "label": "PA: Juniata"
        },
        {
            "value": "Lackawanna",
            "label": "PA: Lackawanna"
        },
        {
            "value": "Lancaster",
            "label": "PA: Lancaster"
        },
        {
            "value": "Lawrence",
            "label": "PA: Lawrence"
        },
        {
            "value": "Lebanon",
            "label": "PA: Lebanon"
        },
        {
            "value": "Lehigh",
            "label": "PA: Lehigh"
        },
        {
            "value": "Luzerne",
            "label": "PA: Luzerne"
        },
        {
            "value": "Lycoming",
            "label": "PA: Lycoming"
        },
        {
            "value": "McKean",
            "label": "PA: McKean"
        },
        {
            "value": "Mercer",
            "label": "PA: Mercer"
        },
        {
            "value": "Mifflin",
            "label": "PA: Mifflin"
        },
        {
            "value": "Monroe",
            "label": "PA: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "PA: Montgomery"
        },
        {
            "value": "Montour",
            "label": "PA: Montour"
        },
        {
            "value": "Northampton",
            "label": "PA: Northampton"
        },
        {
            "value": "Northumberland",
            "label": "PA: Northumberland"
        },
        {
            "value": "Perry",
            "label": "PA: Perry"
        },
        {
            "value": "Philadelphia",
            "label": "PA: Philadelphia"
        },
        {
            "value": "Pike",
            "label": "PA: Pike"
        },
        {
            "value": "Potter",
            "label": "PA: Potter"
        },
        {
            "value": "Schuylkill",
            "label": "PA: Schuylkill"
        },
        {
            "value": "Snyder",
            "label": "PA: Snyder"
        },
        {
            "value": "Somerset",
            "label": "PA: Somerset"
        },
        {
            "value": "Sullivan",
            "label": "PA: Sullivan"
        },
        {
            "value": "Susquehanna",
            "label": "PA: Susquehanna"
        },
        {
            "value": "Tioga",
            "label": "PA: Tioga"
        },
        {
            "value": "Union",
            "label": "PA: Union"
        },
        {
            "value": "Venango",
            "label": "PA: Venango"
        },
        {
            "value": "Warren",
            "label": "PA: Warren"
        },
        {
            "value": "Washington",
            "label": "PA: Washington"
        },
        {
            "value": "Wayne",
            "label": "PA: Wayne"
        },
        {
            "value": "Westmoreland",
            "label": "PA: Westmoreland"
        },
        {
            "value": "Wyoming",
            "label": "PA: Wyoming"
        },
        {
            "value": "York",
            "label": "PA: York"
        },
        {
            "value": "Adjuntas",
            "label": "PR: Adjuntas"
        },
        {
            "value": "Aguada",
            "label": "PR: Aguada"
        },
        {
            "value": "Aguadilla",
            "label": "PR: Aguadilla"
        },
        {
            "value": "Aguas Buenas",
            "label": "PR: Aguas Buenas"
        },
        {
            "value": "Aibonito",
            "label": "PR: Aibonito"
        },
        {
            "value": "Añasco",
            "label": "PR: Añasco"
        },
        {
            "value": "Arecibo",
            "label": "PR: Arecibo"
        },
        {
            "value": "Arroyo",
            "label": "PR: Arroyo"
        },
        {
            "value": "Barceloneta",
            "label": "PR: Barceloneta"
        },
        {
            "value": "Barranquitas",
            "label": "PR: Barranquitas"
        },
        {
            "value": "Bayamón",
            "label": "PR: Bayamón"
        },
        {
            "value": "Cabo Rojo",
            "label": "PR: Cabo Rojo"
        },
        {
            "value": "Caguas",
            "label": "PR: Caguas"
        },
        {
            "value": "Camuy",
            "label": "PR: Camuy"
        },
        {
            "value": "Canóvanas",
            "label": "PR: Canóvanas"
        },
        {
            "value": "Carolina",
            "label": "PR: Carolina"
        },
        {
            "value": "Cataño",
            "label": "PR: Cataño"
        },
        {
            "value": "Cayey",
            "label": "PR: Cayey"
        },
        {
            "value": "Ceiba",
            "label": "PR: Ceiba"
        },
        {
            "value": "Ciales",
            "label": "PR: Ciales"
        },
        {
            "value": "Cidra",
            "label": "PR: Cidra"
        },
        {
            "value": "Coamo",
            "label": "PR: Coamo"
        },
        {
            "value": "Comerío",
            "label": "PR: Comerío"
        },
        {
            "value": "Corozal",
            "label": "PR: Corozal"
        },
        {
            "value": "Culebra",
            "label": "PR: Culebra"
        },
        {
            "value": "Dorado",
            "label": "PR: Dorado"
        },
        {
            "value": "Fajardo",
            "label": "PR: Fajardo"
        },
        {
            "value": "Florida",
            "label": "PR: Florida"
        },
        {
            "value": "Guánica",
            "label": "PR: Guánica"
        },
        {
            "value": "Guayama",
            "label": "PR: Guayama"
        },
        {
            "value": "Guayanilla",
            "label": "PR: Guayanilla"
        },
        {
            "value": "Guaynabo",
            "label": "PR: Guaynabo"
        },
        {
            "value": "Gurabo",
            "label": "PR: Gurabo"
        },
        {
            "value": "Hatillo",
            "label": "PR: Hatillo"
        },
        {
            "value": "Hormigueros",
            "label": "PR: Hormigueros"
        },
        {
            "value": "Humacao",
            "label": "PR: Humacao"
        },
        {
            "value": "Isabela",
            "label": "PR: Isabela"
        },
        {
            "value": "Jayuya",
            "label": "PR: Jayuya"
        },
        {
            "value": "Juana Díaz",
            "label": "PR: Juana Díaz"
        },
        {
            "value": "Juncos",
            "label": "PR: Juncos"
        },
        {
            "value": "Lajas",
            "label": "PR: Lajas"
        },
        {
            "value": "Lares",
            "label": "PR: Lares"
        },
        {
            "value": "Las Marías",
            "label": "PR: Las Marías"
        },
        {
            "value": "Las Piedras",
            "label": "PR: Las Piedras"
        },
        {
            "value": "Loíza",
            "label": "PR: Loíza"
        },
        {
            "value": "Luquillo",
            "label": "PR: Luquillo"
        },
        {
            "value": "Manatí",
            "label": "PR: Manatí"
        },
        {
            "value": "Maricao",
            "label": "PR: Maricao"
        },
        {
            "value": "Maunabo",
            "label": "PR: Maunabo"
        },
        {
            "value": "Mayagüez",
            "label": "PR: Mayagüez"
        },
        {
            "value": "Moca",
            "label": "PR: Moca"
        },
        {
            "value": "Morovis",
            "label": "PR: Morovis"
        },
        {
            "value": "Naguabo",
            "label": "PR: Naguabo"
        },
        {
            "value": "Naranjito",
            "label": "PR: Naranjito"
        },
        {
            "value": "Orocovis",
            "label": "PR: Orocovis"
        },
        {
            "value": "Patillas",
            "label": "PR: Patillas"
        },
        {
            "value": "Peñuelas",
            "label": "PR: Peñuelas"
        },
        {
            "value": "Ponce",
            "label": "PR: Ponce"
        },
        {
            "value": "Quebradillas",
            "label": "PR: Quebradillas"
        },
        {
            "value": "Rincón",
            "label": "PR: Rincón"
        },
        {
            "value": "Río Grande",
            "label": "PR: Río Grande"
        },
        {
            "value": "Sabana Grande",
            "label": "PR: Sabana Grande"
        },
        {
            "value": "Salinas",
            "label": "PR: Salinas"
        },
        {
            "value": "San Germán",
            "label": "PR: San Germán"
        },
        {
            "value": "San Juan",
            "label": "PR: San Juan"
        },
        {
            "value": "San Lorenzo",
            "label": "PR: San Lorenzo"
        },
        {
            "value": "San Sebastián",
            "label": "PR: San Sebastián"
        },
        {
            "value": "Santa Isabel",
            "label": "PR: Santa Isabel"
        },
        {
            "value": "Toa Alta",
            "label": "PR: Toa Alta"
        },
        {
            "value": "Toa Baja",
            "label": "PR: Toa Baja"
        },
        {
            "value": "Trujillo Alto",
            "label": "PR: Trujillo Alto"
        },
        {
            "value": "Utuado",
            "label": "PR: Utuado"
        },
        {
            "value": "Vega Alta",
            "label": "PR: Vega Alta"
        },
        {
            "value": "Vega Baja",
            "label": "PR: Vega Baja"
        },
        {
            "value": "Vieques",
            "label": "PR: Vieques"
        },
        {
            "value": "Villalba",
            "label": "PR: Villalba"
        },
        {
            "value": "Yabucoa",
            "label": "PR: Yabucoa"
        },
        {
            "value": "Yauco",
            "label": "PR: Yauco"
        },
        {
            "value": "Bristol",
            "label": "RI: Bristol"
        },
        {
            "value": "Kent",
            "label": "RI: Kent"
        },
        {
            "value": "Newport",
            "label": "RI: Newport"
        },
        {
            "value": "Providence",
            "label": "RI: Providence"
        },
        {
            "value": "Washington",
            "label": "RI: Washington"
        },
        {
            "value": "Abbeville",
            "label": "SC: Abbeville"
        },
        {
            "value": "Aiken",
            "label": "SC: Aiken"
        },
        {
            "value": "Allendale",
            "label": "SC: Allendale"
        },
        {
            "value": "Anderson",
            "label": "SC: Anderson"
        },
        {
            "value": "Bamberg",
            "label": "SC: Bamberg"
        },
        {
            "value": "Barnwell",
            "label": "SC: Barnwell"
        },
        {
            "value": "Beaufort",
            "label": "SC: Beaufort"
        },
        {
            "value": "Berkeley",
            "label": "SC: Berkeley"
        },
        {
            "value": "Calhoun",
            "label": "SC: Calhoun"
        },
        {
            "value": "Charleston",
            "label": "SC: Charleston"
        },
        {
            "value": "Cherokee",
            "label": "SC: Cherokee"
        },
        {
            "value": "Chester",
            "label": "SC: Chester"
        },
        {
            "value": "Chesterfield",
            "label": "SC: Chesterfield"
        },
        {
            "value": "Clarendon",
            "label": "SC: Clarendon"
        },
        {
            "value": "Colleton",
            "label": "SC: Colleton"
        },
        {
            "value": "Darlington",
            "label": "SC: Darlington"
        },
        {
            "value": "Dillon",
            "label": "SC: Dillon"
        },
        {
            "value": "Dorchester",
            "label": "SC: Dorchester"
        },
        {
            "value": "Edgefield",
            "label": "SC: Edgefield"
        },
        {
            "value": "Fairfield",
            "label": "SC: Fairfield"
        },
        {
            "value": "Florence",
            "label": "SC: Florence"
        },
        {
            "value": "Georgetown",
            "label": "SC: Georgetown"
        },
        {
            "value": "Greenville",
            "label": "SC: Greenville"
        },
        {
            "value": "Greenwood",
            "label": "SC: Greenwood"
        },
        {
            "value": "Hampton",
            "label": "SC: Hampton"
        },
        {
            "value": "Horry",
            "label": "SC: Horry"
        },
        {
            "value": "Jasper",
            "label": "SC: Jasper"
        },
        {
            "value": "Kershaw",
            "label": "SC: Kershaw"
        },
        {
            "value": "Lancaster",
            "label": "SC: Lancaster"
        },
        {
            "value": "Laurens",
            "label": "SC: Laurens"
        },
        {
            "value": "Lee",
            "label": "SC: Lee"
        },
        {
            "value": "Lexington",
            "label": "SC: Lexington"
        },
        {
            "value": "Marion",
            "label": "SC: Marion"
        },
        {
            "value": "Marlboro",
            "label": "SC: Marlboro"
        },
        {
            "value": "McCormick",
            "label": "SC: McCormick"
        },
        {
            "value": "Newberry",
            "label": "SC: Newberry"
        },
        {
            "value": "Oconee",
            "label": "SC: Oconee"
        },
        {
            "value": "Orangeburg",
            "label": "SC: Orangeburg"
        },
        {
            "value": "Pickens",
            "label": "SC: Pickens"
        },
        {
            "value": "Richland",
            "label": "SC: Richland"
        },
        {
            "value": "Saluda",
            "label": "SC: Saluda"
        },
        {
            "value": "Spartanburg",
            "label": "SC: Spartanburg"
        },
        {
            "value": "Sumter",
            "label": "SC: Sumter"
        },
        {
            "value": "Union",
            "label": "SC: Union"
        },
        {
            "value": "Williamsburg",
            "label": "SC: Williamsburg"
        },
        {
            "value": "York",
            "label": "SC: York"
        },
        {
            "value": "Aurora",
            "label": "SD: Aurora"
        },
        {
            "value": "Beadle",
            "label": "SD: Beadle"
        },
        {
            "value": "Bennett",
            "label": "SD: Bennett"
        },
        {
            "value": "Bon Homme",
            "label": "SD: Bon Homme"
        },
        {
            "value": "Brookings",
            "label": "SD: Brookings"
        },
        {
            "value": "Brown",
            "label": "SD: Brown"
        },
        {
            "value": "Brule",
            "label": "SD: Brule"
        },
        {
            "value": "Buffalo",
            "label": "SD: Buffalo"
        },
        {
            "value": "Butte",
            "label": "SD: Butte"
        },
        {
            "value": "Campbell",
            "label": "SD: Campbell"
        },
        {
            "value": "Charles Mix",
            "label": "SD: Charles Mix"
        },
        {
            "value": "Clark",
            "label": "SD: Clark"
        },
        {
            "value": "Clay",
            "label": "SD: Clay"
        },
        {
            "value": "Codington",
            "label": "SD: Codington"
        },
        {
            "value": "Corson",
            "label": "SD: Corson"
        },
        {
            "value": "Custer",
            "label": "SD: Custer"
        },
        {
            "value": "Davison",
            "label": "SD: Davison"
        },
        {
            "value": "Day",
            "label": "SD: Day"
        },
        {
            "value": "Deuel",
            "label": "SD: Deuel"
        },
        {
            "value": "Dewey",
            "label": "SD: Dewey"
        },
        {
            "value": "Douglas",
            "label": "SD: Douglas"
        },
        {
            "value": "Edmunds",
            "label": "SD: Edmunds"
        },
        {
            "value": "Fall River",
            "label": "SD: Fall River"
        },
        {
            "value": "Faulk",
            "label": "SD: Faulk"
        },
        {
            "value": "Grant",
            "label": "SD: Grant"
        },
        {
            "value": "Gregory",
            "label": "SD: Gregory"
        },
        {
            "value": "Haakon",
            "label": "SD: Haakon"
        },
        {
            "value": "Hamlin",
            "label": "SD: Hamlin"
        },
        {
            "value": "Hand",
            "label": "SD: Hand"
        },
        {
            "value": "Hanson",
            "label": "SD: Hanson"
        },
        {
            "value": "Harding",
            "label": "SD: Harding"
        },
        {
            "value": "Hughes",
            "label": "SD: Hughes"
        },
        {
            "value": "Hutchinson",
            "label": "SD: Hutchinson"
        },
        {
            "value": "Hyde",
            "label": "SD: Hyde"
        },
        {
            "value": "Jackson",
            "label": "SD: Jackson"
        },
        {
            "value": "Jerauld",
            "label": "SD: Jerauld"
        },
        {
            "value": "Jones",
            "label": "SD: Jones"
        },
        {
            "value": "Kingsbury",
            "label": "SD: Kingsbury"
        },
        {
            "value": "Lake",
            "label": "SD: Lake"
        },
        {
            "value": "Lawrence",
            "label": "SD: Lawrence"
        },
        {
            "value": "Lincoln",
            "label": "SD: Lincoln"
        },
        {
            "value": "Lyman",
            "label": "SD: Lyman"
        },
        {
            "value": "Marshall",
            "label": "SD: Marshall"
        },
        {
            "value": "McCook",
            "label": "SD: McCook"
        },
        {
            "value": "McPherson",
            "label": "SD: McPherson"
        },
        {
            "value": "Meade",
            "label": "SD: Meade"
        },
        {
            "value": "Mellette",
            "label": "SD: Mellette"
        },
        {
            "value": "Miner",
            "label": "SD: Miner"
        },
        {
            "value": "Minnehaha",
            "label": "SD: Minnehaha"
        },
        {
            "value": "Moody",
            "label": "SD: Moody"
        },
        {
            "value": "Oglala Lakota",
            "label": "SD: Oglala Lakota"
        },
        {
            "value": "Pennington",
            "label": "SD: Pennington"
        },
        {
            "value": "Perkins",
            "label": "SD: Perkins"
        },
        {
            "value": "Potter",
            "label": "SD: Potter"
        },
        {
            "value": "Roberts",
            "label": "SD: Roberts"
        },
        {
            "value": "Sanborn",
            "label": "SD: Sanborn"
        },
        {
            "value": "Spink",
            "label": "SD: Spink"
        },
        {
            "value": "Stanley",
            "label": "SD: Stanley"
        },
        {
            "value": "Sully",
            "label": "SD: Sully"
        },
        {
            "value": "Todd",
            "label": "SD: Todd"
        },
        {
            "value": "Tripp",
            "label": "SD: Tripp"
        },
        {
            "value": "Turner",
            "label": "SD: Turner"
        },
        {
            "value": "Union",
            "label": "SD: Union"
        },
        {
            "value": "Walworth",
            "label": "SD: Walworth"
        },
        {
            "value": "Yankton",
            "label": "SD: Yankton"
        },
        {
            "value": "Ziebach",
            "label": "SD: Ziebach"
        },
        {
            "value": "Anderson",
            "label": "TN: Anderson"
        },
        {
            "value": "Bedford",
            "label": "TN: Bedford"
        },
        {
            "value": "Benton",
            "label": "TN: Benton"
        },
        {
            "value": "Bledsoe",
            "label": "TN: Bledsoe"
        },
        {
            "value": "Blount",
            "label": "TN: Blount"
        },
        {
            "value": "Bradley",
            "label": "TN: Bradley"
        },
        {
            "value": "Campbell",
            "label": "TN: Campbell"
        },
        {
            "value": "Cannon",
            "label": "TN: Cannon"
        },
        {
            "value": "Carroll",
            "label": "TN: Carroll"
        },
        {
            "value": "Carter",
            "label": "TN: Carter"
        },
        {
            "value": "Cheatham",
            "label": "TN: Cheatham"
        },
        {
            "value": "Chester",
            "label": "TN: Chester"
        },
        {
            "value": "Claiborne",
            "label": "TN: Claiborne"
        },
        {
            "value": "Clay",
            "label": "TN: Clay"
        },
        {
            "value": "Cocke",
            "label": "TN: Cocke"
        },
        {
            "value": "Coffee",
            "label": "TN: Coffee"
        },
        {
            "value": "Crockett",
            "label": "TN: Crockett"
        },
        {
            "value": "Cumberland",
            "label": "TN: Cumberland"
        },
        {
            "value": "Davidson",
            "label": "TN: Davidson"
        },
        {
            "value": "Decatur",
            "label": "TN: Decatur"
        },
        {
            "value": "DeKalb",
            "label": "TN: DeKalb"
        },
        {
            "value": "Dickson",
            "label": "TN: Dickson"
        },
        {
            "value": "Dyer",
            "label": "TN: Dyer"
        },
        {
            "value": "Fayette",
            "label": "TN: Fayette"
        },
        {
            "value": "Fentress",
            "label": "TN: Fentress"
        },
        {
            "value": "Franklin",
            "label": "TN: Franklin"
        },
        {
            "value": "Gibson",
            "label": "TN: Gibson"
        },
        {
            "value": "Giles",
            "label": "TN: Giles"
        },
        {
            "value": "Grainger",
            "label": "TN: Grainger"
        },
        {
            "value": "Greene",
            "label": "TN: Greene"
        },
        {
            "value": "Grundy",
            "label": "TN: Grundy"
        },
        {
            "value": "Hamblen",
            "label": "TN: Hamblen"
        },
        {
            "value": "Hamilton",
            "label": "TN: Hamilton"
        },
        {
            "value": "Hancock",
            "label": "TN: Hancock"
        },
        {
            "value": "Hardeman",
            "label": "TN: Hardeman"
        },
        {
            "value": "Hardin",
            "label": "TN: Hardin"
        },
        {
            "value": "Hawkins",
            "label": "TN: Hawkins"
        },
        {
            "value": "Haywood",
            "label": "TN: Haywood"
        },
        {
            "value": "Henderson",
            "label": "TN: Henderson"
        },
        {
            "value": "Henry",
            "label": "TN: Henry"
        },
        {
            "value": "Hickman",
            "label": "TN: Hickman"
        },
        {
            "value": "Houston",
            "label": "TN: Houston"
        },
        {
            "value": "Humphreys",
            "label": "TN: Humphreys"
        },
        {
            "value": "Jackson",
            "label": "TN: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "TN: Jefferson"
        },
        {
            "value": "Johnson",
            "label": "TN: Johnson"
        },
        {
            "value": "Knox",
            "label": "TN: Knox"
        },
        {
            "value": "Lake",
            "label": "TN: Lake"
        },
        {
            "value": "Lauderdale",
            "label": "TN: Lauderdale"
        },
        {
            "value": "Lawrence",
            "label": "TN: Lawrence"
        },
        {
            "value": "Lewis",
            "label": "TN: Lewis"
        },
        {
            "value": "Lincoln",
            "label": "TN: Lincoln"
        },
        {
            "value": "Loudon",
            "label": "TN: Loudon"
        },
        {
            "value": "Macon",
            "label": "TN: Macon"
        },
        {
            "value": "Madison",
            "label": "TN: Madison"
        },
        {
            "value": "Marion",
            "label": "TN: Marion"
        },
        {
            "value": "Marshall",
            "label": "TN: Marshall"
        },
        {
            "value": "Maury",
            "label": "TN: Maury"
        },
        {
            "value": "McMinn",
            "label": "TN: McMinn"
        },
        {
            "value": "McNairy",
            "label": "TN: McNairy"
        },
        {
            "value": "Meigs",
            "label": "TN: Meigs"
        },
        {
            "value": "Monroe",
            "label": "TN: Monroe"
        },
        {
            "value": "Montgomery",
            "label": "TN: Montgomery"
        },
        {
            "value": "Moore",
            "label": "TN: Moore"
        },
        {
            "value": "Morgan",
            "label": "TN: Morgan"
        },
        {
            "value": "Obion",
            "label": "TN: Obion"
        },
        {
            "value": "Overton",
            "label": "TN: Overton"
        },
        {
            "value": "Perry",
            "label": "TN: Perry"
        },
        {
            "value": "Pickett",
            "label": "TN: Pickett"
        },
        {
            "value": "Polk",
            "label": "TN: Polk"
        },
        {
            "value": "Putnam",
            "label": "TN: Putnam"
        },
        {
            "value": "Rhea",
            "label": "TN: Rhea"
        },
        {
            "value": "Roane",
            "label": "TN: Roane"
        },
        {
            "value": "Robertson",
            "label": "TN: Robertson"
        },
        {
            "value": "Rutherford",
            "label": "TN: Rutherford"
        },
        {
            "value": "Scott",
            "label": "TN: Scott"
        },
        {
            "value": "Sequatchie",
            "label": "TN: Sequatchie"
        },
        {
            "value": "Sevier",
            "label": "TN: Sevier"
        },
        {
            "value": "Shelby",
            "label": "TN: Shelby"
        },
        {
            "value": "Smith",
            "label": "TN: Smith"
        },
        {
            "value": "Stewart",
            "label": "TN: Stewart"
        },
        {
            "value": "Sullivan",
            "label": "TN: Sullivan"
        },
        {
            "value": "Sumner",
            "label": "TN: Sumner"
        },
        {
            "value": "Tipton",
            "label": "TN: Tipton"
        },
        {
            "value": "Trousdale",
            "label": "TN: Trousdale"
        },
        {
            "value": "Unicoi",
            "label": "TN: Unicoi"
        },
        {
            "value": "Union",
            "label": "TN: Union"
        },
        {
            "value": "Van Buren",
            "label": "TN: Van Buren"
        },
        {
            "value": "Warren",
            "label": "TN: Warren"
        },
        {
            "value": "Washington",
            "label": "TN: Washington"
        },
        {
            "value": "Wayne",
            "label": "TN: Wayne"
        },
        {
            "value": "Weakley",
            "label": "TN: Weakley"
        },
        {
            "value": "White",
            "label": "TN: White"
        },
        {
            "value": "Williamson",
            "label": "TN: Williamson"
        },
        {
            "value": "Wilson",
            "label": "TN: Wilson"
        },
        {
            "value": "Anderson",
            "label": "TX: Anderson"
        },
        {
            "value": "Andrews",
            "label": "TX: Andrews"
        },
        {
            "value": "Angelina",
            "label": "TX: Angelina"
        },
        {
            "value": "Aransas",
            "label": "TX: Aransas"
        },
        {
            "value": "Archer",
            "label": "TX: Archer"
        },
        {
            "value": "Armstrong",
            "label": "TX: Armstrong"
        },
        {
            "value": "Atascosa",
            "label": "TX: Atascosa"
        },
        {
            "value": "Austin",
            "label": "TX: Austin"
        },
        {
            "value": "Bailey",
            "label": "TX: Bailey"
        },
        {
            "value": "Bandera",
            "label": "TX: Bandera"
        },
        {
            "value": "Bastrop",
            "label": "TX: Bastrop"
        },
        {
            "value": "Baylor",
            "label": "TX: Baylor"
        },
        {
            "value": "Bee",
            "label": "TX: Bee"
        },
        {
            "value": "Bell",
            "label": "TX: Bell"
        },
        {
            "value": "Bexar",
            "label": "TX: Bexar"
        },
        {
            "value": "Blanco",
            "label": "TX: Blanco"
        },
        {
            "value": "Borden",
            "label": "TX: Borden"
        },
        {
            "value": "Bosque",
            "label": "TX: Bosque"
        },
        {
            "value": "Bowie",
            "label": "TX: Bowie"
        },
        {
            "value": "Brazoria",
            "label": "TX: Brazoria"
        },
        {
            "value": "Brazos",
            "label": "TX: Brazos"
        },
        {
            "value": "Brewster",
            "label": "TX: Brewster"
        },
        {
            "value": "Briscoe",
            "label": "TX: Briscoe"
        },
        {
            "value": "Brooks",
            "label": "TX: Brooks"
        },
        {
            "value": "Brown",
            "label": "TX: Brown"
        },
        {
            "value": "Burleson",
            "label": "TX: Burleson"
        },
        {
            "value": "Burnet",
            "label": "TX: Burnet"
        },
        {
            "value": "Caldwell",
            "label": "TX: Caldwell"
        },
        {
            "value": "Calhoun",
            "label": "TX: Calhoun"
        },
        {
            "value": "Callahan",
            "label": "TX: Callahan"
        },
        {
            "value": "Cameron",
            "label": "TX: Cameron"
        },
        {
            "value": "Camp",
            "label": "TX: Camp"
        },
        {
            "value": "Carson",
            "label": "TX: Carson"
        },
        {
            "value": "Cass",
            "label": "TX: Cass"
        },
        {
            "value": "Castro",
            "label": "TX: Castro"
        },
        {
            "value": "Chambers",
            "label": "TX: Chambers"
        },
        {
            "value": "Cherokee",
            "label": "TX: Cherokee"
        },
        {
            "value": "Childress",
            "label": "TX: Childress"
        },
        {
            "value": "Clay",
            "label": "TX: Clay"
        },
        {
            "value": "Cochran",
            "label": "TX: Cochran"
        },
        {
            "value": "Coke",
            "label": "TX: Coke"
        },
        {
            "value": "Coleman",
            "label": "TX: Coleman"
        },
        {
            "value": "Collin",
            "label": "TX: Collin"
        },
        {
            "value": "Collingsworth",
            "label": "TX: Collingsworth"
        },
        {
            "value": "Colorado",
            "label": "TX: Colorado"
        },
        {
            "value": "Comal",
            "label": "TX: Comal"
        },
        {
            "value": "Comanche",
            "label": "TX: Comanche"
        },
        {
            "value": "Concho",
            "label": "TX: Concho"
        },
        {
            "value": "Cooke",
            "label": "TX: Cooke"
        },
        {
            "value": "Coryell",
            "label": "TX: Coryell"
        },
        {
            "value": "Cottle",
            "label": "TX: Cottle"
        },
        {
            "value": "Crane",
            "label": "TX: Crane"
        },
        {
            "value": "Crockett",
            "label": "TX: Crockett"
        },
        {
            "value": "Crosby",
            "label": "TX: Crosby"
        },
        {
            "value": "Culberson",
            "label": "TX: Culberson"
        },
        {
            "value": "Dallam",
            "label": "TX: Dallam"
        },
        {
            "value": "Dallas",
            "label": "TX: Dallas"
        },
        {
            "value": "Dawson",
            "label": "TX: Dawson"
        },
        {
            "value": "Deaf Smith",
            "label": "TX: Deaf Smith"
        },
        {
            "value": "Delta",
            "label": "TX: Delta"
        },
        {
            "value": "Denton",
            "label": "TX: Denton"
        },
        {
            "value": "DeWitt",
            "label": "TX: DeWitt"
        },
        {
            "value": "Dickens",
            "label": "TX: Dickens"
        },
        {
            "value": "Dimmit",
            "label": "TX: Dimmit"
        },
        {
            "value": "Donley",
            "label": "TX: Donley"
        },
        {
            "value": "Duval",
            "label": "TX: Duval"
        },
        {
            "value": "Eastland",
            "label": "TX: Eastland"
        },
        {
            "value": "Ector",
            "label": "TX: Ector"
        },
        {
            "value": "Edwards",
            "label": "TX: Edwards"
        },
        {
            "value": "El Paso",
            "label": "TX: El Paso"
        },
        {
            "value": "Ellis",
            "label": "TX: Ellis"
        },
        {
            "value": "Erath",
            "label": "TX: Erath"
        },
        {
            "value": "Falls",
            "label": "TX: Falls"
        },
        {
            "value": "Fannin",
            "label": "TX: Fannin"
        },
        {
            "value": "Fayette",
            "label": "TX: Fayette"
        },
        {
            "value": "Fisher",
            "label": "TX: Fisher"
        },
        {
            "value": "Floyd",
            "label": "TX: Floyd"
        },
        {
            "value": "Foard",
            "label": "TX: Foard"
        },
        {
            "value": "Fort Bend",
            "label": "TX: Fort Bend"
        },
        {
            "value": "Franklin",
            "label": "TX: Franklin"
        },
        {
            "value": "Freestone",
            "label": "TX: Freestone"
        },
        {
            "value": "Frio",
            "label": "TX: Frio"
        },
        {
            "value": "Gaines",
            "label": "TX: Gaines"
        },
        {
            "value": "Galveston",
            "label": "TX: Galveston"
        },
        {
            "value": "Garza",
            "label": "TX: Garza"
        },
        {
            "value": "Gillespie",
            "label": "TX: Gillespie"
        },
        {
            "value": "Glasscock",
            "label": "TX: Glasscock"
        },
        {
            "value": "Goliad",
            "label": "TX: Goliad"
        },
        {
            "value": "Gonzales",
            "label": "TX: Gonzales"
        },
        {
            "value": "Gray",
            "label": "TX: Gray"
        },
        {
            "value": "Grayson",
            "label": "TX: Grayson"
        },
        {
            "value": "Gregg",
            "label": "TX: Gregg"
        },
        {
            "value": "Grimes",
            "label": "TX: Grimes"
        },
        {
            "value": "Guadalupe",
            "label": "TX: Guadalupe"
        },
        {
            "value": "Hale",
            "label": "TX: Hale"
        },
        {
            "value": "Hall",
            "label": "TX: Hall"
        },
        {
            "value": "Hamilton",
            "label": "TX: Hamilton"
        },
        {
            "value": "Hansford",
            "label": "TX: Hansford"
        },
        {
            "value": "Hardeman",
            "label": "TX: Hardeman"
        },
        {
            "value": "Hardin",
            "label": "TX: Hardin"
        },
        {
            "value": "Harris",
            "label": "TX: Harris"
        },
        {
            "value": "Harrison",
            "label": "TX: Harrison"
        },
        {
            "value": "Hartley",
            "label": "TX: Hartley"
        },
        {
            "value": "Haskell",
            "label": "TX: Haskell"
        },
        {
            "value": "Hays",
            "label": "TX: Hays"
        },
        {
            "value": "Hemphill",
            "label": "TX: Hemphill"
        },
        {
            "value": "Henderson",
            "label": "TX: Henderson"
        },
        {
            "value": "Hidalgo",
            "label": "TX: Hidalgo"
        },
        {
            "value": "Hill",
            "label": "TX: Hill"
        },
        {
            "value": "Hockley",
            "label": "TX: Hockley"
        },
        {
            "value": "Hood",
            "label": "TX: Hood"
        },
        {
            "value": "Hopkins",
            "label": "TX: Hopkins"
        },
        {
            "value": "Houston",
            "label": "TX: Houston"
        },
        {
            "value": "Howard",
            "label": "TX: Howard"
        },
        {
            "value": "Hudspeth",
            "label": "TX: Hudspeth"
        },
        {
            "value": "Hunt",
            "label": "TX: Hunt"
        },
        {
            "value": "Hutchinson",
            "label": "TX: Hutchinson"
        },
        {
            "value": "Irion",
            "label": "TX: Irion"
        },
        {
            "value": "Jack",
            "label": "TX: Jack"
        },
        {
            "value": "Jackson",
            "label": "TX: Jackson"
        },
        {
            "value": "Jasper",
            "label": "TX: Jasper"
        },
        {
            "value": "Jeff Davis",
            "label": "TX: Jeff Davis"
        },
        {
            "value": "Jefferson",
            "label": "TX: Jefferson"
        },
        {
            "value": "Jim Hogg",
            "label": "TX: Jim Hogg"
        },
        {
            "value": "Jim Wells",
            "label": "TX: Jim Wells"
        },
        {
            "value": "Johnson",
            "label": "TX: Johnson"
        },
        {
            "value": "Jones",
            "label": "TX: Jones"
        },
        {
            "value": "Karnes",
            "label": "TX: Karnes"
        },
        {
            "value": "Kaufman",
            "label": "TX: Kaufman"
        },
        {
            "value": "Kendall",
            "label": "TX: Kendall"
        },
        {
            "value": "Kenedy",
            "label": "TX: Kenedy"
        },
        {
            "value": "Kent",
            "label": "TX: Kent"
        },
        {
            "value": "Kerr",
            "label": "TX: Kerr"
        },
        {
            "value": "Kimble",
            "label": "TX: Kimble"
        },
        {
            "value": "King",
            "label": "TX: King"
        },
        {
            "value": "Kinney",
            "label": "TX: Kinney"
        },
        {
            "value": "Kleberg",
            "label": "TX: Kleberg"
        },
        {
            "value": "Knox",
            "label": "TX: Knox"
        },
        {
            "value": "La Salle",
            "label": "TX: La Salle"
        },
        {
            "value": "Lamar",
            "label": "TX: Lamar"
        },
        {
            "value": "Lamb",
            "label": "TX: Lamb"
        },
        {
            "value": "Lampasas",
            "label": "TX: Lampasas"
        },
        {
            "value": "Lavaca",
            "label": "TX: Lavaca"
        },
        {
            "value": "Lee",
            "label": "TX: Lee"
        },
        {
            "value": "Leon",
            "label": "TX: Leon"
        },
        {
            "value": "Liberty",
            "label": "TX: Liberty"
        },
        {
            "value": "Limestone",
            "label": "TX: Limestone"
        },
        {
            "value": "Lipscomb",
            "label": "TX: Lipscomb"
        },
        {
            "value": "Live Oak",
            "label": "TX: Live Oak"
        },
        {
            "value": "Llano",
            "label": "TX: Llano"
        },
        {
            "value": "Loving",
            "label": "TX: Loving"
        },
        {
            "value": "Lubbock",
            "label": "TX: Lubbock"
        },
        {
            "value": "Lynn",
            "label": "TX: Lynn"
        },
        {
            "value": "Madison",
            "label": "TX: Madison"
        },
        {
            "value": "Marion",
            "label": "TX: Marion"
        },
        {
            "value": "Martin",
            "label": "TX: Martin"
        },
        {
            "value": "Mason",
            "label": "TX: Mason"
        },
        {
            "value": "Matagorda",
            "label": "TX: Matagorda"
        },
        {
            "value": "Maverick",
            "label": "TX: Maverick"
        },
        {
            "value": "McCulloch",
            "label": "TX: McCulloch"
        },
        {
            "value": "McLennan",
            "label": "TX: McLennan"
        },
        {
            "value": "McMullen",
            "label": "TX: McMullen"
        },
        {
            "value": "Medina",
            "label": "TX: Medina"
        },
        {
            "value": "Menard",
            "label": "TX: Menard"
        },
        {
            "value": "Midland",
            "label": "TX: Midland"
        },
        {
            "value": "Milam",
            "label": "TX: Milam"
        },
        {
            "value": "Mills",
            "label": "TX: Mills"
        },
        {
            "value": "Mitchell",
            "label": "TX: Mitchell"
        },
        {
            "value": "Montague",
            "label": "TX: Montague"
        },
        {
            "value": "Montgomery",
            "label": "TX: Montgomery"
        },
        {
            "value": "Moore",
            "label": "TX: Moore"
        },
        {
            "value": "Morris",
            "label": "TX: Morris"
        },
        {
            "value": "Motley",
            "label": "TX: Motley"
        },
        {
            "value": "Nacogdoches",
            "label": "TX: Nacogdoches"
        },
        {
            "value": "Navarro",
            "label": "TX: Navarro"
        },
        {
            "value": "Newton",
            "label": "TX: Newton"
        },
        {
            "value": "Nolan",
            "label": "TX: Nolan"
        },
        {
            "value": "Nueces",
            "label": "TX: Nueces"
        },
        {
            "value": "Ochiltree",
            "label": "TX: Ochiltree"
        },
        {
            "value": "Oldham",
            "label": "TX: Oldham"
        },
        {
            "value": "Orange",
            "label": "TX: Orange"
        },
        {
            "value": "Palo Pinto",
            "label": "TX: Palo Pinto"
        },
        {
            "value": "Panola",
            "label": "TX: Panola"
        },
        {
            "value": "Parker",
            "label": "TX: Parker"
        },
        {
            "value": "Parmer",
            "label": "TX: Parmer"
        },
        {
            "value": "Pecos",
            "label": "TX: Pecos"
        },
        {
            "value": "Polk",
            "label": "TX: Polk"
        },
        {
            "value": "Potter",
            "label": "TX: Potter"
        },
        {
            "value": "Presidio",
            "label": "TX: Presidio"
        },
        {
            "value": "Rains",
            "label": "TX: Rains"
        },
        {
            "value": "Randall",
            "label": "TX: Randall"
        },
        {
            "value": "Reagan",
            "label": "TX: Reagan"
        },
        {
            "value": "Real",
            "label": "TX: Real"
        },
        {
            "value": "Red River",
            "label": "TX: Red River"
        },
        {
            "value": "Reeves",
            "label": "TX: Reeves"
        },
        {
            "value": "Refugio",
            "label": "TX: Refugio"
        },
        {
            "value": "Roberts",
            "label": "TX: Roberts"
        },
        {
            "value": "Robertson",
            "label": "TX: Robertson"
        },
        {
            "value": "Rockwall",
            "label": "TX: Rockwall"
        },
        {
            "value": "Runnels",
            "label": "TX: Runnels"
        },
        {
            "value": "Rusk",
            "label": "TX: Rusk"
        },
        {
            "value": "Sabine",
            "label": "TX: Sabine"
        },
        {
            "value": "San Augustine",
            "label": "TX: San Augustine"
        },
        {
            "value": "San Jacinto",
            "label": "TX: San Jacinto"
        },
        {
            "value": "San Patricio",
            "label": "TX: San Patricio"
        },
        {
            "value": "San Saba",
            "label": "TX: San Saba"
        },
        {
            "value": "Schleicher",
            "label": "TX: Schleicher"
        },
        {
            "value": "Scurry",
            "label": "TX: Scurry"
        },
        {
            "value": "Shackelford",
            "label": "TX: Shackelford"
        },
        {
            "value": "Shelby",
            "label": "TX: Shelby"
        },
        {
            "value": "Sherman",
            "label": "TX: Sherman"
        },
        {
            "value": "Smith",
            "label": "TX: Smith"
        },
        {
            "value": "Somervell",
            "label": "TX: Somervell"
        },
        {
            "value": "Starr",
            "label": "TX: Starr"
        },
        {
            "value": "Stephens",
            "label": "TX: Stephens"
        },
        {
            "value": "Sterling",
            "label": "TX: Sterling"
        },
        {
            "value": "Stonewall",
            "label": "TX: Stonewall"
        },
        {
            "value": "Sutton",
            "label": "TX: Sutton"
        },
        {
            "value": "Swisher",
            "label": "TX: Swisher"
        },
        {
            "value": "Tarrant",
            "label": "TX: Tarrant"
        },
        {
            "value": "Taylor",
            "label": "TX: Taylor"
        },
        {
            "value": "Terrell",
            "label": "TX: Terrell"
        },
        {
            "value": "Terry",
            "label": "TX: Terry"
        },
        {
            "value": "Throckmorton",
            "label": "TX: Throckmorton"
        },
        {
            "value": "Titus",
            "label": "TX: Titus"
        },
        {
            "value": "Tom Green",
            "label": "TX: Tom Green"
        },
        {
            "value": "Travis",
            "label": "TX: Travis"
        },
        {
            "value": "Trinity",
            "label": "TX: Trinity"
        },
        {
            "value": "Tyler",
            "label": "TX: Tyler"
        },
        {
            "value": "Upshur",
            "label": "TX: Upshur"
        },
        {
            "value": "Upton",
            "label": "TX: Upton"
        },
        {
            "value": "Uvalde",
            "label": "TX: Uvalde"
        },
        {
            "value": "Val Verde",
            "label": "TX: Val Verde"
        },
        {
            "value": "Van Zandt",
            "label": "TX: Van Zandt"
        },
        {
            "value": "Victoria",
            "label": "TX: Victoria"
        },
        {
            "value": "Walker",
            "label": "TX: Walker"
        },
        {
            "value": "Waller",
            "label": "TX: Waller"
        },
        {
            "value": "Ward",
            "label": "TX: Ward"
        },
        {
            "value": "Washington",
            "label": "TX: Washington"
        },
        {
            "value": "Webb",
            "label": "TX: Webb"
        },
        {
            "value": "Wharton",
            "label": "TX: Wharton"
        },
        {
            "value": "Wheeler",
            "label": "TX: Wheeler"
        },
        {
            "value": "Wichita",
            "label": "TX: Wichita"
        },
        {
            "value": "Wilbarger",
            "label": "TX: Wilbarger"
        },
        {
            "value": "Willacy",
            "label": "TX: Willacy"
        },
        {
            "value": "Williamson",
            "label": "TX: Williamson"
        },
        {
            "value": "Wilson",
            "label": "TX: Wilson"
        },
        {
            "value": "Winkler",
            "label": "TX: Winkler"
        },
        {
            "value": "Wise",
            "label": "TX: Wise"
        },
        {
            "value": "Wood",
            "label": "TX: Wood"
        },
        {
            "value": "Yoakum",
            "label": "TX: Yoakum"
        },
        {
            "value": "Young",
            "label": "TX: Young"
        },
        {
            "value": "Zapata",
            "label": "TX: Zapata"
        },
        {
            "value": "Zavala",
            "label": "TX: Zavala"
        },
        {
            "value": "Beaver",
            "label": "UT: Beaver"
        },
        {
            "value": "Box Elder",
            "label": "UT: Box Elder"
        },
        {
            "value": "Cache",
            "label": "UT: Cache"
        },
        {
            "value": "Carbon",
            "label": "UT: Carbon"
        },
        {
            "value": "Daggett",
            "label": "UT: Daggett"
        },
        {
            "value": "Davis",
            "label": "UT: Davis"
        },
        {
            "value": "Duchesne",
            "label": "UT: Duchesne"
        },
        {
            "value": "Emery",
            "label": "UT: Emery"
        },
        {
            "value": "Garfield",
            "label": "UT: Garfield"
        },
        {
            "value": "Grand",
            "label": "UT: Grand"
        },
        {
            "value": "Iron",
            "label": "UT: Iron"
        },
        {
            "value": "Juab",
            "label": "UT: Juab"
        },
        {
            "value": "Kane",
            "label": "UT: Kane"
        },
        {
            "value": "Millard",
            "label": "UT: Millard"
        },
        {
            "value": "Morgan",
            "label": "UT: Morgan"
        },
        {
            "value": "Piute",
            "label": "UT: Piute"
        },
        {
            "value": "Rich",
            "label": "UT: Rich"
        },
        {
            "value": "Salt Lake",
            "label": "UT: Salt Lake"
        },
        {
            "value": "San Juan",
            "label": "UT: San Juan"
        },
        {
            "value": "Sanpete",
            "label": "UT: Sanpete"
        },
        {
            "value": "Sevier",
            "label": "UT: Sevier"
        },
        {
            "value": "Summit",
            "label": "UT: Summit"
        },
        {
            "value": "Tooele",
            "label": "UT: Tooele"
        },
        {
            "value": "Uintah",
            "label": "UT: Uintah"
        },
        {
            "value": "Utah",
            "label": "UT: Utah"
        },
        {
            "value": "Wasatch",
            "label": "UT: Wasatch"
        },
        {
            "value": "Washington",
            "label": "UT: Washington"
        },
        {
            "value": "Wayne",
            "label": "UT: Wayne"
        },
        {
            "value": "Weber",
            "label": "UT: Weber"
        },
        {
            "value": "Accomack",
            "label": "VA: Accomack"
        },
        {
            "value": "Albemarle",
            "label": "VA: Albemarle"
        },
        {
            "value": "Alexandria",
            "label": "VA: Alexandria"
        },
        {
            "value": "Alleghany",
            "label": "VA: Alleghany"
        },
        {
            "value": "Amelia",
            "label": "VA: Amelia"
        },
        {
            "value": "Amherst",
            "label": "VA: Amherst"
        },
        {
            "value": "Appomattox",
            "label": "VA: Appomattox"
        },
        {
            "value": "Arlington",
            "label": "VA: Arlington"
        },
        {
            "value": "Augusta",
            "label": "VA: Augusta"
        },
        {
            "value": "Bath",
            "label": "VA: Bath"
        },
        {
            "value": "Bedford",
            "label": "VA: Bedford"
        },
        {
            "value": "Bland",
            "label": "VA: Bland"
        },
        {
            "value": "Botetourt",
            "label": "VA: Botetourt"
        },
        {
            "value": "Bristol",
            "label": "VA: Bristol"
        },
        {
            "value": "Brunswick",
            "label": "VA: Brunswick"
        },
        {
            "value": "Buchanan",
            "label": "VA: Buchanan"
        },
        {
            "value": "Buckingham",
            "label": "VA: Buckingham"
        },
        {
            "value": "Buena Vista",
            "label": "VA: Buena Vista"
        },
        {
            "value": "Campbell",
            "label": "VA: Campbell"
        },
        {
            "value": "Caroline",
            "label": "VA: Caroline"
        },
        {
            "value": "Carroll",
            "label": "VA: Carroll"
        },
        {
            "value": "Charles City",
            "label": "VA: Charles City"
        },
        {
            "value": "Charlotte",
            "label": "VA: Charlotte"
        },
        {
            "value": "Charlottesville",
            "label": "VA: Charlottesville"
        },
        {
            "value": "Chesapeake",
            "label": "VA: Chesapeake"
        },
        {
            "value": "Chesterfield",
            "label": "VA: Chesterfield"
        },
        {
            "value": "Clarke",
            "label": "VA: Clarke"
        },
        {
            "value": "Colonial Heights",
            "label": "VA: Colonial Heights"
        },
        {
            "value": "Covington",
            "label": "VA: Covington"
        },
        {
            "value": "Craig",
            "label": "VA: Craig"
        },
        {
            "value": "Culpeper",
            "label": "VA: Culpeper"
        },
        {
            "value": "Cumberland",
            "label": "VA: Cumberland"
        },
        {
            "value": "Danville",
            "label": "VA: Danville"
        },
        {
            "value": "Dickenson",
            "label": "VA: Dickenson"
        },
        {
            "value": "Dinwiddie",
            "label": "VA: Dinwiddie"
        },
        {
            "value": "Emporia",
            "label": "VA: Emporia"
        },
        {
            "value": "Essex",
            "label": "VA: Essex"
        },
        {
            "value": "Fairfax",
            "label": "VA: Fairfax"
        },
        {
            "value": "Fairfax",
            "label": "VA: Fairfax"
        },
        {
            "value": "Falls Church",
            "label": "VA: Falls Church"
        },
        {
            "value": "Fauquier",
            "label": "VA: Fauquier"
        },
        {
            "value": "Floyd",
            "label": "VA: Floyd"
        },
        {
            "value": "Fluvanna",
            "label": "VA: Fluvanna"
        },
        {
            "value": "Franklin",
            "label": "VA: Franklin"
        },
        {
            "value": "Franklin",
            "label": "VA: Franklin"
        },
        {
            "value": "Frederick",
            "label": "VA: Frederick"
        },
        {
            "value": "Fredericksburg",
            "label": "VA: Fredericksburg"
        },
        {
            "value": "Galax",
            "label": "VA: Galax"
        },
        {
            "value": "Giles",
            "label": "VA: Giles"
        },
        {
            "value": "Gloucester",
            "label": "VA: Gloucester"
        },
        {
            "value": "Goochland",
            "label": "VA: Goochland"
        },
        {
            "value": "Grayson",
            "label": "VA: Grayson"
        },
        {
            "value": "Greene",
            "label": "VA: Greene"
        },
        {
            "value": "Greensville",
            "label": "VA: Greensville"
        },
        {
            "value": "Halifax",
            "label": "VA: Halifax"
        },
        {
            "value": "Hampton",
            "label": "VA: Hampton"
        },
        {
            "value": "Hanover",
            "label": "VA: Hanover"
        },
        {
            "value": "Harrisonburg",
            "label": "VA: Harrisonburg"
        },
        {
            "value": "Henrico",
            "label": "VA: Henrico"
        },
        {
            "value": "Henry",
            "label": "VA: Henry"
        },
        {
            "value": "Highland",
            "label": "VA: Highland"
        },
        {
            "value": "Hopewell",
            "label": "VA: Hopewell"
        },
        {
            "value": "Isle of Wight",
            "label": "VA: Isle of Wight"
        },
        {
            "value": "James City",
            "label": "VA: James City"
        },
        {
            "value": "King and Queen",
            "label": "VA: King and Queen"
        },
        {
            "value": "King George",
            "label": "VA: King George"
        },
        {
            "value": "King William",
            "label": "VA: King William"
        },
        {
            "value": "Lancaster",
            "label": "VA: Lancaster"
        },
        {
            "value": "Lee",
            "label": "VA: Lee"
        },
        {
            "value": "Lexington",
            "label": "VA: Lexington"
        },
        {
            "value": "Loudoun",
            "label": "VA: Loudoun"
        },
        {
            "value": "Louisa",
            "label": "VA: Louisa"
        },
        {
            "value": "Lunenburg",
            "label": "VA: Lunenburg"
        },
        {
            "value": "Lynchburg",
            "label": "VA: Lynchburg"
        },
        {
            "value": "Madison",
            "label": "VA: Madison"
        },
        {
            "value": "Manassas",
            "label": "VA: Manassas"
        },
        {
            "value": "Manassas Park",
            "label": "VA: Manassas Park"
        },
        {
            "value": "Martinsville",
            "label": "VA: Martinsville"
        },
        {
            "value": "Mathews",
            "label": "VA: Mathews"
        },
        {
            "value": "Mecklenburg",
            "label": "VA: Mecklenburg"
        },
        {
            "value": "Middlesex",
            "label": "VA: Middlesex"
        },
        {
            "value": "Montgomery",
            "label": "VA: Montgomery"
        },
        {
            "value": "Nelson",
            "label": "VA: Nelson"
        },
        {
            "value": "New Kent",
            "label": "VA: New Kent"
        },
        {
            "value": "Newport News",
            "label": "VA: Newport News"
        },
        {
            "value": "Norfolk",
            "label": "VA: Norfolk"
        },
        {
            "value": "Northampton",
            "label": "VA: Northampton"
        },
        {
            "value": "Northumberland",
            "label": "VA: Northumberland"
        },
        {
            "value": "Norton",
            "label": "VA: Norton"
        },
        {
            "value": "Nottoway",
            "label": "VA: Nottoway"
        },
        {
            "value": "Orange",
            "label": "VA: Orange"
        },
        {
            "value": "Page",
            "label": "VA: Page"
        },
        {
            "value": "Patrick",
            "label": "VA: Patrick"
        },
        {
            "value": "Petersburg",
            "label": "VA: Petersburg"
        },
        {
            "value": "Pittsylvania",
            "label": "VA: Pittsylvania"
        },
        {
            "value": "Poquoson",
            "label": "VA: Poquoson"
        },
        {
            "value": "Portsmouth",
            "label": "VA: Portsmouth"
        },
        {
            "value": "Powhatan",
            "label": "VA: Powhatan"
        },
        {
            "value": "Prince Edward",
            "label": "VA: Prince Edward"
        },
        {
            "value": "Prince George",
            "label": "VA: Prince George"
        },
        {
            "value": "Prince William",
            "label": "VA: Prince William"
        },
        {
            "value": "Pulaski",
            "label": "VA: Pulaski"
        },
        {
            "value": "Radford",
            "label": "VA: Radford"
        },
        {
            "value": "Rappahannock",
            "label": "VA: Rappahannock"
        },
        {
            "value": "Richmond",
            "label": "VA: Richmond"
        },
        {
            "value": "Richmond",
            "label": "VA: Richmond"
        },
        {
            "value": "Roanoke",
            "label": "VA: Roanoke"
        },
        {
            "value": "Roanoke",
            "label": "VA: Roanoke"
        },
        {
            "value": "Rockbridge",
            "label": "VA: Rockbridge"
        },
        {
            "value": "Rockingham",
            "label": "VA: Rockingham"
        },
        {
            "value": "Russell",
            "label": "VA: Russell"
        },
        {
            "value": "Salem",
            "label": "VA: Salem"
        },
        {
            "value": "Scott",
            "label": "VA: Scott"
        },
        {
            "value": "Shenandoah",
            "label": "VA: Shenandoah"
        },
        {
            "value": "Smyth",
            "label": "VA: Smyth"
        },
        {
            "value": "Southampton",
            "label": "VA: Southampton"
        },
        {
            "value": "Spotsylvania",
            "label": "VA: Spotsylvania"
        },
        {
            "value": "Stafford",
            "label": "VA: Stafford"
        },
        {
            "value": "Staunton",
            "label": "VA: Staunton"
        },
        {
            "value": "Suffolk",
            "label": "VA: Suffolk"
        },
        {
            "value": "Surry",
            "label": "VA: Surry"
        },
        {
            "value": "Sussex",
            "label": "VA: Sussex"
        },
        {
            "value": "Tazewell",
            "label": "VA: Tazewell"
        },
        {
            "value": "Virginia Beach",
            "label": "VA: Virginia Beach"
        },
        {
            "value": "Warren",
            "label": "VA: Warren"
        },
        {
            "value": "Washington",
            "label": "VA: Washington"
        },
        {
            "value": "Waynesboro",
            "label": "VA: Waynesboro"
        },
        {
            "value": "Westmoreland",
            "label": "VA: Westmoreland"
        },
        {
            "value": "Williamsburg",
            "label": "VA: Williamsburg"
        },
        {
            "value": "Winchester",
            "label": "VA: Winchester"
        },
        {
            "value": "Wise",
            "label": "VA: Wise"
        },
        {
            "value": "Wythe",
            "label": "VA: Wythe"
        },
        {
            "value": "York",
            "label": "VA: York"
        },
        {
            "value": "Addison",
            "label": "VT: Addison"
        },
        {
            "value": "Bennington",
            "label": "VT: Bennington"
        },
        {
            "value": "Caledonia",
            "label": "VT: Caledonia"
        },
        {
            "value": "Chittenden",
            "label": "VT: Chittenden"
        },
        {
            "value": "Essex",
            "label": "VT: Essex"
        },
        {
            "value": "Franklin",
            "label": "VT: Franklin"
        },
        {
            "value": "Grand Isle",
            "label": "VT: Grand Isle"
        },
        {
            "value": "Lamoille",
            "label": "VT: Lamoille"
        },
        {
            "value": "Orange",
            "label": "VT: Orange"
        },
        {
            "value": "Orleans",
            "label": "VT: Orleans"
        },
        {
            "value": "Rutland",
            "label": "VT: Rutland"
        },
        {
            "value": "Washington",
            "label": "VT: Washington"
        },
        {
            "value": "Windham",
            "label": "VT: Windham"
        },
        {
            "value": "Windsor",
            "label": "VT: Windsor"
        },
        {
            "value": "Adams",
            "label": "WA: Adams"
        },
        {
            "value": "Asotin",
            "label": "WA: Asotin"
        },
        {
            "value": "Benton",
            "label": "WA: Benton"
        },
        {
            "value": "Chelan",
            "label": "WA: Chelan"
        },
        {
            "value": "Clallam",
            "label": "WA: Clallam"
        },
        {
            "value": "Clark",
            "label": "WA: Clark"
        },
        {
            "value": "Columbia",
            "label": "WA: Columbia"
        },
        {
            "value": "Cowlitz",
            "label": "WA: Cowlitz"
        },
        {
            "value": "Douglas",
            "label": "WA: Douglas"
        },
        {
            "value": "Ferry",
            "label": "WA: Ferry"
        },
        {
            "value": "Franklin",
            "label": "WA: Franklin"
        },
        {
            "value": "Garfield",
            "label": "WA: Garfield"
        },
        {
            "value": "Grant",
            "label": "WA: Grant"
        },
        {
            "value": "Grays Harbor",
            "label": "WA: Grays Harbor"
        },
        {
            "value": "Island",
            "label": "WA: Island"
        },
        {
            "value": "Jefferson",
            "label": "WA: Jefferson"
        },
        {
            "value": "King",
            "label": "WA: King"
        },
        {
            "value": "Kitsap",
            "label": "WA: Kitsap"
        },
        {
            "value": "Kittitas",
            "label": "WA: Kittitas"
        },
        {
            "value": "Klickitat",
            "label": "WA: Klickitat"
        },
        {
            "value": "Lewis",
            "label": "WA: Lewis"
        },
        {
            "value": "Lincoln",
            "label": "WA: Lincoln"
        },
        {
            "value": "Mason",
            "label": "WA: Mason"
        },
        {
            "value": "Okanogan",
            "label": "WA: Okanogan"
        },
        {
            "value": "Pacific",
            "label": "WA: Pacific"
        },
        {
            "value": "Pend Oreille",
            "label": "WA: Pend Oreille"
        },
        {
            "value": "Pierce",
            "label": "WA: Pierce"
        },
        {
            "value": "San Juan",
            "label": "WA: San Juan"
        },
        {
            "value": "Skagit",
            "label": "WA: Skagit"
        },
        {
            "value": "Skamania",
            "label": "WA: Skamania"
        },
        {
            "value": "Snohomish",
            "label": "WA: Snohomish"
        },
        {
            "value": "Spokane",
            "label": "WA: Spokane"
        },
        {
            "value": "Stevens",
            "label": "WA: Stevens"
        },
        {
            "value": "Thurston",
            "label": "WA: Thurston"
        },
        {
            "value": "Wahkiakum",
            "label": "WA: Wahkiakum"
        },
        {
            "value": "Walla Walla",
            "label": "WA: Walla Walla"
        },
        {
            "value": "Whatcom",
            "label": "WA: Whatcom"
        },
        {
            "value": "Whitman",
            "label": "WA: Whitman"
        },
        {
            "value": "Yakima",
            "label": "WA: Yakima"
        },
        {
            "value": "Adams",
            "label": "WI: Adams"
        },
        {
            "value": "Ashland",
            "label": "WI: Ashland"
        },
        {
            "value": "Barron",
            "label": "WI: Barron"
        },
        {
            "value": "Bayfield",
            "label": "WI: Bayfield"
        },
        {
            "value": "Brown",
            "label": "WI: Brown"
        },
        {
            "value": "Buffalo",
            "label": "WI: Buffalo"
        },
        {
            "value": "Burnett",
            "label": "WI: Burnett"
        },
        {
            "value": "Calumet",
            "label": "WI: Calumet"
        },
        {
            "value": "Chippewa",
            "label": "WI: Chippewa"
        },
        {
            "value": "Clark",
            "label": "WI: Clark"
        },
        {
            "value": "Columbia",
            "label": "WI: Columbia"
        },
        {
            "value": "Crawford",
            "label": "WI: Crawford"
        },
        {
            "value": "Dane",
            "label": "WI: Dane"
        },
        {
            "value": "Dodge",
            "label": "WI: Dodge"
        },
        {
            "value": "Door",
            "label": "WI: Door"
        },
        {
            "value": "Douglas",
            "label": "WI: Douglas"
        },
        {
            "value": "Dunn",
            "label": "WI: Dunn"
        },
        {
            "value": "Eau Claire",
            "label": "WI: Eau Claire"
        },
        {
            "value": "Florence",
            "label": "WI: Florence"
        },
        {
            "value": "Fond du Lac",
            "label": "WI: Fond du Lac"
        },
        {
            "value": "Forest",
            "label": "WI: Forest"
        },
        {
            "value": "Grant",
            "label": "WI: Grant"
        },
        {
            "value": "Green",
            "label": "WI: Green"
        },
        {
            "value": "Green Lake",
            "label": "WI: Green Lake"
        },
        {
            "value": "Iowa",
            "label": "WI: Iowa"
        },
        {
            "value": "Iron",
            "label": "WI: Iron"
        },
        {
            "value": "Jackson",
            "label": "WI: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "WI: Jefferson"
        },
        {
            "value": "Juneau",
            "label": "WI: Juneau"
        },
        {
            "value": "Kenosha",
            "label": "WI: Kenosha"
        },
        {
            "value": "Kewaunee",
            "label": "WI: Kewaunee"
        },
        {
            "value": "La Crosse",
            "label": "WI: La Crosse"
        },
        {
            "value": "Lafayette",
            "label": "WI: Lafayette"
        },
        {
            "value": "Langlade",
            "label": "WI: Langlade"
        },
        {
            "value": "Lincoln",
            "label": "WI: Lincoln"
        },
        {
            "value": "Manitowoc",
            "label": "WI: Manitowoc"
        },
        {
            "value": "Marathon",
            "label": "WI: Marathon"
        },
        {
            "value": "Marinette",
            "label": "WI: Marinette"
        },
        {
            "value": "Marquette",
            "label": "WI: Marquette"
        },
        {
            "value": "Menominee",
            "label": "WI: Menominee"
        },
        {
            "value": "Milwaukee",
            "label": "WI: Milwaukee"
        },
        {
            "value": "Monroe",
            "label": "WI: Monroe"
        },
        {
            "value": "Oconto",
            "label": "WI: Oconto"
        },
        {
            "value": "Oneida",
            "label": "WI: Oneida"
        },
        {
            "value": "Outagamie",
            "label": "WI: Outagamie"
        },
        {
            "value": "Ozaukee",
            "label": "WI: Ozaukee"
        },
        {
            "value": "Pepin",
            "label": "WI: Pepin"
        },
        {
            "value": "Pierce",
            "label": "WI: Pierce"
        },
        {
            "value": "Polk",
            "label": "WI: Polk"
        },
        {
            "value": "Portage",
            "label": "WI: Portage"
        },
        {
            "value": "Price",
            "label": "WI: Price"
        },
        {
            "value": "Racine",
            "label": "WI: Racine"
        },
        {
            "value": "Richland",
            "label": "WI: Richland"
        },
        {
            "value": "Rock",
            "label": "WI: Rock"
        },
        {
            "value": "Rusk",
            "label": "WI: Rusk"
        },
        {
            "value": "Sauk",
            "label": "WI: Sauk"
        },
        {
            "value": "Sawyer",
            "label": "WI: Sawyer"
        },
        {
            "value": "Shawano",
            "label": "WI: Shawano"
        },
        {
            "value": "Sheboygan",
            "label": "WI: Sheboygan"
        },
        {
            "value": "St. Croix",
            "label": "WI: St. Croix"
        },
        {
            "value": "Taylor",
            "label": "WI: Taylor"
        },
        {
            "value": "Trempealeau",
            "label": "WI: Trempealeau"
        },
        {
            "value": "Vernon",
            "label": "WI: Vernon"
        },
        {
            "value": "Vilas",
            "label": "WI: Vilas"
        },
        {
            "value": "Walworth",
            "label": "WI: Walworth"
        },
        {
            "value": "Washburn",
            "label": "WI: Washburn"
        },
        {
            "value": "Washington",
            "label": "WI: Washington"
        },
        {
            "value": "Waukesha",
            "label": "WI: Waukesha"
        },
        {
            "value": "Waupaca",
            "label": "WI: Waupaca"
        },
        {
            "value": "Waushara",
            "label": "WI: Waushara"
        },
        {
            "value": "Winnebago",
            "label": "WI: Winnebago"
        },
        {
            "value": "Wood",
            "label": "WI: Wood"
        },
        {
            "value": "Barbour",
            "label": "WV: Barbour"
        },
        {
            "value": "Berkeley",
            "label": "WV: Berkeley"
        },
        {
            "value": "Boone",
            "label": "WV: Boone"
        },
        {
            "value": "Braxton",
            "label": "WV: Braxton"
        },
        {
            "value": "Brooke",
            "label": "WV: Brooke"
        },
        {
            "value": "Cabell",
            "label": "WV: Cabell"
        },
        {
            "value": "Calhoun",
            "label": "WV: Calhoun"
        },
        {
            "value": "Clay",
            "label": "WV: Clay"
        },
        {
            "value": "Doddridge",
            "label": "WV: Doddridge"
        },
        {
            "value": "Fayette",
            "label": "WV: Fayette"
        },
        {
            "value": "Gilmer",
            "label": "WV: Gilmer"
        },
        {
            "value": "Grant",
            "label": "WV: Grant"
        },
        {
            "value": "Greenbrier",
            "label": "WV: Greenbrier"
        },
        {
            "value": "Hampshire",
            "label": "WV: Hampshire"
        },
        {
            "value": "Hancock",
            "label": "WV: Hancock"
        },
        {
            "value": "Hardy",
            "label": "WV: Hardy"
        },
        {
            "value": "Harrison",
            "label": "WV: Harrison"
        },
        {
            "value": "Jackson",
            "label": "WV: Jackson"
        },
        {
            "value": "Jefferson",
            "label": "WV: Jefferson"
        },
        {
            "value": "Kanawha",
            "label": "WV: Kanawha"
        },
        {
            "value": "Lewis",
            "label": "WV: Lewis"
        },
        {
            "value": "Lincoln",
            "label": "WV: Lincoln"
        },
        {
            "value": "Logan",
            "label": "WV: Logan"
        },
        {
            "value": "Marion",
            "label": "WV: Marion"
        },
        {
            "value": "Marshall",
            "label": "WV: Marshall"
        },
        {
            "value": "Mason",
            "label": "WV: Mason"
        },
        {
            "value": "McDowell",
            "label": "WV: McDowell"
        },
        {
            "value": "Mercer",
            "label": "WV: Mercer"
        },
        {
            "value": "Mineral",
            "label": "WV: Mineral"
        },
        {
            "value": "Mingo",
            "label": "WV: Mingo"
        },
        {
            "value": "Monongalia",
            "label": "WV: Monongalia"
        },
        {
            "value": "Monroe",
            "label": "WV: Monroe"
        },
        {
            "value": "Morgan",
            "label": "WV: Morgan"
        },
        {
            "value": "Nicholas",
            "label": "WV: Nicholas"
        },
        {
            "value": "Ohio",
            "label": "WV: Ohio"
        },
        {
            "value": "Pendleton",
            "label": "WV: Pendleton"
        },
        {
            "value": "Pleasants",
            "label": "WV: Pleasants"
        },
        {
            "value": "Pocahontas",
            "label": "WV: Pocahontas"
        },
        {
            "value": "Preston",
            "label": "WV: Preston"
        },
        {
            "value": "Putnam",
            "label": "WV: Putnam"
        },
        {
            "value": "Raleigh",
            "label": "WV: Raleigh"
        },
        {
            "value": "Randolph",
            "label": "WV: Randolph"
        },
        {
            "value": "Ritchie",
            "label": "WV: Ritchie"
        },
        {
            "value": "Roane",
            "label": "WV: Roane"
        },
        {
            "value": "Summers",
            "label": "WV: Summers"
        },
        {
            "value": "Taylor",
            "label": "WV: Taylor"
        },
        {
            "value": "Tucker",
            "label": "WV: Tucker"
        },
        {
            "value": "Tyler",
            "label": "WV: Tyler"
        },
        {
            "value": "Upshur",
            "label": "WV: Upshur"
        },
        {
            "value": "Wayne",
            "label": "WV: Wayne"
        },
        {
            "value": "Webster",
            "label": "WV: Webster"
        },
        {
            "value": "Wetzel",
            "label": "WV: Wetzel"
        },
        {
            "value": "Wirt",
            "label": "WV: Wirt"
        },
        {
            "value": "Wood",
            "label": "WV: Wood"
        },
        {
            "value": "Wyoming",
            "label": "WV: Wyoming"
        },
        {
            "value": "Albany",
            "label": "WY: Albany"
        },
        {
            "value": "Big Horn",
            "label": "WY: Big Horn"
        },
        {
            "value": "Campbell",
            "label": "WY: Campbell"
        },
        {
            "value": "Carbon",
            "label": "WY: Carbon"
        },
        {
            "value": "Converse",
            "label": "WY: Converse"
        },
        {
            "value": "Crook",
            "label": "WY: Crook"
        },
        {
            "value": "Fremont",
            "label": "WY: Fremont"
        },
        {
            "value": "Goshen",
            "label": "WY: Goshen"
        },
        {
            "value": "Hot Springs",
            "label": "WY: Hot Springs"
        },
        {
            "value": "Johnson",
            "label": "WY: Johnson"
        },
        {
            "value": "Laramie",
            "label": "WY: Laramie"
        },
        {
            "value": "Lincoln",
            "label": "WY: Lincoln"
        },
        {
            "value": "Natrona",
            "label": "WY: Natrona"
        },
        {
            "value": "Niobrara",
            "label": "WY: Niobrara"
        },
        {
            "value": "Park",
            "label": "WY: Park"
        },
        {
            "value": "Platte",
            "label": "WY: Platte"
        },
        {
            "value": "Sheridan",
            "label": "WY: Sheridan"
        },
        {
            "value": "Sublette",
            "label": "WY: Sublette"
        },
        {
            "value": "Sweetwater",
            "label": "WY: Sweetwater"
        },
        {
            "value": "Teton",
            "label": "WY: Teton"
        },
        {
            "value": "Uinta",
            "label": "WY: Uinta"
        },
        {
            "value": "Washakie",
            "label": "WY: Washakie"
        },
        {
            "value": "Weston",
            "label": "WY: Weston"
        }
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
        if(searcherState.county && searcherState.county.length > 0){
            isFiltered = true;
            filteredResults = filteredResults.filter(arrayMatchesArrayCounty("county", searcherState.county));
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
    getKeys: (obj) => {
        let keysArr = [];
        for (var key in obj) {
          keysArr.push(key);
        }
        return keysArr;
    },
    
    /**
     * @param {Object} object
     * @param {string} key
     * @return {any} value
     */
    getParameterCaseInsensitive:(object, key) => {
        return object[Object.keys(object)
            .find(k => k.toLowerCase() === key.toLowerCase())
            ];
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
    /** Special logic for ;-delimited counties from Egoitz, ... */
    const arrayMatchesArrayCounty = (field, val) => {
        return function (a) {
            let returnValue = false;
            val.forEach(item =>{
                if(a[field]){
                    const _stateCounty = item.split(':'); // 'AK: Anchorage' -> ['AK',' Anchorage']
                    if(_stateCounty.length > 1) {
                        let itemCounty = _stateCounty[1].trim(); // [' Anchorage'] -> 'Anchorage'
                        let _vals = a[field].split(/[;,]+/); // Split up record counties

                        // Right now we just need to know if the state makes sense.
                        // So if it's multi or any states match this county's state then we can proceed.
                        // This is because the counties are just strings in the database.
                        //
                        // TODO: In order to make the filter functionality truly accurate, the counties ALL need to be
                        // prepended with a state abbreviation in the database - this can be done programmatically
                        // by wiping counties clean and generating them based on the geojson data links.
                        // Then instead of checking state and then checking county names, we would only compare county names
                        // because the record's county names would include the state abbreviation already.
                        //
                        // This of course will not fix any data errors.
                        // For example Egoitz's data included a TX;LA record linked to Jefferson County. The algorithm
                        // has no idea whether it's Texas's or Louisiana's Jefferson County, or both. So polygons show up
                        // for both.

                        if(a['state']) {
                            let stateMatched = false;
                            const validStates = a['state'].split(/[;,]+/);
                            if(validStates.length > 0) {
                                if(validStates[0].trim() === 'Multi') {
                                    stateMatched = true;
                                } else {
                                    for(let i = 0; i < validStates.length; i++) { // Check item state against all record states
                                        if(validStates[i].trim() === _stateCounty[0].trim()) {
                                            stateMatched = true; // if we hit ANY of them, then true
                                            i = validStates.length;
                                        }
                                    }
                                    if(stateMatched) {
                                        for(let i = 0; i < _vals.length; i++) { // Check item against all record counties
                                            if (_vals[i].trim() === itemCounty) {
                                                returnValue = true; // if we hit ANY of them, then true
                                                i = _vals.length;
                                            }
                                        }
                                    }
                                }
                            }
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