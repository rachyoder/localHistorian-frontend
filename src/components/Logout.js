import React from "react";
import {NavLink} from "reactstrap";
import API_Calls from "../utilities/Axios";


export default class Logout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
        this.verifyLogout = this.verifyLogout.bind(this);
    }
    verifyLogout() {
        API_Calls.__get("/logout", this.props.token);
        localStorage.removeItem("token");
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