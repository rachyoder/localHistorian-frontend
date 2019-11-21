import React from "react";
import API_Calls from "../../utilities/Axios";
import "./Upload.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default class Upload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image: '',
			coords: '',
			modal: false,
			errorThrown: '',
		}
		this.success = this.success.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.fileUpload = this.fileUpload.bind(this);
	}

	success(pos) {
		let coords = pos.coords.latitude + ',' + pos.coords.longitude;

		this.setState({
			coords: coords,
		});
		console.log(this.state.coords);
	}
	toggleModal() {
		let modal = (!this.state.modal);
		this.setState({
			modal: modal
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
		navigator.geolocation.getCurrentPosition(this.success);
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
	fileUpload() {
		const url = '/fileupload';
		const formData = {
			file: this.state.image,
			coords: this.state.coords
		}
		API_Calls.__post(formData, url, this.props.token)
			.then(res => {
				this.setState({
					coords: {
						lat: 0,
						lon: 0
					}
				});
			})
			.catch(error => error);
	}

	render() {
		return (
			<div className="float-right mb-3 mr-3">
				<Form onSubmit={this.onFormSubmit}>
					<input type="file" id="file" onChange={this.onChange} required accept="image/*" capture="environment" />
					<label htmlFor="file"><FontAwesomeIcon icon={faCamera} /></label>
					<Modal isOpen={this.state.modal} toggle={this.toggleModal} >
						<ModalHeader>
							Upload This Image?
						</ModalHeader>
						<ModalBody>
							<img src={this.state.image} className="display-img" alt="" />
						</ModalBody>
						<ModalFooter>
							{this.state.coords.lon === 0 ?
								(
									(<Button block color="info" disabled >Submit</Button>)
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