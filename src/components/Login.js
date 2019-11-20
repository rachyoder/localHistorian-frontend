import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, NavLink } from "reactstrap";
import API_Calls from "../utilities/Axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            modal: false,
            errorThrown: '',
        }
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        let modal = (!this.state.modal);
        this.setState({ modal: modal })
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const login = {
            email: this.state.email,
            password: this.state.password,
        };
        API_Calls.__post(login, '/login', '')
            .then(res => {
                if (res.status === 200) {
                    let token = res.data.token;
                    localStorage.setItem("token", token);

                    this.setState({ modal: !this.state.modal });
                    this.props.getToken(token);
                } else if (res.response.status === 422) {
                    console.log(res.response.data)
                    this.setState({ errorThrown: res.response.data + "- Check credentials and Try Again" });
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                <NavLink onClick={this.toggle}>Login</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle} >
                    <ModalHeader toggle={this.toggle}>
                        Login
                    </ModalHeader>
                    <Form onSubmit={this.handleSubmit} >
                        <ModalBody>
                            <FormGroup>
                                <Label for="userEmail">Email</Label>
                                <Input type="email" name="email" id="userEmail" value={this.state.email} onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="userPassword">Password</Label>
                                <Input type="password" name="password" id="userPassword" value={this.state.password} onChange={this.handleChange} />
                            </FormGroup>
                            <p className="text-danger">{this.state.errorThrown}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="dark" outline onSubmit={this.handleSubmit} >Login</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        );
    }
}
