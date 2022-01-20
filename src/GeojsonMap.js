import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import Globals from './globals.js';

import './leaflet.css';

let counties = [];

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
        const getDataProcess = async (processId) => {
            let url = Globals.currentHost + "geojson/get_all_geojson_for_process";
            const response = await axios.get(url, { params: { id: processId } });
            
            for(let i = 0; i < response.data.length; i++) {
                let datum = JSON.parse(response.data[i]).properties;
                if(datum.COUNTYNS) {
                    counties.push(datum.NAME);
                }
            }

            setData(response.data);
        };
        const getDataDoc = async (docId) => {
            let url = Globals.currentHost + "geojson/get_all_geojson_for_eisdoc";
            const response = await axios.get(url, { params: { id: docId } });

            for(let i = 0; i < response.data.length; i++) {
                let datum = JSON.parse(response.data[i]).properties;
                if(datum.COUNTYNS) {
                    counties.push(datum.NAME);
                }
            }

            setData(response.data);
        };

        if(props && props.processId) {
            getDataProcess(props.processId);
        } else if(props && props.docId) {
            getDataDoc(props.docId);
        } else {
            getDataAll();
        }

    }, []);

    // render react-leaflet GeoJSON when the data is ready
    if (data && data[0]) { // Render many
        return data.map( ((datum, i) => {
            return <GeoJSON key={"leaflet"+i} data={JSON.parse(datum)} />;
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
            
            <p className='modal-line' hidden={!counties.length}>
                <span className='modal-title'>Counties:</span> <span className="bold">{counties.join("; ")}</span>
            </p>
            
            <MapContainer className="leafmap" 
                center={[39.82, -98.58]} 
                zoom={3} scrollWheelZoom={false}
                // {...props}
            >
                <MyData {...props} />
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