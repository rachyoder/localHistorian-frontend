import React from "react";
import {
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

export default class LandingTutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ visible: !this.state.visible });
    }

    render() {
        return (
            <Modal size="lg" isOpen={this.state.visible} toggle={this.toggle}>
                <div className="modal-full">
                    <ModalHeader className="bg-dark" toggle={this.toggle}>
                        <span className="text-info font-light">local</span><span className="custom-font text-light">Historian</span>
                    </ModalHeader>
                    <ModalBody className="bg-dark">

                    </ModalBody>
                </div>
            </Modal>
        );
    }
}