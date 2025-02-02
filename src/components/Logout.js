import React from "react";
import {NavLink} from "reactstrap";
import API_Calls from "../utilities/Axios";


export default class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.verifyLogout = this.verifyLogout.bind(this);
    }

    /* Logs the user out and clears thier token from local storage */
    verifyLogout() {
        API_Calls.__get("/logout", this.props.token);
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        this.props.clearToken("");
    }

    render() {
        return (
            <React.Fragment>
                <NavLink onClick={this.verifyLogout}>Logout</NavLink>
            </React.Fragment>
        );
    }
}