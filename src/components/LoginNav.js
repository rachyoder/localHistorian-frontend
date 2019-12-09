import React from "react";
import { Button, Modal, ModalBody, ModalFooter, Form, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import API_Calls from "../utilities/Axios";
import classnames from "classnames";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default class LoginNav extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            modal: false,
            errorThrown: '',
            activeTab: '1',
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.pullState = this.pullState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* Will show or hide the modal when called */
    toggleModal() {
        let modal = (!this.state.modal);
        this.setState({ modal: modal });
    }

    /* Changes between the login and register tabs */
    toggleTab(tab) {
        if (tab !== this.state.activeTab) {
            this.setState({ activeTab: tab });
        }
    }

    /* Will pull form data and save it into state */
    pullState(name, value) {
        this.setState({ [name]: value });
    }

    /* Handles submissions for logging in or registering a new user. Changes form submission based on active tab */
    handleSubmit(event) {
        event.preventDefault();
        let values, url;
        if (this.state.activeTab === '1') {
            values = {
                email: this.state.email,
                password: this.state.password,
            };
            url = '/login';
        } else {
            values = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            }
            url = '/register';
        }
        API_Calls.__post(values, url, '')
            .then(res => {
                if (res.status === 200) {
                    let token = res.data.token;
                    localStorage.setItem("token", token);
                    this.setState({ modal: !this.state.modal });
                    this.props.getTokenMethod(token);
                    if (this.state.activeTab === '1') {
                        let isAdmin = res.data.isAdmin;
                        localStorage.setItem("isAdmin", isAdmin);
                        this.props.checkAdmin(isAdmin);
                    }
                } else if (res.response.status === 422) {
                    this.setState({ errorThrown: "Error Occurred - Check credentials and Try Again" });
                }
            })
    }

    render() {
        return (
            <React.Fragment>
                <NavLink onClick={this.toggleModal}>Login</NavLink>
                <Modal centered isOpen={this.state.modal} toggle={this.toggleModal} >
                    <Nav tabs fill>
                        <NavItem className="bg-dark">
                            <NavLink className={classnames({ active: this.state.activeTab }), "bg-dark text-light"} onClick={() => this.toggleTab('1')} >
                                Login
                                </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: this.state.activeTab }), "bg-dark text-light"} onClick={() => this.toggleTab('2')} >
                                Register
                                </NavLink>
                        </NavItem>
                    </Nav>
                    <Form onSubmit={this.handleSubmit} >
                        <ModalBody className="bg-dark text-light">
                            <TabContent activeTab={this.state.activeTab} >
                                <TabPane tabId="1">
                                    <LoginForm pullState={this.pullState} errorThrown={this.state.errorThrown} />
                                </TabPane>
                                <TabPane tabId="2">
                                    <RegisterForm pullState={this.pullState} />
                                </TabPane>
                            </TabContent>
                        </ModalBody>
                        <ModalFooter className="bg-dark text-light">
                            <Button color="info" block onSubmit={this.handleSubmit} >Submit</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}
