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


    // listeners: [],

    // registerListener(listenerFunction) {
    //     this.listeners.push(listenerFunction);
    // },

    // emitEvent(eventObject) {
    //     this.listeners.forEach(listener => {
    //         listener(eventObject);
    //     });
    // },
    
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
    }
}

export default Globals;