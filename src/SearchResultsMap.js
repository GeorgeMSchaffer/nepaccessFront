import { set } from "lodash";
import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { MapContainer, TileLayer, GeoJSON, Popup, Tooltip, useMap, ZoomControl } from "react-leaflet";

import Globals from './globals.js';

import './leaflet.css';

/** geoStatePair[geo_id] = "state abbreviation" */
let geoStatePair = {};
    geoStatePair[1] = "AL";
    geoStatePair[2] = "AK";
    geoStatePair[4] = "AZ";
    geoStatePair[5] = "AR";
    geoStatePair[6] = "CA";
    geoStatePair[8] = "CO";
    geoStatePair[9] = "CT";
    geoStatePair[10] = "DE";
    geoStatePair[11] = "DC";
    geoStatePair[12] = "FL";
    geoStatePair[13] = "GA";
    geoStatePair[15] = "HI";
    geoStatePair[16] = "ID";
    geoStatePair[17] = "IL";
    geoStatePair[18] = "IN";
    geoStatePair[19] = "IA";
    geoStatePair[20] = "KS";
    geoStatePair[21] = "KY";
    geoStatePair[22] = "LA";
    geoStatePair[23] = "ME";
    geoStatePair[24] = "MD";
    geoStatePair[25] = "MA";
    geoStatePair[26] = "MI";
    geoStatePair[27] = "MN";
    geoStatePair[28] = "MS";
    geoStatePair[29] = "MO";
    geoStatePair[30] = "MT";
    geoStatePair[31] = "NE";
    geoStatePair[32] = "NV";
    geoStatePair[33] = "NH";
    geoStatePair[34] = "NJ";
    geoStatePair[35] = "NM";
    geoStatePair[36] = "NY";
    geoStatePair[37] = "NC";
    geoStatePair[38] = "ND";
    geoStatePair[39] = "OH";
    geoStatePair[40] = "OK";
    geoStatePair[41] = "OR";
    geoStatePair[42] = "PA";
    geoStatePair[44] = "RI";
    geoStatePair[45] = "SC";
    geoStatePair[46] = "SD";
    geoStatePair[47] = "TN";
    geoStatePair[48] = "TX";
    geoStatePair[49] = "UT";
    geoStatePair[50] = "VT";
    geoStatePair[51] = "VA";
    geoStatePair[53] = "WA";
    geoStatePair[54] = "WV";
    geoStatePair[55] = "WI";
    geoStatePair[56] = "WY";
    geoStatePair[72] = "PR";

const MyData = (props) => {
    const mounted = useRef(false);

    const [data, setData] = React.useState(); 
    const [isHidden, setHidden] = React.useState(props.isHidden)
    const [geoLoading, setLoading] = React.useState(true);
    const [showStates, setShowStates] = React.useState(true);
    const [showCounties, setShowCounties] = React.useState(true);

    const hide = () => {
        setHidden(!isHidden);
        props.toggleMapHide();
    }

    const toggleGeodata = (val) => {
        if(val === 1) {
            setShowStates(!showStates);
        } else {
            setShowCounties(!showCounties);
        }
    }

    /** Determines which counties/states to display, and the counts for them. Sets this component's data */
    const setAndFilterData = () => {
        setLoading(true);
        let i = 0;
        let filteredGeoWithCounts = JSON.parse(JSON.stringify(props.docList));
        // TODO: We don't need props.searcherState, but maybe we could use it to efficiently skip irrelevant geo items.
        filteredGeoWithCounts.forEach(geoItem => {
            i++;
            props.results.forEach(docItem => {
                // Add to the count for every state or county match (need to determine if geo item is state or county first)
                if(geoItem.properties.STATENS) { // state
                    if(docItem.state) {
                        let statesList = docItem.state.split(";");
                        statesList.some(state => {
                            if(state === geoItem.properties.STUSPS) {
                                if(geoItem.count) {
                                    geoItem.count += 1;
                                } else {
                                    geoItem.count = 1;
                                }
                                return true;
                            }
                        });
                    }
                } else { // Must be county, but if logic changed we could check for geoItem.properties.COUNTYNS
                    // If county, also need to parse by transforming state geo_id to state abbreviation 
                    let stateAbbrev = geoStatePair[parseInt(geoItem.properties.STATEFP)];
                    if(docItem.county) {
                        let counties = docItem.county.split(";");
                        counties.some(county => {
                            // e.g. check for "AZ: Pima"
                            if(county === `${stateAbbrev}: ${geoItem.properties.NAME}`) {
                                if(geoItem.count) {
                                    geoItem.count += 1;
                                } else {
                                    geoItem.count = 1;
                                }
                                return true;
                            }
                            return false;
                        })
                    }
                }
            });

            if(i >= props.docList.length) {
                setLoading(false);
            }
        });

        setData(filteredGeoWithCounts);
    }
    
    const showData = () => {
        if (data && data[0]) { // Render many
            return data.map( ((datum, i) => {
                let jsonData = datum;
                let jsonName = Globals.getParameterCaseInsensitive(jsonData.properties,"name");
                let alaskaFlag = false;
                if(jsonName === "Alaska") {
                    alaskaFlag = true;
                }
                if(jsonData.count) {
                    jsonName += `; ${jsonData.count} ${(jsonData.count === 1) ? "Result" : "Results"}`
                }

                if( jsonData.count 
                    && 
                    ((jsonData.properties.STATENS && showStates) || (jsonData.properties.COUNTYNS && showCounties))
                ) {
                    if(alaskaFlag) {
                        return (
                            <GeoJSON key={"leaflet"+i} 
                                data={jsonData} 
                                color={jsonData.style.color} 
                                fillColor={jsonData.style.fillColor} 
                            >
                                {/* <Popup>{jsonData.properties.NAME}</Popup> */}
                                <Tooltip sticky>{jsonName}</Tooltip>
                            </GeoJSON>
                        );
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
                }
                
            }));
        } else {
            return null;
        }
    }


    // useEffect to fetch data on mount
    useEffect(() => {
        mounted.current = true;

        if(props && props.docList && props.docList.length > 0) {
            setAndFilterData();

            // total state/county geodata is only ~3MB

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

    let toggleText = props.isHidden ? "+" : "-";


    return (<>
        <div className="toggle-container-row">
            <div className="toggle-container">
                <span>
                    <label className="map-toggle-title no-select" onClick={hide}>Toggle map view</label>
                    <span className="map-filters-toggle" onClick={hide}>{toggleText}</span>
                </span>
            </div>
        </div>

        
        {!props.isHidden ?(
            <div>
                {geoLoading ?(
                    <div>Loading map polygons...</div>
                ) : ( <></> )}
                <div className="map-layers-toggle">
                    <div className="checkbox-container">
                        <input type="checkbox" name="showStates" id="showStates" className="sidebar-checkbox"
                                // tabIndex="1"
                                checked={showStates} onChange={() => toggleGeodata(1)} />
                        <label className="checkbox-text no-select" htmlFor="showStates">Show states and territories</label>
                    </div>
                    <div className="checkbox-container">
                        <input type="checkbox" name="showCounties" id="showCounties" className="sidebar-checkbox"
                                // tabIndex="2"
                                checked={showCounties} onChange={() => toggleGeodata(2)} />
                        <label className="checkbox-text no-select" htmlFor="showCounties">Show counties</label>
                    </div>
                </div>
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
                    >
                        {showData()}
                        
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="topright" />
                    </MapContainer>
                </div>
            </div>
        ) : (
            <></>
        )}
        
    </>);
};

export default MyData;