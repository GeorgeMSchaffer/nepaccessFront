// import React, { useEffect, useState } from 'react';
import React, { useEffect } from 'react';

import {showTimeline} from './Timeline';


export default function Chart(props) {
    // const [data, setData] = useState([]);

    useEffect(() => {
        showTimeline(props.dates, props.WIDTH);
    }, [props.dates, props.WIDTH]);


    return (
        <div id="chart">
        </div>
    );
}
