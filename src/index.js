import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//import './index.css';

import Main from './Main.js';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
    <BrowserRouter>
        <Main />
    </BrowserRouter>
    </ThemeProvider>
    , document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
