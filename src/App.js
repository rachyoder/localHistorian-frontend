import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import SimpleNavbar from "./components/SimpleNavbar";
import { Alert } from "reactstrap";
import LandingTutorial from "./components/LandingTutorial/LandingTutorial";

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

	//Passed into children to get alert status and display
	setAlertStatus(alertColor, alertStatus) {
		this.setState({
			alertColor: alertColor,
			alertStatus: alertStatus,
			visible: true,
		})
	}

	//Grabs the login token and saves it in state
	getLoginToken(userToken) {
		this.setState({ token: userToken });
	}

	//Grabs the admin status and saves it in state
	checkAdminStatus(admin) {
		this.setState({ isAdmin: admin });
	}

	//Storing Location in state
	displayLocation(position) {
		this.setState({
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		})
	}

	//If user disables location data, it will pop up a warning to let them know it is neccessary
	deniedLocation(error) {
		this.setAlertStatus("danger", "This website uses location data in order to accurately track the position of Historical Markers, as well as many other features on this site. Please enable location data on this website to continue.");
	}
	onDismiss() {
		this.setState({ visible: (!this.state.visible) });
	}

	//Checks if a User is logged in by seeing if token is still in local storage. If this is the case it will automatically log the user back in
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
				{/* <LandingTutorial /> */}
					<Alert
						color={this.state.alertColor}
						isOpen={this.state.visible}
						toggle={this.onDismiss}
						className="mx-auto alertContainer"
					>
						{this.state.alertStatus}
					</Alert>
				<SimpleNavbar
					token={this.state.token}
					admin={this.state.isAdmin}
					getTokenMethod={this.getLoginToken}
					checkAdmin={this.checkAdminStatus}
					setAlertStatus={this.setAlertStatus}
				/>
			</React.Fragment>
		);
	}
}
