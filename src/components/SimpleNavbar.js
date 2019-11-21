import React from "react";
import LoginNav from "./LoginNav";
import Logout from "./Logout";

import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";

export default class SimpleNavbar extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Navbar color="faded" light>
                    <NavbarBrand href="/" className="mr-auto"><span className="text-info">local</span>Historian</NavbarBrand>
                    <Nav navbar>
                        <NavItem>
                            {this.props.token === "" ? (
                                <LoginNav getTokenMethod={this.props.getTokenMethod} />
                            ) : (
                                    <Logout token={this.props.token} clearToken={this.props.getTokenMethod} /> )}
                        </NavItem>
                    </Nav>
                </Navbar>
            </React.Fragment>
        )
    }
}