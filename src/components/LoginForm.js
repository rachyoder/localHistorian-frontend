import React from "react";

import { FormGroup, Label, Input } from "reactstrap";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        this.props.pullState(event.target.name, event.target.value);
    }

    render() {
        return (
            <React.Fragment>
                <FormGroup>
                    <Label for="userEmail">Email</Label>
                    <Input type="email" name="email" id="userEmail" value={this.state.email} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="userPassword">Password</Label>
                    <Input type="password" name="password" id="userPassword" value={this.state.password} onChange={this.handleChange} />
                </FormGroup>
                <p className="text-danger">{this.props.errorThrown}</p>
            </React.Fragment>
        )
    }
}