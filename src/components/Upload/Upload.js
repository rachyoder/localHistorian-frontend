import React from "react";
import API_Calls from "../../utilities/Axios";
import "./Upload.css";
import EXIF from "exif-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Geocode from "react-geocode";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Input, Label, FormGroup } from "reactstrap";

export default class Upload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image: '',
			deviceCoords: '',
			photoCoords: '',
			title: '',
			desc: '',
			addr: '',
			modal: false,
		}
		this.getAddress = this.getAddress.bind(this);
		this.success = this.success.bind(this);
		this.error = this.error.bind(this);
		this.onChange = this.onChange.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.fileUpload = this.fileUpload.bind(this);
		this.getExif = this.getExif.bind(this);
	}

	async getAddress(lat, lng) {
		Geocode.setApiKey("AIzaSyC5Xu9GUoqhCX8nRYfXaqkA1saAs-hXH4k");
		await Geocode.fromLatLng(lat, lng)
			.then(res => {
				console.log(res.results[0].formatted_address);
				this.setState({ addr: res.results[0].formatted_address });
			});
	}

	/* Pulling Location Data and Checking for Success or Failure */
	success(pos) {
		let coords = pos.coords.latitude + ',' + pos.coords.longitude;
		if (this.state.photoCoords === '') {
			this.getAddress(pos.coords.latitude, pos.coords.longitude);
		}
		this.setState({
			deviceCoords: coords,
		});
	}

	error(err) {
		console.log(err);
	}

	onChange(e) {
		let files = e.target.files || e.dataTransfer.files;
		if (!files.length)
			return;
		this.createImage(files[0]);
		navigator.geolocation.getCurrentPosition(this.success, this.error);
		this.toggleModal();
	}


	/* Toggle and Clear Modal for Submissions and Errors */
	toggleModal() {
		this.setState({
			modal: (!this.state.modal)
		});
	}

	/* Pull any Form Data entered */
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	onFormSubmit(e) {
		e.preventDefault()
		this.fileUpload(this.state.image);
	}


	createImage(file) {
		let reader = new FileReader();
		reader.onload = (e) => {
			this.setState({
				image: e.target.result
			})
		};
		reader.readAsDataURL(file);
	}

	// Upload the Form with Picture
	async fileUpload() {
		await this.getExif();
		const url = '/fileupload';
		const coords = (this.state.photoCoords === '') ?
			(this.state.deviceCoords) :
			(this.state.photoCoords);
		const formData = {
			file: this.state.image,
			coords: (coords),
			title: this.state.title,
			desc: this.state.desc,
			addr: this.state.addr,
		}

		API_Calls.__post(formData, url, this.props.token)
			.then(res => {
				if (res.status === 200) {
					this.props.setAlertStatus("success", "Image Submitted Successfully!");
				} else if (res.response.status === 401) {
					this.props.setAlertStatus("danger", "Unable to submit photo. You must have an account and be logged in to use this feature.")
				}
				this.toggleModal();
			})
			.catch(error => {
				console.log(error);
			});
	}

	/* Getting Location Data from Photo, if not available, backup is pulled from device location */
	async getExif() {
		let img1 = document.getElementById("get-exif");
		let lat, lon, lat_cardinal, lon_cardinal;
		EXIF.getData(img1, function () {
			lat = EXIF.getTag(this, "GPSLatitude");
			lon = EXIF.getTag(this, "GPSLongitude");
			lat_cardinal = EXIF.getTag(this, "GPSLatitudeRef");
			lon_cardinal = EXIF.getTag(this, "GPSLongitudeRef");
		});

		if (lat !== undefined) {
			let lat_dd = (lat[0].numerator + (lat[1].numerator / 60) + (lat[2].numerator / 360000));
			let lon_dd = (lon[0].numerator + (lon[1].numerator / 60) + (lon[2].numerator / 360000));

			lat_dd = (lat_cardinal === "S") ? -Math.abs(lat_dd) : lat_dd;
			lon_dd = (lon_cardinal === "W") ? -Math.abs(lon_dd) : lon_dd;

			lat_dd = lat_dd.toFixed(4);
			lon_dd = lon_dd.toFixed(4);
			await this.getAddress(lat_dd, lon_dd);
			let dd_coords = lat_dd + "," + lon_dd;
			this.setState({ photoCoords: dd_coords });
		}
	}

	render() {
		return (
			<React.Fragment>
				<div className="float-right mb-3 mr-4">
					<Form onSubmit={this.onFormSubmit}>
						<input type="file" id="file" onChange={this.onChange} required accept="image/*" capture="environment" />
						<label htmlFor="file"><FontAwesomeIcon icon={faCamera} /></label>
						<Modal centered scrollable isOpen={this.state.modal} toggle={this.toggleModal} >
							<ModalHeader className="text-center bg-dark text-light">
								Upload This Image?
						</ModalHeader>
							<ModalBody className="bg-dark text-light">
								<img src={this.state.image} className="display-img" id="get-exif" alt="" />
								<FormGroup className="mt-3">
									<Label for="markerTitle">Title</Label>
									<Input type="text" name="title" id="markerTitle" onChange={this.handleChange} required />
								</FormGroup>
								<FormGroup>
									<Label for="markerBody">Marker Contents</Label>
									<Input type="textarea" name="desc" id="markerBody" onChange={this.handleChange} required />
								</FormGroup>
							</ModalBody>
							<ModalFooter className="bg-dark text-light">
								{this.state.deviceCoords === '' ?
									(
										(<Button block color="info" disabled ><Spinner type="grow" color="light" /></Button>)
									) : (
										<Button block color="info" onClick={this.onFormSubmit}>Submit</Button>
									)}
							</ModalFooter>
						</Modal>
					</Form>
				</div>
			</React.Fragment>
		);
	}
}
