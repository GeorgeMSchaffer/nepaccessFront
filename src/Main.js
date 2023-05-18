import React from 'react';
import {Helmet} from 'react-helmet';
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

import Globals from './globals.js';

import { Link, Switch, Route, withRouter } from 'react-router-dom';
import {withMediaQuery} from 'react-responsive';
import PropTypes from "prop-types";
import TopNav from './TopNav';
import CollapsibleTopNav from './CollapsibleTopNav';
import ImporterAlignment from './ImporterAlignment';

const _ = require('lodash');
class Main extends React.Component {
	static propTypes = {
		location: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);

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
		};

		this.refresh = this.refresh.bind(this);
		this.refreshNav = this.refreshNav.bind(this);
		this.getRoleDebounced = _.debounce(this.getRole, 500);
		Globals.setUp();
		this.navItems = [
			{
				label: 'Search',
				link: '/search',
				children: [],
				icon: null,
			},
			{
				label: 'Search Tips',
				link: '/search',
				children: [
					{
						label: 'Search Tips',
						link: '/searchTips',
						icon: null,
					},
				],
			},
			{
				label: 'About NEPA',
				linkk: '/search',
				children: [
					{
						label: 'About NEPAccess',
						link: '/about',
						icon: null,
						children: [],
					},
					{
						label: 'Media',
						link: '/media',
						children: [],
						icon: null,
					},
					{
						label: 'Contact',
						link: '/contact',
						icon: null,
						children: [],
					},
				],
			},
		];
		//				this.isMobile = withMediaQuery('(max-width:600px)');
		this.isMobile = true;
		window.addEventListener('scroll', this.handleScroll);
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
		// check if logged in (JWT is valid and not expired)
		// let verified = false;
		// let checkURL = new URL('test/check', Globals.currentHost);

		// axios.post(checkURL)
		// .then(response => {
		//     verified = response && response.status === 200;
		//     this.setState({
		//         loggedIn: verified
		//     }, () => {
		this.getRoleDebounced();
		// this.refreshNav();
		//     });
		// })
		// .catch((err) => { // Token expired or invalid, or server is down

		//     localStorage.removeItem("role");
		//     this.setState({
		//         loggedIn: false,
		//         role: null
		//     });
		// });
		// console.log("Main check");
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
		// console.log("Main update");
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
			headerCss += ' landing-header';
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
			<div id='home-page'>
				<Helmet>
					<meta charSet='utf-8' />
					<title>NEPAccess</title>
					<meta
						name='description'
						content='Bringing NEPA into the 21st Century through the power of data science. Find and engage with data from thousands of environmental review documents.'
					/>
					<link rel='canonical' href='https://www.nepaccess.org/' />
				</Helmet>

				<div
					id='header'
					className={this.getHeaderCss() + this.state.headerLandingCss}
				>
					<div id='logo' className='no-select'>
						<Link id='logo-link' to='/'></Link>
						<div id='logo-box'></div>
					</div>

					<div id='top-menu' className='no-select'>
						{this.showMenuItems()}

						<span
							id='profile-span'
							className={
								this.state.loggedInDisplay + ' right-nav-item logged-in'
							}
						>
							<Link className='top-menu-link' to='/profile'>
								Profile
							</Link>
						</span>
						<span
							id='login-span'
							className={this.state.loggedOutDisplay + ' logged-out'}
						>
							<Link className='top-menu-link' to='/login'>
								Log in
							</Link>
						</span>
						<span
							id='register-span'
							className={
								this.state.loggedOutDisplay + ' right-nav-item logged-out'
							}
						>
							<Link className='top-menu-link' to='/register'>
								Register
							</Link>
						</span>
						<span
							className={
								this.state.loggedInDisplay + ' right-nav-item logged-in'
							}
						>
							<Link className='top-menu-link' to='/logout'>
								Log out
							</Link>
						</span>
					</div>

					<div id='main-menu'>
						<Link
							currentpage={(this.state.currentPage === '/search').toString()}
							className='main-menu-link'
							to='/search'
						>
							Search
						</Link>
						<div id='about-dropdown-2' className='main-menu-link dropdown'>
							<Link
								currentpage={(
									this.state.currentPage === '/search-tips' ||
									this.state.currentPage === '/available-documents'
								).toString()}
								id='about-button-2'
								className='main-menu-link drop-button'
								to='/search-tips'
							>
								Search Tips
							</Link>
							<i className='fa fa-caret-down'></i>
							<div className='dropdown-content'>
								<Link to='/search-tips'>Search Tips</Link>
								<Link to='/available-documents'>Available Files</Link>
							</div>
						</div>
						<Link
							currentpage={(
								this.state.currentPage === '/about-nepa'
							).toString()}
							className='main-menu-link'
							to='/about-nepa'
						>
							About NEPA
						</Link>
						<div id='about-dropdown' className='main-menu-link dropdown'>
							<Link
								currentpage={(
									this.state.currentPage === '/about-nepaccess' ||
									this.state.currentPage === '/people' ||
									this.state.currentPage === '/media'
								).toString()}
								id='about-button'
								className='main-menu-link drop-button'
								to='/about-nepaccess'
							>
								About NEPAccess
							</Link>
							<i className='fa fa-caret-down'></i>
							<div className='dropdown-content'>
								<Link to='/about-nepaccess'>About NEPAccess</Link>
								<Link to='/media'>Media</Link>
								<Link to='/people'>People</Link>
							</div>
						</div>

						{/* <Link currentpage={(this.state.currentPage==="/future").toString()} className="main-menu-link" to="/future">
                        Future
                    </Link> */}
						<Link
							currentpage={(this.state.currentPage === '/contact').toString()}
							className='main-menu-link'
							to='/contact'
						>
							Contact
						</Link>
					</div>
				</div>
				<Switch>
					<Route path='/profile' component={UserDetails} />
					{/* <Route path="/opt_out" component={OptOut}/> */}
					<Route path='/login' component={Login} />
					<Route path='/register' component={Register} />
					<Route path='/pre_register' component={PreRegister} />
					<Route path='/forgotPassword' component={ForgotPassword} />
					<Route path='/reset' component={Reset} />
					<Route path='/logout' component={Logout} />

					<Route path='/search' component={App} />
					<Route path='/about-nepa' component={AboutNepa} />
					<Route path='/about-nepaccess' component={AboutNepaccess} />
					<Route path='/people' component={People} />
					<Route path='/search-tips' component={SearchTips} />
					<Route path='/available-documents' component={AvailableDocuments} />
					<Route path='/abouthelpcontents' component={AboutHelpContents} />
					<Route path='/stats' component={AboutStats} />
					<Route path='/media' component={Media} />

					<Route path='/contact' component={Contact} />
					<Route path='/future' component={Future} />

					<Route path='/record-details' component={RecordDetailsTab} />
					<Route path='/process-details' component={ProcessDetailsTab} />

					<Route path='/importer' component={Importer} />
					<Route path='/adminFiles' component={AdminFiles} />

					<Route path='/iframes' component={Iframes} />
					<Route path='/privacy-policy' component={PrivacyPolicy} />
					<Route
						path='/disclaimer-terms-of-use'
						component={DisclaimerTermsOfUse}
					/>
					<Route path='/verify' component={Verify} />
					<Route path='/approve' component={Approve} />
					<Route path='/admin' component={Admin} />
					<Route path='/pairs' component={Pairs}></Route>
					<Route path='/pairs2' component={Pairs2}></Route>
					<Route path='/pairs3' component={Pairs3}></Route>
					<Route path='/search_logs' component={SearchLogs}></Route>
					<Route path='/interaction_logs' component={InteractionLogs}></Route>
					<Route path='/stat_counts' component={StatCounts}></Route>
					<Route path='/surveys' component={Surveys}></Route>
					<Route path='/excel' component={Excel}></Route>

					<Route path='/test' component={Test} />
					<Route path='/search_test' component={SearchTest} />
					<Route path='/up_geo' component={ImporterGeo} />
					<Route path='/up_geo_links' component={ImporterGeoLinks} />
					<Route path='/up_alignment' component={ImporterAlignment} />

					<Route path='/' component={Landing} />
				</Switch>
			</div>
		);
	}

	showMenuItems = () => {
		return (
			<span
				id='admin-span'
				hidden={!this.state.role || this.state.role === 'user'}
				className={this.state.loggedInDisplay + ' right-nav-item logged-in'}
			>
				<div id='admin-dropdown' className='main-menu-link dropdown'>
					<Link
						id='admin-button'
						className='main-menu-link drop-button'
						to='/importer'
					>
						Admin
					</Link>
					<i className='fa fa-caret-down'></i>
					<div className='dropdown-content'>
						<Link to='/admin' hidden={!(this.state.role === 'admin')}>
							Admin Panel
						</Link>
						<Link
							to='/importer'
							hidden={
								!(this.state.role === 'curator' || this.state.role === 'admin')
							}
						>
							Import New Documents
						</Link>
						<Link
							to='/adminFiles'
							hidden={
								!(this.state.role === 'curator' || this.state.role === 'admin')
							}
						>
							Find Missing Files
						</Link>
						<Link to='/approve'>Approve Users</Link>
						<Link to='/pre_register'>Pre-Register Users</Link>
						<Link to='/interaction_logs'>Interaction Logs</Link>
						<Link to='/search_logs'>Search Logs</Link>
						<Link to='/abouthelpcontents'>Database Contents</Link>
						<Link to='/stats'>Content Statistics</Link>
						<Link to='/stat_counts'>Stat Counts</Link>
						<Link to='/surveys'>Surveys</Link>
					</div>
				</div>
			</span>
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
		this.check();

		// if(navigator.userAgent.toLowerCase ().match (/mobile/i)) {
		//     console.log("Mobile device");
		// }
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}
}

export default withRouter(Main);