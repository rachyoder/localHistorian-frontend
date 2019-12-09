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
                <div>
                    <ModalHeader className="text-info font-light" color="dark" toggle={this.toggle}>
                        local<span className="custom-font text-dark">Historian</span>
                    </ModalHeader>
                    <ModalBody>

                    </ModalBody>
                </div>
            </Modal>
        );
    }
}