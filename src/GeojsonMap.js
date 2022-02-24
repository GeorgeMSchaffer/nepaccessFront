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



let _size = 0;
let _id = -1;

const MyData = (props) => {
    // create state variable to hold data when it is fetched
    const [data, setData] = React.useState(null); 
    const [isLoading, setLoading] = React.useState(false); 
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
            // console.log("No data");
            return null;
        }
    }


    // useEffect to fetch data on mount
    useEffect(() => {
        let sortedData = [];
        // console.log("useEffect()",props);

        const getByList = async (docs, urlAppend) => {
            setData(null);
            setLoading(true);
            let url = Globals.currentHost + urlAppend;

            const response = await axios.post(url, { ids: docs } );

            if(response.data && response.data[0]) {
                for(let i = 0; i < response.data.length; i++) {
                    // console.log(response.data[i].count); // TODO: use count
                    let json = JSON.parse(response.data[i]['geojson']);
                    json.style = {};
                    json.sortPriority = 0;
                    json.count = response.data[i]['count'];

                    if(json.properties.COUNTYFP) {
                        json.style.color = "#3388ff"; // county: default (blue)
                        json.style.fillColor = "#3388ff";
                        json.sortPriority = 5;
                    } else if(json.properties.STATENS) {
                        json.style.color = "#000"; // state: black
                        json.style.fillColor = "#000";
                        json.sortPriority = 4;
                    } else {
                        json.style.color = "#D54E21";
                        json.style.fillColor = "#D54E21";
                        json.sortPriority = 6;
                    }
                    response.data[i] = json;
                }

                sortedData = response.data.sort((a, b) => parseInt(a.sortPriority) - parseInt(b.sortPriority));
                
                setData(sortedData);
            }

            setLoading(false);
        };

        // async function
        // TODO: This was just for testing and doesn't even use all the data
        // const getDataAll = async () => {
        //     // 'await' the data
        //     let url = new URL('geojson/get_all', Globals.currentHost);
        //     const response = await axios.get(url);

        //     // save data to state
        //     setData(JSON.parse(response.data[0].geojson.geojson));
        // };
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
                        // json.style.color = "#8FBC3F";
                        // json.style.fillColor = "#8FBC3F";
                    }

                    response.data[i] = json;
                }
                // if(jsonData.COUNTYFP) {
                //     console.log("County", jsonData.COUNTYFP);
                // }

                // Sort by our sort priority such that the largest .sortPriority numbers are at the top (counties, other regions)
                sortedData = response.data.sort((a, b) => parseInt(a.sortPriority) - parseInt(b.sortPriority));

                setData(sortedData);
            }

            setLoading(false);
        };

        if(props && props.docList && props.docList.length > 0) {
            if(props.docList.length !== _size) { // simple logic to only rerender when the data has changed
                
                _size = props.docList.length;
                let _ids = [];
                props.docList.forEach(process => {
                    process.records.forEach(record => {
                        _ids.push(record.id);
                    })
                })

                getByList(_ids, "geojson/get_all_state_county_for_eisdocs"); // total state/county is only ~3MB
                // getByList(_ids, "geojson/get_geodata_other_for_eisdocs"); // TODO: test
                // getByList(_ids,"geojson/get_all_geodata_for_eisdocs"); // maximum size is... 100MB+?
            } else {
                // console.log("Failed size test",_size,props.docList.length);
            }
        }
        else if(props && props.processId) {
            if(_id !== props.processId) { // simple logic to only rerender when the data has changed
                _id = props.processId;
                console.log("Firing");
                getDataProcessOrDoc(props.processId, "geojson/get_all_geojson_for_process");
            }
        } else if(props && props.docId) {
            if(_id !== props.docId) { // simple logic to only rerender when the data has changed
                _id = props.docId;
                console.log("Firing");
                getDataProcessOrDoc(props.docId, "geojson/get_all_geojson_for_eisdoc");
            }
        } else {
            // console.log("Nothing here?",props);
            // getDataAll();
        }

        return () => { // unmount
            _size = 0; // unmounting loses data and will need to re-call and re-render, but _size has to be reset manually.
            // _id = -1; // we don't expect to be unmounted in this case; _id should not be reset.
        }
    }, [props]);

    //     // render react-leaflet GeoJSON when the data is ready
    //     if (data && data[0]) { // Render many
    //         return data.map( ((datum, i) => {
    //             let jsonData = datum;
    //             let jsonName = Globals.getParameterCaseInsensitive(jsonData.properties,"name");
    
    //             return (
    //                 <GeoJSON key={"leaflet"+i} 
    //                     data={jsonData} 
    //                     color={jsonData.style.color} 
    //                     fillColor={jsonData.style.fillColor} 
    
    //                 >
    //                     {/* <Popup>{jsonData.properties.NAME}</Popup> */}
    //                     <Tooltip>{jsonName}</Tooltip>
    //                 </GeoJSON>
    //             );
                
    //         }));
    //     } else if(data) { // Render single geojson
    //         return <GeoJSON data={data} />;
    //     } else {
    //         return null;
    //     }
    // }
    
    if(localStorage.role === undefined) {
        return <></>
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

// const LeafletMap = (props) => {
//     console.log("LeafMap",props);
//     return (
//         <div className="leafmap_container">
//             <Helmet>
//                 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
//                     integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
//                     crossorigin=""/>
//                 <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
//                     integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
//                     crossorigin=""></script>
//             </Helmet>
            
//             {/* <div hidden={}>Test</div> */}
//             <MapContainer className="leafmap" 
//                 center={[39.82, -98.58]} 
//                 zoom={3} scrollWheelZoom={false}
//                 // {...props}
//             >
//                 <MyData {...props} />

//                 {/** tested and this tilelayer does work as-is, presumably another "canvas" could be used other than the light gray */}
//                 {/* <TileLayer
//                     url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
//                     attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
//                 /> */}
                
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//             </MapContainer>
//         </div>
//     );
// };

export default MyData;