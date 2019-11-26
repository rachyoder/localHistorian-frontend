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

    toggle() {
        this.setState({ isOpen: (!this.state.isOpen) });
    }

    render() {
        return (
            <React.Fragment>
                <Router>
                    <Navbar color="dark" dark fixed={"top"} expand="md">
                        <NavbarBrand href="/" className="mr-auto"><span className="text-info">local</span>Historian</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/">Map</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/table">Database</NavLink>
                                </NavItem>
                                <NavItem>
                                    {this.props.token === "" ?
                                        (
                                            <LoginNav getTokenMethod={this.props.getTokenMethod} />
                                        ) : (
                                            <Logout token={this.props.token} clearToken={this.props.getTokenMethod} />)}
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                    <Switch>
                        <Route path="/table">
                            <MarkerTable />
                        </Route>
                        <Route path="/">
                            <SimpleMap />
                        </Route>
                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}
