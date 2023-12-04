import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route,Routes,HashRouter,useHistory,useLocation } from 'react-router-dom';

import './index.css';
import {
    Paper,
    Container,
    Grid,
} from '@mui/material';
import { createBrowserHistory } from 'history';
import * as serviceWorker from './serviceWorker';
import AboutHelpContents from './AboutHelpContents.js';
import AboutNepa from './iframes/AboutNepa.js';
import AboutNepaccess from './iframes/AboutNepaccess.js';
import AboutStats from './AboutStats.js';
import Admin from './AdminPanel.js';
import AdminFiles from './AdminFiles.js';
import App from './App';
import Approve from './Approve.js';
import AvailableDocuments from './iframes/AvailableDocuments.js';
import Contact from './Contact.js';
import DisclaimerTermsOfUse from './iframes/DisclaimerTermsOfUse.js';
import Excel from './Excel.js';
import ForgotPassword from './User/ForgotPassword.js';
import Future from './iframes/Future.js';
import Iframes from './iframes/Iframes.js';
import Importer from './Importer.js';
import ImporterGeo from './ImporterGeo.js';
import ImporterGeoLinks from './ImporterGeoLinks.js';
import InteractionLogs from './InteractionLogs.js';
import Landing from './Landing.js';
import Login from './User/Login.js';
import Logout from './User/Logout.js';
import Main from './Main.js';
import Media from './iframes/Media.js';
import Pairs from './Pairs.js';
import Pairs2 from './Pairs2';
import Pairs3 from './Pairs3';
import People from './iframes/People.js';
import PreRegister from './User/PreRegister.js';
import PrivacyPolicy from './iframes/PrivacyPolicy.js';
import ProcessDetailsTab from './Details/ProcessDetailsTab.js';
import RecordDetailsTab from './Details/RecordDetailsTab.js';
import Register from './User/Register.js';
import Reset from './User/Reset.js';
import SearchLogs from './SearchLogs.js';
import SearchTest from './AppTest';
import SearchTips from './iframes/SearchTips.js';
import StatCounts from './StatCounts.js';
import Surveys from './Surveys.js';
import Test from './Test.js';
import UserDetails from './User/Profile.js';
import Verify from './User/Verify.js';
import ImporterAlignment from './ImporterAlignment.js';
const container = document.getElementById('app');
const root = createRoot(document.getElementById('root'));
const history = createBrowserHistory();
console.log(`file: index.js:18 ~ location:`, location);
//const history = createBrowserHistory();
console.log(`file: index.js:20 ~ history:`, history);
  
  history.listen(({ action, location }) => {
    console.log(
      `The current URL is ${location.pathname}${location.search}${location.hash}`
    );
    console.log(`The last navigation action was ${action}`);
  });
  

root.render(

    <HashRouter basename="/" future={{ v7Routing: true }}>
        <Routes>
            <Route path="/profile" element={<UserDetails/>}/>
                    <Route errorElement={<ErrorComponent />} path="/login" element={<Login/>}/>
                    <Route errorElement={<ErrorComponent />} path="/register" element={<Register/>}/>
                    <Route errorElement={<ErrorComponent />} path="/pre_register" element={<PreRegister />}/>
                    <Route errorElement={<ErrorComponent />} path="/forgotPassword" element={<ForgotPassword/>}/>
                    <Route errorElement={<ErrorComponent />} path="/reset" element={<Reset/>}/>
                    <Route errorElement={<ErrorComponent />} path="/logout" element={<Logout/>}/>
                    <Route errorElement={<ErrorComponent />} path="/about-nepa" element={<AboutNepa/>}/>
                    <Route errorElement={<ErrorComponent />} path="/about-nepaccess" component={<AboutNepaccess/>}/>
                    <Route errorElement={<ErrorComponent />} path="/people" element={<People/>}/>
                    <Route errorElement={<ErrorComponent />} path="/search-tips" element={<SearchTips/>}/>
                    <Route errorElement={<ErrorComponent />} path="/available-documents" element={<AvailableDocuments/>}/>
                    <Route errorElement={<ErrorComponent />} path="/abouthelpcontents" component={<AboutHelpContents/>}/>
                    <Route errorElement={<ErrorComponent />} path="/stats" element={<AboutStats/>}/>
                    <Route errorElement={<ErrorComponent />} path="/media" element={<Media/>}/>
                    <Route errorElement={<ErrorComponent />} path="/contact" element={<Contact/>}/>
                    <Route errorElement={<ErrorComponent />} path="/future" element={<Future/>}/>    
                    <Route errorElement={<ErrorComponent />} path="/record-details" element={<RecordDetailsTab/>}/>
                    <Route errorElement={<ErrorComponent />} path="/process-details" element={<ProcessDetailsTab/>}/>
                    <Route errorElement={<ErrorComponent />} path="/importer" element={<Importer/>}/>
                    <Route errorElement={<ErrorComponent />} path="/adminFiles" element={<AdminFiles/>}/>    
                    <Route errorElement={<ErrorComponent />} path="/iframes" element={<Iframes/>} />
                    <Route errorElement={<ErrorComponent />} path="/privacy-policy" element={<PrivacyPolicy/>} />
                    <Route errorElement={<ErrorComponent />} path="/disclaimer-terms-of-use" element={<DisclaimerTermsOfUse/>} />
                    <Route errorElement={<ErrorComponent />} path="/verify" element={<Verify/>} />
                    <Route errorElement={<ErrorComponent />} path="/approve" element={<Approve/>} />
                    <Route errorElement={<ErrorComponent />} path="/admin" element={<Admin/>} />
                    <Route errorElement={<ErrorComponent />} path="/pairs" element={<Pairs/>}></Route>
                    <Route errorElement={<ErrorComponent />} path="/pairs2" element={<Pairs2/>}></Route>
                    <Route errorElement={<ErrorComponent />} path="/pairs3" element={<Pairs3/>}></Route>
                    <Route errorElement={<ErrorComponent />} path="/search_logs" element={<SearchLogs/>}></Route>
                    <Route errorElement={<ErrorComponent />} path="/interaction_logs" element={<InteractionLogs/>}></Route>
                    <Route errorElement={<ErrorComponent />} path="/stat_counts" element={<StatCounts/>}></Route>
                    <Route errorElement={<ErrorComponent />} path="/surveys" element={<Surveys/>}></Route>
                    <Route errorElement={<ErrorComponent />} path="/excel" element={<Excel/>}></Route>
                    <Route errorElement={<ErrorComponent />} path="/search_test" element={<SearchTest/>} />
                    <Route errorElement={<ErrorComponent />} path="/up_geo" element={ImporterGeo} />
                    <Route errorElement={<ErrorComponent />} path="/up_geo_links" element={ImporterGeoLinks} />
                    <Route errorElement={<ErrorComponent />} path="/up_alignment" element={ImporterAlignment} />
            <Route errorElement={<ErrorComponent />} path="/record-details/?id=:id" element={<RecordDetailsTab history={history} />} />
            <Route errorElement={<ErrorComponent />} path="/record-details/"  element={<RecordDetailsTab history={history} />} />

            <Route errorElement={<ErrorComponent />} index path="/process-details/processId=:id" element={<ProcessDetailsTab history={history} />} />
            <Route  errorElement={<ErrorComponent />} path="/search" element={<App history={window.history} />}>
                <Route index element={<App history={window.history} location={window.location} />} />
                <Route path="q=:q" element={<App history={window.location.history} />} />
            </Route>


            <Route  errorElement={<ErrorComponent />}  exact path="/" element={<Landing history={window.history} location={location} />} />
            <Route  errorElement={<ErrorComponent />} path="*" element={<NoMatch />} />
        </Routes>
        {/* <Main location={window.location} history={window.history} /> */}
    </HashRouter>
);
function NoMatch() {
    let location = useLocation();
    console.log(`file: index.js:41 ~ NoMatch ~ location:`, location);
  
    return (
    <Container>
          <Paper elevation={1} styles={{
            flex:1,
            justifyContent:'center',
            alignContent:'center',
            height:'300vh',
          }}>
            <Grid container minHeight={'100vh'} justifyContent="center" alignItems="center">
            <Grid item xs={12} margin={20}>
                 <h2> No match for <code>{location.pathname}</code></h2>
            </Grid>
            </Grid>
          </Paper>
    </Container>
    );
  }  function ErrorComponent(){
    return(
        <Countainer styles={{
            border:'1px solid red',
            justifyContent:'center',
        }}>
            <h1>ERROR</h1>
        </Countainer>
    )
  }
  
  // Listen for changes to the current location.
let unlisten = history.listen(({ location, action }) => {
    console.log(action, location.pathname, location.state);
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
