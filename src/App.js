import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

import {Alert} from 'reactstrap';

import SimpleNavbar from './components/SimpleNavbar';
import Upload from './components/Upload/Upload';
import SimpleMap from './components/SimpleMap/SimpleMap';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: '',
			visible: false,
			lat: '',
			lng: '',
		}
		this.getLoginToken = this.getLoginToken.bind(this);
		this.displayLocation = this.displayLocation.bind(this);
		this.deniedLocation = this.deniedLocation.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
	}

	getLoginToken(userToken) {
		this.setState({token: userToken});
	}

	displayLocation(position) {
		this.setState ({
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		})
	}
	deniedLocation(error) {
		this.setState({visible: true});
	}
	onDismiss() {
		this.setState({ visible: (!this.state.visible) });
	}

	componentDidMount() {
		if (localStorage.length > 0) {
			this.setState({ token: localStorage.getItem('token') });
		}
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.displayLocation, this.deniedLocation);
		} else {
			this.setState({visible: true});
		}
		
	}

	render() {
		return (
			<React.Fragment>
				<SimpleNavbar token={this.state.token} getTokenMethod={this.getLoginToken} />
				<Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss} >This website uses location data in order to accurately track the position of Historical Markers, as well as many other features on this site. Please enable location data on this website to continue.</Alert>
				<SimpleMap />
				<footer className="fixed-bottom">
					<Upload token={this.state.token} />
				</footer>
			</React.Fragment>
		);
	}
}
