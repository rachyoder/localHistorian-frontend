import React from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import API_Calls from "../utilities/Axios";

const mapSyles = {
    width: "100%",
    height: "100%"
};

export class SimpleMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // showingInfoWindow: false,
            // activeMarker: {},
            // selectedPlace: {},
            data: [],
        }
        this.MarkerGetter = this.MarkerGetter.bind(this);
    }

    // onMarkerClick = (props, marker, e) =>
    //     this.setState({
    //         selectedPlace: props,
    //         activeMarker: marker,
    //         showingInfoWindow: true
    //     });

    // onClose = props => {
    //     if (this.state.showingInfoWindow) {
    //         this.setState({
    //             showingInfoWindow: false,
    //             activeMarker: null
    //         });
    //     }
    // };

    async MarkerGetter() {
        await API_Calls.__get('/markers', '')
            .then(res => {
                    this.setState({ data: res.data.data });
            });
    }

    componentDidMount() {
        this.MarkerGetter();
    }

    render() {
        const Markers = this.state.data.map((marker, idx) => {
            return (
                <Marker
                    key={idx}
                    position={{ lat: marker.lat, lng: marker.lon }}
                />
            )
        })
        return (
            <Map
                google={this.props.google}
                zoom={14}
                style={mapSyles}
                defaultOptions={{ zoomControl: false }}
                initialCenter={{
                    lat: 38.042081,
                    lng: -84.492542
                }}
                disableDefaultUI
            >
                {this.state.data.length > 0 ? Markers : null}
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC5Xu9GUoqhCX8nRYfXaqkA1saAs-hXH4k"
})(SimpleMap);