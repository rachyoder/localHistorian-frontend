import React from "react";
import { Form, Button, Card, CardBody, CardTitle, CardText, CardImg, CardFooter, CardDeck } from "reactstrap";
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
        this.setState({ verified: [...this.state.verified, checkedValues] });
    }

    submit(e) {
        e.preventDefault();
        console.log(this.state.verified);
        API_Calls.__post({ 'verified': this.state.verified }, '/verify', this.props.token)
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
                <div className="mt-3 col-lg-4" key={idx}>
                    <Card className="m-3" >
                        <div className="imgContainer">
                            <CardImg className="mt-3 imgStyle" src={"http://192.168.86.240:8000/images/" + marker.filename} alt="Card image cap" />
                        </div>
                        <CardBody>
                            <CardTitle className="text-center"><strong>{marker.title}</strong></CardTitle>
                            <CardText>{marker.desc}</CardText>
                            <CardText>
                                <small className="text-muted">{marker.addr}</small>
                            </CardText>
                        </CardBody>
                        {this.props.admin ? (
                            <CardFooter>
                                {marker.isVerified ? <input type="checkbox" name={marker.id} onChange={this.isChecked} checked /> : <input type="checkbox" name={marker.id} onChange={this.isChecked} />}
                                <span className="text-center text-muted">Verify | Delete</span>
                                <div className="text-muted float-right" id={marker.id} onClick={this.delete}>X</div>
                            </CardFooter>
                        ) : (
                                null
                            )}
                    </Card>
                </div>
            );
        })

        return (
                <Form onSubmit={this.submit}>
                    {this.props.admin ? (
                        <div className="row">
                            <Button color="info" className="btn-block" >Verify Selected</Button>
                        </div>
                    ) : null}
                    <div className="row">
                        <CardDeck>
                            {Markers}
                        </CardDeck>
                    </div>
                </Form>
        );
    }
}
