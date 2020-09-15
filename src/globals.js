import axios from 'axios';

const Globals = {
    currentHost: new URL('http://localhost:8080/'),

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
        if(window.location.hostname === 'mis-jvinalappl1.microagelab.arizona.edu') {
            this.currentHost = new URL('http://mis-jvinalappl1.microagelab.arizona.edu:8080/');
        }
        
        axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
                
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
            limit: searcherState.limit, // definitely need to keep these
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

    
    anEnum: Object.freeze({"test":1, "test2":2, "test3":3})

    
}

export default Globals;