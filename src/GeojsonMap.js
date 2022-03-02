import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
//https://react-leaflet.js.org/docs/example-react-control/
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import axios from "axios";
import Globals from './globals.js';

import './leaflet.css';

// basic colorblind palette
// #000000
// #252525
// #676767
// #ffffff

// #171723
// #004949
// #009999
// #22cf22
// #490092
// #006ddb
// #b66dff
// #ff6db6
// #920000
// #8f4e00
// #db6d00
// #ffdf4d

let _id = -1;

const MyData = (props) => {
    const mounted = useRef(false);
    // create state variable to hold data when it is fetched
    const [data, setData] = React.useState(); 
    const [isLoading, setLoading] = React.useState(false); 
    
    // TODO: Get count if available, append or prepend to name, or make it the popup text (on-click)
    /** Helper returns <GeoJSON> from data.map */
    const showData = () => {
        if (data && data[0]) { // Render many
            return data.map( ((datum, i) => {
                let jsonData = datum;
                let jsonName = Globals.getParameterCaseInsensitive(jsonData.properties,"name");
                if(jsonData.count) {
                    jsonName += "; " + jsonData.count + " Results"
                }

                return (
                    <GeoJSON key={"leaflet"+i} 
                        data={jsonData} 
                        color={jsonData.style.color} 
                        fillColor={jsonData.style.fillColor} 

                    >
                        {/* <Popup>{jsonData.properties.NAME}</Popup> */}
                        <Tooltip>{jsonName}</Tooltip>
                    </GeoJSON>
                );
                
            }));
        } else if(data) { // Render single geojson
            return <GeoJSON data={data} />;
        } else {
            return null;
        }
    }


    // useEffect to fetch data on mount
    useEffect(() => {
        mounted.current = true;
        let sortedData = [];

        const getDataProcessOrDoc = async (id, urlAppend) => {
            setData(null);
            setLoading(true);
            let url = Globals.currentHost + urlAppend;

            const response = await axios.get(url, { params: { id: id } });

            // Add specific color to states and counties

            // Internal polygons (counties, other) must be added LAST in order to show up, 
            // otherwise the overlapping labels don't work. We'll use a new property, sortPriority.
            if(response.data && response.data[0]) {
                for(let i = 0; i < response.data.length; i++) {
                    let json = JSON.parse(response.data[i]);
                    json.style = {};
                    json.sortPriority = 0;

                    if(json.properties.COUNTYFP) {
                        json.style.color = "#3388ff"; // county: default (blue)
                        json.style.fillColor = "#3388ff";
                        json.sortPriority = 5;
                    } else if(json.properties.STATENS) {
                        json.style.color = "#000"; // state: black
                        json.style.fillColor = "#000";
                        json.sortPriority = 4;
                    } else {
                        json.style.color = "#D54E21"; // other: orange, colorblind friendly and contrasts well
                        json.style.fillColor = "#D54E21";
                        json.sortPriority = 6;
                    }

                    response.data[i] = json;
                }

                // Sort by our sort priority such that the largest .sortPriority numbers are at the top (counties, other regions)
                sortedData = response.data.sort((a, b) => parseInt(a.sortPriority) - parseInt(b.sortPriority));

                setData(sortedData);
            }

            setLoading(false);
        };

        if(props && props.processId) {
            if(_id !== props.processId) { // simple logic to only rerender when the data has changed
                _id = props.processId;
                getDataProcessOrDoc(props.processId, "geojson/get_all_geojson_for_process");
            }
        } else if(props && props.docId) {
            if(_id !== props.docId) { // simple logic to only rerender when the data has changed
                _id = props.docId;
                getDataProcessOrDoc(props.docId, "geojson/get_all_geojson_for_eisdoc");
            }
        } else {
            // console.log("Nothing here?",props);
        }

        return () => { // unmount or rerender
            // _id = -1;
            mounted.current = false;
        };
    }, [props]);
    
    if(localStorage.role === undefined) {
        return <></>
    } else {
        return (<>
            <div className="leafmap_container">
                <Helmet>
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                        crossorigin=""/>
                    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                        crossorigin=""></script>
                </Helmet>
                
                <div className="map-loading-tooltip" hidden={!isLoading}>Please wait for map data to load...</div>
                <MapContainer className="leafmap"
                    center={[39.82, -98.58]} 
                    zoom={3} scrollWheelZoom={false}
                >
                    {showData()}
                    
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        </>);
    }
    

};

export default MyData;