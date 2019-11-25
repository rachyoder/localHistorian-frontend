import React from "react";
import { Table } from "reactstrap";


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
        const Markers = [];
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Body</th>
                        <th>Location</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </Table>
        );
    }
}
