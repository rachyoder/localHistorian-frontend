import React from "react";
import API_Calls from "../../utilities/Axios";
import "./Upload.css";
import EXIF from "exif-js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";

export default class Upload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image: '',
			deviceCoords: '',
			photoCoords: '',
			modal: false,
			errorThrown: '',
		}
		this.success = this.success.bind(this);
		this.error = this.error.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.fileUpload = this.fileUpload.bind(this);
		this.getExif = this.getExif.bind(this);
	}

	success(pos) {
		let coords = pos.coords.latitude + ',' + pos.coords.longitude;

		this.setState({
			deviceCoords: coords,
		});
	}
	error(err) {
		console.log(err);
	}

	toggleModal() {
		this.setState({
			modal: (!this.state.modal)
		});
	}

	onFormSubmit(e) {
		e.preventDefault()
		this.fileUpload(this.state.image);
		this.toggleModal();
	}

	onChange(e) {
		let files = e.target.files || e.dataTransfer.files;
		if (!files.length)
			return;
		this.createImage(files[0]);
		let options = {
			enableHighAccuracy: false,
		}
		navigator.geolocation.getCurrentPosition(this.success, this.error, options);
		this.toggleModal();
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

	async fileUpload() {
		await this.getExif();
		const url = '/fileupload';
		const formData = (this.state.photoCoords === '') ?
			{
				file: this.state.image,
				coords: this.state.deviceCoords
			} :
			{
				file: this.state.image,
				coords: this.state.photoCoords
			};

		API_Calls.__post(formData, url, this.props.token)
			.then(res => {
				this.setState({
					deviceCoords: '',
					photoCoords: '',
				});
			})
			.catch(error => error);
	}

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

			let dd_coords = lat_dd + "," + lon_dd;
			this.setState({ photoCoords: dd_coords });
		}
	}

	render() {
		return (
			<div className="float-right mb-3 mr-4">
				<Form onSubmit={this.onFormSubmit}>
					<input type="file" id="file" onChange={this.onChange} required accept="image/*" capture="environment" />
					<label htmlFor="file"><FontAwesomeIcon icon={faCamera} /></label>
					<Modal centered isOpen={this.state.modal} toggle={this.toggleModal} >
						<ModalHeader className="text-center bg-dark text-light">
							Upload This Image?
						</ModalHeader>
						<ModalBody className="bg-dark text-light">
							<img src={this.state.image} className="display-img" id="get-exif" alt="" />
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
		);
	}
}