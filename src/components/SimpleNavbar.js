import React from "react";
import LoginNav from "./LoginNav";
import Logout from "./Logout";
import MarkerTable from "./MarkerTable/MarkerTable";
import SimpleMap from "./SimpleMap/SimpleMap";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from "reactstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default class SimpleNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        }
        this.toggle = this.toggle.bind(this);
    }

    /* Toggles the collapse menu of the navbar */
    toggle() {
        this.setState({ isOpen: (!this.state.isOpen) });
    }

    render() {
        return (
            <React.Fragment>
                <Router>
                    <Navbar
                        color="dark"
                        dark
                        className="sticky-top"
                        expand="md"
                    >
                        <NavbarBrand href="/" className="mr-auto custom-font"><span className="text-info font-light">local</span>Historian</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav
                                className="ml-auto"
                                navbar
                            >
                                <NavItem>
                                    <NavLink
                                        tag={Link}
                                        onClick={this.toggle}
                                        to="/"
                                    >
                                        Map
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        tag={Link}
                                        onClick={this.toggle}
                                        to="/table"
                                    >
                                        Database
                                    </NavLink>
                                </NavItem>
                                <NavItem onClick={this.toggle}>
                                    {this.props.token === "" ?
                                        (
                                            <LoginNav
                                                getTokenMethod={this.props.getTokenMethod}
                                                checkAdmin={this.props.checkAdmin}
                                            />
                                        ) : (
                                            <Logout
                                                token={this.props.token}
                                                clearToken={this.props.getTokenMethod}
                                            />
                                        )}
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                    <Switch>
                        <Route path="/table">
                            <MarkerTable
                                token={this.props.token}
                                admin={this.props.admin}
                            />
                        </Route>
                        <Route path="/">
                            <SimpleMap setAlertStatus={this.props.setAlertStatus} />
                        </Route>
                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}
