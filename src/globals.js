import axios from 'axios';

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
        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem("username");
        localStorage.removeItem("curator");
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

            if(_status == 400) {
                message = "400 Bad request";
            }
            else if(_status == 401) {
                message = "401 Unauthorized";
            }
            else if(_status == 403) {
                message = "Please log in again (user session may have expired).";
            }
            else if(_status == 404) {
                message = "404 Not Found";
            }
            else if(_status == 408) {
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
    
    anEnum: Object.freeze({"test":1, "test2":2, "test3":3})

    
}

export default Globals;