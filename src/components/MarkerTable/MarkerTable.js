import React from "react";
import { Table } from "reactstrap";
import API_Calls from "../../utilities/Axios";
import "./MarkerTable.css";

export default class MarkerTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        API_Calls.__get('/markers', '')
            .then(res => {
                this.setState({ data: res.data.data });
            });
    }

    render() {
        const Markers = this.state.data.map((marker, idx) => {
            return (
                <tr key={idx}>
                    <td>{marker.title}</td>
                    <td>{marker.desc}</td>
                    <td>{marker.addr}</td>
                    <td>
                        <img src={"http://10.0.1.148:8000/images/" + marker.filename} alt={marker.title} className="tableImg" />
                    </td>
                </tr>
            );
        })

        return (
            <Table className="mt-5" hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Body</th>
                        <th>Location</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {Markers}
                </tbody>
            </Table>
        );
    }
}
