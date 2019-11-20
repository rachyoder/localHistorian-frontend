import React from "react";
import Login from "./Login";
import Logout from "./Logout";

import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";

export default class SimpleNavbar extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Navbar color="faded" light>
                    <NavbarBrand href="/" className="mr-auto"><span className="text-muted">local</span>Historian</NavbarBrand>
                    <Nav navbar>
                        <NavItem>
                            {this.props.setToken === "" ? (
                                <Login getToken={this.props.getToken} />
                            ) : (
                                    <Logout token={this.props.setToken} clearToken={this.props.getToken} /> )}
                        </NavItem>
                    </Nav>
                </Navbar>
            </React.Fragment>
        )
    }
}