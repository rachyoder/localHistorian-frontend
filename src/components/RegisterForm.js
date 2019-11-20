import React from "react";
import { FormGroup, Label, Input } from "reactstrap";

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
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
                    <Label for="regName">Name</Label>
                    <Input type="text" name="name" id="regName" value={this.state.name} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="regEmail">Email</Label>
                    <Input type="email" name="email" id="regEmail" value={this.state.email} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="regPassword">Password</Label>
                    <Input type="password" name="password" id="regPassword" value={this.state.password} onChange={this.handleChange} />
                </FormGroup>
            </React.Fragment>
        );
    }
}