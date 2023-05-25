import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  IconButton,
  Drawer,
  Link,
  MenuItem,
  Paper,
  Box,
  Container,
  Grid
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './index.css';
import { Helmet } from 'react-helmet';
const headersData = [
  {
    label: 'Listings',
    href: '/listings',
  },
  {
    label: 'Mentors',
    href: '/mentors',
  },
  {
    label: 'My Account',
    href: '/account',
  },
  {
    label: 'Log Out',
    href: '/logout',
  },
];

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#abbdc4',
    // paddingRight: '79px',
    // paddingLeft: '118px',
    '@media (max-width: 900px)': {
      paddingLeft: 0,
      height:'105px'
    },
  },
  menuButton: {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 700,
    size: '18px',
    marginLeft: '38px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '',
    height: '105px',
    justifyItems: 'center',

    // backgroundImage: 'url("logo2022.png")',
  },
  drawerContainer: {
    padding: '20px 30px',
  },

  muiAppBar: {
    backgroundColor: '#abbdc4',
    height: '105px',
    display: 'flow-root',
    width: '100%',
    /* background: #C4C4C4; */
    zIndex: 99999 /* Geojson map introduces some very high z-index items */,
  },
  logoImage: {
    // backgroundImage: 'url("logo2022.png")',
    // backgroundImage: 'url("logo2022.png")',
    backgroundRepeat: 'no-repeat',
    // border: '3px solid red',
    justifyContent: 'left',
    backgroundSize: 'contain',

  },
  logoBox:{
    // marginLeft: '200px',
    // height:'102px',
    width: '200px',
    // backgroundPosition:'top',

    // backgroundImage: 'url("logo2022.png")',
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'contain',
  },
  menuContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navLink:{
    dropShadow: '3px',
      position: 'relative',
  fontFamily: "Open Sans",
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '1.1em',
  lineHeight: '25px',
  textDecoration: 'none',
  color: '#000000',
  textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  mainMenuLink: { 
    color: 'black',
  },
}));

export default function HeaderNav() {
  const {
    Nav,
    header,
    logo,
    menuButton,
    toolbar,
    drawerContainer,
    logoBox,
    muiAppBar,
    logoImage,
    mainMenuLink,
    menuContainer,
    navLink,
  } = useStyles();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const displayDesktop = (props) => {
    const role = 'user';
    const loggedInDisplay =  'none';
    const loggedOutDisplay = '';
    const loggedIn = false;
    const headerLandingCss = ''; //props.headerLandingCss || '';
    const currentPage = ''; //props.currentPage || '';
    return (
      <Toolbar
        id="nav-toolbar"
        className={toolbar}
        xs={{
          backgroundImage: 'url("logo2022.png")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          height: '105px',
        }}
      >
        <Box
          id="desktop-logo-box"
          xs={{
            height: '102px',
            width: '200px',
            // border: '3px solid red',
            // backgroundColor: 'red',
            // backgroundRepeat: 'no-repeat',
            // backgroundSize: 'contain',
            // height: '102px',
            // width: '100%',
            // alignItems: 'left',
            // marginLeft: '-200px',
          }}
        >
          <img
            id="logo-image"
            src="logo2022.png"
            className={logoImage}
            height={102}
            width={302}
            alt="NEPAccess Logo"
          />
        </Box>
        <Container
          id="link-container"
          xs={{
            border: '3px solid red',
            justifyContent: 'flex-start',
            alignItems: 'left',
            marginLeft: '350px',
            backgroundImage: 'url("logo2022.png")',
          }}
        >
          <Container id="menu-container" className={menuContainer}>
            <MenuItem className={navLink}>Search</MenuItem>
            <MenuItem className={navLink}>Search Tips</MenuItem>
            <MenuItem className={navLink}>About NEPA</MenuItem>
            <MenuItem className={navLink}>About NEPAccess</MenuItem>
            <MenuItem className={navLink}>Contact</MenuItem>
            <span
              id="admin-span"
              hidden={!role || role === 'user'}
              className={loggedInDisplay + ' right-nav-item logged-in'}
            >
              <div id="admin-dropdown" className="main-menu-link dropdown">
                <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
                  Admin
                </Link>
                <i className="fa fa-caret-down"></i>
                <div className="dropdown-content">
                  <Link to="/admin" hidden={!(role === 'admin')}>
                    Admin Panel
                  </Link>
                  <Link
                    to="/importer"
                    hidden={!(role === 'curator' || role === 'admin')}
                  >
                    Import New Documents
                  </Link>
                  <Link
                    to="/adminFiles"
                    hidden={!(role === 'curator' || role === 'admin')}
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
          </Container>
        </Container>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () => setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar className={muiAppBar}>
        <IconButton
          {...{
            edge: 'start',
            color: 'inherit',
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: 'left',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>

        <div>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Link
          {...{
            component: RouterLink,
            to: href,
            color: 'inherit',
            style: { textDecoration: 'none' },
            key: label,
          }}
        >
          <MenuItem>{label}</MenuItem>
        </Link>
      );
    });
  };

  

  // const logoBackDrop = (
  //   <img src="url('logo2022.png')" alt="NEPAccess Logo" />  
  // );

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button
          {...{
            key: label,
            color: 'inherit',
            to: href,
            component: RouterLink,
            className: menuButton,
          }}
        >
          {label}
        </Button>
      );
    });
  };

  return (
    <Paper
    >
      <AppBar className={header}>{mobileView ? displayMobile() : displayDesktop()}
         
      </AppBar>
    </Paper>
  );
}

export function DesktopNavLinks(){
  const [currentPage,setCurrentPage]= useState();
  const [loggedInDisplay, setLoggedInDisplay] = useState('display-none');
  const [loggedOutDisplay, setLoggedOutDisplay] = useState();
  const { mainMenuLink } = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);  
  const [showMenuItems, setShowMenuItems] = useState();
  const [role, setRole] = useState('user');
  return (
    <>
      <Grid
        item
        xs={{
          border: '3px solid red',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexGrow: 1,
          justifySelf: 'flex-end',
          color: 'black',
          backgroundColor: 'white',
        }}
      >
        <span
          id="admin-span"
          hidden={!role || role === 'user'}
          className={loggedInDisplay + ' right-nav-item logged-in'}
        >
          <div id="admin-dropdown" className="main-menu-link dropdown">
            <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
              Admin
            </Link>
            <i className="fa fa-caret-down"></i>
            <div className="dropdown-content">
              <Link to="/admin" hidden={!(role === 'admin')}>
                Admin Panel
              </Link>
              <Link
                to="/importer"
              >
                Import New Documents
              </Link>
              <Link
                to="/adminFiles"
                hidden={!(role === 'curator' || role === 'admin')}
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
        <span id="profile-span" className={loggedInDisplay + ' right-nav-item logged-in'}>
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
    </>
  );
}
export function Test(props)
{
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('user');
  const [showMenuItems, setShowMenuItems] = useState(true);
  const [currentPage, setCurrentPage] = useState('');
  const [loggedInDisplay, setLoggedInDisplay] = useState('display-none');
  const [headerLandingCss, setHeaderLandingCss] = useState('');
  const [loggedOutDisplay, setLoggedOutDisplay] = useState('');
          return (
        <div id="home-page">
            <Helmet>
                <meta charSet="utf-8" />
                <title>NEPAccess</title>
                <meta name="description" content="Bringing NEPA into the 21st Century through the power of data science. Find and engage with data from thousands of environmental review documents." />
                <link rel="canonical" href="https://www.nepaccess.org/" />
            </Helmet>

            <div id="header" className={this.getHeaderCss() + headerLandingCss}>

                <div id="logo" className="no-select">
                    <Link id="logo-link" to="/">
                    </Link>
                    <div id="logo-box">

                    </div>
                </div>

                <div id="top-menu" className="no-select">
                    
                    {this.showMenuItems()}

                    <span id="profile-span" className={loggedInDisplay + " right-nav-item logged-in"}>
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
                </div>

                <div id="main-menu">
                    <Link currentpage={(currentPage==="/search").toString()} className="main-menu-link" to="/search">
                        Search
                    </Link>
                    <div id="about-dropdown-2" className="main-menu-link dropdown">
                        <Link currentpage={(currentPage==="/search-tips" || currentPage==="/available-documents").toString()} id="about-button-2" className="main-menu-link drop-button" to="/search-tips">
                            Search Tips
                        </Link>
                        <i className="fa fa-caret-down"></i>
                        <div className="dropdown-content">
                            <Link to="/search-tips">Search Tips</Link>
                            <Link to="/available-documents">Available Files</Link>
                        </div>
                    </div>
                    <Link currentpage={(currentPage==="/about-nepa").toString()} className="main-menu-link" to="/about-nepa">
                        About NEPA
                    </Link>
                    <div id="about-dropdown" className="main-menu-link dropdown">
                        <Link currentpage={(currentPage==="/about-nepaccess" || currentPage==="/people" || currentPage==="/media").toString()} id="about-button" className="main-menu-link drop-button" to="/about-nepaccess">
                            About NEPAccess
                        </Link>
                        <i className="fa fa-caret-down"></i>
                        <div className="dropdown-content">
                            <Link to="/about-nepaccess">About NEPAccess</Link>
                            <Link to="/media">
                                Media
                            </Link>
                            <Link to="/people">People</Link>
                        </div>
                    </div>
                    
                    {/* <Link currentpage={(currentPage==="/future").toString()} className="main-menu-link" to="/future">
                        Future
                    </Link> */}
                    <Link currentpage={(currentPage==="/contact").toString()} className="main-menu-link" to="/contact">
                        Contact
                    </Link>

                </div>
                
            </div>
        </div>
        )
    }
export function MenuItems(props){
        const [loggedInDisplayrole,setLoggedInDisplayrole]=useState('user');
        const [loggedInDisplay, setLoggedInDisplay] = useState('');
        const [currentPage,setCurrentPage]= useState();
        const [loggedOutDisplay, setLoggedOutDisplay] = useState();
        return (
          <>
          <div id="top-menu" className="no-select">

                    <span id="profile-span" className={loggedInDisplay + " right-nav-item logged-in"}>
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
          </div>

            
          </>
        );
    }
