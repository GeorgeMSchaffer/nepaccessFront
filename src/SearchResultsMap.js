import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { MapContainer, TileLayer, GeoJSON, Popup, Tooltip, useMap } from "react-leaflet";

import Globals from './globals.js';

import './leaflet.css';

const MyData = (props) => {
    const mounted = useRef(false);

    const [data, setData] = React.useState(); 
    const [isHidden, setHidden] = React.useState(false); 
    const [minimize, setMinimize] = React.useState("-");


    const hide = () => {
        if(isHidden) {
            setMinimize("-");
            setHidden(false);
        } else {
            setMinimize("+");
            setHidden(true);
        }
    }

    
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
        } else {
            return null;
        }
    }


    // useEffect to fetch data on mount
    useEffect(() => {
        mounted.current = true;
        setData(null);

        if(props && props.docList && props.docList.length > 0) {

            // total state/county is only ~3MB
            setData(props.docList);

            // getByList(_ids, "geojson/get_geodata_other_for_eisdocs"); // presumably up to about ~180MB
            // getByList(_ids,"geojson/get_all_geodata_for_eisdocs"); // up to ~180MB
        } else {
            // console.log("Nothing here");
            // getByList(null, "geojson/get_all_state_county_for_eisdocs");
        }

        return () => { // unmount or rerender
            mounted.current = false;
        };
    }, [props]);



    if(localStorage.role === undefined) {
        return <></>;
    } else {
        return (<>
            <div className="toggle-container">
                <span className="map-filters-toggle" onClick={hide}>{minimize}</span>
            </div>
            <div className="leafmap_container" hidden={isHidden}>
                <Helmet>
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                        crossorigin=""/>
                    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                        crossorigin=""></script>
                </Helmet>
                
                <div className="map-loading-tooltip" hidden={!props.geoLoading}>Please wait for map data to load...</div>
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