import React from "react";
import { Table, Form, Button } from "reactstrap";
import API_Calls from "../../utilities/Axios";
import "./MarkerTable.css";

export default class MarkerTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            verified: [],
        }
        this.delete = this.delete.bind(this);
        this.isChecked = this.isChecked.bind(this);
        this.submit = this.submit.bind(this);
        this.getMarkersTable = this.getMarkersTable.bind(this);
    }

    delete(e) {
        var id = e.target.id;
        API_Calls.__post({ id: id }, '/delete', this.props.token)
            .then(res => {
                this.getMarkersTable();
            });
    }

    isChecked(e) {
        const value = e.target.checked ? 1 : 0;
        const checkedValues = { id: Number(e.target.name), verify: value };
        console.log(checkedValues);
        this.setState({ verified: [...this.state.verified, checkedValues]});
    }

    submit(e) {
        e.preventDefault();
        console.log(this.state.verified);
        API_Calls.__post({'verified': this.state.verified}, '/verify', this.props.token)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
    }

    getMarkersTable() {
        API_Calls.__get('/markers', '')
            .then(res => {
                this.setState({ data: res.data.data });
            });
    }

    componentDidMount() {
        this.getMarkersTable();
    }

    render() {
        const Markers = this.state.data.map((marker, idx) => {
            return (
                <tr key={idx}>
                    <td>
                        {marker.isVerified ? <input type="checkbox" name={marker.id} onChange={this.isChecked} checked /> : <input type="checkbox" name={marker.id} onChange={this.isChecked} /> }
                    </td>
                    <td>{marker.title}</td>
                    <td>{marker.desc}</td>
                    <td>{marker.addr}</td>
                    <td>
                        <img src={"http://10.0.1.148:8000/images/" + marker.filename} alt={marker.title} className="tableImg" />
                    </td>
                    <td>
                        <div id={marker.id} onClick={this.delete}>X</div>
                    </td>
                </tr>
            );
        })

        return (
            <div className="container mt-5">
                <Form onSubmit={this.submit}>
                    <Button className="mt-3" >Submit Changes</Button>
                    <Table className="mt-3" hover>
                        <thead>
                            <tr>
                                <th>Verify Photos</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Location</th>
                                <th>Image</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Markers}
                        </tbody>
                    </Table>
                </Form>
            </div>
        );
    }
}
