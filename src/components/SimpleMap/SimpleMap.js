import React from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import API_Calls from "../../utilities/Axios";
import "./SimpleMap.css";

export class SimpleMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            data: [],
        }
        this.MarkerGetter = this.MarkerGetter.bind(this);
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

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
                    onClick={this.onMarkerClick}
                    position={{ lat: marker.lat, lng: marker.lon }}
                    name={marker.title}
                    title={marker.filename}
                />
            );
        })

        return (
            <Map
                google={this.props.google}
                zoom={14}
                style={{
                    width: "100%",
                    height: "100%"
                }}
                defaultOptions={{
                    maxZoom: 8,
                }}
                initialCenter={{
                    lat: 38.042081,
                    lng: -84.492542
                }}
                disableDefaultUI
            >
                {this.state.data.length > 0 ? Markers : null}
                {this.state.activeMarker ?
                    <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}
                        onClose={this.onClose}
                    >
                        <div>
                            <img src={'http://10.0.1.148:8000/images/' + this.state.activeMarker.title} alt={this.state.activeMarker.name} className="mapImg" />
                        </div>
                    </InfoWindow>
                    : null}
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC5Xu9GUoqhCX8nRYfXaqkA1saAs-hXH4k"
})(SimpleMap);
