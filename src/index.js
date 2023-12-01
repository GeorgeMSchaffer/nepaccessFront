import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

import Main from './Main.js';

const container = document.getElementById('app');
const root = createRoot(document.getElementById('root'));


root.render(
    <BrowserRouter>
        <Main location={window.location} history={window.history} />
    </BrowserRouter>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
