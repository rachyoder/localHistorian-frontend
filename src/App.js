import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import SimpleNavbar from "./components/SimpleNavbar";
import Upload from "./components/Upload/Upload";
import { Alert } from "reactstrap";
import { MobileView } from "react-device-detect";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: '',
			visible: false,
			lat: '',
			lng: '',
		}
		this.setAlertStatus = this.setAlertStatus.bind(this);
		this.getLoginToken = this.getLoginToken.bind(this);
		this.displayLocation = this.displayLocation.bind(this);
		this.deniedLocation = this.deniedLocation.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
	}

	setAlertStatus(alertColor, alertStatus) {
		this.setState({
			alertColor: alertColor,
			alertStatus: alertStatus,
			visible: true,
		})

	}

	getLoginToken(userToken) {
		this.setState({ token: userToken });
	}

	displayLocation(position) {
		this.setState({
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		})
	}
	deniedLocation(error) {
		this.setAlertStatus("danger", "This website uses location data in order to accurately track the position of Historical Markers, as well as many other features on this site. Please enable location data on this website to continue.");
	}
	onDismiss() {
		this.setState({ visible: (!this.state.visible) });
	}

	componentDidMount() {
		if (localStorage.length > 0) {
			this.setState({ token: localStorage.getItem("token") });
		}
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.displayLocation, this.deniedLocation);
		} else {
			this.setAlertStatus("danger", "This website uses location data in order to accurately track the position of Historical Markers, as well as many other features on this site. Please enable location data on this website to continue.");
		}

	}

	render() {
		return (
			<React.Fragment>
				<Alert color={this.state.alertColor} isOpen={this.state.visible} toggle={this.onDismiss} >{this.state.alertStatus}</Alert>
				<SimpleNavbar token={this.state.token} getTokenMethod={this.getLoginToken} />
				<MobileView>
					<footer className="fixed-bottom">
						<Upload token={this.state.token} setAlertStatus={this.setAlertStatus} />
					</footer>
				</MobileView>
			</React.Fragment>
		);
	}
}
