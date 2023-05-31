import {
  AppBar,
  Toolbar,
  makeStyles,
  Button,
  IconButton,
  Drawer,
  Link,
  MenuItem,
  Paper,
  Box,
  Container,
  Divider,
  Grid,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './index.css';
import CalloutContainer from './CalloutContainer';
import SearcherLanding from './SearcherLanding';
import MediaQuery from 'react-responsive';
import NavDropdown from './NavDropdown';


const headersData = [
  {
    label: 'Search',
    href: '/search?q=""',
  },
  {
    label: 'Search Tips',
    href: '/search-tip',
  },
  {
    label: 'Available Files',
    href: '/available-documents',
  },
  {
    label: 'Available Documents',
    href: '/available-documents',
  },
  {
    label: 'About NEPA',
    href: '/about-nepaccess',
  },
  {
    label: 'About NEPAaccess',
    href: '/about-nepaccess',
  },
  {
    label: 'Media',
    href: '/media',
  },
  {
    label: 'People',
    href: '/people',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];
const dropdownItems = [
  {name: 'About NEPAccess', href: '/about-nepaccess'},
  { name: 'Media', href:'/media' },
  { name: 'People', href:'/people' },
];


const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#abbdc4',
    height: '100%',
  },
  menuButton: {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 500,
    size: '12px',
    marginLeft: '38px',
    color: 'black',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '',
    height: '105px',
    justifyItems: 'center',

    // backgroundImage: 'url("logo2022.png")',
  },
  mobileToolbar: {
    display: 'flex',
    height: '65px',
    backgroundColor: '#abbdc4',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  drawerContainer: {
    padding: '20px 30px',
  },

  muiAppBar: {
    backgroundColor: '#abbdc4',
    height: '50px',
    display: 'block',
    width: '100%',
    /* background: #C4C4C4; */
    zIndex: 99999 /* Geojson map introduces some very high z-index items */,
  },
  logoImage: {
    backgroundRepeat: 'no-repeat',
    justifyContent: 'left',
    backgroundSize: 'contain',
  },
  logoBox: {
    width: '200px',
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 0
  },
  navLink: {
    dropShadow: '3px',
    position: 'relative',
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '1.1em',
    lineHeight: '25px',
    textDecoration: 'none',
    color: '#000000',
    "&:hover": {
      color: '#FFF'
    }
    //textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
}));

export default function HeaderNav() {
  const {
    menuButton,
    toolbar,
    drawerContainer,
    logoImage,
    menuContainer,
    navLink,
    menuIcon,
    mobileToolbar,

  } = useStyles();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
    dropdownOpen: false,
    dropdownValue: 'About NEPAccess',
  });
  // const isMobile = withMediaQuery({ maxWidth: 768 })
  const { mobileView, drawerOpen, dropdownOpen, dropdownValue } = state;

  const onMouseOver=(evt)=>{
    console.log('onMouseEnter', evt.currentTarget);
//    setAnchorEl(evt.currentTarget);
    evt.preventDefault();
  }
  const onMouseOut=(evt)=>{
    console.log('onMouseOut', evt.currentTarget);
 //   setAnchorEl(evt.currentTarget);
    evt.preventDefault();
  }

  useEffect(() => {
    const setResponsiveness = () => {
      console.log('set responsive', window.innerHeight);
      return window.innerWidth < 768
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () => setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return ( 
      <>
        <Toolbar id="mobile-tool-bar"
          className={mobileToolbar}
          elevation={2}
        >
          <IconButton
            id="mobile-icon-button"
            {...{
              color: 'black',
              edge: 'start',
              'aria-label': 'menu',
              'aria-haspopup': 'true',
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon color="#000" className={menuIcon} />
          </IconButton>
          <Grid container
            id="mobile-logo-container"
            sx={{
              alignItems: 'center',
              border: '2px solid black',
              height: '70px',
              display: 'flex',
              justifyContent: 'center',
            }}>

            <img src="logo2022.png" height={61} width={150} alt="NEPAccess Mobile Logo" />
          </Grid>

          <Drawer
            id="drawer"
            {...{
              anchor: 'left',
              open: drawerOpen,
              onClose: handleDrawerClose,
            }}
          >
            <div id="drawer-container" className={drawerContainer}>
              {getDrawerChoices()}
            </div>
          </Drawer>

          {/* <div>{getMenuButtons()}</div> */}

        </Toolbar>
      </>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }, idx) => {
      return (
        <Link
          {...{
            component: RouterLink,
            to: href,
            color: 'inherit',
            style: { textDecoration: 'none' },
            key: label,
          }}
          xs={{
            color: 'black',
            fontWeight: 600,
          }}
        >
          <MenuItem
            xs={{
              color: 'black',
            }}
            className="menu-item"
          >
            {label}

          </MenuItem>
          <Divider />
        </Link>
      );
    });
  };

  // const logoBackDrop = (
  //   <img src="url('logo2022.png')" alt="NEPAccess Logo" />
  // );
  const displayDesktop = (props) => {
    const role = 'user';
    const loggedInDisplay = 'none';

    return (
      <>
        <Toolbar
          id="nav-toolbar"
          className={toolbar}
          color="#a0b6c1"
          xs={{
            backgroundColor: '#a0b6c1',
            backgroundImage: 'url("logo2022.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            border: '3px solid red',
            //   height: '105px',
          }}
        >
          <Box
            id="desktop-logo-box"
            xs={{
              height: '102px',
              width: '200px',
              backgroundColor: '#a8b9c0',
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
              justifyContent: 'flex-start',
              alignItems: 'left',
              marginLeft: '100px',
              backgroundImage: 'url("logo2022.png")',
            }}
          >
            <Container id="menu-container" className={menuContainer}>
              <MenuItem className={navLink}>Search</MenuItem>
              <MenuItem className={navLink}>Search Tips</MenuItem>
              <MenuItem className={navLink}>Available Files</MenuItem>
              <MenuItem className={navLink}>About NEPA</MenuItem>
              <MenuItem className={navLink}>
                <NavDropdown title="About NEPAccess" options={dropdownItems} MouseOver={onMouseOver} onMouseOut={onMouseOut}  /></MenuItem>
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
                    <Link to="/importer" hidden={!(role === 'curator' || role === 'admin')}>
                      Import New Documents
                    </Link>
                    <Link to="/adminFiles" hidden={!(role === 'curator' || role === 'admin')}>
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
        {/* <Container id='mobile-content-container'>
            <Container id="mobile-search-container">
              <SearcherLanding />
            </Container>
  
            <Container id="mobile-call-out-container">
              <CalloutContainer />
            </Container>
          </Container> */}
      </>
    );
  };
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
  /* RETURN of the main function */
  return (
    <Paper id="paper-root"
      elevation={2}>
      <AppBar elevation={1} id="header-root-app-bar" color='transparent'>
        <MediaQuery maxWidth={767}>
          {displayMobile()}
          <SearcherLanding />
          <Container xs={{
            border: 2,
            borderColor: 'black',
            justifyContent: 'center',

          }}>
            <CalloutContainer />
          </Container>
        </MediaQuery>
        <MediaQuery minWidth={768}>{displayDesktop()}</MediaQuery>
      </AppBar>
    </Paper>
  );
}
