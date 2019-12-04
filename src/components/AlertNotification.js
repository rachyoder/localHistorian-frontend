import React from "react";
import {alert} from "reactstrap";

export default class AlertNotification extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
        }
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        this.setState({
            visible: !this.state.visible,
        })
    }

    render() {
        return (
            <Alert
                color={this.props.color}
                isOpen={this.state.visible}
                toggle={this.onDismiss}
            >
                {this.props.body}
            </Alert>
        );
    }
}