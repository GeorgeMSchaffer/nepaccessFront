import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

import './index.css';

import Landing from './Landing.js';
import App from './App';
import ProcessDetailsTab from './Details/ProcessDetailsTab.js';
import RecordDetailsTab from './Details/RecordDetailsTab.js';

// import OptOut from './User/OptOut';

import Login from './User/Login.js';
import Logout from './User/Logout.js';
import Reset from './User/Reset.js';
import UserDetails from './User/Profile.js';
import ForgotPassword from './User/ForgotPassword.js';
import Register from './User/Register.js';
import PreRegister from './User/PreRegister.js';
import Verify from './User/Verify.js';

import AboutNepa from './iframes/AboutNepa.js';
import AboutNepaccess from './iframes/AboutNepaccess.js';
import People from './iframes/People.js';
import SearchTips from './iframes/SearchTips.js';
import AvailableDocuments from './iframes/AvailableDocuments.js';
import Media from './iframes/Media.js';
import PrivacyPolicy from './iframes/PrivacyPolicy.js';
import DisclaimerTermsOfUse from './iframes/DisclaimerTermsOfUse.js';

import Contact from './Contact.js';
import Future from './iframes/Future.js';

import AboutHelpContents from './AboutHelpContents.js';
import AboutStats from './AboutStats.js';
import StatCounts from './StatCounts.js';
import InteractionLogs from './InteractionLogs.js';

import Iframes from './iframes/Iframes.js';

import Approve from './Approve.js';

import Importer from './Importer.js';
import Admin from './AdminPanel.js';
import AdminFiles from './AdminFiles.js';

import Test from './Test.js';
import SearchTest from './AppTest';
import Pairs from './Pairs.js';
import Pairs2 from './Pairs2';
import Pairs3 from './Pairs3';

import SearchLogs from './SearchLogs.js';
import Surveys from './Surveys.js';

import Excel from './Excel.js';
import ImporterGeo from './ImporterGeo.js';
import ImporterGeoLinks from './ImporterGeoLinks.js';
import MediaQuery from 'react-responsive';
import Globals from './globals.js';

import { Link, Switch, Route, withRouter } from 'react-router-dom';
//import {withMediaQuery} from 'react-responsive';
import PropTypes from 'prop-types';
import CollapsibleTopNav from './CollapsibleTopNav';
import ImporterAlignment from './ImporterAlignment';
import { makeStyles, withStyles } from '@mui/styles';
import {
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  Container,
  AppBar,
  Toolbar,
  CssBaseline,
  Drawer,
} from '@mui/material';
import Navbar from './Navbar';
import { Height } from '@mui/icons-material';
import DrawerComponent from './Drawer';
import HeaderNav from './HeaderNav';

const _ = require('lodash');

const classes = makeStyles((theme) => ({
  root: {
    backgroundColor: '#abbec3',
  },
  appBar: {
    color: '#000',
    elevation: 2,
    height: '400pxs',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    justifySelf: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: '3px solid #000000',
  },
  toolbar: {
    border: '3px solid #000000',
    backgroundColor: 'transparent',
    height: '400px',
  },
  headerContainer: {
    backgroundColor: 'transparent',
    height: '400px',
  },
  navBarContainer: {
    backgroundColor: 'red',
    width: '100%',
    border: '5px solid red',
  },
  navContainer: {
    backgroundColor: '#111',
    border: '5px solid red',
    flexGrow: 1,
    height: '75px',
  },
  drawerContainer: {},
  homeHeaderContainer: {
    backgroundColor: 'white',
    border: '5px solid red',
    flexGrow: 1,
    height: '75px',
  },
}));
class Main extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    console.log('MAIN JS PROPS', props);
    this.state = {
      displayUsername: '',
      loggedIn: false,
      loggedInDisplay: 'display-none',
      loggedOutDisplay: '',
      loaderClass: 'loadDefault',
      role: null,
      currentPage: '',
      anonymous: false,
      headerLandingCss: '',
      matches: window.matchMedia('(min-width: 768px)') ? true : false,
      isMobile: false,
      windowSize: window.innerWidth,
    };
    this.classes = props.classes;
    this.refresh = this.refresh.bind(this);
    this.refreshNav = this.refreshNav.bind(this);
    this.getRoleDebounced = _.debounce(this.getRole, 500);
    Globals.setUp();
    window.addEventListener('scroll', this.handleScroll);
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize(WindowSize, event) {
    this.setState({ windowSize: window.innerWidth });
    console.log('window size', window.innerWidth);
    //        this.state.windowSize ({WindowSize: window.innerWidth})
  }
  /** This effectively replaces the original purpose of check(), especially with anonymous user support */
  getRole = () => {
    const checkURL = new URL('user/get_role', Globals.currentHost);
    axios
      .post(checkURL)
      .then((response) => {
        const verified = response && response.status === 200;
        if (verified) {
          localStorage.role = response.data.toLowerCase();
          this.setState(
            {
              role: response.data.toLowerCase(),
              loggedIn: true,
              anonymous: false,
            },
            () => {
              this.refreshNav();
            },
          );
        } else {
          localStorage.clear();
          this.setState({ role: undefined, loggedIn: false, anonymous: true });
        }
      })
      .catch((err) => {
        // Token expired or invalid, or server is down
        console.log(err);
        if (err.message === 'Network Error') {
          // do nothing
        } else {
          // token problem
          localStorage.clear();
          this.setState({ role: undefined, loggedIn: false, anonymous: true });
        }
      });
  };

  check = () => {
    this.getRoleDebounced();
    console.log('Main check');
  };

  // refresh() has a global listener so as to change the loggedIn state and then update the navbar
  // as needed, from child components
  refresh(verified) {
    this.setState(
      {
        loggedIn: verified.loggedIn,
      },
      () => {
        this.getRoleDebounced();
        this.refreshNav();
      },
    );
  }

  refreshNav() {
    this.setState({
      loggedOutDisplay: 'display-none',
      loggedInDisplay: 'display-none',
    });
    if (this.state.loggedIn) {
      // console.log("Logout etc. displaying");
      this.setState({
        loggedInDisplay: '',
      });
    } else {
      // console.log("Login button displaying");
      this.setState({
        loggedOutDisplay: '',
        role: null,
      });
    }

    if (localStorage.username) {
      this.setState({
        displayUsername: localStorage.username,
      });
    }
  }

  componentDidUpdate(prevProps) {
    console.log('Main update, window size', window.innerWidth);

    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }
  onRouteChanged() {
    // console.log("Route changed",this.props.location.pathname);
    this.setState({
      currentPage: this.props.location.pathname,
    });
  }

  getHeaderCss = () => {
    let headerCss = 'no-select';
    if (!this.state.currentPage || this.state.currentPage === '/') {
      // headerCss += ' landing-header';
    }
    return headerCss;
  };
  handleScroll = (e) => {
    // For landing only
    if (this.state.currentPage && this.state.currentPage === '/') {
      let landingStyle = '';

      const position = window.pageYOffset;

      if (position > 100) {
        // console.log("Transition header background", position);
        landingStyle = ' transition';
      }

      this.setState({
        headerLandingCss: landingStyle,
      });
    }
  };
  render() {
    return (
      <>

		<HeaderNav/>
        {this.showMenuItems()}

		<div className="main-container">
			stuuuuasdudwsaasddsa
		</div>
      </>
    );
  }

  showMenuItems = () => {
    return (
      <>
	  MENU ITEMS??
	  <HeaderNav/>
      	<span
	        id="admin-span"
	        hidden={!this.state.role || this.state.role === 'user'}
	        className={this.state.loggedInDisplay + ' right-nav-item logged-in'}
	      >
	        <div id="admin-dropdown" className="main-menu-link dropdown">
	          <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
	            Admin
	          </Link>
	          <i className="fa fa-caret-down"></i>
	          <div className="dropdown-content">
	            <Link to="/admin" hidden={!(this.state.role === 'admin')}>
	              Admin Panel
	            </Link>
	            <Link
	              to="/importer"
	              hidden={!(this.state.role === 'curator' || this.state.role === 'admin')}
	            >
	              Import New Documents
	            </Link>
	            <Link
	              to="/adminFiles"
	              hidden={!(this.state.role === 'curator' || this.state.role === 'admin')}
	            >
	              Find Missing Files
	            </Link>
	            <Link to="/approve">Approve Users</Link>
	            <Link to="/pre_register">Pre-Register Users</Link>
	            <Link to="/interaction_logs">Interaction Logs</Link>
	            <Link to="/search_logs">Search Logs</Link>
	            <Link to="/abouthelpcontents">Database Contents</Link>
	            <Link to="/stats">Content Statistics</Link>
	            <Link to="/stat_counts">Stat Counts</Link>
	            <Link to="/surveys">Surveys</Link>
	          </div>
	        </div>
	      </span>
      </>
    );
  };
  componentDidMount() {
    // Role config allows admin menu and options to work properly
    if (!this.state.role) {
      if (localStorage.role) {
        this.setState({ role: localStorage.role });
      } else if (this.state.anonymous) {
      } else {
        this.getRoleDebounced();
      }
    }

    Globals.registerListener('refresh', this.refresh);
    this.setState({
      currentPage: window.location.pathname,
    });
    const handler = (e) => this.setState({ matches: e.matches });
    window.matchMedia('(min-width: 768px)').addEventListener('change', handler);

    this.check();

    // if(navigator.userAgent.toLowerCase ().match (/mobile/i)) {
    //     console.log("Mobile device");
    // }
  }
  routePath() {
    return (
      <div>
        <Switch>
          <Route path="/profile" component={UserDetails} />
          {/* <Route path="/opt_out" component={OptOut}/> */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/pre_register" component={PreRegister} />
          <Route path="/forgotPassword" component={ForgotPassword} />
          <Route path="/reset" component={Reset} />
          <Route path="/logout" component={Logout} />

          <Route path="/search" component={App} />
          <Route path="/about-nepa" component={AboutNepa} />
          <Route path="/about-nepaccess" component={AboutNepaccess} />
          <Route path="/people" component={People} />
          <Route path="/search-tips" component={SearchTips} />
          <Route path="/available-documents" component={AvailableDocuments} />
          <Route path="/abouthelpcontents" component={AboutHelpContents} />
          <Route path="/stats" component={AboutStats} />
          <Route path="/media" component={Media} />

          <Route path="/contact" component={Contact} />
          <Route path="/future" component={Future} />

          <Route path="/record-details" component={RecordDetailsTab} />
          <Route path="/process-details" component={ProcessDetailsTab} />

          <Route path="/importer" component={Importer} />
          <Route path="/adminFiles" component={AdminFiles} />

          <Route path="/iframes" component={Iframes} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/disclaimer-terms-of-use" component={DisclaimerTermsOfUse} />
          <Route path="/verify" component={Verify} />
          <Route path="/approve" component={Approve} />
          <Route path="/admin" component={Admin} />
          <Route path="/pairs" component={Pairs}></Route>
          <Route path="/pairs2" component={Pairs2}></Route>
          <Route path="/pairs3" component={Pairs3}></Route>
          <Route path="/search_logs" component={SearchLogs}></Route>
          <Route path="/interaction_logs" component={InteractionLogs}></Route>
          <Route path="/stat_counts" component={StatCounts}></Route>
          <Route path="/surveys" component={Surveys}></Route>
          <Route path="/excel" component={Excel}></Route>

          <Route path="/test" component={Test} />
          <Route path="/search_test" component={SearchTest} />
          <Route path="/up_geo" component={ImporterGeo} />
          <Route path="/up_geo_links" component={ImporterGeoLinks} />
          <Route path="/up_alignment" component={ImporterAlignment} />

          <Route path="/" component={Landing} />
        </Switch>
      </div>
    );
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
export function HomeHeader(props) {
  console.log('HomeHeader props', props);
  const { currentPage, classes, headerLandingCss } = props;
  return (
    <Grid
      container
      className={classes.homeHeaderContainer}
      id="home-header-container"
      xs={{
        border: '3px solid red',
      }}
    >
      <Grid
        item
        xs={{
          flexGrow: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Link
          currentpage={(currentPage === '/search').toString()}
          className="main-menu-link"
          to="/search"
        >
          Search
        </Link>
        <div id="about-dropdown-2" className="main-menu-link dropdown">
          <Link
            currentpage={(
              currentPage === '/search-tips' || currentPage === '/available-documents'
            ).toString()}
            id="about-button-2"
            className="main-menu-link drop-button"
            to="/search-tips"
          >
            Search Tips
          </Link>
          <i className="fa fa-caret-down"></i>
          <div className="dropdown-content">
            <Link to="/search-tips">Search Tips</Link>
            <Link to="/available-documents">Available Files</Link>
          </div>
        </div>

        <Link
          currentpage={(currentPage === '/about-nepa').toString()}
          className="main-menu-link"
          to="/about-nepa"
        >
          About NEPA
        </Link>
        <div id="about-dropdown" className="main-menu-link dropdown">
          <Link
            currentpage={(
              currentPage === '/about-nepaccess' ||
              currentPage === '/people' ||
              currentPage === '/media'
            ).toString()}
            id="about-button"
            className="main-menu-link drop-button"
            to="/about-nepaccess"
          >
            About NEPAccess
          </Link>
          <i className="fa fa-caret-down"></i>
          <div className="dropdown-content">
            <Link to="/about-nepaccess">About NEPAccess</Link>
            <Link to="/media">Media</Link>
            <Link to="/people">People</Link>
          </div>
        </div>
      </Grid>

      {/* <Link currentpage={(this.state.currentPage==="/future").toString()} className="main-menu-link" to="/future">
                        Future
                    </Link> */}
      <Link
        currentpage={(currentPage === '/contact').toString()}
        className="main-menu-link"
        to="/contact"
      >
        Contact
      </Link>
    </Grid>
  );
}
export function MainHeader(props) {
  const { classes, currentPage, loggedInDisplay, loggedOutDisplay, headerCss, headerLandingCss } =
    props;

  console.log('MainHeader call');
  return (
    <>
      <Grid
        container
        id="header"
        className={headerCss + headerLandingCss}
        xs={{
          border: '3px solid red',
          m: 0,
          p: 0,
        }}
      >
        {/* <div id="logo" className="no-select">
					<Link id="logo-link" to="/">
					</Link>
					<div id="logo-box">

					</div>

				</div> */}

        <Grid
          item
          id=""
          className="no-select"
          xs={{
            border: '3px solid red',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            justifySelf: 'flex-end',
            justifyContent: 'flex-end',
            marginLeft: '200px',
            backgroundColor: 'white',
          }}
        >
          {/* <Grid item
						xs={{
							border: '3px solid red',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-end',
							flexGrow: 1,
							justifySelf: 'flex-end',
							color:'black',
							backgroundColor:'white',
						}}
					>
						<span id="profile-span" className={classes.loggedInDisplay + " right-nav-item logged-in"}>
							<Link className="top-menu-link" to="/profile">Profile</Link>
						</span>
						<span id="login-span" className={loggedOutDisplay + " logged-out"}>
							<Link className="top-menu-link" to="/login">Log in</Link>
						</span>
						<span id="register-span" className={loggedOutDisplay + " right-nav-item logged-out"}>
							<Link className="top-menu-link" to="/register">Register</Link>
						</span>
						<span className={loggedInDisplay + " right-nav-item logged-in"}>
							<Link className="top-menu-link" to="/logout">Log out</Link>
						</span>
					</Grid> */}
          {/* <Container id="logo-box" xs={{
							border: '3px solid red',
							display: 'absolute',
							top: '0px',
							left: '0px',
						}}>
							<div id='logo' className='no-select'>
								<Link id='logo-link' to='/'></Link>
								<div id='logo-box'></div>

							</div>
						</Container> */}
          {/* <Grid item xs={{
						// border: '3px solid red',
						// alignItems: 'flex-start',
						// justifyContent: 'flex-start',
						// justifySelf: 'flex-start',
						// display: 'block',
						marginLeft: '150px',
						border: '3px solid red',
						width: '100%',
					}}>
						<div id='logo' >
							<Link id='logo-link' to='/'></Link>
							<div id='logo-box'></div>

						</div>
					</Grid> */}
          <Grid
            item
            xs={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              justifySelf: 'flex-end',
              display: 'block',
              flexGrow: 1,
            }}
          >
            <Link
              currentpage={(currentPage === '/search').toString()}
              className="main-menu-link"
              to="/search"
            >
              Search
            </Link>
            <div id="about-dropdown-2" className="main-menu-link dropdown">
              <Link
                currentpage={(
                  currentPage === '/search-tips' || currentPage === '/available-documents'
                ).toString()}
                id="about-button-2"
                className="main-menu-link drop-button"
                to="/search-tips"
              >
                Search Tips
              </Link>
              <i className="fa fa-caret-down"></i>
              <div className="dropdown-content">
                <Link to="/search-tips">Search Tips</Link>
                <Link to="/available-documents">Available Files</Link>
              </div>
            </div>

            <Link
              currentpage={(currentPage === '/about-nepa').toString()}
              className="main-menu-link"
              to="/about-nepa"
            >
              About NEPA
            </Link>
            <div id="about-dropdown" className="main-menu-link dropdown">
              <Link
                currentpage={(
                  currentPage === '/about-nepaccess' ||
                  currentPage === '/people' ||
                  currentPage === '/media'
                ).toString()}
                id="about-button"
                className="main-menu-link drop-button"
                to="/about-nepaccess"
              >
                About NEPAccess
              </Link>
              <i className="fa fa-caret-down"></i>
              <div className="dropdown-content">
                <Link to="/about-nepaccess">About NEPAccess</Link>
                <Link to="/media">Media</Link>
                <Link to="/people">People</Link>
              </div>
            </div>
          </Grid>
          {/* <Link currentpage={(this.state.currentPage==="/future").toString()} className="main-menu-link" to="/future">
	                        Future
	                    </Link> */}

          <Link
            currentpage={(currentPage === '/contact').toString()}
            className="main-menu-link"
            to="/contact"
          >
            Contact
          </Link>
          <span id="profile-span" className={classes.loggedInDisplay + ' right-nav-item logged-in'}>
            <Link className="top-menu-link" to="/profile">
              Profile
            </Link>
          </span>
          <span id="login-span" className={loggedOutDisplay + ' logged-out'}>
            <Link className="top-menu-link" to="/login">
              Log in
            </Link>
          </span>
          <span id="register-span" className={loggedOutDisplay + ' right-nav-item logged-out'}>
            <Link className="top-menu-link" to="/register">
              Register
            </Link>
          </span>
          <span className={loggedInDisplay + ' right-nav-item logged-in'}>
            <Link className="top-menu-link" to="/logout">
              Log out
            </Link>
          </span>
        </Grid>
      </Grid>
    </>
  );
}
function showMenuItems(){
	return (
    <span
      id="admin-span"
      hidden={!this.state.role || this.state.role === 'user'}
      className={this.state.loggedInDisplay + ' right-nav-item logged-in'}
    >
      <div id="admin-dropdown" className="main-menu-link dropdown">
        <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
          Admin
        </Link>
        <i className="fa fa-caret-down"></i>
        <div className="dropdown-content">
          <Link to="/admin" hidden={!(this.state.role === 'admin')}>
            Admin Panel
          </Link>
          <Link
            to="/importer"
            hidden={!(this.state.role === 'curator' || this.state.role === 'admin')}
          >
            Import New Documents
          </Link>
          <Link
            to="/adminFiles"
            hidden={!(this.state.role === 'curator' || this.state.role === 'admin')}
          >
            Find Missing Files
          </Link>
          <Link to="/approve">Approve Users</Link>
          <Link to="/pre_register">Pre-Register Users</Link>
          <Link to="/interaction_logs">Interaction Logs</Link>
          <Link to="/search_logs">Search Logs</Link>
          <Link to="/abouthelpcontents">Database Contents</Link>
          <Link to="/stats">Content Statistics</Link>
          <Link to="/stat_counts">Stat Counts</Link>
          <Link to="/surveys">Surveys</Link>
        </div>
      </div>
    </span>
  );
}

export function DesktopNav(props) {
  const { classes, currentPage } = props;
  console.log('DesktopNav call');
  return (
    <Container id="desktop-nav-Container">
      <div>
        {/* <div id='logo' className='no-select'>
					<Link id='logo-link' to='/'></Link>
					<div id='logo-box'></div>
					<Link
						currentpage={(this.state.currentPage === '/search').toString()}
						className='main-menu-link'
						to='/search'
					></Link>
				</div> */}
        
      </div>
    </Container>
  );
}
export default withStyles(classes)(withRouter(Main));
