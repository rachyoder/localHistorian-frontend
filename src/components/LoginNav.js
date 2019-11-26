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

    toggleModal() {
        let modal = (!this.state.modal);
        this.setState({ modal: modal });
    }

    toggleTab(tab) {
        if (tab !== this.state.activeTab) {
            this.setState({ activeTab: tab });
        }
    }

    pullState(name, value) {
        this.setState({ [name]: value });
    }

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
                } else if (res.response.status === 422) {
                    this.setState({ errorThrown: res.response.data + " - Check credentials and Try Again" });
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return (
            <React.Fragment>
                <NavLink onClick={this.toggleModal}>Login</NavLink>
                <Modal centered isOpen={this.state.modal} toggle={this.toggleModal} >
                    <Nav tabs fill>
                        <NavItem>
                            <NavLink className={classnames({ active: this.state.activeTab })} onClick={() => this.toggleTab('1')} >
                                Login
                                </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: this.state.activeTab })} onClick={() => this.toggleTab('2')} >
                                Register
                                </NavLink>
                        </NavItem>
                    </Nav>
                    <Form onSubmit={this.handleSubmit} >
                        <ModalBody>
                            <TabContent activeTab={this.state.activeTab} >
                                <TabPane tabId="1">
                                    <LoginForm pullState={this.pullState} errorThrown={this.state.errorThrown} />
                                </TabPane>
                                <TabPane tabId="2">
                                    <RegisterForm pullState={this.pullState} />
                                </TabPane>
                            </TabContent>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="dark" outline onSubmit={this.handleSubmit} >Submit</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}
