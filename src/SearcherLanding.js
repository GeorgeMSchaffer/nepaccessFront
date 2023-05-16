import React from 'react';
import axios from 'axios';
import {
	TextField,
	FormControl,
	Grid,
	Container,
	Typography,
	IconButton,
	Paper,
} from '@mui/material';
import { SearchOutlined } from '@material-ui/icons';
import Globals from './globals.js';

// import FlipNumbers from 'react-flip-numbers';

/** Search box with planned autocomplete suggestion that loads the main search page (app.js) with the search input
 *  or preloaded results when search is confirmed */
class SearcherLanding extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			titleRaw: '',
			num: 0,
		};

		this.getTitles = this.getTitles.bind(this);
	}

	onInput = (evt) => {
		this.setState({ [evt.target.name]: evt.target.value });
		const val = evt.target.value;
		this.props.onChange(this.props.id, val);
	};

	onKeyUp = (evt) => {
		if (evt.keyCode === 13) {
			this.props.onClick('render', 'app');
		}
	};
	onIconClick = (evt) => {
		this.props.onClick('render', 'app');
	};
	onClearClick = (evt) => {
		// Custom clear icon not captured by onInput(), so update the relevant props and state here
		this.setState({ titleRaw: '' });
		this.props.onChange(this.props.id, '');
	};
	onChangeHandler = (evt) => {
		// do nothing
	};

	// TODO: Get shortlist of title suggestions ordered by relevance from backend using NLM, alphanumeric only, maybe use
	// autocomplete library to fill selectables
	getTitles() {
		let titlesUrl = new URL('test/titles', Globals.currentHost);
		//Send the AJAX call to the server
		axios({
			method: 'POST',
			url: titlesUrl,
			data: '',
		})
			.then((response) => {
				let responseOK = response && response.status === 200;
				if (responseOK) {
					return response.data;
				} else {
					return null;
				}
			})
			.then((parsedJson) => {
				console.log('this should be json', parsedJson);
				if (parsedJson) {
					this.setState({
						titles: parsedJson,
					});
				}
			})
			.catch((error) => {
				// If verification failed, it'll be a 403 error (includes expired tokens) or server down
				// Don't necessarily need to do anything, autocomplete won't work and user probably needs to login anyway
			});
	}

	handleSearch = (evt) => {
		const val = evt.target.value;
		console.log('HandleSearch evt', evt);
	};

	get = (url, stateName) => {
		const _url = new URL(url, Globals.currentHost);
		axios({
			url: _url,
			method: 'GET',
			data: {},
		})
			.then((_response) => {
				const rsp = _response.data;
				this.setState({ [stateName]: rsp });
			})
			.catch((error) => {});
	};
	// getCounts = () => {
	//     this.get('stats/earliest_year','firstYear');
	//     this.get('stats/latest_year','lastYear');
	//     this.get('stats/total_count','total')
	// }

	// showFlipNum = () => {
	//     const numStyle = {
	//         'fontFamily': "Open Sans",
	//         'fontSize': "23px",
	//     };

	//     if(this.state.total) {
	//         return <div className="under-search-holder">
	//             <div className="flip">
	//                 <FlipNumbers
	//                     height={44} width={25} color="white" background="rgba(0,0,0,0.5)"
	//                     play={true} duration={1} delay={0} numbers={`${this.state.num}`}
	//                     perspective={500}
	//                     numberStyle={numStyle}
	//                 />
	//                 <span className="flip-span">
	//                     NEPA documents and counting
	//                 </span>
	//             </div>

	//             <div className="flip">
	//                 <div className="flip-range flip-top">
	//                     <span className="transparent-background">
	//                         {this.state.firstYear}</span> - <span className="transparent-background">{this.state.lastYear}
	//                     </span>
	//                 </div>
	//                 <span className="flip-span">Date range</span>
	//             </div>

	//             <div className="flip">
	//                 <div className="transparent-background">
	//                     <a className="link landing-link" rel="noopener noreferrer"
	//                             href={`./available-documents`}>
	//                         More about Available Files
	//                     </a>
	//                 </div>
	//             </div>
	//         </div>;
	//     } else {
	//         return <></>;
	//     }
	// }

	render() {
		return (
			<div id='landing-search-box-container'>
				<div id='landing-search-holder'>
					<div id='landing-search-bar-holder'>
						{/* <h3 id="landing-search-header">
                            <span className="glow">
                                Begin with a simple keyword search:
                            </span>
                        </h3> */}
						<TextField
							fullWidth
							id='standard-bare'
							variant='standard'
							defaultValue=''
							placeholder='Search...'
							sx={{
								width: '100%',
								borderRadius: 2,
								border: 'none',
								backgroundColor: 'white',
								padding: 0,
								paddingLeft: 2,
							}}
							onKeyUp={this.onKeyUp}
							onInput={this.onInput}
							InputProps={{
								endAdornment: (
									<IconButton onClick={(evt) => this.onIconClick(evt)}>
										<SearchOutlined />
									</IconButton>
								),
							}}
						/>
				</div>
                </div>
				{/* {this.showFlipNum()} */}
			</div>
		);
	}

	// componentDidMount() {
	//     this.getCounts();

	//     this.timer = setInterval(() => {
	//         if(this.state.num < this.state.total) {
	//             let increment = 1;
	//             if(this.state.total - this.state.num > 1000) {
	//                 increment = 111;
	//             } else if(this.state.total - this.state.num > 100) {
	//                 increment = 11;
	//             }

	//             this.setState({
	//                 num: this.state.num + increment
	//             });
	//         }
	//     }, 10);
	// }

	// componentWillUnmount() {
	//     clearInterval(this.timer);
	// }
}

export default SearcherLanding;
