import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
//https://react-leaflet.js.org/docs/example-react-control/
import { MapContainer, TileLayer, GeoJSON, Popup, Tooltip, useMap } from "react-leaflet";
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

const MyData = (props) => {
    // create state variable to hold data when it is fetched
    const [data, setData] = React.useState();

    // useEffect to fetch data on mount
    useEffect(() => {
        // console.log("useEffect()",props);

        // async function
        const getDataAll = async () => {
            // 'await' the data
            let url = new URL('geojson/get_all', Globals.currentHost);
            const response = await axios.get(url);

            // save data to state
            setData(JSON.parse(response.data[0].geojson.geojson));
        };
        const getDataProcessOrDoc = async (_id, urlAppend) => {
            let url = Globals.currentHost + urlAppend;
            const response = await axios.get(url, { params: { id: _id } });

            // Add specific color to states and counties
            if(response.data && response.data[0]) {
                for(let i = 0; i < response.data.length; i++) {
                    let json = JSON.parse(response.data[i]);
                    json.style = {};

                    if(json.properties.COUNTYFP) {
                        json.style.color = "#3388ff"; // default
                        json.style.fillColor = "#3388ff";
                        response.data[i] = JSON.stringify(json);
                    } else {
                        json.style.color = "#000";
                        json.style.fillColor = "#000";
                        // json.style.color = "#8FBC3F";
                        // json.style.fillColor = "#8FBC3F";
                        response.data[i] = JSON.stringify(json);
                    }
                    
                    // console.log(json.style);
                }
                // if(jsonData.COUNTYFP) {
                //     console.log("County", jsonData.COUNTYFP);
                // }
            }
            
            setData(response.data);
        };

        if(props && props.processId) {
            getDataProcessOrDoc(props.processId, "geojson/get_all_geojson_for_process");
        } else if(props && props.docId) {
            getDataProcessOrDoc(props.docId, "geojson/get_all_geojson_for_eisdoc");
        } else {
            getDataAll();
        }

    }, []);

    // render react-leaflet GeoJSON when the data is ready
    if (data && data[0]) { // Render many
        return data.map( ((datum, i) => {
            let jsonData = JSON.parse(datum);
            // console.log(jsonData);

            return (
                <GeoJSON key={"leaflet"+i} 
                    data={jsonData} 
                    color={jsonData.style.color} 
                    fillColor={jsonData.style.fillColor} 

                >
                    {/* <Popup>{jsonData.properties.NAME}</Popup> */}
                    <Tooltip>{jsonData.properties.NAME}</Tooltip>
                </GeoJSON>
            );
            
        }));
    } else if(data) { // Render single geojson
        return <GeoJSON data={data} />;
    } else {
        return null;
    }
};

const LeafletMap = (props) => {
    return (
        <div className="leafmap_container">
            <Helmet>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                    crossorigin=""/>
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                    crossorigin=""></script>
            </Helmet>
            
            <MapContainer className="leafmap" 
                center={[39.82, -98.58]} 
                zoom={3} scrollWheelZoom={false}
                // {...props}
            >
                <MyData {...props} />

                {/** tested and this tilelayer does work as-is, presumably another "canvas" could be used other than the light gray */}
                {/* <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
                /> */}
                
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
};

export default LeafletMap;