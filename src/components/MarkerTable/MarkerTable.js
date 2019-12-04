import React from "react";
import { Form, Button, Card, CardBody, CardTitle, CardText, CardImg, CardFooter, Row, Col } from "reactstrap";
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

    //Will delete entry from the table and auto update it
    delete(e) {
        var id = e.target.id;
        API_Calls.__post({ id: id }, '/delete', this.props.token)
            .then(res => {
                this.getMarkersTable();
            });
    }

    //Checks if an entry is checked or not for verification, saves result in state
    isChecked(e) {
        const value = e.target.checked ? 1 : 0;
        const checkedValues = { id: Number(e.target.name), verify: value };
        this.setState({ verified: [...this.state.verified, checkedValues] });
    }

    //Submits all verified markers to database, which allows them to be displayed
    submit(e) {
        e.preventDefault();
        API_Calls.__post({ 'verified': this.state.verified }, '/verify', this.props.token)
            .then(res => {
                this.getMarkersTable();
            })
            .catch(error => {
            })
    }

    //Pulls all the markers from database and stores them in state
    getMarkersTable() {
        API_Calls.__get('/markers', '')
            .then(res => {
                this.setState({ data: res.data.data });
            });
    }

    //On page load, grabs all the markers
    componentDidMount() {
        this.getMarkersTable();
    }

    render() {
        const Markers = this.state.data.map((marker, idx) => {
            return (
                this.props.admin ? (
                    <Col sm="4" key={idx}>
                        <Card className="m-3" >
                            <div className="imgContainer">
                                <CardImg top className="mt-3 imgStyle" src={marker.filename} alt="Card image cap" />
                            </div>
                            <CardBody>
                                <CardTitle className="text-center"><strong>{marker.title}</strong></CardTitle>
                                <CardText>{marker.desc}</CardText>
                                <CardText>
                                    <small className="text-muted">{marker.addr}</small>
                                </CardText>
                            </CardBody>
                            <CardFooter>
                                <div>
                                    {marker.isVerified ?
                                        <input type="checkbox" id={"verify" + idx} className="mx-1" name={marker.id} onChange={this.isChecked} checked /> : <input type="checkbox" id={"verify" + idx} className="mx-1" name={marker.id} onChange={this.isChecked} />}
                                    <label htmlFor={"verify" + idx} className="text-center mt-2 text-muted"> Verify</label>
                                    <button className="text-muted btn btn-outline-secondary float-right delete" id={marker.id} onClick={this.delete}>Delete</button>
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                ) : (
                        (marker.isVerified) ? (
                            <div className="mt-5 col-lg-4" key={idx}>
                                <Card>
                                    <div className="imgContainer">
                                        <CardImg className="mt-3 imgStyle" src={marker.filename} alt="Card image cap" />
                                    </div>
                                    <CardBody>
                                        <CardTitle className="text-center"><strong>{marker.title}</strong></CardTitle>
                                        <CardText>{marker.desc}</CardText>
                                        <CardText>
                                            <small className="text-muted">{marker.addr}</small>
                                        </CardText>
                                    </CardBody>
                                </Card>
                            </div>
                        ) : (
                                null
                            )
                    )
            );
        })

        return (
            <Form onSubmit={this.submit}>
                <div className="container-fluid mt-3">
                    {this.props.admin ? (
                        <div className="row mt-5 align-items-center">
                            <Button color="info" className="btn-block mt-3" >Verify Selected</Button>
                        </div>
                    ) : (
                            null
                        )}
                    <Row>
                        {Markers}
                    </Row>
                </div>
            </Form>
        );
    }
}
