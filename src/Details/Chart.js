import React, { useEffect, useState } from 'react';

import {showTimeline} from './Timeline';


export default function Chart(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        showTimeline(props.dates);
    }, [props.dates]);


    return (
        <div id="chart">
        </div>
    );
}
