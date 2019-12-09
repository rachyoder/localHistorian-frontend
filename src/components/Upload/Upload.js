import React from "react";
import API_Calls from "../../utilities/Axios";
import "./Upload.css";
import EXIF from "exif-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Geocode from "react-geocode";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Storage from "./Firebase";
import {
	Form,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Spinner,
	Input,
	Label,
	FormGroup
} from "reactstrap";

export default class Upload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image: null,
			image_path: null,
			deviceCoords: '',
			photoCoords: '',
			orientation: '',
			title: '',
			desc: '',
			addr: '',
			modal: false,
			alertColor: '',
			alertBody: '',
			visible: false,
		}
		this.getAddress = this.getAddress.bind(this);
		this.success = this.success.bind(this);
		this.error = this.error.bind(this);
		this.onChange = this.onChange.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.fileUpload = this.fileUpload.bind(this);
		this.passAlertData = this.passAlertData.bind(this);
		this.getExif = this.getExif.bind(this);
	}

	/* Will convert latitude and longitude into a readable address */
	async getAddress(lat, lng) {
		Geocode.setApiKey("AIzaSyC5Xu9GUoqhCX8nRYfXaqkA1saAs-hXH4k");
		await Geocode.fromLatLng(lat, lng)
			.then(res => {
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
		// console.log(err);
	}

	/* Grabs image submitted by user and passes it to state as well as grabbing location data and creating an image for laravel to use */
	onChange(e) {
		let files = e.target.files || e.dataTransfer.files;
		if (!files.length)
			return;
		this.createImage(files[0]);
		this.setState({ imageFile: files[0] });
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

	/* sends image data to fileUpload, which handles the bulk of the submission */
	onFormSubmit(e) {
		e.preventDefault()
		this.fileUpload(this.state.image);
	}

	/* REDUNDANT CODE -- Used when saving photos to laravel. No longer needed as photos are saved in the front end server */
	createImage(file) {
		let reader = new FileReader();
		reader.onload = (e) => {
			this.setState({
				image: e.target.result
			})
		};
		reader.readAsDataURL(file);
	}

	/* Sets token to state for API Calls */
	componentDidMount() {
		this.setState({ token: this.props.token });
	}

	/* Toggles alert visibility -- Currently under revision */
	alertVisible() {
		this.setState({ visible: (!this.state.visible) });
	}

	/* Upload Photo to Server Bucket and send form data to API to save in the database. */
	async fileUpload() {
		await this.getExif();
		const image = this.state.imageFile;
		const uploadTask = Storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			"state_changed",
			snapshot => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				this.setState({ progress });
			},
			error => {
				// console.log(error);
			},
			() => {
				Storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then(url => {
						const apiUrl = '/fileupload';
						const coords = (this.state.photoCoords === '') ?
							(this.state.deviceCoords) :
							(this.state.photoCoords);
						const formData = {
							file: url,
							coords: (coords),
							title: this.state.title,
							desc: this.state.desc,
							addr: this.state.addr,
						}
						const token = localStorage.getItem('token');
						API_Calls.__post(formData, apiUrl, token)
							.then(res => {
								if (res.status === 200) {
									this.setState({
										alertColor: "success",
										alertBody: "Upload Successful! Photo awaiting verification"
									});
								} else if (res.response.status === 401) {
									this.setState({
										alertColor: "danger",
										alertBody: "Unable to upload photo. Make sure you are logged in and try again."
									});
								}
								this.toggleModal();
								this.passAlertData(this.state.alertColor, this.state.alertBody);
							})
							.catch(error => {
								// console.log(error);
							});
					});
			},
		)
	}

	passAlertData(color, body) {
		this.props.setAlertStatus(color, body);
	}

	/* Getting Location Data from Photo, if not available, backup is pulled from device location */
	async getExif() {
		let image = document.getElementById("get-exif");
		let lat, lon, lat_cardinal, lon_cardinal, orientation;
		EXIF.getData(image, function () {
			lat = EXIF.getTag(this, "GPSLatitude");
			lon = EXIF.getTag(this, "GPSLongitude");
			lat_cardinal = EXIF.getTag(this, "GPSLatitudeRef");
			lon_cardinal = EXIF.getTag(this, "GPSLongitudeRef");
			orientation = EXIF.getTag(this, "Orientation");
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
			this.setState({
				photoCoords: dd_coords,
				orientation: orientation,
			});
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
								<div className="container">
									<img src={this.state.image} className="display-img" id="get-exif" alt="" />
								</div>
								<FormGroup className="mt-3">
									<Label for="markerTitle">Title of Marker</Label>
									<Input type="text" name="title" id="markerTitle" onChange={this.handleChange} required />
								</FormGroup>
								<FormGroup>
									<Label for="markerBody">Body of Marker</Label>
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
