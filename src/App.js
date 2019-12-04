import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import SimpleNavbar from "./components/SimpleNavbar";
import { Alert } from "reactstrap";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: '',
			isAdmin: 0,
			visible: false,
			lat: '',
			lng: '',
		}
		this.setAlertStatus = this.setAlertStatus.bind(this);
		this.getLoginToken = this.getLoginToken.bind(this);
		this.checkAdminStatus = this.checkAdminStatus.bind(this);
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

	checkAdminStatus(admin) {
		this.setState({ isAdmin: admin });
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
			this.setState({ 
				token: localStorage.getItem("token"),
				isAdmin: localStorage.getItem("isAdmin"),
			});
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
				<Alert
					color={this.state.alertColor}
					isOpen={this.state.visible}
					toggle={this.onDismiss}
				>
					{this.state.alertStatus}
				</Alert>
				<SimpleNavbar
					token={this.state.token}
					admin={this.state.isAdmin}
					getTokenMethod={this.getLoginToken}
					checkAdmin={this.checkAdminStatus}
				/>
			</React.Fragment>
		);
	}
}
